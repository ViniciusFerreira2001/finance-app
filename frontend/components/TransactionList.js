'use client';

import styles from './TransactionList.module.css';

const fmt = (n) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n ?? 0);

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

export default function TransactionList({
  transactions,
  onEdit,
  onDelete,
  loading,
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  filterType,
  setFilterType,
  categories = []
}) {
  return (
    <div className={styles.card}>
      <div className={styles.filterBar}>
        <div className={styles.searchWrap}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className={styles.searchIcon}>
            <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M14 14l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Buscar transação..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.dropdowns}>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className={styles.select}
          >
            <option value="all">Todos os tipos</option>
            <option value="income">Entradas</option>
            <option value="expense">Saídas</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className={styles.select}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'Todas as categorias' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Transações</h2>
        <span className={styles.count}>{transactions.length} registros encontrados</span>
      </div>

      {loading ? (
        <div className={styles.skeletonList}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`skeleton ${styles.skeletonRow}`} style={{ animationDelay: `${i * 80}ms` }} />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className={styles.empty}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="var(--border)" strokeWidth="2" />
            <path d="M14 20h12M20 14v12" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p>Nenhuma transação ainda.</p>
          <span>Clique em <strong>Nova Transação</strong> para começar.</span>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Data</th>
                <th className={styles.amountCol}>Valor</th>
                <th className={styles.actionsCol}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, i) => (
                <tr key={tx.id} className={styles.row} style={{ animationDelay: `${i * 30}ms` }}>
                  <td className={styles.descCell}>
                    <span className={`${styles.typeDot} ${styles[tx.type]}`} />
                    <span className={styles.desc}>{tx.description || tx.category}</span>
                  </td>
                  <td>
                    <span className={styles.badge}>{tx.category}</span>
                  </td>
                  <td className={styles.dateCell}>{fmtDate(tx.date)}</td>
                  <td className={`${styles.amountCol} ${styles[tx.type + 'Amt']}`}>
                    {tx.type === 'income' ? '+' : '-'} {fmt(tx.amount)}
                  </td>
                  <td className={styles.actionsCol}>
                    <button
                      id={`edit-tx-${tx.id}`}
                      className={styles.iconBtn}
                      onClick={() => onEdit(tx)}
                      title="Editar"
                    >
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                        <path d="M10.5 2.5l2 2L5 12H3v-2L10.5 2.5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button
                      id={`delete-tx-${tx.id}`}
                      className={`${styles.iconBtn} ${styles.deleteBtn}`}
                      onClick={() => onDelete(tx)}
                      title="Excluir"
                    >
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                        <path d="M2 4h11M5 4V2h5v2M6 7v5M9 7v5M3 4l1 9h7l1-9H3z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
