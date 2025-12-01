import React, { useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { TransactionContext } from '../utils/TransactionContext';
import { FaBell, FaUserCircle, FaSearch, FaCog, FaMoon, FaSun } from 'react-icons/fa';
import { format } from 'date-fns';
import { kk } from 'date-fns/locale';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { stats } = useContext(TransactionContext);
  const [notifications] = useState([
    { id: 1, text: 'Бюджет 80%-ға жетті', type: 'warning', time: '10 мин бұрын' },
    { id: 2, text: 'Жаңа табыс қосылды', type: 'info', time: '1 сағат бұрын' },
    { id: 3, text: 'Айдың соңына 3 күн қалды', type: 'reminder', time: '1 күн бұрын' }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header className="main-header">
      <div className="header-left">
        <div className="logo">
          <span className="logo-icon">💰</span>
          <span className="logo-text">CoinKeeper</span>
        </div>
        
        <div className="date-display">
          <span className="day">{format(new Date(), 'EEEE', { locale: kk })}</span>
          <span className="date">{format(new Date(), 'dd MMMM yyyy', { locale: kk })}</span>
        </div>
      </div>

      <div className="header-center">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Транзакцияларды іздеу..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>
              ×
            </button>
          )}
        </div>
      </div>

      <div className="header-right">
        <div className="balance-indicator">
          <span className="balance-label">Қалдық:</span>
          <span className={`balance-amount ${stats.totals.balance >= 0 ? 'positive' : 'negative'}`}>
            {stats.totals.balance.toLocaleString()} ₸
          </span>
        </div>

        <button 
          className="icon-btn theme-toggle"
          onClick={toggleDarkMode}
          title={darkMode ? 'Күндізгі режим' : 'Түнгі режим'}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        <div className="notifications-container">
          <button 
            className="icon-btn notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FaBell />
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
          </button>
          
          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="notifications-header">
                <h4>Хабарландырулар</h4>
                <span className="notification-count">{notifications.length} жаңа</span>
              </div>
              <div className="notifications-list">
                {notifications.map(notification => (
                  <div key={notification.id} className={`notification-item ${notification.type}`}>
                    <div className="notification-content">
                      <p>{notification.text}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                    <div className="notification-actions">
                      <button className="notification-action">✓</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="notifications-footer">
                <button className="view-all-btn">Барлығын көру</button>
                <button className="clear-all-btn">Тазалау</button>
              </div>
            </div>
          )}
        </div>

        <div className="user-profile-container">
          <button 
            className="user-profile-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <FaUserCircle className="user-avatar" />
            <div className="user-info">
              <span className="user-name">{user?.name || 'Қолданушы'}</span>
              <span className="user-email">{user?.email || 'example@mail.com'}</span>
            </div>
          </button>
          
          {showUserMenu && (
            <div className="user-menu-dropdown">
              <div className="user-menu-header">
                <FaUserCircle className="menu-user-avatar" />
                <div className="menu-user-info">
                  <h4>{user?.name || 'Қолданушы'}</h4>
                  <span>{user?.email || 'example@mail.com'}</span>
                </div>
              </div>
              
              <div className="user-menu-items">
                <a href="/profile" className="menu-item">
                  <FaUserCircle /> Профиль
                </a>
                <a href="/settings" className="menu-item">
                  <FaCog /> Баптаулар
                </a>
                <button className="menu-item" onClick={toggleDarkMode}>
                  {darkMode ? <FaSun /> : <FaMoon />}
                  {darkMode ? 'Күндізгі режим' : 'Түнгі режим'}
                </button>
                <div className="menu-divider"></div>
                <button className="menu-item logout-btn" onClick={handleLogout}>
                  Шығу
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
