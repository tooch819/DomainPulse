import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { Briefcase, Eye, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { user, isPremium } = useAuth();
  const [summary, setSummary] = useState(null);
  const [recentAppraisals, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sumRes, historyRes] = await Promise.all([
          api.get('/portfolio/summary'),
          api.get('/domains/history')
        ]);
        setSummary(sumRes.data);
        setHistory(historyRes.data.history.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    if (isPremium) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [isPremium]);

  if (loading) return <div className="shimmer card" style={{ height: '400px' }}></div>;

  return (
    <div className="dashboard-page">
      <div className="welcome-section">
        <h1>Welcome back, {user?.name}</h1>
        <p>Here's what's happening with your domain portfolio today.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card card">
          <div className="stat-header">
            <div className="stat-icon bg-gradient"><Briefcase size={20} /></div>
            <span className="stat-title">Portfolio Value</span>
          </div>
          <div className="stat-content">
            <h2 className="stat-amount">
              {summary ? `$${summary.totalValuation.toLocaleString()}` : '$0'}
            </h2>
            <div className={`stat-change ${summary?.overallChangePercent >= 0 ? 'up' : 'down'}`}>
              {summary?.overallChangePercent >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {Math.abs(summary?.overallChangePercent || 0)}%
            </div>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-header">
            <div className="stat-icon bg-gradient"><Eye size={20} /></div>
            <span className="stat-title">Watchlist Items</span>
          </div>
          <div className="stat-content">
            <h2 className="stat-amount">{summary?.itemCount || 0}</h2>
            <span className="stat-subtitle">Domains tracked</span>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-header">
            <div className="stat-icon bg-gradient"><TrendingUp size={20} /></div>
            <span className="stat-title">Market Pulse</span>
          </div>
          <div className="stat-content">
            <h2 className="stat-amount">Rising</h2>
            <span className="stat-subtitle">AI & Tech sectors</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="recent-activity card">
          <div className="card-header">
            <h3>Recent Appraisals</h3>
            <Link to="/appraisal" className="btn btn-ghost btn-sm">View All</Link>
          </div>
          <div className="activity-list">
            {recentAppraisals.length > 0 ? (
              recentAppraisals.map((item, i) => (
                <div key={i} className="activity-item">
                  <div className="item-info">
                    <span className="item-domain">{item.domain}</span>
                    <span className="item-date"><Clock size={12} /> {new Date(item.appraisedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="item-value">
                    {item.isMasked ? '***' : `$${item.valuation.toLocaleString()}`}
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-state">No recent appraisals found.</p>
            )}
          </div>
        </div>

        <div className="market-overview card">
          <h3>Sector Performance</h3>
          <div className="sector-chart">
            {/* Mock bar chart with CSS */}
            {[
              { label: 'AI', value: 85 },
              { label: 'Fintech', value: 65 },
              { label: 'Health', value: 45 },
              { label: 'Edu', value: 30 },
              { label: 'Real Estate', value: 20 }
            ].map((s, i) => (
              <div key={i} className="chart-row">
                <span className="chart-label">{s.label}</span>
                <div className="chart-bar-container">
                  <div className="chart-bar" style={{ width: `${s.value}%` }}></div>
                </div>
                <span className="chart-value">+{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Need to import Link but used it above
import { Link } from 'react-router-dom';

export default Dashboard;
