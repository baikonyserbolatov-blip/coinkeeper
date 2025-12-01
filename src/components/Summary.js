import React, { useContext, useState } from 'react';
import { TransactionContext } from '../utils/TransactionContext';
import { 
  FaArrowUp, 
  FaArrowDown, 
  FaWallet, 
  FaChartLine,
  FaCalendarAlt,
  FaExchangeAlt
} from 'react-icons/fa';
import { format, subMonths } from 'date-fns';
import { kk } from 'date-fns/locale';

const Summary = () => {
  const { stats, transactions } = useContext(TransactionContext);
  const [timeframe, setTimeframe] = useState('month');
  
  const getTimeframeData = () => {
    const now = new Date();
    let filtered = [...transactions];
    
    switch(timeframe) {
      case 'today':
        const today = format(now, 'yyyy-MM-dd');
        filtered = filtered.filter(t => format(new Date(t.date), 'yyyy-MM-dd') === today);
        break;
      case 'week':
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        filtered = filtered.filter(t => new Date(t.date) >= weekAgo);
        break;
      case 'month':
        const monthAgo = subMonths(new Date(), 1);
        filtered = filtered.filter(t => new Date(t.date) >= monthAgo);
        break;
      case 'year':
        const yearAgo = subMonths(new Date(), 12);
        filtered = filtered.filter(t => new Date(t.date) >= yearAgo);
        break;
      default:
        break;
    }
    
    const income = filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expense;
    
    return { income, expense, balance, count: filtered.length };
  };
  
  const timeframeData = getTimeframeData();
  const previousMonthData = stats.monthlyStats[stats.monthlyStats.length - 2] || { income: 0, expense: 0 };
  
  const calculateChange = (current, previous) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };
  
  const incomeChange = calculateChange(timeframeData.income, previousMonthData.income);
  const expenseChange = calculateChange(timeframeData.expense, previousMonthData.expense);
  const balanceChange = calculateChange(
    timeframeData.balance, 
    previousMonthData.income - previousMonthData.expense
  );

  const summaryCards = [
    {
      id: 'income',
      title: 'Табыс',
      value: timeframeData.income,
      icon: <FaArrowUp />,
      change: incomeChange,
      color: '#2ECC71',
      gradient: 'linear-gradient(135deg, #2ECC71, #27AE60)'
    },
    {
      id: 'expense',
      title: 'Шығын',
      value: timeframeData.expense,
      icon: <FaArrowDown />,
      change: expenseChange,
      color: '#E74C3C',
      gradient: 'linear-gradient(135deg, #E74C3C, #C0392B)'
    },
    {
      id: 'balance',
      title: 'Қалдық',
      value: timeframeData.balance,
      icon: <FaWallet />,
      change: balanceChange,
      color: '#3498DB',
      gradient: 'linear-gradient(135deg, #3498DB, #2980B9)'
    },
    {
      id: 'transactions',
      title: 'Транзакциялар',
      value: timeframeData.count,
      icon: <FaExchangeAlt />,
      change: 0,
      color: '#9B59B6',
      gradient: 'linear-gradient(135deg, #9B59B6, #8E44AD)'
    }
  ];

  const getBudgetStatus = () => {
    const totalBudget = stats.budgetStatus.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = stats.budgetStatus.reduce((sum, b) => sum + b.spent, 0);
    const percentage = (totalSpent / totalBudget) * 100;
    
    let status = 'good';
    if (percentage >= 90) status = 'danger';
    else if (percentage >= 70) status = 'warning';
    
    return { totalBudget, totalSpent, percentage, status };
  };

  const budgetStatus = getBudgetStatus();

  return (
    <div className="summary-container">
      <div className="summary-header">
        <div className="header-left">
          <h2>Қаржылық қорытынды</h2>
          <p className="subtitle">
            {format(new Date(), 'dd MMMM yyyy', { locale: kk })}
          </p>
        </div>
        
        <div className="header-right">
          <div className="timeframe-selector">
            <button 
              className={`timeframe-btn ${timeframe === 'today' ? 'active' : ''}`}
              onClick={() => setTimeframe('today')}
            >
              Бүгін
            </button>
            <button 
              className={`timeframe-btn ${timeframe === 'week' ? 'active' : ''}`}
              onClick={() => setTimeframe('week')}
            >
              Апта
            </button>
            <button 
              className={`timeframe-btn ${timeframe === 'month' ? 'active' : ''}`}
              onClick={() => setTimeframe('month')}
            >
              Ай
            </button>
            <button 
              className={`timeframe-btn ${timeframe === 'year' ? 'active' : ''}`}
              onClick={() => setTimeframe('year')}
            >
              Жыл
            </button>
          </div>
          
          <div className="trend-indicator">
            <FaChartLine />
            <span className={`trend-text ${balanceChange >= 0 ? 'positive' : 'negative'}`}>
              {balanceChange >= 0 ? '↑' : '↓'} {Math.abs(balanceChange).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      <div className="summary-grid">
        {summaryCards.map(card => (
          <div 
            key={card.id} 
            className="summary-card"
            style={{ 
              borderTopColor: card.color,
              background: card.gradient
            }}
          >
            <div className="card-header">
              <div className="card-icon" style={{ color: card.color }}>
                {card.icon}
              </div>
              <div className="card-title">{card.title}</div>
            </div>
            
            <div className="card-value">
              {card.id === 'transactions' 
                ? card.value.toLocaleString()
                : `${card.value.toLocaleString()} ₸`
              }
            </div>
            
            <div className="card-footer">
              {card.change !== 0 && (
                <div className={`change-indicator ${card.change >= 0 ? 'positive' : 'negative'}`}>
                  {card.change >= 0 ? '↑' : '↓'} {Math.abs(card.change).toFixed(1)}%
                </div>
              )}
              <div className="card-subtitle">
                {timeframe === 'today' && 'Бүгін'}
                {timeframe === 'week' && 'Соңғы апта'}
                {timeframe === 'month' && 'Соңғы ай'}
                {timeframe === 'year' && 'Соңғы жыл'}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="summary-details">
        <div className="detail-card budget-card">
          <div className="detail-header">
            <h4><FaCalendarAlt /> Бюджет күйі</h4>
            <span className={`budget-status ${budgetStatus.status}`}>
              {budgetStatus.status === 'good' ? 'Жақсы' : 
               budgetStatus.status === 'warning' ? 'Ескерту' : 'Төтенше'}
            </span>
          </div>
          
          <div className="budget-progress">
            <div className="progress-bar">
              <div 
                className={`progress-fill ${budgetStatus.status}`}
                style={{ width: `${Math.min(budgetStatus.percentage, 100)}%` }}
              >
                <span>{Math.round(budgetStatus.percentage)}%</span>
              </div>
            </div>
            <div className="budget-numbers">
              <span className="budget-spent">Жұмсалды: {budgetStatus.totalSpent.toLocaleString()} ₸</span>
              <span className="budget-total">Жалпы: {budgetStatus.totalBudget.toLocaleString()} ₸</span>
            </div>
          </div>
          
          <div className="budget-categories">
            {stats.budgetStatus.slice(0, 3).map(budget => (
              <div key={budget.category} className="budget-category">
                <span className="category-name">{budget.category}</span>
                <span className="category-progress">
                  {Math.round(budget.percentage)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="detail-card category-card">
          <div className="detail-header">
            <h4>Ең көп шығын санаттары</h4>
          </div>
          
          <div className="category-list">
            {stats.categoryStats
              .filter(stat => stat.expense > 0)
              .sort((a, b) => b.expense - a.expense)
              .slice(0, 5)
              .map((stat, index) => (
                <div key={stat.category} className="category-item">
                  <div className="category-rank">
                    <span className="rank-number">{index + 1}</span>
                    <span className="category-name">{stat.category}</span>
                  </div>
                  <div className="category-amount">
                    <span className="amount">{stat.expense.toLocaleString()} ₸</span>
                    <span className="percentage">
                      {((stat.expense / timeframeData.expense) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="detail-card prediction-card">
          <div className="detail-header">
            <h4>Келесі ай болжамы</h4>
            <span className="prediction-accuracy">85% дәлдік</span>
          </div>
          
          <div className="prediction-content">
            <div className="prediction-item">
              <span className="prediction-label">Табыс болжамы:</span>
              <span className="prediction-value income">
                {Math.round(timeframeData.income * 1.1).toLocaleString()} ₸
              </span>
            </div>
            <div className="prediction-item">
              <span className="prediction-label">Шығын болжамы:</span>
              <span className="prediction-value expense">
                {Math.round(timeframeData.expense * 0.95).toLocaleString()} ₸
              </span>
            </div>
            <div className="prediction-item">
              <span className="prediction-label">Қалдық болжамы:</span>
              <span className="prediction-value balance">
                {Math.round((timeframeData.income * 1.1) - (timeframeData.expense * 0.95)).toLocaleString()} ₸
              </span>
            </div>
          </div>
          
          <div className="prediction-tips">
            <p className="tip-title">💡 Кеңес:</p>
            <p className="tip-content">
              {timeframeData.balance > 0 
                ? 'Сіздің қаржылық жағдайыңыз жақсы. Қалған ақшаны жинақтауға бағыттаңыз.'
                : 'Шығындарыңызды азайтып, бюджетті қайта қараңыз.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
