require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routers
const authRouter = require('./routes/auth');
const domainsRouter = require('./routes/domains');
const portfolioRouter = require('./routes/portfolio');
const watchlistRouter = require('./routes/watchlist');
const subscriptionsRouter = require('./routes/subscriptions');
const profileRouter = require('./routes/profile');
const agreementsRouter = require('./routes/agreements');
const trendingRouter = require('./routes/trending');

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Mount routers
app.use('/api/auth', authRouter);
app.use('/api/domains', domainsRouter);
app.use('/api/portfolio', portfolioRouter);
app.use('/api/watchlist', watchlistRouter);
app.use('/api/subscriptions', subscriptionsRouter);
app.use('/api/profile', profileRouter);
app.use('/api/agreements', agreementsRouter);
app.use('/api/trending', trendingRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// 5-min background trend refresh interval
setInterval(() => {
  console.log(`[${new Date().toISOString()}] Refreshing market trends...`);
  // Logic for refreshing trends would go here
}, 5 * 60 * 1000);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`DomainPulse Backend listening on port ${PORT}`);
});
