const express = require('express');
const router = express.Router();
const db = require('../data/store');
const { appraiseDomain } = require('../data/mockDomains');
const { authenticate, requirePremium } = require('../middleware/auth');

// All watchlist routes require authentication and a premium subscription
router.use(authenticate);
router.use(requirePremium);

// GET /api/watchlist
router.get('/', (req, res) => {
  const watchlist = db.getWatchlists(req.user.id);
  res.json({ watchlist });
});

// POST /api/watchlist
router.post('/', (req, res) => {
  const { domain } = req.body;
  if (!domain) {
    return res.status(400).json({ error: 'Domain is required' });
  }

  const valuationAtAdded = appraiseDomain(domain);
  const item = db.addToWatchlist({
    userId: req.user.id,
    domain,
    valuationAtAdded,
    currentValuation: valuationAtAdded,
    addedAt: new Date()
  });

  res.status(201).json({ message: 'Added to watchlist', item });
});

// DELETE /api/watchlist/:id
router.delete('/:id', (req, res) => {
  const item = db.removeFromWatchlist(req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.json({ message: 'Removed from watchlist', item });
});

module.exports = router;
