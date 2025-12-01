import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

// Жалпы сомаларды есептеу
export const calculateTotals = (transactions) => {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = income - expense;
  
  return { income, expense, balance };
};

// Күндер бойынша топтау
export const groupByDate = (transactions, period = 'day') => {
  const groups = {};
  
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    let key;
    
    switch (period) {
      case 'day':
        key = format(date, 'yyyy-MM-dd');
        break;
      case 'week':
        key = format(date, 'yyyy-ww');
        break;
      case 'month':
        key = format(date, 'yyyy-MM');
        break;
      default:
        key = format(date, 'yyyy-MM-dd');
    }
    
    if (!groups[key]) {
      groups[key] = {
        date: key,
        income: 0,
        expense: 0,
        transactions: []
      };
    }
    
    groups[key][transaction.type] += transaction.amount;
    groups[key].transactions.push(transaction);
  });
  
  return Object.values(groups).sort((a, b) => new Date(a.date) - new Date(b.date));
};

// Санаттар бойынша статистика
export const getCategoryStats = (transactions) => {
  const categoryStats = {};
  
  transactions.forEach(transaction => {
    if (!categoryStats[transaction.category]) {
      categoryStats[transaction.category] = {
        category: transaction.category,
        income: 0,
        expense: 0,
        count: 0
      };
    }
    
    categoryStats[transaction.category][transaction.type] += transaction.amount;
    categoryStats[transaction.category].count++;
  });
  
  return Object.values(categoryStats).map(stat => ({
    ...stat,
    total: stat.income + stat.expense
  }));
};

// Айлық қорытынды
export const getMonthlySummary = (transactions) => {
  const monthlyData = {};
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), i);
    return format(date, 'yyyy-MM');
  }).reverse();
  
  // Бастапқы мәндер
  last6Months.forEach(month => {
    monthlyData[month] = { income: 0, expense: 0 };
  });
  
  // Транзакцияларды топтау
  transactions.forEach(transaction => {
    const month = format(new Date(transaction.date), 'yyyy-MM');
    if (monthlyData[month]) {
      monthlyData[month][transaction.type] += transaction.amount;
    }
  });
  
  // Массивке түрлендіру
  return last6Months.map(month => ({
    month,
    ...monthlyData[month],
    balance: monthlyData[month].income - monthlyData[month].expense
  }));
};

// Фильтрлер
export const filterByDate = (transactions, range, startDate, endDate) => {
  const now = new Date();
  
  switch (range) {
    case 'today':
      const today = format(now, 'yyyy-MM-dd');
      return transactions.filter(t => format(new Date(t.date), 'yyyy-MM-dd') === today);
      
    case 'week':
      const weekAgo = subMonths(now, 1);
      return transactions.filter(t => new Date(t.date) >= weekAgo);
      
    case 'month':
      const monthAgo = subMonths(now, 1);
      return transactions.filter(t => new Date(t.date) >= monthAgo);
      
    case 'year':
      const yearAgo = subMonths(now, 12);
      return transactions.filter(t => new Date(t.date) >= yearAgo);
      
    case 'custom':
      if (startDate && endDate) {
        return transactions.filter(t => 
          isWithinInterval(new Date(t.date), {
            start: new Date(startDate),
            end: new Date(endDate)
          })
        );
      }
      return transactions;
      
    default:
      return transactions;
  }
};

export const filterByCategory = (transactions, category) => {
  if (category === 'all') return transactions;
  return transactions.filter(t => t.category === category);
};

export const filterByType = (transactions, type) => {
  if (type === 'all') return transactions;
  return transactions.filter(t => t.type === type);
};

// Бюджет есептеулері
export const calculateBudgetStatus = (transactions, budgets) => {
  return budgets.map(budget => {
    const monthStart = startOfMonth(new Date(budget.month));
    const monthEnd = endOfMonth(new Date(budget.month));
    
    const spent = transactions
      .filter(t => 
        t.category === budget.category &&
        t.type === 'expense' &&
        isWithinInterval(new Date(t.date), { start: monthStart, end: monthEnd })
      )
      .reduce((sum, t) => sum + t.amount, 0);
    
    const remaining = budget.amount - spent;
    const percentage = (spent / budget.amount) * 100;
    
    return {
      ...budget,
      spent,
      remaining,
      percentage,
      status: percentage >= 100 ? 'over' : percentage >= 80 ? 'warning' : 'good'
    };
  });
};

// Тренд есептеу
export const calculateTrend = (current, previous) => {
  if (previous === 0) return 100;
  return ((current - previous) / previous) * 100;
};

// Болжам
export const predictNextMonth = (transactions) => {
  const last3Months = groupByDate(transactions, 'month').slice(-3);
  
  if (last3Months.length < 2) return null;
  
  const avgIncome = last3Months.reduce((sum, month) => sum + month.income, 0) / last3Months.length;
  const avgExpense = last3Months.reduce((sum, month) => sum + month.expense, 0) / last3Months.length;
  
  return {
    predictedIncome: avgIncome,
    predictedExpense: avgExpense,
    predictedBalance: avgIncome - avgExpense,
    confidence: last3Months.length * 0.3 // Сенімділік коэффициенті
  };
};
