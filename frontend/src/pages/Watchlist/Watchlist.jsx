import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import PremiumGate from '../../components/PremiumGate/PremiumGate';
import { Eye, TrendingUp, TrendingDown, Trash2, Plus, Bell } from 'lucide-react';
import './Watchlist.css';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWatchlist = async () => {
    setLoading(true);
    try {
      const res = await api.get('/watchlist');
      setWatchlist(res.data.watchlist);
    } catch (error) {
      console.error('Error fetching watchlist', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleRemove = async (id) => {
    try {
      await api.delete(`/watchlist/${id}`);
      fetchWatchlist();
    } catch (error) {
      console.error('Removal failed', error);
    }
  };

  const handleAddToPortfolio = (domain) => {
    console.log('Moving to portfolio', domain);
  };

  return (
    <div className="watchlist-page">
      <div className="page-header">
        <h1>My Watchlist</h1>
        <p>Monitor domains you're interested in and track valuation shifts.</p>
      </div>

      <PremiumGate>
        <div className="watchlist-container">
          {loading ? (
            <div className="shimmer card" style={{ height: '200px' }}></div>
          ) : watchlist.length > 0 ? (
            <div className="watchlist-grid">
              {watchlist.map((item) => (
                <div key={item.id} className="watch-card card">
                  <div className="watch-header">
                    <h3>{item.domain}</h3>
                    <button className="icon-btn" onClick={() => handleRemove(item.id)}><Trash2 size={18} /></button>
                  </div>
                  
                  <div className="watch-body">
                    <div className="watch-stat">
                      <span className="label">Added Value</span>
                      <span className="value">${item.valuationAtAdded.toLocaleString()}</span>
                    </div>
                    <div className="watch-stat">
                      <span className="label">Current Value</span>
                      <span className="value text-primary">${item.currentValuation.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="watch-footer">
                    <button className="btn btn-outline btn-sm" onClick={() => handleAddToPortfolio(item.domain)}>
                      <Plus size={14} /> Add to Portfolio
                    </button>
                    <button className="btn btn-ghost btn-sm">
                      <Bell size={14} /> Alert
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state card">
              <Eye size={48} className="text-muted" />
              <h3>Your watchlist is empty</h3>
              <p>Appraise a domain and click "Watch" to start tracking it here.</p>
            </div>
          )}
        </div>
      </PremiumGate>
    </div>
  );
};

export default Watchlist;
