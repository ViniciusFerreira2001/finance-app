'use client';

import styles from './DeleteConfirm.module.css';

const fmt = (n) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n ?? 0);

export default function DeleteConfirm({ open, transaction, onConfirm, onCancel, loading }) {
  if (!open || !transaction) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onCancel} />
      <div className={styles.dialog} role="alertdialog" aria-modal="true">
        <div className={styles.iconWrap}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="13" stroke="var(--negative)" strokeWidth="1.8" />
            <path d="M14 9v6M14 18v1" stroke="var(--negative)" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </div>
        <h3 className={styles.title}>Excluir transação?</h3>
        <p className={styles.desc}>
          Você está prestes a excluir{' '}
          <strong>{transaction.description || transaction.category}</strong>{' '}
          ({fmt(transaction.amount)}). Esta ação não pode ser desfeita.
        </p>
        <div className={styles.actions}>
          <button
            id="delete-cancel"
            className={styles.cancelBtn}
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            id="delete-confirm"
            className={styles.deleteBtn}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </>
  );
}
