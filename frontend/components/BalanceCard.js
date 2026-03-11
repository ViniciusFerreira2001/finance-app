'use client';

import styles from './BalanceCard.module.css';

const fmt = (n) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n ?? 0);

function Card({ label, value, type, loading }) {
  return (
    <div className={`${styles.card} ${styles[type]}`}>
      <div className={styles.iconWrap}>
        {type === 'balance' && (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.8" />
            <path d="M10 6v8M7 9l3-3 3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {type === 'income' && (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 15V5M5 10l5-5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {type === 'expense' && (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 5v10M5 10l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <div className={styles.content}>
        <span className={styles.label}>{label}</span>
        {loading ? (
          <div className={`skeleton ${styles.skeletonAmt}`} />
        ) : (
          <span className={styles.value}>{fmt(value)}</span>
        )}
      </div>
    </div>
  );
}

export default function BalanceCard({ balance, loading }) {
  return (
    <div className={styles.row}>
      <Card label="Saldo Atual" value={balance?.balance} type="balance" loading={loading} />
      <Card label="Total Entradas" value={balance?.totalIncome} type="income" loading={loading} />
      <Card label="Total Saídas" value={balance?.totalExpense} type="expense" loading={loading} />
    </div>
  );
}
