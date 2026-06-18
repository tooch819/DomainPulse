import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import AgreementModal from './components/AgreementModal/AgreementModal';

// Pages
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Appraisal from './pages/Appraisal/Appraisal';
import AvailableDomains from './pages/AvailableDomains/AvailableDomains';
import Portfolio from './pages/Portfolio/Portfolio';
import Watchlist from './pages/Watchlist/Watchlist';
import Trending from './pages/Trending/Trending';
import Profile from './pages/Profile/Profile';
import Subscription from './pages/Subscription/Subscription';

import './App.css';

function App() {
  const { user, loading } = useAuth();
  const [showAgreement, setShowAgreement] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Show agreement modal if logged in but haven't 'accepted' (mock state)
    if (user && !localStorage.getItem('agreed')) {
      setShowAgreement(true);
    }
  }, [user]);

  const handleAcceptAgreements = () => {
    localStorage.setItem('agreed', 'true');
    setShowAgreement(false);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="shimmer" style={{ height: '4px', width: '200px', borderRadius: '2px' }}></div>
      </div>
    );
  }

  const isPublicPage = location.pathname === '/' || location.pathname === '/login';

  return (
    <div className="app-container">
      <Header />
      <div className="app-layout">
        {!isPublicPage && <Sidebar />}
        <main className={`main-content ${isPublicPage ? 'full-width' : ''}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/appraisal" element={<Appraisal />} />
            <Route path="/available" element={<AvailableDomains />} />
            <Route path="/portfolio" element={user ? <Portfolio /> : <Navigate to="/login" />} />
            <Route path="/watchlist" element={user ? <Watchlist /> : <Navigate to="/login" />} />
            <Route path="/trends" element={<Trending />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/subscription" element={user ? <Subscription /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>

      {showAgreement && <AgreementModal onAccept={handleAcceptAgreements} />}
    </div>
  );
}

export default App;
