import React, { useState, useContext, useEffect } from 'react';
import { TransactionContext } from '../utils/TransactionContext';
import { FaPlus, FaTag, FaCalendar, FaReceipt } from 'react-icons/fa';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const AddTransaction = () => {
  const { createTransaction, categories } = useContext(TransactionContext);
  
  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    description: '',
    tags: []
  });
  
  const [tagInput, setTagInput] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringSettings, setRecurringSettings] = useState({
    frequency: 'monthly',
    endDate: '',
    count: 1
  });

  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category) {
      toast.error('Санатты таңдаңыз');
      return;
    }
    
    if (!formData.amount || formData.amount <= 0) {
      toast.error('Дұрыс сома енгізіңіз');
      return;
    }

    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount),
      tags: formData.tags,
      createdAt: new Date().toISOString()
    };

    try {
      await createTransaction(transactionData);
      
      toast.success('Транзакция сәтті қосылды!', {
        icon: '✅',
        duration: 3000
      });
      
      // Форманы тазалау
      setFormData({
        type: 'expense',
        category: '',
        amount: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        description: '',
        tags: []
      });
      setTagInput('');
      setIsRecurring(false);
      
    } catch (error) {
      toast.error('Қосылу қатесі: ' + error.message);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleTypeChange = (type) => {
    setFormData({
      ...formData,
      type,
      category: '' // Санатты тазалау
    });
  };

  const amountSuggestions = [1000, 2000, 5000, 10000, 20000, 50000];

  return (
    <div className="add-transaction">
      <div className="form-header">
        <h3>
          <FaPlus /> Жаңа транзакция
        </h3>
        <div className="type-toggle">
          <button
            className={`type-btn ${formData.type === 'income' ? 'active' : ''}`}
            onClick={() => handleTypeChange('income')}
          >
            Табыс
          </button>
          <button
            className={`type-btn ${formData.type === 'expense' ? 'active' : ''}`}
            onClick={() => handleTypeChange('expense')}
          >
            Шығын
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-section">
          <div className="form-row">
            <div className="form-group">
              <label>
                <FaTag /> Санат
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
                className="category-select"
              >
                <option value="">Санатты таңдаңыз</option>
                {(formData.type === 'income' ? incomeCategories : expenseCategories).map(cat => (
                  <option key={cat.id} value={cat.name}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Сома (₸)</label>
              <div className="amount-input-wrapper">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  placeholder="0.00"
                  required
                  className="amount-input"
                />
                <div className="amount-suggestions">
                  {amountSuggestions.map(amount => (
                    <button
                      key={amount}
                      type="button"
                      className="amount-suggestion"
                      onClick={() => setFormData({...formData, amount: amount.toString()})}
                    >
                      {amount.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                <FaCalendar /> Күні
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <FaReceipt /> Сипаттама
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData
