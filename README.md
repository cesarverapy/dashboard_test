# Dashboard

This repository includes a simple dashboard for monitoring the crypto agent's activity.

## Prerequisites

- Node.js environment capable of serving static files (e.g. using `npx serve` or `python -m http.server`)
- A Supabase project containing `execution_logs` and `error_logs` tables

## Setup

1. Copy `.env.example` to `.env` and populate `SUPABASE_URL` and `SUPABASE_ANON_KEY` with your project's credentials.
2. Serve the contents of the `dashboard` folder:
   ```bash
   npx serve dashboard
   ```
   or using Python:
   ```bash
   python -m http.server --directory dashboard
   ```
3. Open `http://localhost:3000` (or the port shown) in your browser.

The dashboard fetches logs every 30 seconds and displays charts of recent activity.

### File overview

- `dashboard/index.html` – entry point loading React and Chart.js
- `dashboard/app.js` – main application logic for fetching data and rendering charts
- `dashboard/supabaseClient.js` – Supabase client configured via environment variables or global variables

The expected schema for logs is minimal:

`execution_logs` should include at least `timestamp`, `action`, `symbol` and a `details` field.

`error_logs` should include `timestamp` and `message` fields.