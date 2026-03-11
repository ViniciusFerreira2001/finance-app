// Mock API using localStorage for a fully functional "Local Mode"
const STORAGE_KEY = 'finance_app_data';

const getStore = () => {
    if (typeof window === 'undefined') return { transactions: [], goals: [] };
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { transactions: [], goals: [] };
};

const saveStore = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const api = {
    getTransactions: async () => {
        const { transactions } = getStore();
        return { transactions: transactions.sort((a, b) => new Date(b.date) - new Date(a.date)) };
    },

    getBalance: async () => {
        const { transactions } = getStore();
        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + Number(t.amount), 0);
        const totalExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + Number(t.amount), 0);
        return {
            totalIncome,
            totalExpense,
            balance: totalIncome - totalExpense
        };
    },

    createTransaction: async (data) => {
        const store = getStore();
        const newTx = {
            ...data,
            id: Math.random().toString(36).substr(2, 9),
            date: data.date || new Date().toISOString()
        };
        store.transactions.push(newTx);
        saveStore(store);
        return newTx;
    },

    updateTransaction: async (id, data) => {
        const store = getStore();
        const index = store.transactions.findIndex(t => t.id === id);
        if (index !== -1) {
            store.transactions[index] = { ...store.transactions[index], ...data };
            saveStore(store);
        }
    },

    deleteTransaction: async (id) => {
        const store = getStore();
        store.transactions = store.transactions.filter(t => t.id !== id);
        saveStore(store);
    },

    // Global Goals
    getGoals: async () => {
        const { goals = [] } = getStore();
        return { goals };
    },

    createGoal: async (data) => {
        const store = getStore();
        if (!store.goals) store.goals = [];
        const newGoal = {
            ...data,
            id: Math.random().toString(36).substr(2, 9),
            currentAmount: data.currentAmount || 0
        };
        store.goals.push(newGoal);
        saveStore(store);
        return newGoal;
    },

    updateGoal: async (id, data) => {
        const store = getStore();
        const index = store.goals.findIndex(g => g.id === id);
        if (index !== -1) {
            store.goals[index] = { ...store.goals[index], ...data };
            saveStore(store);
        }
    },

    deleteGoal: async (id) => {
        const store = getStore();
        store.goals = (store.goals || []).filter(g => g.id !== id);
        saveStore(store);
    },

    depositToGoal: async (id, amount) => {
        const store = getStore();
        const goalIndex = store.goals.findIndex(g => g.id === id);
        if (goalIndex === -1) return;

        const goal = store.goals[goalIndex];
        const numAmount = Number(amount);

        // 1. Update Goal
        store.goals[goalIndex] = {
            ...goal,
            currentAmount: (Number(goal.currentAmount) || 0) + numAmount
        };

        // 2. Create automatic transaction (Cofrinho/Reserva)
        const newTx = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'expense',
            amount: numAmount,
            category: 'Objetivos',
            description: `Depósito: ${goal.title}`,
            date: new Date().toISOString()
        };
        store.transactions.push(newTx);

        saveStore(store);
        return { goal: store.goals[goalIndex], transaction: newTx };
    }
};
