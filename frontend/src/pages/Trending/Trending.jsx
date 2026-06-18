import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import PremiumGate from '../../components/PremiumGate/PremiumGate';
import { TrendingUp, BarChart3, PieChart, Activity, Zap } from 'lucide-react';
import './Trending.css';

const Trending = () => {
  const [keywords, setKeywords] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [keyRes, secRes] = await Promise.all([
          api.get('/trending/keywords'),
          api.get('/trending/sectors')
        ]);
        setKeywords(keyRes.data.keywords);
        setSectors(secRes.data.sectors);
      } catch (error) {
        console.error('Error fetching trending data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="trending-page">
      <div className="page-header">
        <h1>Market Trends</h1>
        <p>Real-time industry analytics and high-growth sector identification.</p>
      </div>

      <PremiumGate>
        <div className="trending-grid">
          <section className="trending-section card">
            <div className="section-header">
              <Activity className="text-primary" size={20} />
              <h3>Top 10 Keywords</h3>
            </div>
            <div className="ranking-list">
              {loading ? (
                <div className="shimmer bar" style={{ height: '200px' }}></div>
              ) : (
                keywords.map((kw, i) => (
                  <div key={i} className="ranking-item">
                    <div className="ranking-info">
                      <span className="rank">#{kw.rank}</span>
                      <span className="name">{kw.keyword}</span>
                      <span className={`change ${kw.status}`}>{kw.change}</span>
                    </div>
                    <div className="progress-container">
                      <div className="progress-bar" style={{ width: `${100 - i * 10}%` }}></div>
                    </div>
                    <span className="volume">{kw.volume} searches</span>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="trending-section card">
            <div className="section-header">
              <PieChart className="text-secondary" size={20} />
              <h3>High-Growth Sectors</h3>
            </div>
            <div className="sector-list">
              {loading ? (
                <div className="shimmer bar" style={{ height: '200px' }}></div>
              ) : (
                sectors.map((s, i) => (
                  <div key={i} className="sector-item">
                    <div className="sector-info">
                      <span className="name">{s.sector}</span>
                      <span className="growth text-success">{s.growth} growth</span>
                    </div>
                    <div className="progress-container">
                      <div className="progress-bar secondary" style={{ width: s.growth, backgroundColor: s.color }}></div>
                    </div>
                    <span className="volume">{s.volume} domains</span>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <section className="trending-footer card bg-gradient text-white">
          <div className="footer-content">
            <Zap size={32} />
            <div>
              <h3>AI-Powered Trend Detection</h3>
              <p>Our algorithms analyze millions of sales and search queries to bring you these insights.</p>
            </div>
          </div>
          <button className="btn btn-outline-white">Export Report</button>
        </section>
      </PremiumGate>
    </div>
  );
};

export default Trending;
