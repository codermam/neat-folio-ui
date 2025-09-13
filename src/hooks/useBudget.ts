import { useState, useEffect } from 'react';
import { Transaction, CategorySummary, MonthlySummary, BudgetGoal, TransactionFilters } from '@/types/budget';

export function useBudget() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('budget-transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [budgetGoals, setBudgetGoals] = useState<BudgetGoal[]>(() => {
    const saved = localStorage.getItem('budget-goals');
    return saved ? JSON.parse(saved) : [];
  });

  const [filters, setFilters] = useState<TransactionFilters>({});

  useEffect(() => {
    localStorage.setItem('budget-transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('budget-goals', JSON.stringify(budgetGoals));
  }, [budgetGoals]);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => 
      prev.map(t => t.id === id ? { ...t, ...updates } : t)
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const getMonthlyTotals = () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyTransactions = transactions.filter(t => 
      t.date.startsWith(currentMonth)
    );

    const income = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return { income, expenses, balance: income - expenses };
  };

  const getCategorySummaries = (): CategorySummary[] => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyExpenses = transactions.filter(t => 
      t.type === 'expense' && t.date.startsWith(currentMonth)
    );

    const categoryTotals = monthlyExpenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
      count: monthlyExpenses.filter(t => t.category === category).length,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
    }));
  };

  const addBudgetGoal = (goal: Omit<BudgetGoal, 'id'>) => {
    const newGoal: BudgetGoal = {
      ...goal,
      id: crypto.randomUUID(),
    };
    setBudgetGoals(prev => [...prev, newGoal]);
  };

  const updateBudgetGoal = (id: string, updates: Partial<BudgetGoal>) => {
    setBudgetGoals(prev => 
      prev.map(goal => goal.id === id ? { ...goal, ...updates } : goal)
    );
  };

  const deleteBudgetGoal = (id: string) => {
    setBudgetGoals(prev => prev.filter(goal => goal.id !== id));
  };

  const getFilteredTransactions = () => {
    return transactions.filter(transaction => {
      // Category filter
      if (filters.category && transaction.category !== filters.category) {
        return false;
      }

      // Date range filter
      if (filters.dateStart && transaction.date < filters.dateStart) {
        return false;
      }
      if (filters.dateEnd && transaction.date > filters.dateEnd) {
        return false;
      }

      // Amount range filter
      if (filters.amountMin && transaction.amount < filters.amountMin) {
        return false;
      }
      if (filters.amountMax && transaction.amount > filters.amountMax) {
        return false;
      }

      // Search filter
      if (filters.search && !transaction.description.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      return true;
    });
  };

  const clearFilters = () => {
    setFilters({});
  };

  return {
    transactions,
    filteredTransactions: getFilteredTransactions(),
    filters,
    budgetGoals,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getMonthlyTotals,
    getCategorySummaries,
    addBudgetGoal,
    updateBudgetGoal,
    deleteBudgetGoal,
    setFilters,
    clearFilters,
  };
}