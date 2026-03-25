import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charset="utf-8" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta property="og:title" content="ThumbCheck - YouTube Thumbnail Previewer" />
        <meta property="og:description" content="Upload your YouTube thumbnail and see if it stands out in search results. Get instant visual feedback before you go live." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yt-thumbnail-mvp.vercel.app" />
        <meta property="og:image" content="https://yt-thumbnail-mvp.vercel.app/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ThumbCheck - YouTube Thumbnail Previewer" />
        <meta name="twitter:description" content="See if your thumbnail stands out before you go live." />
        <meta name="twitter:image" content="https://yt-thumbnail-mvp.vercel.app/og-image.png" />
        <link rel="canonical" href="https://yt-thumbnail-mvp.vercel.app" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
