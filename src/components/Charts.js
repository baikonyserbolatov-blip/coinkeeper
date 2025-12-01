import React, { useContext, useState, useEffect } from 'react';
import { TransactionContext } from '../utils/TransactionContext';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  RadialLinearScale,
  Filler
} from 'chart.js';
import { Line, Bar, Pie, Doughnut, Radar } from 'react-chartjs-2';
import { FaChartBar, FaChartLine, FaChartPie, FaExchangeAlt } from 'react-icons/fa';
import { format, subMonths, eachMonthOfInterval } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
);

const Charts = ({ type = 'category' }) => {
  const { stats, transactions } = useContext(TransactionContext);
  const [chartType, setChartType] = useState(type);
  const [timeRange, setTimeRange] = useState('6months');

  const getChartData = () => {
    switch (chartType) {
      case 'category':
        return getCategoryChartData();
      case 'monthly':
        return getMonthlyChartData();
      case 'trend':
        return getTrendChartData();
      case 'comparison':
        return getComparisonChartData();
      default:
        return getCategoryChartData();
    }
  };

  const getCategoryChartData = () => {
    const categoryData = stats.categoryStats
      .filter(stat => stat.expense > 0)
      .sort((a, b) => b.expense - a.expense)
      .slice(0, 8);

    return {
      labels: categoryData.map(cat => cat.category),
      datasets: [
        {
          label: 'Шығындар',
          data: categoryData.map(cat => cat.expense),
          backgroundColor: [
            '#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0',
            '#118AB2', '#073B4C', '#7209B7', '#F72585'
          ],
          borderColor: '#fff',
          borderWidth: 2,
          borderRadius: 8
        }
      ]
    };
  };

  const getMonthlyChartData = () => {
    const months = eachMonthOfInterval({
      start: subMonths(new Date(), 5),
      end: new Date()
    }).map(date => format(date, 'MMM yyyy'));

    const monthlyData = stats.monthlyStats.slice(-6);

    return {
      labels: months,
      datasets: [
        {
          label: 'Табыс',
          data: monthlyData.map(month => month.income),
          borderColor: '#2ECC71',
          backgroundColor: 'rgba(46, 204, 113, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Шығын',
          data: monthlyData.map(month => month.expense),
          borderColor: '#E74C3C',
          backgroundColor: 'rgba(231, 76, 60, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  };

  const getTrendChartData = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return format(date, 'dd MMM');
    });

    const dailyData = {};
    transactions.forEach(transaction => {
      const dateKey = format(new Date(transaction.date), 'dd MMM');
      if (last30Days.includes(dateKey)) {
        if (!dailyData[dateKey]) {
          dailyData[dateKey] = { income: 0, expense: 0 };
        }
        dailyData[dateKey][transaction.type] += transaction.amount;
      }
    });

    return {
      labels: last30Days,
      datasets: [
        {
          label: 'Табыс тренді',
          data: last30Days.map(day => dailyData[day]?.income || 0),
          borderColor: '#3498DB',
          backgroundColor: 'rgba(52, 152, 219, 0.2)',
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: 'Шығын тренді',
          data: last30Days.map(day => dailyData[day]?.expense || 0),
          borderColor: '#E74C3C',
          backgroundColor: 'rgba(231, 76, 60, 0.2)',
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    };
  };

  const getComparisonChartData = () => {
    const categories = [...new Set(transactions.map(t => t.category))].slice(0, 6);
    
    const currentMonth = format(new Date(), 'yyyy-MM');
    const lastMonth = format(subMonths(new Date(), 1), 'yyyy-MM');

    const currentData = categories.map(category => 
      transactions
        .filter(t => t.category === category && 
                     format(new Date(t.date), 'yyyy-MM') === currentMonth &&
                     t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
    );

    const previousData = categories.map(category => 
      transactions
        .filter(t => t.category === category && 
                     format(new Date(t.date), 'yyyy-MM') === lastMonth &&
                     t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
    );

    return {
      labels: categories,
      datasets: [
        {
          label: 'Ағымдағы ай',
          data: currentData,
          backgroundColor: 'rgba(52, 152, 219, 0.7)',
          borderColor: '#2980B9',
          borderWidth: 1
        },
        {
          label: 'Өткен ай',
          data: previousData,
          backgroundColor: 'rgba(149, 165, 166, 0.7)',
          borderColor: '#7F8C8D',
          borderWidth: 1
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: "'Segoe UI', sans-serif",
            size: 12
          },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        },
        padding: 12,
        cornerRadius: 6,
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()} ₸`;
          }
        }
      }
    },
    scales: chartType === 'category' ? {} : {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value.toLocaleString()} ₸`
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    }
  };

  const renderChart = () => {
    const data = getChartData();
    
    switch (chartType) {
      case 'category':
        return <Doughnut data={data} options={chartOptions} />;
      case 'monthly':
        return <Line data={data} options={chartOptions} />;
      case 'trend':
        return <Line data={data} options={chartOptions} />;
      case 'comparison':
        return <Bar data={data} options={chartOptions} />;
      default:
        return <Doughnut data={data} options={chartOptions} />;
    }
  };

  return (
    <div className="charts-container">
      <div className="charts-header">
        <h3>Аналитика</h3>
        <div className="chart-controls">
          <div className="chart-type-selector">
            <button 
              className={`chart-btn ${chartType === 'category' ? 'active' : ''}`}
              onClick={() => setChartType('category')}
            >
              <FaChartPie /> Санаттар
            </button>
            <button 
              className={`chart-btn ${chartType === 'monthly' ? 'active' : ''}`}
              onClick={() => setChartType('monthly')}
            >
              <FaChartLine /> Айлық
            </button>
            <button 
              className={`chart-btn ${chartType === 'trend' ? 'active' : ''}`}
              onClick={() => setChartType('trend')}
            >
              <FaChartLine /> Тренд
            </button>
            <button 
              className={`chart-btn ${chartType === 'comparison' ? 'active' : ''}`}
              onClick={() => setChartType('comparison')}
            >
              <FaExchangeAlt /> Салыстыру
            </button>
          </div>
          
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-selector"
          >
            <option value="1month">Соңғы ай</option>
            <option value="3months">3 ай</option>
            <option value="6months">6 ай</option>
            <option value="1year">1 жыл</option>
          </select>
        </div>
      </div>

      <div className="chart-wrapper">
        <div className="chart-content">
          {renderChart()}
        </div>
        
        <div className="chart-stats">
          <div className="stat-card">
            <span className="stat-title">Ең көп шығын</span>
            <span className="stat-value">
              {stats.categoryStats.length > 0 
                ? stats.categoryStats[0].category 
                : 'Деректер жоқ'}
            </span>
            <span className="stat-subvalue">
              {stats.categoryStats.length > 0 
                ? `${stats.categoryStats[0].expense.toLocaleString()} ₸` 
                : ''}
            </span>
          </div>
          
          <div className="stat-card">
            <span className="stat-title">Орташа айлық</span>
            <span className="stat-value">
              {Math.round(stats.totals.expense / 12).toLocaleString()} ₸
            </span>
            <span className="stat-subvalue">Соңғы 12 ай</span>
          </div>
          
          <div className="stat-card">
            <span className="stat-title">Өсу тренді</span>
            <span className="stat-value positive">
              {stats.monthlyStats.length > 1 
                ? `${((stats.monthlyStats[stats.monthlyStats.length - 1].income - 
                    stats.monthlyStats[stats.monthlyStats.length - 2].income) / 
                    stats.monthlyStats[stats.monthlyStats.length - 2].income * 100).toFixed(1)}%`
                : '0%'}
            </span>
            <span className="stat-subvalue">Ай сайын</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;
