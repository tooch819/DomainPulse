import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Minus, ShoppingCart, Lock } from 'lucide-react';
import './ValuationDisplay.css';

const ValuationDisplay = ({ valuation, isMasked }) => {
  // Mocking variations for GoDaddy vs Domainify based on the base valuation
  const gdValuation = Math.floor(valuation * 1.05);
  const dmValuation = Math.floor(valuation * 0.98);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getBadge = (percent) => {
    if (percent > 0) return <span className="badge-inline success"><TrendingUp size={12} /> +{percent}%</span>;
    if (percent < 0) return <span className="badge-inline danger"><TrendingDown size={12} /> {percent}%</span>;
    return <span className="badge-inline neutral"><Minus size={12} /> 0%</span>;
  };

  const renderGrid = (title, currentVal, logoClass) => (
    <div className="valuation-grid">
      <div className={`grid-header ${logoClass}`}>
        <span>{title}</span>
        {isMasked ? (
          <span className="shimmer-text"></span>
        ) : (
          <span className="current-val">{formatCurrency(currentVal)}</span>
        )}
      </div>
      <div className="grid-body">
        <div className="grid-row">
          <span className="label">30 Day Projection</span>
          {isMasked ? (
            <div className="shimmer bar"></div>
          ) : (
            <div className="val-group">
              {formatCurrency(currentVal * 1.02)}
              {getBadge(2)}
            </div>
          )}
        </div>
        <div className="grid-row">
          <span className="label">6 Month Projection</span>
          {isMasked ? (
            <div className="shimmer bar"></div>
          ) : (
            <div className="val-group">
              {formatCurrency(currentVal * 1.15)}
              {getBadge(15)}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="valuation-container">
      <div className="valuation-grids">
        {renderGrid('GoDaddy', gdValuation, 'godaddy')}
        {renderGrid('Domainify', dmValuation, 'domainify')}
      </div>

      <div className="valuation-actions">
        {isMasked ? (
          <div className="masked-overlay">
            <Lock size={20} />
            <p>Unlock detailed analytics and market data</p>
            <Link to="/subscription" className="btn btn-primary btn-sm">Upgrade to Pro</Link>
          </div>
        ) : (
          <>
            <div className="advice-badge">
              <span className="label">MARKET ADVICE</span>
              <span className="value success">STRONG BUY</span>
            </div>
            <div className="action-btns">
              <button className="btn btn-success"><ShoppingCart size={18} /> Buy Now</button>
              <button className="btn btn-outline">Hold Asset</button>
              <button className="btn btn-outline">Sell Domain</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ValuationDisplay;
