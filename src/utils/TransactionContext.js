import React, { createContext, useState, useEffect, useCallback } from 'react';
import { 
  getTransactions, 
  addTransaction, 
  updateTransaction, 
  deleteTransaction,
  getBudgets,
  setBudget,
  getCategories,
  addCategory
} from './storage';
import { 
  calculateTotals, 
  filterByDate, 
  filterByCategory, 
  groupByMonth,
  getCategoryStats,
  getMonthlySummary
} from './calculations';
import toast from 'react-hot-toast';

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    dateRange: 'month',
    startDate: null,
    endDate: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [transData, budgetData, categoryData] = await Promise.all([
        getTransactions(),
        getBudgets(),
        getCategories()
      ]);
      setTransactions(transData);
      setBudgets(budgetData);
      setCategories(categoryData);
    } catch (error) {
      toast.error('Деректерді жүктеу кезінде қателік орын алды');
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (transactionData) => {
    try {
      const newTransaction = await addTransaction(transactionData);
      setTransactions(prev => [...prev, newTransaction]);
      
      // Бюджетті тексеру
      const categoryBudget = budgets.find(b => b.category === transactionData.category);
      if (categoryBudget && transactionData.type === 'expense') {
        const monthlyExpenses = transactions
          .filter(t => t.category === transactionData.category && 
                      t.type === 'expense' && 
                      new Date(t.date).getMonth() === new Date().getMonth())
          .reduce((sum, t) => sum + t.amount, 0);
        
        if (monthlyExpenses + transactionData.amount > categoryBudget.amount) {
          toast.warning(`"${transactionData.category}" санатындағы бюджет асып кетті!`);
        }
      }
      
      toast.success('Транзакция сәтті қосылды');
      return newTransaction;
    } catch (error) {
      toast.error('Транзакцияны қосу кезінде қателік орын алды');
      throw error;
    }
  };

  const editTransaction = async (id, updates) => {
    try {
      const updated = await updateTransaction(id, updates);
      setTransactions(prev => prev.map(t => t.id === id ? updated : t));
      toast.success('Транзакция сәтті өзгертілді');
      return updated;
    } catch (error) {
      toast.error('Транзакцияны өзгерту кезінде қателік орын алды');
      throw error;
    }
  };

  const removeTransaction = async (id) => {
    try {
      await deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
      toast.success('Транзакция сәтті жойылды');
    } catch (error) {
      toast.error('Транзакцияны жою кезінде қателік орын алды');
      throw error;
    }
  };

  const createBudget = async (budgetData) => {
    try {
      const newBudget = await setBudget(budgetData);
      setBudgets(prev => [...prev.filter(b => b.category !== budgetData.category), newBudget]);
      toast.success('Бюджет сәтті сақталды');
      return newBudget;
    } catch (error) {
      toast.error('Бюджетті сақтау кезінде қателік орын алды');
      throw error;
    }
  };

  const createCategory = async (categoryData) => {
    try {
      const newCategory = await addCategory(categoryData);
      setCategories(prev => [...prev, newCategory]);
      toast.success('Санат сәтті қосылды');
      return newCategory;
    } catch (error) {
      toast.error('Санат қосу кезінде қателік орын алды');
      throw error;
    }
  };

  // Фильтрленген транзакциялар
  const filteredTransactions = useCallback(() => {
    let filtered = [...transactions];
    
    if (filters.type !== 'all') {
      filtered = filtered.filter(t => t.type === filters.type);
    }
    
    if (filters.category !== 'all') {
      filtered = filtered.filter(t => t.category === filters.category);
    }
    
    if (filters.dateRange !== 'all') {
      filtered = filterByDate(filtered, filters.dateRange, filters.startDate, filters.endDate);
    }
    
    return filtered;
  }, [transactions, filters]);

  // Статистика
  const stats = useCallback(() => {
    const filtered = filteredTransactions();
    const totals = calculateTotals(filtered);
    const categoryStats = getCategoryStats(filtered);
    const monthlyStats = getMonthlySummary(transactions);
    
    return {
      totals,
      categoryStats,
      monthlyStats,
      filteredCount: filtered.length,
      budgetStatus: budgets.map(budget => {
        const spent = transactions
          .filter(t => t.category === budget.category && t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        return {
          ...budget,
          spent,
          remaining: budget.amount - spent,
          percentage: (spent / budget.amount) * 100
        };
      })
    };
  }, [transactions, filteredTransactions, budgets]);

  const value = {
    transactions,
    budgets,
    categories,
    filters,
    loading,
    stats: stats(),
    filteredTransactions: filteredTransactions(),
    setFilters,
    createTransaction,
    editTransaction,
    removeTransaction,
    createBudget,
    createCategory,
    refreshData: loadData
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};
