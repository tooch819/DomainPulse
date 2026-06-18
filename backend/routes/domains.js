const express = require('express');
const router = express.Router();
const db = require('../data/store');
const { mockDomains, appraiseDomain } = require('../data/mockDomains');
const { optionalAuth, authenticate } = require('../middleware/auth');

// Helper to mask domain data for free tier
const maskDomainForFree = (domainData) => {
  return {
    ...domainData,
    valuation: '***',
    details: 'Upgrade to Pro to see full details',
    isMasked: true
  };
};

// GET /api/domains/search
router.get('/search', (req, res) => {
  const { query, sector } = req.query;
  let results = [...mockDomains];

  if (query) {
    results = results.filter(d => d.domain.toLowerCase().includes(query.toLowerCase()));
  }

  if (sector) {
    results = results.filter(d => d.sector.toLowerCase() === sector.toLowerCase());
  }

  res.json({ results: results.slice(0, 10) }); // Limit results
});

// POST /api/domains/appraise
router.post('/appraise', optionalAuth, (req, res) => {
  const { domain } = req.body;
  if (!domain) {
    return res.status(400).json({ error: 'Domain name is required' });
  }

  const value = appraiseDomain(domain);
  const appraisalResult = {
    domain,
    valuation: value,
    currency: 'USD',
    appraisedAt: new Date(),
    confidenceScore: 85 + Math.floor(Math.random() * 10),
    comparables: mockDomains.slice(0, 3)
  };

  // If user is logged in, save to history
  if (req.user) {
    db.addAppraisal({
      userId: req.user.id,
      ...appraisalResult
    });

    // Check if user has premium subscription
    const subscriptions = db.getSubscriptions(req.user.id);
    const hasPremium = subscriptions.some(s => 
      (s.status === 'active' && (s.plan === 'Pro' || s.plan === 'Enterprise')) || 
      s.plan === 'Lifetime'
    );

    if (!hasPremium) {
      return res.json(maskDomainForFree(appraisalResult));
    }
  } else {
    // Guest user always gets masked data
    return res.json(maskDomainForFree(appraisalResult));
  }

  res.json(appraisalResult);
});

// GET /api/domains/history
router.get('/history', authenticate, (req, res) => {
  const history = db.getAppraisalHistory(req.user.id);
  
  // Check if user has premium subscription
  const subscriptions = db.getSubscriptions(req.user.id);
  const hasPremium = subscriptions.some(s => 
    (s.status === 'active' && (s.plan === 'Pro' || s.plan === 'Enterprise')) || 
    s.plan === 'Lifetime'
  );

  const processedHistory = history.map(h => hasPremium ? h : maskDomainForFree(h));
  res.json({ history: processedHistory });
});

module.exports = router;
