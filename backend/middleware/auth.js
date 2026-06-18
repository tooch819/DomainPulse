const db = require('../data/store');

const authenticate = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID required' });
  }
  const user = db.findUserById(userId);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: User not found' });
  }
  req.user = user;
  next();
};

const optionalAuth = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (userId) {
    const user = db.findUserById(userId);
    if (user) {
      req.user = user;
    }
  }
  next();
};

const requirePremium = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const subscriptions = db.getSubscriptions(req.user.id);
  // Any active Pro or Lifetime subscription counts
  const activeSub = subscriptions.find(s => 
    (s.status === 'active' && (s.plan === 'Pro' || s.plan === 'Enterprise')) || 
    s.plan === 'Lifetime'
  );
  
  if (!activeSub) {
    return res.status(403).json({ error: 'Forbidden: Premium subscription required' });
  }
  
  req.subscription = activeSub;
  next();
};

module.exports = { authenticate, optionalAuth, requirePremium };
