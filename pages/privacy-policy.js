export default function PrivacyPolicy() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif', lineHeight: '1.6' }}>
      <h1>Privacy Policy</h1>
      <p><strong>Effective Date:</strong> March 2026</p>

      <h2>What We Collect</h2>
      <p>When you use ytthumb.app, we collect:</p>
      <ul>
        <li><strong>Images:</strong> Thumbnail images you upload are processed in memory only and never stored.</li>
        <li><strong>Search queries:</strong> The text you search (e.g., "React tutorial") is sent to YouTube's API to fetch results.</li>
        <li><strong>IP address:</strong> Your IP is logged by Vercel (our hosting provider) and used for rate limiting to prevent abuse.</li>
      </ul>

      <h2>How We Use This Data</h2>
      <ul>
        <li>Uploaded images: Processed only to generate the preview, then discarded.</li>
        <li>Search queries: Sent to YouTube to fetch search results. Cached locally for 24 hours to reduce API calls.</li>
        <li>IP address: Used only for rate limiting (5 searches/minute per IP).</li>
      </ul>

      <h2>Who Sees Your Data</h2>
      <ul>
        <li><strong>YouTube:</strong> Search queries are sent to Google's YouTube API as part of the search.</li>
        <li><strong>Vercel:</strong> Hosting provider. Can view server logs including IP, queries, and basic request data.</li>
        <li><strong>Us:</strong> We do not store or view your data unless you voluntarily join the Pro waitlist (email only).</li>
      </ul>

      <h2>Data Retention</h2>
      <ul>
        <li>Uploaded images: Deleted immediately after processing.</li>
        <li>Search queries: Cached for 24 hours, then deleted.</li>
        <li>IP logs: Retained by Vercel per their standard policy (typically 30 days).</li>
        <li>Waitlist emails: Retained until you unsubscribe.</li>
      </ul>

      <h2>Your Rights</h2>
      <p>You can:</p>
      <ul>
        <li>Request deletion of your email from the waitlist by emailing us.</li>
        <li>Review our data handling at any time by contacting us.</li>
      </ul>

      <h2>Contact</h2>
      <p>Questions about this privacy policy? Email: <strong>jeff@ytthumb.app</strong></p>

      <p style={{ marginTop: '40px', color: '#666', fontSize: '0.9em' }}>This policy applies to Australian Privacy Act, GDPR, and CCPA principles.</p>
    </div>
  );
}
