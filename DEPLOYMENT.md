# Client preview and production hosting

The production server now serves the built React PWA, API, uploaded files and
route fallbacks from one origin. This avoids cross-origin configuration and
allows one URL to demonstrate both the public website and `/app` portal.

## Fast temporary client preview

Use this when the client only needs to review the application for a meeting or
short approval window.

1. Copy `.env.example` to `.env`.
2. Replace `JWT_SECRET` with a long random value.
3. Keep `SEED_DEMO_DATA=true` only if the client should see sample records.
4. Run `npm run preview:client`.
5. Confirm `http://127.0.0.1:4174` works locally.
6. In a second terminal, run:

   ```powershell
   cloudflared tunnel --url http://localhost:4174
   ```

7. Send the generated `https://...trycloudflare.com` URL to the client.

The URL works only while both terminal processes and the computer remain on.
Anyone with the URL can reach the preview. Cloudflare Quick Tunnels also
support an email allow-list when a private review is required.

Do not use real customer or financial data in a temporary tunnel. Change the
seeded administrator password before sharing portal access.

## Stable Render deployment

Use this when the client needs a stable URL that remains online.

1. Push the repository to GitHub.
2. Create a Render Blueprint and select this repository. Render will read
   `render.yaml`.
3. Confirm the paid Starter web service and 1 GB persistent disk. SQLite and
   uploaded documents require persistent storage.
4. Deploy the service.
5. Open the assigned `onrender.com` URL and verify `/api/health`, `/`, and
   `/app`.
6. Add `VITE_SITE_URL` with the final public URL and redeploy so canonical and
   social metadata use the deployed domain.
7. Change the seeded administrator password immediately.
8. Set `SEED_DEMO_DATA=false` and clear demonstration data before entering real
   business records.

The disk is mounted at `/opt/render/project/src/data`. The deployment stores
the SQLite database and document uploads below that directory.

## Production checklist

- Connect the final domain and enable HTTPS.
- Use a unique production `JWT_SECRET`.
- Back up the SQLite database and uploads regularly.
- Restrict administrator accounts and rotate the demonstration password.
- Replace SQLite and local uploads with managed database and object storage
  before horizontal scaling or mission-critical use.
- Submit `/sitemap.xml` to Google Search Console after the final domain is live.
