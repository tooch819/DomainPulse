const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const db = require('../data/store');
const { authenticate } = require('../middleware/auth');

const TOS_TEXT = `DomainPulse Terms of Service
Last Updated: June 18, 2026

1. Acceptance of Terms
By accessing or using DomainPulse, you agree to be bound by these Terms of Service...
...`;

const PRIVACY_TEXT = `DomainPulse Privacy Policy
Last Updated: June 18, 2026

1. Data Collection
We collect domain search history and portfolio data to provide valuation services...
...`;

// GET /api/agreements/tos
router.get('/tos', (req, res) => {
  res.json({ text: TOS_TEXT });
});

// GET /api/agreements/privacy
router.get('/privacy', (req, res) => {
  res.json({ text: PRIVACY_TEXT });
});

// GET /api/agreements/download/:id
router.get('/download/:id', authenticate, (req, res) => {
  const agreements = db.getAgreements(req.user.id);
  const agreement = agreements.find(a => a.id === req.params.id);

  if (!agreement) {
    return res.status(404).json({ error: 'Agreement record not found' });
  }

  const doc = new PDFDocument();
  let filename = `Agreement_${agreement.type}_${agreement.id}.pdf`;
  
  // Set headers
  res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
  res.setHeader('Content-type', 'application/pdf');

  doc.fontSize(20).text('DomainPulse Agreement', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Agreement Type: ${agreement.type}`);
  doc.text(`Agreement ID: ${agreement.id}`);
  doc.text(`User ID: ${agreement.userId}`);
  doc.text(`Accepted On: ${agreement.createdAt}`);
  doc.text(`Version: ${agreement.version}`);
  doc.moveDown();
  doc.text('This document serves as an official record of your acceptance of our terms.');
  doc.moveDown();
  
  if (agreement.type === 'TOS') {
    doc.text(TOS_TEXT);
  } else {
    doc.text(PRIVACY_TEXT);
  }

  doc.pipe(res);
  doc.end();
});

module.exports = router;
