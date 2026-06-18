const express = require('express');
const router = express.Router();

// Mock trending data
const TRENDING_KEYWORDS = [
  { keyword: 'ai', rank: 1, volume: '95k', change: '+12%', status: 'rising' },
  { keyword: 'crypto', rank: 2, volume: '88k', change: '-5%', status: 'falling' },
  { keyword: 'cloud', rank: 3, volume: '72k', change: '+8%', status: 'rising' },
  { keyword: 'pay', rank: 4, volume: '65k', change: '+20%', status: 'rising' },
  { keyword: 'meta', rank: 5, volume: '60k', change: '+2%', status: 'stable' },
  { keyword: 'health', rank: 6, volume: '55k', change: '+15%', status: 'rising' },
  { keyword: 'eco', rank: 7, volume: '48k', change: '+10%', status: 'rising' },
  { keyword: 'bio', rank: 8, volume: '42k', change: '+4%', status: 'stable' }
];

const TRENDING_SECTORS = [
  { sector: 'Technology', volume: '250k', growth: '15%', color: '#3B82F6' },
  { sector: 'Finance', volume: '180k', growth: '10%', color: '#10B981' },
  { sector: 'Health', volume: '150k', growth: '20%', color: '#EF4444' },
  { sector: 'Environment', volume: '120k', growth: '25%', color: '#059669' },
  { sector: 'Education', volume: '100k', growth: '5%', color: '#F59E0B' }
];

// GET /api/trending/keywords
router.get('/keywords', (req, res) => {
  res.json({ keywords: TRENDING_KEYWORDS });
});

// GET /api/trending/sectors
router.get('/sectors', (req, res) => {
  res.json({ sectors: TRENDING_SECTORS });
});

module.exports = router;
