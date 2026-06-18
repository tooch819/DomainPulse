import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import DomainCard from '../../components/DomainCard/DomainCard';
import PremiumGate from '../../components/PremiumGate/PremiumGate';
import { Filter, Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import './AvailableDomains.css';

const AvailableDomains = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [sector, setSector] = useState('');

  const sectors = ['Technology', 'Finance', 'Health', 'Education', 'Real Estate', 'E-commerce'];

  const fetchDomains = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/domains/search?query=${query}&sector=${sector}`);
      setResults(res.data.results);
    } catch (error) {
      console.error('Search failed', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, [sector]);

  return (
    <div className="available-domains-page">
      <div className="page-header">
        <h1>Available Domains</h1>
        <p>Browse our curated list of high-potential premium domains.</p>
      </div>

      <PremiumGate>
        <div className="browser-layout">
          <aside className="filter-panel card">
            <div className="filter-header">
              <SlidersHorizontal size={18} />
              <h3>Filters</h3>
            </div>
            
            <div className="filter-group">
              <label>Search Keyword</label>
              <div className="input-with-btn">
                <input 
                  type="text" 
                  placeholder="e.g. cloud" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button onClick={fetchDomains} className="btn btn-primary btn-sm"><Search size={14} /></button>
              </div>
            </div>

            <div className="filter-group">
              <label>Industry Sector</label>
              <select value={sector} onChange={(e) => setSector(e.target.value)}>
                <option value="">All Sectors</option>
                {sectors.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="filter-group">
              <label>Valuation Range</label>
              <div className="range-inputs">
                <input type="number" placeholder="Min" />
                <span>-</span>
                <input type="number" placeholder="Max" />
              </div>
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <div className="sort-select">
                <ArrowUpDown size={14} />
                <select>
                  <option>Valuation (High to Low)</option>
                  <option>Valuation (Low to High)</option>
                  <option>Alphabetical</option>
                  <option>Recently Added</option>
                </select>
              </div>
            </div>

            <button className="btn btn-outline btn-sm mt-4">Reset Filters</button>
          </aside>

          <main className="results-grid">
            {loading ? (
              [...Array(6)].map((_, i) => <div key={i} className="shimmer card" style={{ height: '300px' }}></div>)
            ) : results.length > 0 ? (
              results.map((domain, i) => (
                <DomainCard 
                  key={i} 
                  domainData={{...domain, valuation: domain.baseValue}} 
                  onAddToPortfolio={(d) => console.log('Portfolio', d)}
                  onAddToWatchlist={(d) => console.log('Watchlist', d)}
                />
              ))
            ) : (
              <div className="no-results card">
                <Search size={48} className="text-muted" />
                <h3>No domains found</h3>
                <p>Try adjusting your filters or search query.</p>
              </div>
            )}
          </main>
        </div>
      </PremiumGate>
    </div>
  );
};

export default AvailableDomains;
