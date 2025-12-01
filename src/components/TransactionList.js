import React, { useContext, useState, useMemo } from 'react';
import { TransactionContext } from '../utils/TransactionContext';
import { FaEdit, FaTrash, FaFilter, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import { format, parseISO } from 'date-fns';
import Modal from './Modal';

const TransactionList = ({ limit = null }) => {
  const { 
    filteredTransactions, 
    removeTransaction, 
    editTransaction,
    categories 
  } = useContext(TransactionContext);
  
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const sortedTransactions = useMemo(() => {
    let sorted = [...filteredTransactions];
    
    // Іздеу
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      sorted = sorted.filter(t => 
        t.category.toLowerCase().includes(term) ||
        (t.description && t.description.toLowerCase().includes(term))
      );
    }
    
    // Сұрыптау
    sorted.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        default:
          aValue = new Date(a.date);
          bValue = new Date(b.date);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    // Шектеу
    if (limit) {
      return sorted.slice(0, limit);
    }
    
    return sorted;
  }, [filteredTransactions, sortBy, sortOrder, searchTerm, limit]);

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      await editTransaction(editingTransaction.id, updatedData);
      setShowEditModal(false);
      setEditingTransaction(null);
    } catch (error) {
      console.error('Өзгерту қатесі:', error);
    }
  };

  const getCategoryIcon = (category) => {
    const categoryObj = categories.find(c => c.name === category);
    return categoryObj?.icon || '💰';
  };

  const getCategoryColor = (category) => {
    const categoryObj = categories.find(c => c.name === category);
    return categoryObj?.color || '#3498DB';
  };

  const formatAmount = (amount, type) => {
    return (
      <span className={`amount ${type}`}>
        {type === 'income' ? '+' : '-'}
        {amount.toLocaleString('kk-KZ', { minimumFractionDigits: 2 })}
        <span className="currency"> ₸</span>
      </span>
    );
  };

  if (sortedTransactions.length === 0) {
    return (
      <div className="transaction-list empty">
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h4>Транзакциялар жоқ</h4>
          <p>Бірінші транзакцияны қосыңыз</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="transaction-list">
        <div className="list-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Іздеу..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaFilter className="search-icon" />
          </div>
          
          <div className="sort-controls">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="date">Күні бойынша</option>
              <option value="amount">Сома бойынша</option>
              <option value="category">Санат бойынша</option>
            </select>
            
            <button 
              className="sort-order-btn"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
            </button>
          </div>
        </div>

        <div className="transactions-table">
          <div className="table-header">
            <div className="table-cell">Санат</div>
            <div className="table-cell">Сипаттама</div>
            <div className="table-cell">Сома</div>
            <div className="table-cell">Күні</div>
            <div className="table-cell">Әрекеттер</div>
          </div>
          
          <div className="table-body">
            {sortedTransactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className={`table-row ${transaction.type}`}
                style={{ borderLeftColor: getCategoryColor(transaction.category) }}
              >
                <div className="table-cell category-cell">
                  <span 
                    className="category-icon"
                    style={{ backgroundColor: getCategoryColor(transaction.category) }}
                  >
                    {getCategoryIcon(transaction.category)}
                  </span>
                  <span className="category-name">{transaction.category}</span>
                </div>
                
                <div className="table-cell">
                  <div className="description">
                    {transaction.description || 'Сипаттамасыз'}
                    {transaction.tags && transaction.tags.length > 0 && (
                      <div className="tags">
                        {transaction.tags.map(tag => (
                          <span key={tag} className="tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="table-cell amount-cell">
                  {formatAmount(transaction.amount, transaction.type)}
                </div>
                
                <div className="table-cell date-cell">
                  <div className="date-display">
                    <span className="date">{format(parseISO(transaction.date), 'dd.MM.yyyy')}</span>
                    <span className="time">{format(parseISO(transaction.createdAt), 'HH:mm')}</span>
                  </div>
                </div>
                
                <div className="table-cell actions-cell">
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => handleEdit(transaction)}
                    title="Өңдеу"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => removeTransaction(transaction.id)}
                    title="Жою"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="list-footer">
          <div className="summary-info">
            <span>Барлығы: {sortedTransactions.length} транзакция</span>
            <span className="total-amount">
              Жалпы: {sortedTransactions.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0).toLocaleString()} ₸
            </span>
          </div>
          
          {limit && sortedTransactions.length === limit && (
            <button className="view-all-btn">
              Барлығын көру →
            </button>
          )}
        </div>
      </div>

      {showEditModal && editingTransaction && (
        <Modal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingTransaction(null);
          }}
          title="Транзакцияны өңдеу"
        >
          <EditTransactionForm
            transaction={editingTransaction}
            onSave={handleSaveEdit}
            onCancel={() => {
              setShowEditModal(false);
              setEditingTransaction(null);
            }}
          />
        </Modal>
      )}
    </>
  );
};

const EditTransactionForm = ({ transaction, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    type: transaction.type,
    category: transaction.category,
    amount: transaction.amount,
    date: transaction.date,
    description: transaction.description || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="edit-form">
      <div className="form-group">
        <label>Түрі</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({...formData, type: e.target.value})}
        >
          <option value="income">Табыс</option>
          <option value="expense">Шығын</option>
        </select>
      </div>
      
      <div className="form-group">
        <label>Санат</label>
        <input
          type="text"
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
        />
      </div>
      
      <div className="form-group">
        <label>Сома</label>
        <input
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})}
        />
      </div>
      
      <div className="form-group">
        <label>Күні</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({...formData, date: e.target.value})}
        />
      </div>
      
      <div className="form-group">
        <label>Сипаттама</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows="3"
        />
      </div>
      
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Болдырмау
        </button>
        <button type="submit" className="btn btn-primary">
          Сақтау
        </button>
      </div>
    </form>
  );
};

export default TransactionList;
