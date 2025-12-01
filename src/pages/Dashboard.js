import React, { useContext, useState } from 'react';
import { TransactionContext } from '../utils/TransactionContext';
import Summary from '../components/Summary';
import Charts from '../components/Charts';
import TransactionList from '../components/TransactionList';
import Budgets from '../components/Budgets';
import Filters from '../components/Filters';
import { FaPlus, FaDownload, FaChartLine, FaBell } from 'react-icons/fa';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { 
    stats, 
    filteredTransactions, 
    createTransaction,
    refreshData 
  } = useContext(TransactionContext);
  
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAmount, setQuickAmount] = useState('');
  const [quickCategory, setQuickCategory] = useState('Тамақ');
  const [quickType, setQuickType] = useState('expense');

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!quickAmount || quickAmount <= 0) {
      toast.error('Дұрыс сома енгізіңіз');
      return;
    }

    await createTransaction({
      type: quickType,
      category: quickCategory,
      amount: parseFloat(quickAmount),
      date: format(new Date(), 'yyyy-MM-dd'),
      description: 'Жылдам транзакция'
    });

    setQuickAmount('');
    setShowQuickAdd(false);
    toast.success('Транзакция қосылды!');
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(filteredTransactions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `transactions_${format(new Date(), 'yyyy-MM-dd')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Бақылау тақтасы</h1>
          <p className="subtitle">{format(new Date(), 'dd MMMM yyyy')}</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={handleExport}>
            <FaDownload /> Экспорт
          </button>
          <button className="btn btn-primary" onClick={() => setShowQuickAdd(!showQuickAdd)}>
            <FaPlus /> Жылдам қосу
          </button>
          <button className="btn btn-icon" onClick={refreshData}>
            <FaChartLine />
          </button>
        </div>
      </div>

      {showQuickAdd && (
        <div className="quick-add-form">
          <form onSubmit={handleQuickAdd}>
            <div className="form-row">
              <select value={quickType} onChange={(e) => setQuickType(e.target.value)}>
                <option value="expense">Шығын</option>
                <option value="income">Табыс</option>
              </select>
              <select value={quickCategory} onChange={(e) => setQuickCategory(e.target.value)}>
                <option value="Тамақ">Тамақ</option>
                <option value="Көлік">Көлік</option>
                <option value="Ойын-сауық">Ойын-сауық</option>
                <option value="Жалақы">Жалақы</option>
              </select>
              <input
                type="number"
                placeholder="Сома"
                value={quickAmount}
                onChange={(e) => setQuickAmount(e.target.value)}
                step="0.01"
              />
              <button type="submit" className="btn btn-success">Қосу</button>
              <button type="button" onClick={() => setShowQuickAdd(false)} className="btn btn-cancel">
                Болдырмау
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="dashboard-grid">
        <div className="grid-item full-width">
          <Summary />
        </div>
        
        <div className="grid-item">
          <div className="card">
            <div className="card-header">
              <h3>Бюджет күйі</h3>
              <FaBell className="icon-warning" />
            </div>
            <div className="budget-status">
              {stats.budgetStatus.map((budget, index) => (
                <div key={index} className="budget-item">
                  <div className="budget-info">
                    <span className="budget-category">{budget.category}</span>
                    <span className="budget-amount">{budget.spent} / {budget.amount} ₸</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className={`progress-fill ${budget.status}`}
                      style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                    >
                      <span>{Math.round(budget.percentage)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid-item">
          <div className="card">
            <div className="card-header">
              <h3>Жылдам статистика</h3>
            </div>
            <div className="quick-stats">
              <div className="stat-item">
                <span className="stat-label">Бүгінгі шығын</span>
                <span className="stat-value expense">
                  {stats.totals.expense.toLocaleString()} ₸
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Айлық баланс</span>
                <span className={`stat-value ${stats.totals.balance >= 0 ? 'income' : 'expense'}`}>
                  {stats.totals.balance.toLocaleString()} ₸
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Орташа күнделікті</span>
                <span className="stat-value">
                  {Math.round(stats.totals.expense / 30).toLocaleString()} ₸
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Транзакциялар</span>
                <span className="stat-value">{filteredTransactions.length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid-item full-width">
          <div className="card">
            <div className="card-header">
              <h3>Соңғы транзакциялар</h3>
              <Filters />
            </div>
            <TransactionList limit={5} />
          </div>
        </div>

        <div className="grid-item">
          <Charts type="category" />
        </div>

        <div className="grid-item">
          <Charts type="monthly" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
