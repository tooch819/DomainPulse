const { v4: uuidv4 } = require('uuid');

const store = {
  users: [],
  agreements: [],
  subscriptions: [],
  portfolios: [],
  watchlists: [],
  appraisalHistory: [],
  linkedAccounts: [],
};

const db = {
  // Users
  getUsers: () => store.users,
  addUser: (user) => {
    const newUser = { id: uuidv4(), ...user, createdAt: new Date() };
    store.users.push(newUser);
    return newUser;
  },
  findUserByEmail: (email) => store.users.find(u => u.email === email),
  findUserById: (id) => store.users.find(u => u.id === id),

  // Agreements
  getAgreements: (userId) => store.agreements.filter(a => a.userId === userId),
  addAgreement: (agreement) => {
    const newAgreement = { id: uuidv4(), ...agreement, createdAt: new Date() };
    store.agreements.push(newAgreement);
    return newAgreement;
  },

  // Subscriptions
  getSubscriptions: (userId) => store.subscriptions.filter(s => s.userId === userId),
  addSubscription: (subscription) => {
    const newSub = { 
      id: uuidv4(), 
      ...subscription, 
      status: 'active', 
      startDate: new Date(),
      updatedAt: new Date()
    };
    store.subscriptions.push(newSub);
    return newSub;
  },
  updateSubscription: (id, updates) => {
    const index = store.subscriptions.findIndex(s => s.id === id);
    if (index !== -1) {
      store.subscriptions[index] = { 
        ...store.subscriptions[index], 
        ...updates, 
        updatedAt: new Date() 
      };
      return store.subscriptions[index];
    }
    return null;
  },
  // Pro cancellation and Lifetime refund logic
  cancelSubscription: (id) => {
    const sub = store.subscriptions.find(s => s.id === id);
    if (!sub) return null;
    
    if (sub.plan === 'Pro') {
      return db.updateSubscription(id, { status: 'cancelled', endDate: new Date() });
    } else if (sub.plan === 'Lifetime') {
      // Specific refund policy logic (Section 6.1)
      // Usually would check if within 30 days etc.
      return db.updateSubscription(id, { status: 'refunded', endDate: new Date() });
    }
    return db.updateSubscription(id, { status: 'inactive', endDate: new Date() });
  },

  // Portfolios
  getPortfolios: (userId) => store.portfolios.filter(p => p.userId === userId),
  addPortfolioItem: (item) => {
    const newItem = { id: uuidv4(), ...item, addedAt: new Date() };
    store.portfolios.push(newItem);
    return newItem;
  },
  removePortfolioItem: (id) => {
    const index = store.portfolios.findIndex(p => p.id === id);
    if (index !== -1) return store.portfolios.splice(index, 1)[0];
    return null;
  },

  // Watchlists
  getWatchlists: (userId) => store.watchlists.filter(w => w.userId === userId),
  addToWatchlist: (item) => {
    const newItem = { id: uuidv4(), ...item, addedAt: new Date() };
    store.watchlists.push(newItem);
    return newItem;
  },
  removeFromWatchlist: (id) => {
    const index = store.watchlists.findIndex(w => w.id === id);
    if (index !== -1) return store.watchlists.splice(index, 1)[0];
    return null;
  },

  // Appraisal History
  getAppraisalHistory: (userId) => store.appraisalHistory.filter(h => h.userId === userId),
  addAppraisal: (appraisal) => {
    const entry = { id: uuidv4(), ...appraisal, appraisedAt: new Date() };
    store.appraisalHistory.push(entry);
    return entry;
  },

  // Linked Accounts
  getLinkedAccounts: (userId) => store.linkedAccounts.filter(a => a.userId === userId),
  linkAccount: (account) => {
    const newAccount = { id: uuidv4(), ...account, linkedAt: new Date() };
    store.linkedAccounts.push(newAccount);
    return newAccount;
  },
  unlinkAccount: (id) => {
    const index = store.linkedAccounts.findIndex(a => a.id === id);
    if (index !== -1) return store.linkedAccounts.splice(index, 1)[0];
    return null;
  }
};

module.exports = db;
