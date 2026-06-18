const express = require('express');
const router = express.Router();
const db = require('../data/store');
const { appraiseDomain } = require('../data/mockDomains');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// GET /api/profile
router.get('/', (req, res) => {
  const linkedAccounts = db.getLinkedAccounts(req.user.id);
  res.json({ user: req.user, linkedAccounts });
});

// PUT /api/profile
router.put('/', (req, res) => {
  const { name, phone } = req.body;
  // Note: Usually we don't allow email change without verification
  
  const updatedUser = { ...req.user, name: name || req.user.name, phone: phone || req.user.phone };
  // Update in store (simplified, should have a proper update method)
  const users = db.getUsers();
  const index = users.findIndex(u => u.id === req.user.id);
  if (index !== -1) {
    users[index] = updatedUser;
  }
  
  res.json({ message: 'Profile updated', user: updatedUser });
});

// POST /api/profile/link-registrar
router.post('/link-registrar', (req, res) => {
  const { registrar, apiKey, apiSecret } = req.body;
  if (!registrar || !apiKey) {
    return res.status(400).json({ error: 'Registrar and API Key are required' });
  }

  const account = db.linkAccount({
    userId: req.user.id,
    registrar,
    status: 'connected',
    apiKeyMasked: apiKey.substring(0, 4) + '****'
  });

  res.status(201).json({ message: `${registrar} linked successfully`, account });
});

// GET /api/profile/registrar-domains
router.get('/registrar-domains', (req, res) => {
  const accounts = db.getLinkedAccounts(req.user.id);
  if (accounts.length === 0) {
    return res.json({ domains: [] });
  }

  // Mock domains from registrars
  const mockRegistrarDomains = [
    { domain: 'my-business.com', registrar: 'GoDaddy', expiryDate: '2025-12-01' },
    { domain: 'portfolio-site.net', registrar: 'Domainify', expiryDate: '2026-06-15' },
    { domain: 'startup-idea.io', registrar: 'GoDaddy', expiryDate: '2025-08-20' }
  ];

  // Map and add mock valuations
  const domains = mockRegistrarDomains.map(d => ({
    ...d,
    valuation: appraiseDomain(d.domain)
  }));

  res.json({ domains });
});

module.exports = router;
