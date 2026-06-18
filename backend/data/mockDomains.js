const mockDomains = [
  // Technology
  { domain: 'cloud-tech.com', sector: 'Technology', baseValue: 1500 },
  { domain: 'ai-solutions.io', sector: 'Technology', baseValue: 5000 },
  // Finance
  { domain: 'pay-quick.com', sector: 'Finance', baseValue: 2500 },
  { domain: 'crypto-vault.net', sector: 'Finance', baseValue: 4000 },
  // Health
  { domain: 'tele-health.com', sector: 'Health', baseValue: 3000 },
  { domain: 'fit-life.app', sector: 'Health', baseValue: 1200 },
  // Education
  { domain: 'learn-online.edu', sector: 'Education', baseValue: 2000 },
  { domain: 'skill-up.org', sector: 'Education', baseValue: 1800 },
  // Real Estate
  { domain: 'home-search.com', sector: 'Real Estate', baseValue: 3500 },
  { domain: 'office-space.rent', sector: 'Real Estate', baseValue: 2200 },
  // E-commerce
  { domain: 'shop-easy.store', sector: 'E-commerce', baseValue: 1000 },
  { domain: 'global-buy.com', sector: 'E-commerce', baseValue: 4500 },
  // Travel
  { domain: 'trip-planner.com', sector: 'Travel', baseValue: 2800 },
  { domain: 'hotel-deals.net', sector: 'Travel', baseValue: 3200 },
  // Entertainment
  { domain: 'stream-now.tv', sector: 'Entertainment', baseValue: 5000 },
  { domain: 'game-hub.com', sector: 'Entertainment', baseValue: 2500 },
  // Food
  { domain: 'tasty-bites.com', sector: 'Food', baseValue: 1500 },
  { domain: 'organic-farm.org', sector: 'Food', baseValue: 2100 },
  // Fashion
  { domain: 'style-watch.com', sector: 'Fashion', baseValue: 1800 },
  { domain: 'trend-wear.store', sector: 'Fashion', baseValue: 1100 },
  // Sports
  { domain: 'pro-athletes.com', sector: 'Sports', baseValue: 2300 },
  { domain: 'fan-zone.net', sector: 'Sports', baseValue: 1400 },
  // Automotive
  { domain: 'car-deals.com', sector: 'Automotive', baseValue: 3800 },
  { domain: 'electric-rides.com', sector: 'Automotive', baseValue: 5500 },
  // Environment
  { domain: 'green-energy.org', sector: 'Environment', baseValue: 4200 },
  { domain: 'eco-living.com', sector: 'Environment', baseValue: 1600 },
  // Law
  { domain: 'legal-aid.com', sector: 'Law', baseValue: 2700 },
  { domain: 'law-firm.net', sector: 'Law', baseValue: 3100 },
  // Marketing
  { domain: 'ad-pulse.com', sector: 'Marketing', baseValue: 1900 },
  { domain: 'brand-boost.io', sector: 'Marketing', baseValue: 2600 }
];

const appraiseDomain = (domain) => {
  if (!domain) return 0;
  const domainParts = domain.split('.');
  const name = domainParts[0].toLowerCase();
  const tld = domainParts[1] || 'com';

  let valuation = 500; // Base value

  // Length factor
  if (name.length < 5) valuation += 2000;
  else if (name.length < 10) valuation += 1000;

  // TLD factor
  const tldMultipliers = {
    'com': 2.5,
    'net': 1.5,
    'org': 1.2,
    'io': 3.0,
    'ai': 4.0,
    'app': 2.0
  };
  const multiplier = tldMultipliers[tld] || 1.0;
  valuation *= multiplier;

  // Keyword check (simplified)
  const premiumKeywords = ['tech', 'cloud', 'ai', 'pay', 'crypto', 'health', 'home', 'shop', 'gold', 'pro', 'vip'];
  premiumKeywords.forEach(kw => {
    if (name.includes(kw)) valuation += 1500;
  });

  // Hyphen penalty
  if (name.includes('-')) valuation *= 0.8;

  // Random variance (deterministic based on domain name for consistency)
  let hash = 0;
  for (let i = 0; i < domain.length; i++) {
    hash = domain.charCodeAt(i) + ((hash << 5) - hash);
  }
  const variance = (Math.abs(hash) % 20) - 10; // -10% to +10%
  valuation = valuation * (1 + variance / 100);

  return Math.floor(valuation);
};

module.exports = { mockDomains, appraiseDomain };
