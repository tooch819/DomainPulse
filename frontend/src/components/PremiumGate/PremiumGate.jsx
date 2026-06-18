import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, Zap, CheckCircle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import './PremiumGate.css';

const PremiumGate = ({ children }) => {
  const { isPremium, loading } = useAuth();

  if (loading) return <div className="shimmer card" style={{ height: '300px' }}></div>;

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <div className="premium-gate card">
      <div className="gate-content">
        <div className="gate-icon">
          <Lock size={48} className="text-primary" />
        </div>
        <h2>Unlock Premium Features</h2>
        <p>This feature is exclusive to our Pro and Enterprise members. Upgrade your account to get full access to all tools.</p>
        
        <div className="feature-list">
          <div className="feature-item">
            <CheckCircle size={18} className="text-success" />
            <span>Unlimited Domain Appraisals</span>
          </div>
          <div className="feature-item">
            <CheckCircle size={18} className="text-success" />
            <span>Advanced Portfolio Tracking</span>
          </div>
          <div className="feature-item">
            <CheckCircle size={18} className="text-success" />
            <span>Real-time Market Analytics</span>
          </div>
          <div className="feature-item">
            <CheckCircle size={18} className="text-success" />
            <span>Automated Trend Detection</span>
          </div>
        </div>

        <div className="gate-actions">
          <Link to="/subscription" className="btn btn-primary btn-lg">
            <Zap size={18} /> View Pricing Plans
          </Link>
          <div className="security-note">
            <ShieldCheck size={14} /> 30-day money-back guarantee
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumGate;
