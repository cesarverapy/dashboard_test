# Dashboard

This repository includes a simple dashboard for monitoring the crypto agent's activity.

## Prerequisites

- Node.js environment capable of serving static files (e.g. using `npx serve` or `python -m http.server`)
- A Supabase project containing `execution_logs` and `error_logs` tables

## Setup

1. Copy `dashboard/env.example.js` to `dashboard/env.js` and fill in your Supabase credentials.
2. (Optional) Create a `.env` file at the project root if you plan to use a bundler that injects environment variables.
3. Install Python dependencies (required for optional scripts) using:
   ```bash
   pip install -r requirements.txt
   ```
4. Serve the contents of the `dashboard` folder:
   ```bash
   npx serve dashboard
   ```
   or using Python:
   ```bash
   python -m http.server --directory dashboard
   ```
5. Open `http://localhost:3000` (or the port shown) in your browser.
6. Run the basic checks to verify your environment:
   ```bash
   npm test
   pytest -q
   ```

The dashboard fetches logs every 30 seconds and displays charts of recent activity.

### File overview

- `dashboard/index.html` – entry point loading React and Chart.js
- `dashboard/app.js` – main application logic for fetching data and rendering charts
- `dashboard/supabaseClient.js` – Supabase client configured via environment variables or global variables

The expected schema for logs is minimal:

`execution_logs` should include at least `timestamp`, `action`, `symbol` and a `details` field.

`error_logs` should include `timestamp` and `message` fields.