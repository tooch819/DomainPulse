const express = require('express');
const router = express.Router();
const db = require('../data/store');
const { authenticate } = require('../middleware/auth');

// POST /api/auth/login
// Mock login - in a real app this might use Internet Identity or OAuth
router.post('/login', (req, res) => {
  const { email, name } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  let user = db.findUserByEmail(email);
  if (!user) {
    user = db.addUser({ email, name: name || 'User', role: 'user' });
  }

  // In a real app, we'd set a cookie or return a JWT.
  // Here we just return the user and the frontend will send x-user-id header.
  res.json({ message: 'Login successful', user });
});

// GET /api/auth/me
router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

// GET /api/auth/agreement
router.get('/agreement', authenticate, (req, res) => {
  const agreements = db.getAgreements(req.user.id);
  res.json({ agreements });
});

// POST /api/auth/agreement
router.post('/agreement', authenticate, (req, res) => {
  const { type, accepted } = req.body;
  if (!type || accepted === undefined) {
    return res.status(400).json({ error: 'Type and accepted status required' });
  }

  const agreement = db.addAgreement({
    userId: req.user.id,
    type,
    accepted,
    version: '1.0'
  });

  res.status(201).json({ message: 'Agreement recorded', agreement });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;
