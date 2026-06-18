import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Search, 
  LayoutDashboard, 
  TrendingUp, 
  Briefcase, 
  Eye, 
  Lock, 
  ChevronRight,
  Zap,
  Globe
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const { isPremium, trialDaysLeft, user } = useAuth();

  const navItems = [
    { name: 'Appraisal', path: '/appraisal', icon: <Search size={20} />, premium: false },
    { name: 'Browser', path: '/available', icon: <Globe size={20} />, premium: true },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, premium: false },
    { name: 'Portfolio', path: '/portfolio', icon: <Briefcase size={20} />, premium: true },
    { name: 'Watchlist', path: '/watchlist', icon: <Eye size={20} />, premium: true },
    { name: 'Market Trends', path: '/trends', icon: <TrendingUp size={20} />, premium: true },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path} 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-name">{item.name}</span>
            {item.premium && !isPremium && (
              <span className="lock-icon" title="Premium Feature">
                <Lock size={14} />
              </span>
            )}
            <ChevronRight className="chevron" size={16} />
          </NavLink>
        ))}
      </div>

      <div className="sidebar-footer">
        {user && !isPremium && (
          <div className="upgrade-prompt card">
            <div className="prompt-header">
              <Zap size={16} className="text-warning" />
              <span>Trial Active</span>
            </div>
            <p>{trialDaysLeft} days remaining</p>
            <NavLink to="/subscription" className="btn btn-primary btn-sm mt-4">
              Upgrade Now
            </NavLink>
          </div>
        )}
        {isPremium && (
          <div className="pro-status card">
            <div className="prompt-header">
              <Zap size={16} className="text-success" />
              <span>Pro Member</span>
            </div>
            <p>Full Access Enabled</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
