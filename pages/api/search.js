import axios from 'axios';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// In-memory rate limiters
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 searches per minute per IP

// Daily quota counter (resets at UTC midnight, approximate)
const dailyQuotaKey = () => new Date().toISOString().split('T')[0];
let dailyQuota = { date: dailyQuotaKey(), count: 0 };
const DAILY_QUOTA_MAX = 80; // Leave buffer for errors

// Search result cache (24-hour TTL)
const searchCache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

function getCacheKey(query) {
  return `search:${query.toLowerCase().trim()}`;
}

function getCachedResult(query) {
  const key = getCacheKey(query);
  const cached = searchCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.results;
  }
  if (cached) {
    searchCache.delete(key); // Expired
  }
  return null;
}

function setCachedResult(query, results) {
  const key = getCacheKey(query);
  searchCache.set(key, {
    results,
    timestamp: Date.now(),
  });
}

function getRateLimitKey(ip) {
  return `${ip}:${Math.floor(Date.now() / RATE_LIMIT_WINDOW)}`;
}

function isRateLimited(ip) {
  const key = getRateLimitKey(ip);
  const count = (requestCounts.get(key) || 0) + 1;
  requestCounts.set(key, count);
  
  // Cleanup old entries every 100 requests
  if (requestCounts.size > 200) {
    const now = Math.floor(Date.now() / RATE_LIMIT_WINDOW);
    for (const [k] of requestCounts) {
      const entryWindow = parseInt(k.split(':')[1]);
      if (entryWindow < now - 5) {
        requestCounts.delete(k);
      }
    }
  }
  
  return count > RATE_LIMIT_MAX;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check daily quota
  const today = dailyQuotaKey();
  if (dailyQuota.date !== today) {
    dailyQuota = { date: today, count: 0 };
  }
  if (dailyQuota.count >= DAILY_QUOTA_MAX) {
    return res.status(503).json({ 
      error: 'We\'re getting a lot of traffic today! The tool will reset at midnight UTC. Try again tomorrow.' 
    });
  }

  // Rate limiting
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: 'Too many searches. Try again in a minute.' });
  }

  const { query } = req.body;

  // Input validation
  if (typeof query !== 'string' || query.trim().length === 0) {
    return res.status(400).json({ error: 'Search query must be a non-empty string' });
  }

  // Max length validation
  if (query.length > 100) {
    return res.status(400).json({ error: 'Search query too long (max 100 characters)' });
  }

  if (!YOUTUBE_API_KEY) {
    return res.status(500).json({ error: 'YouTube API key not configured' });
  }

  // Check cache first
  const cachedResults = getCachedResult(query);
  if (cachedResults) {
    res.setHeader('X-Cache', 'HIT');
    res.setHeader('X-Cache-Key', getCacheKey(query));
    return res.status(200).json({ results: cachedResults, cached: true });
  }
  res.setHeader('X-Cache', 'MISS');
  res.setHeader('X-Cache-Key', getCacheKey(query));

  try {
    // Encode query properly for Unicode
    const encodedQuery = encodeURIComponent(query);
    
    // Search YouTube
    const searchResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        q: query, // axios handles encoding
        part: 'snippet',
        maxResults: 12, // Get more to account for dedup
        order: 'relevance',
        type: 'video',
        key: YOUTUBE_API_KEY,
      },
      timeout: 5000, // 5 second timeout
    });

    if (!searchResponse.data.items || searchResponse.data.items.length === 0) {
      return res.status(200).json({ results: [] });
    }

    const decodeHtmlEntities = (str) => {
      if (typeof str !== 'string') return '';
      const entities = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'",
        '&#x27;': "'",
      };
      return str.replace(/&[a-z]+;/gi, (match) => entities[match] || match);
    };

    const results = searchResponse.data.items
      .filter((item) => item.id && item.id.videoId && item.snippet) // Strict validation
      .map((item) => ({
        id: item.id.videoId,
        title: decodeHtmlEntities(item.snippet.title),
        channel: decodeHtmlEntities(item.snippet.channelTitle),
        thumbnail: item.snippet.thumbnails?.medium?.url || '',
        description: decodeHtmlEntities(item.snippet.description),
        publishedAt: item.snippet.publishedAt,
      }))
      .reduce((unique, item) => {
        // Deduplicate by videoId
        if (!unique.find((v) => v.id === item.id)) {
          unique.push(item);
        }
        return unique;
      }, [])
      .slice(0, 8); // Return max 8 results

    // Cache the results
    setCachedResult(query, results);

    // Increment daily quota counter
    dailyQuota.count += 1;

    return res.status(200).json({ results, cached: false });
  } catch (error) {
    console.error('YouTube API error:', error.response?.status, error.message);
    
    // Return specific error messages
    if (error.response?.status === 403) {
      return res.status(503).json({ error: 'API quota exceeded. Try again later.' });
    }
    if (error.response?.status === 400) {
      return res.status(400).json({ error: 'Invalid search query.' });
    }
    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({ error: 'Search timed out. Try a simpler query.' });
    }
    
    return res.status(500).json({ error: 'Failed to search YouTube. Try again.' });
  }
}
