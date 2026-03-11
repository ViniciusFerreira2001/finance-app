'use client';

import { useState } from 'react';
import styles from './TransactionModal.module.css';

export default function DepositModal({ open, onClose, onSubmit, goal }) {
  const [amount, setAmount] = useState('');

  if (!open || !goal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (num > 0) {
      onSubmit(goal.id, num);
      setAmount('');
      onClose();
    }
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <aside className={styles.drawer} role="dialog">
        <div className={styles.drawerHeader}>
          <div className={styles.drawerTitleGroup}>
            <h2 className={styles.drawerTitle}>Guardar Dinheiro</h2>
            <p className={styles.label}>Objetivo: {goal.title}</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Quanto você quer guardar?</label>
            <input
              type="number"
              required
              min="0.01"
              step="0.01"
              autoFocus
              className={styles.input}
              placeholder="R$ 0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <p className={styles.optional} style={{ marginTop: '8px' }}>
              Este valor será descontado do seu saldo atual e adicionado a este objetivo.
            </p>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
            <button type="submit" className={`${styles.submitBtn} ${styles.submitIncome}`}>
              Confirmar Depósito
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}
