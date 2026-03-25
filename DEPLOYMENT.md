# Deployment to Vercel

## Quick Start

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd /sandbox/yt-thumbnail-mvp
   vercel
   ```

3. **Set Environment Variable**
   - During deploy, Vercel will ask for environment variables
   - Add `YOUTUBE_API_KEY=AIzaSyBQ5RhyCf5j8PNEqJR_KQGR-p_L8Z9Nv3w`

4. **Done**
   - Your app is live at the provided URL
   - Free tier includes serverless functions

## Manual Setup (GitHub + Vercel Web)

1. Push project to GitHub
2. Go to https://vercel.com/import
3. Import the repository
4. Set environment variables in project settings
5. Deploy automatically on each push

## Cost

- **Free tier**: 100 GB bandwidth/month, 6,000 Function invocations/month
- Should be enough for MVP testing
- YouTube API is free (10,000 requests/day quota shared)

## Troubleshooting

If deployment fails:
- Check Node version matches (14+)
- Verify .env.local is in .gitignore
- Ensure all dependencies in package.json
- Check build logs in Vercel dashboard

## Next Steps After Deployment

1. Test the live version
2. Add Stripe for payments ($9/month Pro)
3. Add user authentication
4. Track usage (searches per day)
5. Build comparison feature (A/B testing)
