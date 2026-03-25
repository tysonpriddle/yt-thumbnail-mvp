import axios from 'axios';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body;

  if (!query || query.trim().length === 0) {
    return res.status(400).json({ error: 'Search query required' });
  }

  if (!YOUTUBE_API_KEY) {
    return res.status(500).json({ error: 'YouTube API key not configured' });
  }

  try {
    // Search YouTube
    const searchResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        q: query,
        part: 'snippet',
        maxResults: 8,
        order: 'relevance',
        type: 'video',
        key: YOUTUBE_API_KEY,
      },
    });

    const results = searchResponse.data.items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.medium.url,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
    }));

    return res.status(200).json({ results });
  } catch (error) {
    console.error('YouTube API error:', error.message);
    return res.status(500).json({ error: 'Failed to search YouTube' });
  }
}
