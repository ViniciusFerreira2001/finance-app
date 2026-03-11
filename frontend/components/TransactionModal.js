'use client';

import { useState, useEffect } from 'react';
import styles from './TransactionModal.module.css';

const CATEGORIES_INCOME = ['Salário', 'Freelance', 'Investimentos', 'Presente', 'Outro'];
const CATEGORIES_EXPENSE = ['Alimentação', 'Moradia', 'Transporte', 'Saúde', 'Lazer', 'Educação', 'Assinaturas', 'Outro'];

const today = () => new Date().toISOString().split('T')[0];

export default function TransactionModal({ open, onClose, onSubmit, editData }) {
  const isEdit = !!editData;

  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(today());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Populate form on edit
  useEffect(() => {
    if (editData) {
      setType(editData.type || 'expense');
      setAmount(String(editData.amount || ''));
      setCategory(editData.category || '');
      setDescription(editData.description || '');
      setDate(editData.date ? editData.date.split('T')[0] : today());
    } else {
      setType('expense');
      setAmount('');
      setCategory('');
      setDescription('');
      setDate(today());
    }
    setError('');
  }, [editData, open]);

  const categories = type === 'income' ? CATEGORIES_INCOME : CATEGORIES_EXPENSE;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const num = parseFloat(amount.replace(',', '.'));
    if (!num || num <= 0) { setError('Informe um valor válido.'); return; }
    if (!category) { setError('Selecione uma categoria.'); return; }

    setLoading(true);
    try {
      const payload = isEdit
        ? { amount: num, category, description }
        : { type, amount: num, category, description, date: new Date(date + 'T12:00:00').toISOString() };
      await onSubmit(payload);
      onClose();
    } catch (err) {
      setError(err.message || 'Ocorreu um erro.');
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <aside className={styles.drawer} role="dialog" aria-modal="true" aria-label="Nova transação">
        <div className={styles.drawerHeader}>
          <h2 className={styles.drawerTitle}>{isEdit ? 'Editar Transação' : 'Nova Transação'}</h2>
          <button className={styles.closeBtn} onClick={onClose} id="modal-close" aria-label="Fechar">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Type toggle — only on create */}
          {!isEdit && (
            <div className={styles.typeRow}>
              <button
                type="button"
                id="type-expense"
                className={`${styles.typeBtn} ${type === 'expense' ? styles.expenseActive : ''}`}
                onClick={() => { setType('expense'); setCategory(''); }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3v10M3 8l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Saída
              </button>
              <button
                type="button"
                id="type-income"
                className={`${styles.typeBtn} ${type === 'income' ? styles.incomeActive : ''}`}
                onClick={() => { setType('income'); setCategory(''); }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 13V3M3 8l5-5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Entrada
              </button>
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label}>Valor (R$)</label>
            <input
              id="modal-amount"
              className={styles.input}
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Categoria</label>
            <select
              id="modal-category"
              className={styles.input}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Selecione...</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Descrição <span className={styles.optional}>(opcional)</span></label>
            <input
              id="modal-description"
              className={styles.input}
              type="text"
              placeholder="Ex: Supermercado Extra"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={120}
            />
          </div>

          {!isEdit && (
            <div className={styles.field}>
              <label className={styles.label}>Data</label>
              <input
                id="modal-date"
                className={styles.input}
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          )}

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
            <button
              id="modal-submit"
              type="submit"
              className={`${styles.submitBtn} ${type === 'income' ? styles.submitIncome : styles.submitExpense}`}
              disabled={loading}
            >
              {loading ? 'Salvando...' : isEdit ? 'Salvar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}
