import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [thumbnail, setThumbnail] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setThumbnail(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/search', {
        query: searchQuery,
      });
      setResults(response.data.results || []);
    } catch (err) {
      setError('Failed to search. Try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>YouTube Thumbnail Preview Tool</h1>
      <p>See how your thumbnail stacks up against real YouTube results</p>

      <div style={{ marginBottom: '30px' }}>
        <h2>1. Upload Your Thumbnail</h2>
        <input type="file" accept="image/*" onChange={handleThumbnailUpload} />
        {thumbnail && (
          <div style={{ marginTop: '10px' }}>
            <img src={thumbnail} alt="Uploaded" style={{ maxWidth: '320px', border: '2px solid #ccc' }} />
          </div>
        )}
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>2. Search YouTube</h2>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="e.g., 'React tutorial', 'Gaming highlights'"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '10px', width: '300px', fontSize: '16px' }}
          />
          <button type="submit" style={{ padding: '10px 20px', marginLeft: '10px', fontSize: '16px' }}>
            Search
          </button>
        </form>
      </div>

      {loading && <p>Searching YouTube...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {results.length > 0 && thumbnail && (
        <div>
          <h2>3. Preview Among Results</h2>
          <p>Your thumbnail (top left) compared to real results:</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '15px' }}>
            {/* Your thumbnail */}
            <div style={{ border: '3px solid #ff6b6b', padding: '10px', background: '#ffe0e0' }}>
              <img src={thumbnail} alt="Your thumbnail" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />
              <p style={{ margin: '10px 0', fontWeight: 'bold' }}>YOUR THUMBNAIL</p>
              <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>Your video title here</p>
            </div>

            {/* YouTube results */}
            {results.map((video, idx) => (
              <div key={idx} style={{ border: '1px solid #ddd', padding: '10px' }}>
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }}
                />
                <p style={{ margin: '10px 0', fontSize: '14px', fontWeight: 'bold' }}>{video.title}</p>
                <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>{video.channel}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: '50px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>Pro Features (Coming Soon)</h3>
        <ul>
          <li>Unlimited searches (currently limited to 5/day)</li>
          <li>A/B testing with multiple thumbnails</li>
          <li>Color analysis & contrast suggestions</li>
          <li>Competitor thumbnail library</li>
        </ul>
        <p>Upgrade to Pro: $9/month</p>
      </div>
    </div>
  );
}
