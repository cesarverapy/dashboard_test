# Agent Dashboard

This project contains a simple dashboard that visualises logs from the agent stored in Supabase.

## Setup

1. Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
# edit .env with your values
```

`dashboard/supabaseClient.js` reads the variables `VITE_SUPABASE_URL` and
`VITE_SUPABASE_ANON_KEY` when bundled with a tool like Vite. If no bundler is
used you can define `window.SUPABASE_URL` and `window.SUPABASE_ANON_KEY` in a
script before loading `app.js`.

2. Serve the dashboard directory using any static server:

```bash
npx serve dashboard
# or
python3 -m http.server 8080 -d dashboard
```

Then open `http://localhost:8080` (or the port you chose) in your browser.

## Features

- Lists the 50 most recent executions and errors
- Automatically refreshes data every 30 seconds
- Charts execution volume by action and error counts over time using Chart.js

The dashboard expects two tables in Supabase: `execution_logs` and `error_logs`.
Each should contain a `timestamp` column. Executions benefit from fields like
`action`, `symbol`, or `details`, while errors should include a descriptive
`message`.
