import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { CreditCard, Zap, CheckCircle2, ShieldCheck, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import './Subscription.css';

const Subscription = () => {
  const { isPremium, refreshAuth } = useAuth();
  const [plans, setPlans] = useState([]);
  const [activeSub, setActiveSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansRes, statusRes] = await Promise.all([
          api.get('/subscriptions/plans'),
          api.get('/subscriptions/status')
        ]);
        setPlans(plansRes.data.plans);
        setActiveSub(statusRes.data.subscription);
      } catch (error) {
        console.error('Error fetching sub data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubscribe = async () => {
    if (!selectedPlan) return;
    setIsProcessing(true);
    try {
      await api.post('/subscriptions/subscribe', { planId: selectedPlan.id.toLowerCase() });
      await refreshAuth();
      // Refresh status
      const statusRes = await api.get('/subscriptions/status');
      setActiveSub(statusRes.data.subscription);
      setSelectedPlan(null);
      alert('Welcome to Pro!');
    } catch (error) {
      console.error('Subscription failed', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!activeSub) return;
    const confirmMsg = activeSub.plan === 'Lifetime' 
      ? 'Apply for a refund within our 30-day policy?' 
      : 'Cancel your subscription at the end of the current period?';
    
    if (!window.confirm(confirmMsg)) return;

    try {
      await api.post('/subscriptions/cancel', { subscriptionId: activeSub.id });
      alert('Processed successfully');
      const statusRes = await api.get('/subscriptions/status');
      setActiveSub(statusRes.data.subscription);
    } catch (error) {
      console.error('Cancellation failed', error);
    }
  };

  if (loading) return <div className="shimmer card" style={{ height: '500px' }}></div>;

  return (
    <div className="subscription-page">
      <div className="page-header">
        <h1>Subscription Plans</h1>
        <p>Unlock the full power of DomainPulse with our professional tiers.</p>
      </div>

      {activeSub && (
        <section className="current-subscription card glass">
          <div className="sub-status-info">
            <Zap className="text-primary" size={32} />
            <div>
              <h3>Active Plan: {activeSub.plan}</h3>
              <p>Status: <span className="text-success">{activeSub.status.toUpperCase()}</span> • {activeSub.interval === 'once' ? 'Lifetime Access' : `Billed ${activeSub.interval}`}</p>
            </div>
          </div>
          <button className="btn btn-outline text-danger" onClick={handleCancel}>Cancel Plan</button>
        </section>
      )}

      {!selectedPlan ? (
        <div className="plans-grid">
          {plans.map((plan) => (
            <div key={plan.id} className={`plan-card card ${plan.id === 'pro' ? 'featured' : ''}`}>
              {plan.id === 'pro' && <div className="featured-badge">Best Value</div>}
              <h3>{plan.name}</h3>
              <div className="plan-price">${plan.price}<span>/{plan.interval === 'once' ? 'once' : 'mo'}</span></div>
              <ul className="plan-features">
                {plan.features.map((f, i) => (
                  <li key={i}><CheckCircle2 size={16} className="text-success" /> {f}</li>
                ))}
              </ul>
              <button 
                className={`btn ${plan.id === 'pro' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setSelectedPlan(plan)}
                disabled={activeSub?.plan === plan.name}
              >
                {activeSub?.plan === plan.name ? 'Current Plan' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="checkout-panel card">
          <button className="btn btn-ghost mb-4" onClick={() => setSelectedPlan(null)}>&larr; Back to plans</button>
          <div className="checkout-grid">
            <div className="checkout-form">
              <h3>Secure Checkout</h3>
              <p className="mb-4">Complete your subscription to <strong>{selectedPlan.name}</strong></p>
              
              <div className="form-group mb-4">
                <label>Cardholder Name</label>
                <input type="text" placeholder="John Doe" defaultValue="Mock User" />
              </div>
              
              <div className="form-group mb-4">
                <label>Credit Card Info (Mock)</label>
                <div className="input-with-icon">
                  <CreditCard size={18} />
                  <input type="text" placeholder="4242 4242 4242 4242" defaultValue="4242 4242 4242 4242" />
                </div>
              </div>

              <div className="form-row mb-4">
                <div className="form-group">
                  <label>Expiry</label>
                  <input type="text" placeholder="MM/YY" defaultValue="12/28" />
                </div>
                <div className="form-group">
                  <label>CVC</label>
                  <input type="text" placeholder="123" defaultValue="123" />
                </div>
              </div>

              <button className="btn btn-primary btn-lg w-full" onClick={handleSubscribe} disabled={isProcessing}>
                {isProcessing ? <Loader2 className="animate-spin" /> : `Pay $${selectedPlan.price}`}
              </button>

              <div className="checkout-security mt-4">
                <ShieldCheck size={14} /> Secure SSL Encrypted Payment
              </div>
            </div>

            <aside className="order-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>{selectedPlan.name} Plan</span>
                <span>${selectedPlan.price}.00</span>
              </div>
              <div className="summary-row">
                <span>Tax (0%)</span>
                <span>$0.00</span>
              </div>
              <hr />
              <div className="summary-row total">
                <span>Total Today</span>
                <span>${selectedPlan.price}.00</span>
              </div>
              <div className="policy-note">
                <AlertCircle size={14} />
                <p>Subscriptions automatically renew. Cancel anytime in your dashboard.</p>
              </div>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscription;
