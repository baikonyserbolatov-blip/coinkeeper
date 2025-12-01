import React, { useContext, useState } from 'react';
import { TransactionContext } from '../utils/TransactionContext';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaChartPie, 
  FaBell,
  FaCalendar,
  FaMoneyBillWave
} from 'react-icons/fa';
import { format, addMonths } from 'date-fns';
import Modal from './Modal';
import toast from 'react-hot-toast';

const Budgets = () => {
  const { stats, createBudget, categories } = useContext(TransactionContext);
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list', 'chart'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [timeframe, setTimeframe] = useState('current');

  const [budgetForm, setBudgetForm] = useState({
    category: '',
    amount: '',
    month: format(new Date(), 'yyyy-MM'),
    notifications: true,
    notificationThreshold: 80,
    color: '#3498DB'
  });

  const expenseCategories = categories.filter(c => c.type === 'expense');

  const handleSubmitBudget = async (e) => {
    e.preventDefault();
    
    if (!budgetForm.category || !budgetForm.amount || budgetForm.amount <= 0) {
      toast.error('Барлық өрістерді толтырыңыз');
      return;
    }

    try {
      await createBudget({
        ...budgetForm,
        amount: parseFloat(budgetForm.amount)
      });
      
      setShowAddBudget(false);
      setBudgetForm({
        category: '',
        amount: '',
        month: format(new Date(), 'yyyy-MM'),
        notifications: true,
        notificationThreshold: 80,
        color: '#3498DB'
      });
      
      toast.success('Бюджет сәтті сақталды!');
    } catch (error) {
      toast.error('Бюджетті сақтау қатесі');
    }
  };

  const getFilteredBudgets = () => {
    let filtered = stats.budgetStatus;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(b => b.category === selectedCategory);
    }
    
    if (timeframe === 'current') {
      const currentMonth = format(new Date(), 'yyyy-MM');
      filtered = filtered.filter(b => b.month === currentMonth);
    } else if (timeframe === 'future') {
      const nextMonth = format(addMonths(new Date(), 1), 'yyyy-MM');
      filtered = filtered.filter(b => b.month === nextMonth);
    }
    
    return filtered;
  };

  const filteredBudgets = getFilteredBudgets();

  const getBudgetStatusColor = (percentage) => {
    if (percentage >= 100) return '#E74C3C';
    if (percentage >= 80) return '#F39C12';
    if (percentage >= 50) return '#F1C40F';
    return '#2ECC71';
  };

  const calculateTotalBudget = () => {
    return filteredBudgets.reduce((sum, b) => sum + b.amount, 0);
  };

  const calculateTotalSpent = () => {
    return filteredBudgets.reduce((sum, b) => sum + b.spent, 0);
  };

  const calculateAverageUsage = () => {
    if (filteredBudgets.length === 0) return 0;
    return filteredBudgets.reduce((sum, b) => sum + b.percentage, 0) / filteredBudgets.length;
  };

  return (
    <div className="budgets-container">
      <div className="budgets-header">
        <div className="header-left">
          <h2><FaMoneyBillWave /> Бюджеттер</h2>
          <p className="subtitle">
            Бюджеттерді басқару және бақылау
          </p>
        </div>
        
        <div className="header-right">
          <div className="view-controls">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Тор көрінісі"
            >
              ▦
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="Тізім көрінісі"
            >
              ≡
            </button>
            <button 
              className={`view-btn ${viewMode === 'chart' ? 'active' : ''}`}
              onClick={() => setViewMode('chart')}
              title="Диаграмма"
            >
              <FaChartPie />
            </button>
          </div>
          
          <div className="filters">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-filter"
            >
              <option value="all">Барлық санаттар</option>
              {expenseCategories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            
            <select 
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="timeframe-filter"
            >
              <option value="current">Ағымдағы ай</option>
              <option value="future">Келесі ай</option>
              <option value="all">Барлығы</option>
            </select>
          </div>
          
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddBudget(true)}
          >
            <FaPlus /> Жаңа бюджет
          </button>
        </div>
      </div>

      <div className="budgets-stats">
        <div className="stat-card">
          <div className="stat-icon total-budget">
            <FaMoneyBillWave />
          </div>
          <div className="stat-content">
            <span className="stat-label">Жалпы бюджет</span>
            <span className="stat-value">{calculateTotalBudget().toLocaleString()} ₸</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon total-spent">
            <FaChartPie />
          </div>
          <div className="stat-content">
            <span className="stat-label">Жалпы жұмсалды</span>
            <span className="stat-value">{calculateTotalSpent().toLocaleString()} ₸</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon average-usage">
            <FaBell />
          </div>
          <div className="stat-content">
            <span className="stat-label">Орташа пайдалану</span>
            <span className="stat-value">{calculateAverageUsage().toFixed(1)}%</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon remaining">
            <FaCalendar />
          </div>
          <div className="stat-content">
            <span className="stat-label">Қалған бюджет</span>
            <span className="stat-value">
              {(calculateTotalBudget() - calculateTotalSpent()).toLocaleString()} ₸
            </span>
          </div>
        </div>
      </div>

      {viewMode === 'grid' && (
        <div className="budgets-grid">
          {filteredBudgets.map(budget => (
            <div 
              key={budget.id} 
              className="budget-card"
              style={{ borderColor: getBudgetStatusColor(budget.percentage) }}
            >
              <div className="budget-header">
                <div className="budget-category">
                  <div 
                    className="category-color"
                    style={{ backgroundColor: budget.color || '#3498DB' }}
                  />
                  <h4>{budget.category}</h4>
                </div>
                <div className="budget-actions">
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => setEditingBudget(budget)}
                    title="Өңдеу"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => {}}
                    title="Жою"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              
              <div className="budget-progress">
                <div className="progress-info">
                  <span className="spent-amount">{budget.spent.toLocaleString()} ₸</span>
                  <span className="total-amount">/ {budget.amount.toLocaleString()} ₸</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${Math.min(budget.percentage, 100)}%`,
                      backgroundColor: getBudgetStatusColor(budget.percentage)
                    }}
                  />
                </div>
                <div className="progress-percentage">
                  <span>{Math.round(budget.percentage)}%</span>
                  <span className="remaining">
                    Қалды: {(budget.amount - budget.spent).toLocaleString()} ₸
                  </span>
                </div>
              </div>
              
              <div className="budget-footer">
                <div className="budget-month">
                  <FaCalendar /> {format(new Date(budget.month), 'MMM yyyy')}
                </div>
                <div className={`budget-status ${budget.status}`}>
                  {budget.status === 'good' && 'Жақсы'}
                  {budget.status === 'warning' && 'Ескерту'}
                  {budget.status === 'over' && 'Асып кетті'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'list' && (
        <div className="budgets-list">
          <div className="list-header">
            <div className="list-cell">Санат</div>
            <div className="list-cell">Бюджет</div>
            <div className="list-cell">Жұмсалды</div>
            <div className="list-cell">Қалды</div>
            <div className="list-cell">Процент</div>
            <div className="list-cell">Күйі</div>
            <div className="list-cell">Әрекеттер</div>
          </div>
          
          <div className="list-body">
            {filteredBudgets.map(budget => (
              <div key={budget.id} className="list-row">
                <div className="list-cell category-cell">
                  <div 
                    className="category-dot"
                    style={{ backgroundColor: budget.color || '#3498DB' }}
                  />
                  {budget.category}
                </div>
                <div className="list-cell">{budget.amount.toLocaleString()} ₸</div>
                <div className="list-cell">{budget.spent.toLocaleString()} ₸</div>
                <div className="list-cell">
                  {(budget.amount - budget.spent).toLocaleString()} ₸
                </div>
                <div className="list-cell">
                  <span className="percentage-bar">
                    <span 
                      className="percentage-fill"
                      style={{ 
                        width: `${Math.min(budget.percentage, 100)}%`,
                        backgroundColor: getBudgetStatusColor(budget.percentage)
                      }}
                    />
                    <span className="percentage-text">{Math.round(budget.percentage)}%</span>
                  </span>
                </div>
                <div className="list-cell">
                  <span className={`status-badge ${budget.status}`}>
                    {budget.status === 'good' && '✓'}
                    {budget.status === 'warning' && '⚠'}
                    {budget.status === 'over' && '✗'}
                  </span>
                </div>
                <div className="list-cell actions-cell">
                  <button className="action-btn">Өңдеу</button>
                  <button className="action-btn delete">Жою</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewMode === 'chart' && (
        <div className="budgets-chart">
          <div className="chart-container">
            {/* Chart.js графигі осында болады */}
            <div className="chart-placeholder">
              <FaChartPie />
              <p>Бюджеттер диаграммасы</p>
            </div>
          </div>
          
          <div className="chart-legend">
            {filteredBudgets.map(budget => (
              <div key={budget.id} className="legend-item">
                <div 
                  className="legend-color"
                  style={{ backgroundColor: budget.color || '#3498DB' }}
                />
                <span className="legend-label">{budget.category}</span>
                <span className="legend-value">{budget.percentage.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showAddBudget && (
        <Modal
          isOpen={showAddBudget}
          onClose={() => setShowAddBudget(false)}
          title="Жаңа бюджет қосу"
        >
          <form onSubmit={handleSubmitBudget} className="budget-form">
            <div className="form-group">
              <label>Санат</label>
              <select
                value={budgetForm.category}
                onChange={(e) => setBudgetForm({...budgetForm, category: e.target.value})}
                required
              >
                <option value="">Санатты таңдаңыз</option>
                {expenseCategories.map(cat => (
                  <option key={cat.id} value={cat.name}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Сома (₸)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={budgetForm.amount}
                onChange={(e) => setBudgetForm({...budgetForm, amount: e.target.value})}
                placeholder="Бюджет сомасы"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Ай</label>
              <input
                type="month"
                value={budgetForm.month}
                onChange={(e) => setBudgetForm({...budgetForm, month: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Түсі</label>
              <div className="color-picker">
                {['#3498DB', '#2ECC71', '#E74C3C', '#F39C12', '#9B59B6', '#1ABC9C'].map(color => (
                  <button
                    key={color}
                    type="button"
                    className={`color-option ${budgetForm.color === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setBudgetForm({...budgetForm, color})}
                  />
                ))}
              </div>
            </div>
            
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={budgetForm.notifications}
                  onChange={(e) => setBudgetForm({...budgetForm, notifications: e.target.checked})}
                />
                <span>Хабарландыруларды қосу</span>
              </label>
            </div>
            
            {budgetForm.notifications && (
              <div className="form-group">
                <label>Хабарландыру шегі (%)</label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="5"
                  value={budgetForm.notificationThreshold}
                  onChange={(e) => setBudgetForm({...budgetForm, notificationThreshold: e.target.value})}
                />
                <div className="threshold-display">
                  <span>{budgetForm.notificationThreshold}%</span>
                </div>
              </div>
            )}
            
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowAddBudget(false)}
              >
                Болдырмау
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Бюджетті сақтау
              </button>
            </div>
          </form>
        </Modal>
      )}

      {editingBudget && (
        <Modal
          isOpen={!!editingBudget}
          onClose={() => setEditingBudget(null)}
          title="Бюджетті өңдеу"
        >
          {/* Өңдеу формасы */}
        </Modal>
      )}
    </div>
  );
};

export default Budgets;
