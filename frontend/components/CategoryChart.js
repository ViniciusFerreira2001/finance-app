'use client';

import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import styles from './CategoryChart.module.css';

const COLORS = [
  '#6C5CE7', // Accent
  '#00B894', // Positive
  '#FD7C5A', // Negative
  '#FDCB6E', // Warning
  '#0984E3', // Blue
  '#E17055', // Orange
  '#D63031', // Red
  '#E84393', // Pink
  '#2D3436', // Dark
];

const fmt = (n) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{data.name}</p>
      <p style={{ color: payload[0].fill, fontWeight: 700 }}>
        {fmt(data.value)}
      </p>
      <p className={styles.tooltipPercent}>{data.percent.toFixed(1)}% do total</p>
    </div>
  );
}

export default function CategoryChart({ transactions }) {
  // Processar dados apenas de despesas para o gráfico de pizza ser mais útil
  const expenses = transactions.filter(t => t.type === 'expense');
  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);

  const dataMap = {};
  expenses.forEach(t => {
    const cat = t.category || 'Outros';
    dataMap[cat] = (dataMap[cat] || 0) + Number(t.amount);
  });

  const data = Object.entries(dataMap)
    .map(([name, value]) => ({
      name,
      value,
      percent: (value / totalExpense) * 100
    }))
    .sort((a, b) => b.value - a.value);

  if (expenses.length === 0) {
    return (
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Gastos por Categoria</h2>
        <div className={styles.empty}>
          <p>Sem despesas para exibir o gráfico.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>Gastos por Categoria</h2>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
