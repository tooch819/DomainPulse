import React from 'react';
import { useAuth } from '../../context/AuthContext';
import ValuationDisplay from '../ValuationDisplay/ValuationDisplay';
import { Plus, Eye, History, ExternalLink, Globe, Tag } from 'lucide-react';
import './DomainCard.css';

const DomainCard = ({ domainData, onAddToPortfolio, onAddToWatchlist }) => {
  const { isPremium } = useAuth();
  const { domain, sector, valuation, isMasked, appraisedAt, confidenceScore } = domainData;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`domain-card card ${isMasked ? 'is-masked' : ''}`}>
      <div className="domain-card-header">
        <div className="domain-info">
          <div className="domain-name-row">
            <Globe size={20} className="text-primary" />
            <h3 className="domain-name">{domain}</h3>
          </div>
          <div className="domain-meta">
            <span className="meta-item">
              <Tag size={14} /> {sector || 'General'}
            </span>
            <span className="meta-item">
              <History size={14} /> {formatDate(appraisedAt || new Date())}
            </span>
          </div>
        </div>

        <div className="confidence-score">
          <div className="score-label">Confidence</div>
          <div className="score-value">{confidenceScore || 85}%</div>
          <div className="score-bar">
            <div 
              className="score-fill" 
              style={{ width: `${confidenceScore || 85}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="domain-card-body">
        <ValuationDisplay valuation={valuation} isMasked={isMasked} />
      </div>

      <div className="domain-card-footer">
        <div className="action-group">
          <button 
            className="btn btn-outline btn-sm"
            onClick={() => onAddToPortfolio(domain)}
          >
            <Plus size={16} /> Add to Portfolio
          </button>
          <button 
            className="btn btn-outline btn-sm"
            onClick={() => onAddToWatchlist(domain)}
          >
            <Eye size={16} /> Watch
          </button>
        </div>
        <button className="btn btn-ghost btn-sm">
          Details <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
};

export default DomainCard;
