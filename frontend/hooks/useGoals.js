'use client';

import { useState, useCallback, useEffect } from 'react';
import { api } from '../lib/api';

export function useGoals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getGoals();
      setGoals(res.goals || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addGoal = useCallback(async (data) => {
    await api.createGoal(data);
    await fetchGoals();
  }, [fetchGoals]);

  const editGoal = useCallback(async (id, data) => {
    await api.updateGoal(id, data);
    await fetchGoals();
  }, [fetchGoals]);

  const removeGoal = useCallback(async (id) => {
    await api.deleteGoal(id);
    await fetchGoals();
  }, [fetchGoals]);

  const depositToGoal = useCallback(async (id, amount) => {
    await api.depositToGoal(id, amount);
    await fetchGoals();
  }, [fetchGoals]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return {
    goals,
    loading,
    error,
    fetchGoals,
    addGoal,
    editGoal,
    removeGoal,
    depositToGoal,
  };
}
