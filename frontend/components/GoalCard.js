'use client';

import styles from './GoalCard.module.css';

const fmt = (n) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n ?? 0);

export default function GoalCard({ goal, onEdit, onDelete, onDeposit }) {
  const percent = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.info}>
          <h3 className={styles.title}>{goal.title}</h3>
          <p className={styles.subtitle}>Alvo: {fmt(goal.targetAmount)}</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.guardarBtn} onClick={() => onDeposit(goal)}>
            Guardar
          </button>
          <div className={styles.utilActions}>
            <button className={styles.iconBtn} onClick={() => onEdit(goal)} title="Editar">
              <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
                <path d="M10.5 2.5l2 2L5 12H3v-2L10.5 2.5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className={`${styles.iconBtn} ${styles.delete}`} onClick={() => onDelete(goal.id)} title="Excluir">
              <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
                <path d="M2 4h11M5 4V2h5v2M6 7v5M9 7v5M3 4l1 9h7l1-9H3z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={styles.progressSection}>
        <div className={styles.progressLabels}>
          <span className={styles.current}>{fmt(goal.currentAmount)}</span>
          <span className={styles.percent}>{percent}%</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${percent}%` }} />
        </div>
      </div>
    </div>
  );
}
