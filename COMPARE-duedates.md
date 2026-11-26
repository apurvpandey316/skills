# Due dates and reminders

1. **In-app only:** store an optional UTC due timestamp and show overdue/upcoming items on load. Simple and cheap, but no reminder when the app is closed.
2. **Server worker with email:** persist due time, recipient and reminder schedule; a worker claims due jobs and sends through an email provider. Works while closed, but needs provider, credentials, retries, monitoring and explicit consent.
3. **Browser notifications:** schedule notifications while the app is active or use service worker push with a server. Native feel, but permissions, browser support and push infrastructure complicate reliability.

Recommend starting with option 1 for visible due dates, then option 2 when delivery is required. Store UTC instants and render in the user's timezone; clarify date-only semantics separately. For email, use a durable job table with unique occurrence keys, claim/lease, retries and idempotent sending where provider support permits; record failures, opt-in and unsubscribe. Test timezone/DST, edits, deletion, duplicate workers and outages. Option 1 is not an out-of-app reminder and should be labelled accordingly.
