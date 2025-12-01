import React, { useState, useContext } from 'react';
import { TransactionContext } from '../utils/TransactionContext';
import { FaFilter, FaCalendarAlt, FaTags, FaSortAmountDown } from 'react-icons/fa';
import { format, subDays, subMonths } from 'date-fns';

const Filters = () => {
  const { filters, setFilters, categories } = useContext(TransactionContext);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const dateRanges = [
    { label: 'Бүгін', value: 'today' },
    { label: 'Соңғы 7 күн', value: 'week' },
    { label: 'Соңғы 30 күн', value: 'month' },
    { label: 'Соңғы 3 ай', value: '3months' },
    { label: 'Барлығы', value: 'all' },
    { label: 'Өзгеше', value: 'custom' }
  ];

  const handleDateRangeChange = (range) => {
    let startDate = null;
    let endDate = new Date();

    switch (range) {
      case 'today':
        startDate = new Date();
        break;
      case 'week':
        startDate = subDays(new Date(), 7);
        break;
      case 'month':
        startDate = subMonths(new Date(), 1);
        break;
      case '3months':
        startDate = subMonths(new Date(), 3);
        break;
      default:
        startDate = null;
    }

    setFilters({
      ...filters,
      dateRange: range,
      startDate,
      endDate
    });
  };

  const handleCategoryChange = (category) => {
    setFilters({
      ...filters,
      category
    });
  };

  const handleTypeChange = (type) => {
    setFilters({
      ...filters,
      type
    });
  };

  const handleSortChange = (sortBy) => {
    setFilters({
      ...filters,
      sortBy
    });
  };

  const clearFilters = () => {
    setFilters({
      type: 'all',
      category: 'all',
      dateRange: 'month',
      startDate: null,
      endDate: null,
      sortBy: 'date_desc'
    });
  };

  return (
    <div className="filters-container">
      <div className="filters-header">
        <FaFilter className="filter-icon" />
        <h4>Фильтрлер</h4>
        <button 
          className="advanced-toggle"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? 'Қарапайым' : 'Жетілдірілген'}
        </button>
      </div>

      <div className="basic-filters">
        <div className="filter-group">
          <label>Түрі</label>
          <div className="type-buttons">
            <button 
              className={`type-btn ${filters.type === 'all' ? 'active' : ''}`}
              onClick={() => handleTypeChange('all')}
            >
              Барлығы
            </button>
            <button 
              className={`type-btn income ${filters.type === 'income' ? 'active' : ''}`}
              onClick={() => handleTypeChange('income')}
            >
              Табыс
            </button>
            <button 
              className={`type-btn expense ${filters.type === 'expense' ? 'active' : ''}`}
              onClick={() => handleTypeChange('expense')}
            >
              Шығын
            </button>
          </div>
        </div>

        <div className="filter-group">
          <label><FaCalendarAlt /> Уақыт</label>
          <div className="date-range-buttons">
            {dateRanges.slice(0, 4).map(range => (
              <button
                key={range.value}
                className={`date-btn ${filters.dateRange === range.value ? 'active' : ''}`}
                onClick={() => handleDateRangeChange(range.value)}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label><FaTags /> Санат</label>
          <select
            value={filters.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="category-select"
          >
            <option value="all">Барлық санаттар</option>
            {categories
              .filter(cat => cat.type === (filters.type !== 'all' ? filters.type : 'expense'))
              .map(cat => (
                <option key={cat.id} value={cat.name}>
                  {cat.icon} {cat.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      {showAdvanced && (
        <div className="advanced-filters">
          <div className="filter-group">
            <label>Сұрыптау</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="sort-select"
            >
              <option value="date_desc">Күні бойынша (жаңа)</option>
              <option value="date_asc">Күні бойынша (ескі)</option>
              <option value="amount_desc">Сома бойынша (үлкен)</option>
              <option value="amount_asc">Сома бойынша (кіші)</option>
            </select>
          </div>

          {filters.dateRange === 'custom' && (
            <div className="filter-group custom-date">
              <label>Уақыт аралығы</label>
              <div className="date-inputs">
                <input
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                />
                <span className="date-separator">—</span>
                <input
                  type="date"
                  value={filters.endDate || ''}
                  onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                />
              </div>
            </div>
          )}

          <div className="filter-group">
            <label>Сома аралығы</label>
            <div className="amount-range">
              <input
                type="number"
                placeholder="Ең төменгі"
                className="amount-input"
              />
              <span className="range-separator">—</span>
              <input
                type="number"
                placeholder="Ең жоғарғы"
                className="amount-input"
              />
            </div>
          </div>
        </div>
      )}

      <div className="filter-actions">
        <button 
          className="btn btn-secondary clear-btn"
          onClick={clearFilters}
        >
          Тазалау
        </button>
        <span className="filter-count">
          {filters.type !== 'all' || filters.category !== 'all' || filters.dateRange !== 'month' 
            ? 'Фильтрлер белсенді' 
            : 'Фильтрлер жоқ'}
        </span>
      </div>
    </div>
  );
};

export default Filters;
