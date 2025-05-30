# Agent Dashboard

This repository includes a minimal dashboard for monitoring the crypto trading agent. It reads execution and error logs from Supabase and provides a simple interface to review recent activity.

## Requirements
* A Supabase project with `execution_logs` and `error_logs` tables.
* A static file server (any tool that can serve HTML files such as `npx serve` or `python3 -m http.server`).

## Setup
1. Clone this repository.
2. Copy `.env.example` to `.env` and fill in your Supabase credentials (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`).
3. Serve the `dashboard` folder using a static server:
   ```bash
   npx serve -s dashboard
   # or
   python3 -m http.server --directory dashboard
   ```
4. Visit the printed local URL and open `index.html`.

### Alternate configuration
If you are not using a build tool that injects environment variables (e.g. Vite), create a file `dashboard/env.js` with the following content:

```javascript
window.SUPABASE_URL = 'https://your-project.supabase.co';
window.SUPABASE_ANON_KEY = 'public-anon-key';
```

This script is loaded automatically by `index.html` and will be used by `supabaseClient.js`.

## File Overview
- `dashboard/index.html` – main HTML page that loads React, Chart.js and the app.
- `dashboard/app.js` – fetches logs from Supabase, updates every 30s and renders a chart of execution actions.
- `dashboard/style.css` – basic styling.
- `dashboard/supabaseClient.js` – creates the Supabase client. Reads credentials from environment variables or globals.
- `.env.example` – copy to `.env` and fill in with your Supabase credentials.

## Expected Schema
The dashboard expects the following minimal columns:

### `execution_logs`
- `timestamp` – ISO string or timestamp of the execution.
- `action` – buy/sell/rebalance or other action.
- `symbol` – asset symbol traded.
- `details` – additional JSON or text describing the operation.

### `error_logs`
- `timestamp` – when the error occurred.
- `message` – error message text.

## Development
You can also run the dashboard using Vite for automatic environment injection:

```bash
cd dashboard
npm install
npx vite
```

The app will be available at the printed local address and reload on changes.
