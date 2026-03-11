'use client';

import { useState, useEffect } from 'react';
import styles from './TransactionModal.module.css'; // Reusing styles for consistency

export default function GoalModal({ open, onClose, onSubmit, editData }) {
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '',
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title || '',
        targetAmount: editData.targetAmount || '',
        currentAmount: editData.currentAmount || '',
      });
    } else {
      setFormData({ title: '', targetAmount: '', currentAmount: '' });
    }
  }, [editData, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      targetAmount: Number(formData.targetAmount),
      currentAmount: Number(formData.currentAmount || 0),
    });
    onClose();
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <aside className={styles.drawer} role="dialog">
        <div className={styles.drawerHeader}>
          <h2 className={styles.drawerTitle}>{editData ? 'Editar Objetivo' : 'Novo Objetivo'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Nome do Objetivo</label>
            <input
              type="text"
              required
              className={styles.input}
              placeholder="Ex: Juntar 200 reais"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.label}>Valor Alvo (R$)</label>
              <input
                type="number"
                required
                min="1"
                step="0.01"
                className={styles.input}
                placeholder="200.00"
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Já economizado (R$)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className={styles.input}
                placeholder="0.00"
                value={formData.currentAmount}
                onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
            <button type="submit" className={`${styles.submitBtn} ${styles.submitIncome}`}>
              {editData ? 'Salvar' : 'Criar Objetivo'}
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}
