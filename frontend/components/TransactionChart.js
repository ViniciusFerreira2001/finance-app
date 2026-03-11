'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import styles from './TransactionChart.module.css';

const MONTH_NAMES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

const fmt = (n) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n);

function buildChartData(transactions) {
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ year: d.getFullYear(), month: d.getMonth(), label: MONTH_NAMES[d.getMonth()] });
  }

  return months.map(({ year, month, label }) => {
    let income = 0, expense = 0;
    transactions.forEach((tx) => {
      const d = new Date(tx.date);
      if (d.getFullYear() === year && d.getMonth() === month) {
        if (tx.type === 'income') income += tx.amount;
        else expense += tx.amount;
      }
    });
    return { label, income, expense };
  });
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color, fontWeight: 600 }}>
          {p.dataKey === 'income' ? 'Entradas' : 'Saídas'}: {fmt(p.value)}
        </p>
      ))}
    </div>
  );
}

export default function TransactionChart({ transactions }) {
  const data = buildChartData(transactions);
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Evolução Mensal</h2>
        <span className={styles.cardSubtitle}>Últimos 6 meses</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barCategoryGap="30%" barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={(v) => `R$${v >= 1000 ? (v/1000)+'k' : v}`} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={52} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(108,92,231,0.05)' }} />
          <Legend
            formatter={(v) => v === 'income' ? 'Entradas' : 'Saídas'}
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, color: 'var(--text-muted)' }}
          />
          <Bar dataKey="income" fill="var(--positive)" radius={[6,6,0,0]} />
          <Bar dataKey="expense" fill="var(--negative)" radius={[6,6,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
