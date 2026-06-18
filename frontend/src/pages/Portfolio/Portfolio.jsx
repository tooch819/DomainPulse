import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import PremiumGate from '../../components/PremiumGate/PremiumGate';
import { Briefcase, TrendingUp, Plus, Trash2, ExternalLink, RefreshCw } from 'lucide-react';
import './Portfolio.css';

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [portRes, sumRes] = await Promise.all([
        api.get('/portfolio'),
        api.get('/portfolio/summary')
      ]);
      setPortfolio(portRes.data.portfolio);
      setSummary(sumRes.data);
    } catch (error) {
      console.error('Error fetching portfolio', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRemove = async (id) => {
    try {
      await api.delete(`/portfolio/${id}`);
      fetchData();
    } catch (error) {
      console.error('Removal failed', error);
    }
  };

  return (
    <div className="portfolio-page">
      <div className="page-header">
        <h1>My Domain Portfolio</h1>
        <p>Manage and track the growth of your digital assets.</p>
        <button className="btn btn-primary" onClick={() => console.log('Add Manual')}><Plus size={18} /> Add Domain</button>
      </div>

      <PremiumGate>
        {summary && (
          <div className="summary-cards">
            <div className="summary-card card bg-gradient text-white">
              <span className="label">Total Portfolio Value</span>
              <div className="value">${summary.totalValuation.toLocaleString()}</div>
              <div className={`change-badge ${summary.changeBadge}`}>
                {summary.overallChangePercent >= 0 ? '+' : ''}{summary.overallChangePercent}%
              </div>
            </div>
            <div className="summary-card card">
              <span className="label">Total Acquisition Cost</span>
              <div className="value">${summary.totalPurchasePrice.toLocaleString()}</div>
            </div>
            <div className="summary-card card">
              <span className="label">Managed Assets</span>
              <div className="value">{summary.itemCount}</div>
            </div>
          </div>
        )}

        <div className="portfolio-container card">
          <div className="table-header">
            <h3>Tracked Assets</h3>
            <button className="btn btn-ghost btn-sm" onClick={fetchData}><RefreshCw size={14} /> Refresh Prices</button>
          </div>
          
          <div className="table-responsive">
            <table className="portfolio-table">
              <thead>
                <tr>
                  <th>Domain Name</th>
                  <th>Registrar</th>
                  <th>Acquisition</th>
                  <th>Current Value</th>
                  <th>Performance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>Loading assets...</td></tr>
                ) : portfolio.length > 0 ? (
                  portfolio.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="domain-cell">
                          <strong>{item.domain}</strong>
                          <span className="last-checked">Checked {new Date(item.lastChecked).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td>{item.registrar}</td>
                      <td>${item.purchasePrice.toLocaleString()}</td>
                      <td><span className="text-primary">${item.currentValuation.toLocaleString()}</span></td>
                      <td>
                        <span className={`perf-badge ${item.changePercent >= 0 ? 'up' : 'down'}`}>
                          {item.changePercent >= 0 ? '▲' : '▼'} {Math.abs(item.changePercent)}%
                        </span>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button className="icon-btn" title="View Details"><ExternalLink size={16} /></button>
                          <button className="icon-btn text-danger" onClick={() => handleRemove(item.id)} title="Remove"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" className="empty-state">No assets in your portfolio.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </PremiumGate>
    </div>
  );
};

export default Portfolio;
