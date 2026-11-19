# Pulse Room: Operations Runbook

## 1. Local Development & Demo Mode
```bash
# 1. Install dependencies
npm ci

# 2. Verify environment boundaries
npm run check-env

# 3. Start development server
npm run dev

# 4. Run full test suite
npm run test
```

## 2. Managing Data Outages
- **USGS / EONET Outage:** The app automatically detects adapter rejection and serves `public/data/snapshot.json`. A *"showing last known data"* badge is displayed. No engineer intervention required.
- **Refreshing Committed Snapshot:**
  Run `npm run build-snapshot` or manually update `public/data/snapshot.json` with recent valid events adhering to `EventSchema`.

## 3. Secret Rotation & CI/CD
- **Server Keys:** Only set in Cloudflare/Vercel host dashboard or GitHub Secrets.
- **Never Prefix Secrets with `VITE_`:** Doing so triggers `scripts/check-env.ts` in CI and halts deployment.
- **Rotation Checklist:**
  1. Revoke existing key on provider console (Groq, Gemini, LiveKit).
  2. Update GitHub Secrets and hosting environment variables.
  3. Trigger redeploy via `nightly-smoke.yml` workflow dispatch.
