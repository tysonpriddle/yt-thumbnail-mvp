# YouTube Thumbnail Preview Tool MVP

Upload your YouTube thumbnail and see how it compares to real search results.

## Features
- Upload custom thumbnail images
- Search YouTube for any topic
- Preview your thumbnail alongside real results
- Freemium model ($9/month Pro tier)

## Tech Stack
- Next.js (React)
- YouTube Data API v3
- Vercel hosting

## Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

## Deployment to Vercel

1. Push to GitHub
2. Connect repo to Vercel
3. Set `YOUTUBE_API_KEY` environment variable in Vercel dashboard
4. Deploy

## Environment Variables

Required:
- `YOUTUBE_API_KEY`: YouTube Data API key

Get one at: https://console.developers.google.com/

## API Limits (Free Tier)

- YouTube API: 10,000 requests/day (shared quota)
- MVP limits user to 5 searches/day
- Pro tier: Unlimited

## Next Steps

- Add A/B testing (compare 2-3 thumbnails)
- Color contrast analysis
- Stripe payment integration
- User accounts & history
- Competitor thumbnail library
