import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaChartBar, 
  FaWallet, 
  FaCog, 
  FaFileExport, 
  FaQuestionCircle,
  FaBars,
  FaTimes,
  FaPlusCircle,
  FaHistory,
  FaPiggyBank,
  FaCreditCard
} from 'react-icons/fa';
import { format } from 'date-fns';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const location = useLocation();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Бақылау тақтасы',
      icon: <FaHome />,
      path: '/',
      badge: null
    },
    {
      id: 'analytics',
      label: 'Аналитика',
      icon: <FaChartBar />,
      path: '/analytics',
      submenu: [
        { label: 'Статистика', path: '/analytics/stats' },
        { label: 'Графиктер', path: '/analytics/charts' },
        { label: 'Есептер', path: '/analytics/reports' }
      ]
    },
    {
      id: 'budget',
      label: 'Бюджет',
      icon: <FaWallet />,
      path: '/budget',
      badge: '3',
      submenu: [
        { label: 'Айлық бюджет', path: '/budget/monthly' },
        { label: 'Санаттар', path: '/budget/categories' },
        { label: 'Мақсаттар', path: '/budget/goals' }
      ]
    },
    {
      id: 'transactions',
      label: 'Транзакциялар',
      icon: <FaHistory />,
      path: '/transactions',
      submenu: [
        { label: 'Барлығы', path: '/transactions/all' },
        { label: 'Табыстар', path: '/transactions/income' },
        { label: 'Шығындар', path: '/transactions/expense' }
      ]
    },
    {
      id: 'savings',
      label: 'Жинақтау',
      icon: <FaPiggyBank />,
      path: '/savings',
      submenu: [
        { label: 'Мақсаттар', path: '/savings/goals' },
        { label: 'Инвестициялар', path: '/savings/investments' },
        { label: 'Жинақтар', path: '/savings/savings' }
      ]
    },
    {
      id: 'accounts',
      label: 'Шоттар',
      icon: <FaCreditCard />,
      path: '/accounts',
      submenu: [
        { label: 'Банк шоттары', path: '/accounts/bank' },
        { label: 'Қолма-қол ақша', path: '/accounts/cash' },
        { label: 'Карталар', path: '/accounts/cards' }
      ]
    }
  ];

  const quickActions = [
    { label: 'Транзакция қосу', icon: <FaPlusCircle />, action: 'addTransaction' },
    { label: 'Есеп шығару', icon: <FaFileExport />, action: 'exportReport' },
    { label: 'Бюджет қосу', icon: <FaWallet />, action: 'addBudget' }
  ];

  const handleQuickAction = (action) => {
    switch(action) {
      case 'addTransaction':
        // Транзакция қосу логикасы
        break;
      case 'exportReport':
        // Есеп шығару логикасы
        break;
      case 'addBudget':
        // Бюджет қосу логикасы
        break;
      default:
        break;
    }
  };

  return (
    <aside className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-header">
        <button 
          className="sidebar-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <FaTimes /> : <FaBars />}
        </button>
        {isExpanded && (
          <div className="sidebar-logo">
            <span className="logo-mini">💰</span>
            <span className="logo-full">CoinKeeper Pro</span>
          </div>
        )}
      </div>

      <div className="sidebar-date">
        {isExpanded ? (
          <>
            <div className="current-date">{format(new Date(), 'dd MMMM')}</div>
            <div className="current-year">{format(new Date(), 'yyyy')}</div>
          </>
        ) : (
          <div className="date-collapsed">{format(new Date(), 'dd')}</div>
        )}
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3 className="nav-section-title">{isExpanded ? 'Негізгі' : '≡'}</h3>
          <ul className="nav-list">
            {navItems.slice(0, 3).map(item => (
              <li key={item.id} className="nav-item">
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                  onClick={() => {
                    if (item.submenu) {
                      setActiveSubmenu(activeSubmenu === item.id ? null : item.id);
                    }
                  }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {isExpanded && (
                    <>
                      <span className="nav-label">{item.label}</span>
                      {item.badge && <span className="nav-badge">{item.badge}</span>}
                      {item.submenu && (
                        <span className="nav-arrow">
                          {activeSubmenu === item.id ? '▲' : '▼'}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
                
                {isExpanded && item.submenu && activeSubmenu === item.id && (
                  <ul className="submenu">
                    {item.submenu.map(subItem => (
                      <li key={subItem.path}>
                        <NavLink
                          to={subItem.path}
                          className={({ isActive }) => 
                            `submenu-link ${isActive ? 'active' : ''}`
                          }
                        >
                          {subItem.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="nav-section">
          <h3 className="nav-section-title">{isExpanded ? 'Қосымша' : '+'}</h3>
          <ul className="nav-list">
            {navItems.slice(3).map(item => (
              <li key={item.id} className="nav-item">
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  <span className="nav-icon">{item.icon}</span>
                  {isExpanded && <span className="nav-label">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="sidebar-quick-actions">
        <h3 className="quick-actions-title">{isExpanded ? 'Жылдам әрекеттер' : '⚡'}</h3>
        <div className="quick-actions-buttons">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="quick-action-btn"
              onClick={() => handleQuickAction(action.action)}
              title={action.label}
            >
              <span className="quick-action-icon">{action.icon}</span>
              {isExpanded && (
                <span className="quick-action-label">{action.label}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-footer">
        <NavLink to="/settings" className="footer-link">
          <FaCog />
          {isExpanded && <span>Баптаулар</span>}
        </NavLink>
        <NavLink to="/help" className="footer-link">
          <FaQuestionCircle />
          {isExpanded && <span>Көмек</span>}
        </NavLink>
      </div>

      {isExpanded && (
        <div className="sidebar-stats">
          <div className="stat-item">
            <span className="stat-label">Бүгінгі шығын:</span>
            <span className="stat-value">12,450 ₸</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Айлық қалдық:</span>
            <span className="stat-value positive">45,200 ₸</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Мақсаттар:</span>
            <span className="stat-value">3/5</span>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
