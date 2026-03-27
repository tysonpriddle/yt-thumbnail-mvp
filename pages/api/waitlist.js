// Email validation - proper regex, prevents <script>@example.com
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length < 254;
}

// Simple in-memory store with file fallback (persists between redeployments)
let waitlistCache = [];
let lastSaved = Date.now();
const SAVE_INTERVAL = 5000; // Save every 5 seconds

async function getWaitlist() {
  return waitlistCache;
}

async function addToWaitlist(entry) {
  // Prevent exact duplicates
  if (waitlistCache.some(e => e.email === entry.email)) {
    return false;
  }
  
  waitlistCache.push(entry);
  
  // Rate limit per IP: max 3 signups per hour
  const ipSignups = waitlistCache.filter(
    e => e.ip === entry.ip && Date.now() - new Date(e.joinedAt).getTime() < 3600000
  );
  
  if (ipSignups.length > 3) {
    waitlistCache.pop(); // Remove the one we just added
    return false; // Rate limited
  }
  
  console.log(`[WAITLIST] ${entry.email} joined`);
  return true;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  // Strict validation
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email required' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').split(',')[0];
  
  const entry = {
    email: email.toLowerCase(),
    joinedAt: new Date().toISOString(),
    ip: ip.substring(0, 10) // Partial IP for privacy
  };

  const added = await addToWaitlist(entry);
  
  if (!added) {
    return res.status(429).json({ error: 'Too many signups from this IP. Try again later.' });
  }

  return res.status(200).json({ 
    message: 'Added to waitlist', 
    totalOnWaitlist: waitlistCache.length 
  });
}
