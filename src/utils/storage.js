import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
  TRANSACTIONS: 'coinkeeper_transactions',
  BUDGETS: 'coinkeeper_budgets',
  CATEGORIES: 'coinkeeper_categories',
  USERS: 'coinkeeper_users',
  SETTINGS: 'coinkeeper_settings'
};

// Бастапқы деректер
const DEFAULT_CATEGORIES = [
  { id: '1', name: 'Тамақ', type: 'expense', icon: '🍕', color: '#FF6B6B' },
  { id: '2', name: 'Көлік', type: 'expense', icon: '🚗', color: '#4ECDC4' },
  { id: '3', name: 'Ойын-сауық', type: 'expense', icon: '🎬', color: '#FFD166' },
  { id: '4', name: 'Киім', type: 'expense', icon: '👕', color: '#06D6A0' },
  { id: '5', name: 'Коммуналдық', type: 'expense', icon: '🏠', color: '#118AB2' },
  { id: '6', name: 'Денсаулық', type: 'expense', icon: '💊', color: '#073B4C' },
  { id: '7', name: 'Білім', type: 'expense', icon: '📚', color: '#7209B7' },
  { id: '8', name: 'Жалақы', type: 'income', icon: '💰', color: '#2ECC71' },
  { id: '9', name: 'Бонус', type: 'income', icon: '🎁', color: '#F39C12' },
  { id: '10', name: 'Инвестиция', type: 'income', icon: '📈', color: '#3498DB' }
];

// Транзакциялар
export const getTransactions = () => {
  const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  return data ? JSON.parse(data) : [];
};

export const addTransaction = (transaction) => {
  const transactions = getTransactions();
  const newTransaction = {
    id: uuidv4(),
    ...transaction,
    createdAt: new Date().toISOString()
  };
  const updated = [...transactions, newTransaction];
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));
  return newTransaction;
};

export const updateTransaction = (id, updates) => {
  const transactions = getTransactions();
  const index = transactions.findIndex(t => t.id === id);
  if (index === -1) throw new Error('Транзакция табылмады');
  
  transactions[index] = { ...transactions[index], ...updates, updatedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  return transactions[index];
};

export const deleteTransaction = (id) => {
  const transactions = getTransactions();
  const updated = transactions.filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));
};

// Бюджеттер
export const getBudgets = () => {
  const data = localStorage.getItem(STORAGE_KEYS.BUDGETS);
  return data ? JSON.parse(data) : [];
};

export const setBudget = (budget) => {
  const budgets = getBudgets();
  const existingIndex = budgets.findIndex(b => b.category === budget.category && b.month === budget.month);
  
  const newBudget = {
    id: uuidv4(),
    ...budget,
    createdAt: new Date().toISOString()
  };
  
  if (existingIndex !== -1) {
    budgets[existingIndex] = newBudget;
  } else {
    budgets.push(newBudget);
  }
  
  localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  return newBudget;
};

// Санаттар
export const getCategories = () => {
  const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES;
  }
  return JSON.parse(data);
};

export const addCategory = (category) => {
  const categories = getCategories();
  const newCategory = {
    id: uuidv4(),
    ...category
  };
  const updated = [...categories, newCategory];
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated));
  return newCategory;
};

// Экспорт/Импорт
export const exportData = () => {
  const data = {
    transactions: getTransactions(),
    budgets: getBudgets(),
    categories: getCategories(),
    exportedAt: new Date().toISOString()
  };
  return JSON.stringify(data, null, 2);
};

export const importData = (jsonData) => {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.transactions) {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(data.transactions));
    }
    if (data.budgets) {
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(data.budgets));
    }
    if (data.categories) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(data.categories));
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Кеш тазалау
export const clearData = () => {
  localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
  localStorage.removeItem(STORAGE_KEYS.BUDGETS);
  localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
};
