import fs from 'fs';
import path from 'path';

const WAITLIST_FILE = path.join(process.cwd(), '.waitlist.json');

function loadWaitlist() {
  try {
    if (fs.existsSync(WAITLIST_FILE)) {
      const data = fs.readFileSync(WAITLIST_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading waitlist:', err);
  }
  return [];
}

function saveWaitlist(list) {
  try {
    fs.writeFileSync(WAITLIST_FILE, JSON.stringify(list, null, 2));
  } catch (err) {
    console.error('Error saving waitlist:', err);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const waitlist = loadWaitlist();
  
  // Check if already on list
  if (waitlist.some(entry => entry.email === email)) {
    return res.status(200).json({ message: 'Already on waitlist' });
  }

  // Add new entry with timestamp
  const entry = {
    email,
    joinedAt: new Date().toISOString(),
    source: req.headers.referer || 'direct'
  };

  waitlist.push(entry);
  saveWaitlist(waitlist);

  console.log(`[WAITLIST] ${email} joined at ${entry.joinedAt}`);

  return res.status(200).json({ message: 'Added to waitlist', totalOnWaitlist: waitlist.length });
}
