import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import DomainCard from '../../components/DomainCard/DomainCard';
import { Search, Loader2, History, TrendingUp, Zap } from 'lucide-react';
import './Appraisal.css';

const Appraisal = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/domains/history');
      setHistory(res.data.history);
    } catch (error) {
      console.error('Error fetching history', error);
    }
  };

  const handleAppraise = async (e, quickDomain) => {
    if (e) e.preventDefault();
    const domainToAppraise = quickDomain || domain;
    if (!domainToAppraise) return;

    setLoading(true);
    try {
      const res = await api.post('/domains/appraise', { domain: domainToAppraise });
      setResult(res.data);
      fetchHistory();
    } catch (error) {
      console.error('Appraisal failed', error);
    } finally {
      setLoading(false);
    }
  };

  const recommendations = ['cloud-storage.com', 'ai-agent.io', 'meta-pay.net'];

  return (
    <div className="appraisal-page">
      <section className="search-section">
        <h1>Domain Appraisal</h1>
        <p>Enter any domain name to get an instant valuation and market analysis.</p>
        
        <form onSubmit={handleAppraise} className="search-box card glass">
          <Search className="search-icon" size={24} />
          <input 
            type="text" 
            placeholder="example.com" 
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Appraise'}
          </button>
        </form>

        <div className="quick-picks">
          <span>Quick picks:</span>
          {recommendations.map(rec => (
            <button key={rec} onClick={() => handleAppraise(null, rec)} className="btn btn-ghost btn-sm">
              <Zap size={14} /> {rec}
            </button>
          ))}
        </div>
      </section>

      <div className="results-container">
        {result && (
          <div className="main-result">
            <h2 className="section-title">Valuation Result</h2>
            <DomainCard 
              domainData={result} 
              onAddToPortfolio={(d) => console.log('Add to portfolio', d)}
              onAddToWatchlist={(d) => console.log('Add to watchlist', d)}
            />
          </div>
        )}

        <section className="history-section card">
          <div className="section-header">
            <h3><History size={18} /> Appraisal History</h3>
          </div>
          <div className="history-table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Domain</th>
                  <th>Date</th>
                  <th>Valuation</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.length > 0 ? (
                  history.map((item, i) => (
                    <tr key={i} onClick={() => setResult(item)} className="clickable-row">
                      <td><strong>{item.domain}</strong></td>
                      <td>{new Date(item.appraisedAt).toLocaleDateString()}</td>
                      <td>{item.isMasked ? '***' : `$${item.valuation.toLocaleString()}`}</td>
                      <td>
                        <span className={`badge ${item.isMasked ? 'badge-warning' : 'badge-success'}`}>
                          {item.isMasked ? 'Masked' : 'Complete'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="empty-row">No history found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Appraisal;
