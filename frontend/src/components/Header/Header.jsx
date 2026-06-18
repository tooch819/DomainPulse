import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, User, LogOut, Settings, CreditCard, LayoutDashboard, Menu, X, Globe, Search } from 'lucide-react';
import './Header.css';

const Header = () => {
  const { user, logout, isPremium, trialDaysLeft } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setDropdownOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo text-gradient">
            DomainPulse
          </Link>
          <nav className="desktop-nav">
            <Link to="/appraisal" className="nav-item">Appraisal</Link>
            <Link to="/available" className="nav-item">Browser</Link>
            <Link to="/trends" className="nav-item">Trends</Link>
          </nav>
        </div>

        <div className="header-right">
          <div className="status-badges">
            {user && (
              <>
                {isPremium ? (
                  <span className="badge badge-success">PRO PLAN</span>
                ) : (
                  <span className="badge badge-warning">
                    {trialDaysLeft} DAYS TRIAL
                  </span>
                )}
              </>
            )}
          </div>

          <button className="icon-btn theme-toggle" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {user ? (
            <div className="user-menu-container">
              <button 
                className="user-profile-btn" 
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="user-name">{user.name}</span>
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu card">
                  <Link to="/dashboard" onClick={() => setDropdownOpen(false)}>
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <Link to="/profile" onClick={() => setDropdownOpen(false)}>
                    <User size={16} /> Profile
                  </Link>
                  <Link to="/subscription" onClick={() => setDropdownOpen(false)}>
                    <CreditCard size={16} /> Subscription
                  </Link>
                  <hr />
                  <button onClick={handleLogout} className="logout-btn">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary">Login</Link>
          )}

          <button 
            className="mobile-menu-toggle icon-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu glass">
          <Link to="/appraisal" onClick={() => setMobileMenuOpen(false)}><Search size={18} /> Appraisal</Link>
          <Link to="/available" onClick={() => setMobileMenuOpen(false)}><Globe size={18} /> Browser</Link>
          <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}><LayoutDashboard size={18} /> Dashboard</Link>
          <Link to="/trends" onClick={() => setMobileMenuOpen(false)}>Trends</Link>
          <Link to="/portfolio" onClick={() => setMobileMenuOpen(false)}>Portfolio</Link>
          <Link to="/watchlist" onClick={() => setMobileMenuOpen(false)}>Watchlist</Link>
          <hr />
          {user ? (
            <button onClick={handleLogout} className="logout-btn"><LogOut size={18} /> Logout</button>
          ) : (
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
