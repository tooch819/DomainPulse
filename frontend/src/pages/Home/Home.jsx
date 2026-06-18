import React from 'react';
import { Link } from 'react-router-dom';
import { Search, TrendingUp, Shield, BarChart3, Zap, Globe } from 'lucide-react';
import './Home.css';

const Home = () => {
  const features = [
    { icon: <Search />, title: "Instant Appraisal", desc: "Get real-time valuations using our advanced deterministic AI algorithm." },
    { icon: <TrendingUp />, title: "Market Trends", desc: "Track rising keywords and high-growth sectors across the domain industry." },
    { icon: <Shield />, title: "Secure Tracking", desc: "Monitor your domain portfolio and watchlist with bank-grade security." },
    { icon: <BarChart3 />, title: "Dual Valuations", desc: "Compare side-by-side data from GoDaddy and Domainify for every asset." },
    { icon: <Zap />, title: "Smart Alerts", desc: "Receive notifications for significant price changes and trend shifts." },
    { icon: <Globe />, title: "Registrar Sync", desc: "Automatically pull your domains from external registrar accounts." }
  ];

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1 className="text-gradient pulse-text">Master the Domain Market</h1>
          <p>Consolidated appraisals, portfolio tracking, and real-time market analytics in one powerful platform.</p>
          <div className="hero-actions">
            <Link to="/appraisal" className="btn btn-primary btn-lg">Start Free Appraisal</Link>
            <Link to="/subscription" className="btn btn-outline btn-lg">View Pro Plans</Link>
          </div>
        </div>
        <div className="hero-stats card glass">
          <div className="stat-item">
            <span className="stat-value">$42M+</span>
            <span className="stat-label">Assets Tracked</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">150k+</span>
            <span className="stat-label">Daily Appraisals</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">98%</span>
            <span className="stat-label">Accuracy Rate</span>
          </div>
        </div>
      </section>

      <section className="features-grid">
        {features.map((f, i) => (
          <div key={i} className="feature-card card">
            <div className="feature-icon bg-gradient">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </section>

      <section className="pricing-preview">
        <h2>Choose Your Performance Tier</h2>
        <div className="pricing-cards">
          <div className="pricing-card card">
            <h3>Free Tier</h3>
            <div className="price">$0<span>/mo</span></div>
            <ul>
              <li>Basic Domain Search</li>
              <li>Masked Valuations</li>
              <li>7-Day Free Trial</li>
            </ul>
            <Link to="/login" className="btn btn-outline">Get Started</Link>
          </div>
          <div className="pricing-card card featured">
            <div className="badge badge-success">MOST POPULAR</div>
            <h3>Pro Plan</h3>
            <div className="price">$29<span>/mo</span></div>
            <ul>
              <li>Unlimited Appraisals</li>
              <li>Full Portfolio Management</li>
              <li>Real-time Trend Detection</li>
              <li>GoDaddy/Domainify Integration</li>
            </ul>
            <Link to="/subscription" className="btn btn-primary">Go Pro</Link>
          </div>
          <div className="pricing-card card">
            <h3>Lifetime</h3>
            <div className="price">$75<span>once</span></div>
            <ul>
              <li>Everything in Pro</li>
              <li>One-time Payment</li>
              <li>Priority Support</li>
              <li>Exclusive Beta Access</li>
            </ul>
            <Link to="/subscription" className="btn btn-outline">Buy Lifetime</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
