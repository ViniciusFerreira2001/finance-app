'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { useTransactions } from '../../hooks/useTransactions';
import { useGoals } from '../../hooks/useGoals';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import BalanceCard from '../../components/BalanceCard';
import TransactionChart from '../../components/TransactionChart';
import CategoryChart from '../../components/CategoryChart';
import TransactionList from '../../components/TransactionList';
import GoalCard from '../../components/GoalCard';
import TransactionModal from '../../components/TransactionModal';
import GoalModal from '../../components/GoalModal';
import DepositModal from '../../components/DepositModal';
import DeleteConfirm from '../../components/DeleteConfirm';
import styles from './dashboard.module.css';

function DashboardContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const {
    transactions, rawTransactions, balance, loading, fetchAll,
    addTransaction, editTransaction, removeTransaction,
    searchTerm, setSearchTerm,
    filterCategory, setFilterCategory,
    filterType, setFilterType,
    categories,
  } = useTransactions();

  const {
    goals, addGoal, editGoal, removeGoal, depositToGoal
  } = useGoals();

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [goalEditData, setGoalEditData] = useState(null);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [depositTarget, setDepositTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    // Modo Local: Sem redirecionamento
    // if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) fetchAll();
  }, [user, fetchAll]);

  function openCreate() { setEditData(null); setModalOpen(true); }
  function openEdit(tx) { setEditData(tx); setModalOpen(true); }
  function closeModal() { setModalOpen(false); setEditData(null); }

  function openGoalCreate() { setGoalEditData(null); setGoalModalOpen(true); }
  function openGoalEdit(goal) { setGoalEditData(goal); setGoalModalOpen(true); }

  async function handleSubmit(payload) {
    if (editData) {
      await editTransaction(editData.id, payload);
    } else {
      await addTransaction(payload);
    }
  }

  async function handleGoalSubmit(payload) {
    if (goalEditData) {
      await editGoal(goalEditData.id, payload);
    } else {
      await addGoal(payload);
    }
  }

  async function handleDepositClick(goal) {
    setDepositTarget(goal);
    setDepositModalOpen(true);
  }

  async function handleDepositSubmit(id, amount) {
    await depositToGoal(id, amount);
    await fetchAll(); // Refresh balance and transactions
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await removeTransaction(deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  }

  if (authLoading || !user) return null;

  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.main}>
        <div className={styles.content}>
          <Header onNewTransaction={openCreate} />
          <BalanceCard balance={balance} loading={loading} />

          <div className={styles.grid}>
            <div className={styles.chartsRow}>
              <TransactionChart transactions={rawTransactions} />
              <CategoryChart transactions={transactions} />
            </div>

            <section className={styles.goalsSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Meus Objetivos</h2>
                <button className={styles.addGoalBtn} onClick={openGoalCreate}>
                  + Novo Objetivo
                </button>
              </div>
              <div className={styles.goalsGrid}>
                {goals.length === 0 ? (
                  <div className={styles.emptyGoals}>
                    Nenhum objetivo definido ainda. Junte para algo especial!
                  </div>
                ) : (
                  goals.map(goal => (
                    <GoalCard 
                      key={goal.id} 
                      goal={goal} 
                      onEdit={openGoalEdit} 
                      onDelete={removeGoal} 
                      onDeposit={handleDepositClick}
                    />
                  ))
                )}
              </div>
            </section>

            <TransactionList
              transactions={transactions}
              loading={loading}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
              filterType={filterType}
              setFilterType={setFilterType}
              categories={categories}
            />
          </div>
        </div>
      </main>

      <TransactionModal
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        editData={editData}
      />

      <GoalModal
        open={goalModalOpen}
        onClose={() => setGoalModalOpen(false)}
        onSubmit={handleGoalSubmit}
        editData={goalEditData}
      />

      <DepositModal
        open={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        onSubmit={handleDepositSubmit}
        goal={depositTarget}
      />

      <DeleteConfirm
        open={!!deleteTarget}
        transaction={deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteLoading}
      />
    </div>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}
