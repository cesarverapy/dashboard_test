# Agent Dashboard

This project includes a lightweight dashboard located in the `dashboard` folder.
It displays recent entries from the `error_logs`, `execution_logs`, and
`executed_trades` tables stored in Supabase. Aggregate charts show error counts
and trade volume over time.

## Setup

1. Copy `.env.example` to `.env` and fill in your Supabase credentials.
   These variables are read in `dashboard/supabaseClient.js` via
   `import.meta.env` when using a bundler such as Vite. If you are serving the
   files directly, you can provide the credentials using global variables
   `SUPABASE_URL` and `SUPABASE_ANON_KEY` in a script tag.

2. Serve the `dashboard` directory. Any static HTTP server works. For example:

   ```bash
   npx serve dashboard
   ```

   or using Python:

   ```bash
   cd dashboard
   python3 -m http.server 8080
   ```

3. Open the served `index.html` in your browser. The dashboard will connect to
   Supabase and display recent logs.

## Expected Data Schema

The dashboard expects three tables in Supabase:

- **error_logs** – should contain at least `timestamp` and `message` columns.
- **execution_logs** – should contain `timestamp`, `action`, `symbol`, and
  `details` columns describing each agent decision.
- **executed_trades** – should contain `timestamp` and `trade_amount` columns for
  aggregating trade volume.

## Development

The dashboard uses plain React from a CDN. Auto-refresh and charting features
are implemented in `dashboard/app.js`.
