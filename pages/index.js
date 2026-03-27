import { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [currentStep, setCurrentStep] = useState('landing'); // landing, upload, search, results, upgrade
  const [thumbnail, setThumbnail] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleThumbnailUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Please upload a valid image (JPG, PNG, WEBP, or GIF)');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('Image too large. Maximum size is 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      setError('Failed to read file. Try again.');
    };
    reader.onload = (event) => {
      setThumbnail(event.target.result);
      setError('');
      setCurrentStep('search');
    };
    reader.readAsDataURL(file);
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
      setCurrentStep('results');
    } catch (err) {
      setError('Failed to search. Try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Landing Page
  if (currentStep === 'landing') {
    return (
      <>
        <Head>
          <title>ThumbCheck - YouTube Thumbnail Previewer</title>
          <meta name="description" content="Upload your YouTube thumbnail and see if it stands out in search results. Get instant visual feedback before you go live." />
        </Head>
        <div className={styles.container}>
        <div className={styles.landing}>
          <div className={styles.landingContent}>
            <h1 className={styles.hero}>Know if your thumbnail will stand out</h1>
            <p className={styles.subtitle}>
              Upload your design and see it side-by-side with real YouTube search results. Make confident edits before you publish.
            </p>
            
            <button 
              className={styles.ctaButton}
              onClick={() => setCurrentStep('upload')}
            >
              Start Preview
            </button>

            <div className={styles.pricingTeaser}>
              <p><strong>Free while in beta.</strong> Pro coming soon.</p>
            </div>
          </div>

          <footer className={styles.footer}>
            <a href="/privacy-policy">Privacy Policy</a> · <a href="/terms">Terms of Service</a>
          </footer>
        </div>
      </div>
      </>
    );
  }

  // Upload Page
  if (currentStep === 'upload') {
    return (
      <>
        <Head>
          <title>Upload Thumbnail - ThumbCheck</title>
        </Head>
        <div className={styles.container}>
        <div className={styles.uploadContainer}>
          <h2>Upload your thumbnail</h2>
          <p className={styles.stepCounter}>Step 1 of 3</p>

          <label className={styles.uploadZone}>
            <div className={styles.uploadContent}>
              <div className={styles.uploadIcon}>📤</div>
              <p className={styles.uploadText}>Drag and drop or click to select</p>
              <p className={styles.uploadHint}>JPG, PNG, WEBP up to 5MB</p>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleThumbnailUpload}
              style={{ display: 'none' }}
            />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <button 
            className={styles.secondaryButton}
            onClick={() => setCurrentStep('landing')}
          >
            Back
          </button>
        </div>
      </div>
      </>
    );
  }

  // Search Page
  if (currentStep === 'search') {
    return (
      <>
        <Head>
          <title>Search - ThumbCheck</title>
        </Head>
        <div className={styles.container}>
        <div className={styles.searchContainer}>
          <h2>What are you searching for?</h2>
          <p className={styles.stepCounter}>Step 2 of 3</p>

          {thumbnail && (
            <div className={styles.thumbnailPreview}>
              <img src={thumbnail} alt="Your thumbnail" />
              <button 
                className={styles.changeButton}
                onClick={() => {
                  setThumbnail(null);
                  setCurrentStep('upload');
                }}
              >
                Change
              </button>
            </div>
          )}

          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="e.g., 'React tutorial', 'Gaming highlights'"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              autoFocus
            />
            <button type="submit" className={styles.ctaButton} disabled={loading || !query.trim()}>
              {loading ? 'Searching...' : 'See Results'}
            </button>
          </form>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.suggestedSearches}>
            <p>Try: "Python tutorial" • "Gaming highlights" • "React tips"</p>
          </div>

          <button 
            className={styles.secondaryButton}
            onClick={() => {
              setThumbnail(null);
              setCurrentStep('upload');
            }}
          >
            Back
          </button>
        </div>
      </div>
      </>
    );
  }

  // Results Page
  if (currentStep === 'results') {
    return (
      <>
        <Head>
          <title>Results - ThumbCheck</title>
        </Head>
        <div className={styles.container}>
        <div className={styles.resultsContainer}>
          <h2>Your thumbnail vs. what's already ranking. Does it compete?</h2>
          <p className={styles.stepCounter}>Step 3 of 3</p>

          <div className={styles.resultsGrid}>
            {/* User's Thumbnail */}
            <div className={`${styles.thumbnailCard} ${styles.userThumbnail}`}>
              <img src={thumbnail} alt="Your thumbnail" />
              <div className={styles.cardLabel}>YOUR THUMBNAIL</div>
              <p className={styles.cardTitle}>Your video</p>
            </div>

            {/* YouTube Results */}
            {results.map((video, idx) => (
              <a 
                key={idx} 
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.thumbnailCard}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <img src={video.thumbnail} alt={video.title} />
                <p className={styles.cardTitle}>{video.title}</p>
                <p className={styles.cardChannel}>{video.channel}</p>
              </a>
            ))}
          </div>

          <p className={styles.youtubeBranding}>
            Results powered by <strong>YouTube</strong>. Click any thumbnail to watch the video.
          </p>

          <div className={styles.ctaSection}>
            <button 
              className={styles.ctaButton}
              onClick={() => {
                setCurrentStep('search');
                setSearchQuery('');
                setResults([]);
              }}
            >
              Try Another Search
            </button>

            <button 
              className={styles.upgradeButton}
              onClick={() => setCurrentStep('upgrade')}
            >
              Unlock Pro Features
            </button>
          </div>

          <button 
            className={styles.secondaryButton}
            onClick={() => {
              setThumbnail(null);
              setCurrentStep('landing');
              setSearchQuery('');
              setResults([]);
            }}
          >
            Start Over
          </button>
        </div>
      </div>
      </>
    );
  }

  // Upgrade Page
  if (currentStep === 'upgrade') {
    return (
      <>
        <Head>
          <title>Upgrade to Pro - ThumbCheck</title>
        </Head>
        <div className={styles.container}>
        <div className={styles.upgradeModal}>
          <h2>Unlock Pro</h2>

          <div className={styles.upgradeFeatures}>
            <div className={styles.feature}>
              <span>✓</span> Unlimited searches
            </div>
            <div className={styles.feature}>
              <span>✓</span> A/B testing (compare 2-3 thumbnails)
            </div>
            <div className={styles.feature}>
              <span>✓</span> Color contrast analysis
            </div>
            <div className={styles.feature}>
              <span>✓</span> Competitor thumbnail library
            </div>
          </div>

          <div className={styles.upgradePrice}>
            <p className={styles.price}>$9<span>/month</span></p>
          </div>

          <button 
            className={styles.ctaButton}
            onClick={() => {
              const email = prompt('Enter your email to join the Pro waitlist:');
              if (email && email.includes('@')) {
                fetch('/api/waitlist', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email }),
                })
                  .then(() => alert('Thanks! You\'re on the Pro waitlist.'))
                  .catch(() => alert('Error. Try again.'));
              }
            }}
          >
            Join the Pro Waitlist
          </button>

          <button 
            className={styles.secondaryButton}
            onClick={() => setCurrentStep('results')}
          >
            Maybe Later
          </button>
        </div>
      </div>
      </>
    );
  }
}
