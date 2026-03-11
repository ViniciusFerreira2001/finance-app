'use client';

import { useState, useCallback, useMemo } from 'react';
import { api } from '../lib/api';

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [txRes, balRes] = await Promise.all([
        api.getTransactions(100),
        api.getBalance(),
      ]);
      setTransactions(txRes.transactions || []);
      setBalance(balRes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTransaction = useCallback(async (data) => {
    await api.createTransaction(data);
    await fetchAll();
  }, [fetchAll]);

  const editTransaction = useCallback(async (id, data) => {
    await api.updateTransaction(id, data);
    await fetchAll();
  }, [fetchAll]);

  const removeTransaction = useCallback(async (id) => {
    await api.deleteTransaction(id);
    await fetchAll();
  }, [fetchAll]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const desc = tx.description || '';
      const matchesSearch = desc.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || tx.category === filterCategory;
      const matchesType = filterType === 'all' || tx.type === filterType;
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [transactions, searchTerm, filterCategory, filterType]);

  const categories = useMemo(() => {
    const cats = transactions.map(tx => tx.category);
    return ['all', ...new Set(cats)];
  }, [transactions]);

  return {
    transactions: filteredTransactions,
    rawTransactions: transactions,
    balance,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    filterType,
    setFilterType,
    categories,
    fetchAll,
    addTransaction,
    editTransaction,
    removeTransaction,
  };
}
