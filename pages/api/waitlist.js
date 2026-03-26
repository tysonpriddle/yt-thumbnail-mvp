// Simple in-memory waitlist for MVP
const waitlist = new Set();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  // Add to waitlist (prevent duplicates)
  if (waitlist.has(email)) {
    return res.status(200).json({ message: 'Already on waitlist' });
  }

  waitlist.add(email);
  console.log(`[WAITLIST] ${email} joined at ${new Date().toISOString()}`);

  return res.status(200).json({ message: 'Added to waitlist', totalOnWaitlist: waitlist.size });
}
