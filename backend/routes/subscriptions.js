const express = require('express');
const router = express.Router();
const db = require('../data/store');
const { authenticate } = require('../middleware/auth');

const PLANS = [
  { id: 'free', name: 'Free Tier', price: 0, interval: 'month', features: ['Basic Search', 'Masked Valuations'] },
  { id: 'pro', name: 'Pro', price: 29, interval: 'month', features: ['Unlimited Appraisals', 'Portfolio Tracking', 'Trend Detection'] },
  { id: 'lifetime', name: 'Lifetime', price: 75, interval: 'once', features: ['All Pro Features', 'One-time Payment', 'Priority Support'] },
  { id: 'enterprise', name: 'Enterprise', price: 99, interval: 'month', features: ['Bulk Appraisals', 'API Access', 'Custom Reporting'] }
];

// GET /api/subscriptions/plans
router.get('/plans', (req, res) => {
  res.json({ plans: PLANS });
});

// GET /api/subscriptions/status
router.get('/status', authenticate, (req, res) => {
  const subscriptions = db.getSubscriptions(req.user.id);
  const activeSub = subscriptions.find(s => s.status === 'active' || s.plan === 'Lifetime');
  res.json({ subscription: activeSub || null });
});

// POST /api/subscriptions/subscribe
router.post('/subscribe', authenticate, (req, res) => {
  const { planId, paymentMethodId } = req.body;
  const plan = PLANS.find(p => p.id === planId);
  
  if (!plan) {
    return res.status(400).json({ error: 'Invalid plan selected' });
  }

  // Mock Stripe Payment Intent
  console.log(`Processing mock payment for ${plan.name} using ${paymentMethodId || 'default card'}`);

  const subscription = db.addSubscription({
    userId: req.user.id,
    plan: plan.name,
    amount: plan.price,
    interval: plan.interval,
    paymentStatus: 'paid'
  });

  res.status(201).json({ message: 'Subscription successful', subscription });
});

// POST /api/subscriptions/cancel
router.post('/cancel', authenticate, (req, res) => {
  const { subscriptionId } = req.body;
  if (!subscriptionId) {
    return res.status(400).json({ error: 'Subscription ID is required' });
  }

  const result = db.cancelSubscription(subscriptionId);
  if (!result) {
    return res.status(404).json({ error: 'Subscription not found' });
  }

  res.json({ message: 'Subscription processed (cancelled/refunded)', subscription: result });
});

module.exports = router;
