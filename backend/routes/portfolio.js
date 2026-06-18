const express = require('express');
const router = express.Router();
const db = require('../data/store');
const { appraiseDomain } = require('../data/mockDomains');
const { authenticate, requirePremium } = require('../middleware/auth');

// All portfolio routes require authentication and a premium subscription
router.use(authenticate);
router.use(requirePremium);

// GET /api/portfolio
router.get('/', (req, res) => {
  const portfolio = db.getPortfolios(req.user.id);
  res.json({ portfolio });
});

// POST /api/portfolio
router.post('/', (req, res) => {
  const { domain, purchasePrice, registrar } = req.body;
  if (!domain) {
    return res.status(400).json({ error: 'Domain is required' });
  }

  const currentValuation = appraiseDomain(domain);
  const changePercent = purchasePrice ? ((currentValuation - purchasePrice) / purchasePrice) * 100 : 0;

  const item = db.addPortfolioItem({
    userId: req.user.id,
    domain,
    purchasePrice: purchasePrice || currentValuation,
    currentValuation,
    changePercent: parseFloat(changePercent.toFixed(2)),
    registrar: registrar || 'Manual',
    lastChecked: new Date()
  });

  res.status(201).json({ message: 'Added to portfolio', item });
});

// DELETE /api/portfolio/:id
router.delete('/:id', (req, res) => {
  const item = db.removePortfolioItem(req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.json({ message: 'Removed from portfolio', item });
});

// GET /api/portfolio/summary
router.get('/summary', (req, res) => {
  const portfolio = db.getPortfolios(req.user.id);
  
  const totalPurchasePrice = portfolio.reduce((sum, item) => sum + (item.purchasePrice || 0), 0);
  const totalValuation = portfolio.reduce((sum, item) => sum + (item.currentValuation || 0), 0);
  const totalChangePercent = totalPurchasePrice > 0 
    ? ((totalValuation - totalPurchasePrice) / totalPurchasePrice) * 100 
    : 0;

  res.json({
    itemCount: portfolio.length,
    totalValuation,
    totalPurchasePrice,
    overallChangePercent: parseFloat(totalChangePercent.toFixed(2)),
    changeBadge: totalChangePercent >= 0 ? 'positive' : 'negative'
  });
});

module.exports = router;
