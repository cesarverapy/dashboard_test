# Dashboard

This repository includes a simple dashboard for monitoring the crypto agent's activity.

## Prerequisites

- Node.js environment capable of serving static files (e.g. using `npx serve` or `python -m http.server`)
- A Supabase project containing `execution_logs`, `executed_trades`, `agent_logs`, and `workflow_errors` tables
- The repository includes an `n8n` workflow export named `pre1_7 (2).json`. Use the **Import from File** option in n8n to load it, configure your Supabase credentials and run the workflow once to populate the tables with sample data.

## Setup

1. Copy `dashboard/env.example.js` to `dashboard/env.js` and fill in your Supabase credentials.
2. (Optional) Create a `.env` file at the project root if you plan to use a bundler that injects environment variables.
3. Install Python dependencies (required for optional scripts) using:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the test suite to verify everything is set up correctly:
   ```bash
   pytest -q
   npm test
   ```
5. Serve the contents of the `dashboard` folder:
   ```bash
   npx serve dashboard
   ```
   or using Python:
   ```bash
   python -m http.server --directory dashboard
   ```
6. Open `http://localhost:3000` (or the port shown) in your browser.

The dashboard fetches logs every 30 seconds and displays charts of recent activity.

### File overview

- `dashboard/index.html` – entry point loading React and Chart.js
- `dashboard/app.js` – main application logic for fetching data and rendering charts
- `dashboard/supabaseClient.js` – Supabase client configured via environment variables or global variables

The expected schema for logs is minimal:

- **`execution_logs`** – actions taken by the agent. These power the "Execution Summary" chart and the "Recent Executions" table. Each row should contain at least `timestamp`, `action`, `symbol` and a `details` field.
- **`executed_trades`** – every trade executed by the agent. The dashboard uses this table for the portfolio overview, the latest trades table, the profit chart and strategy effectiveness stats. Required fields include `timestamp`, `side`, `symbol`, `price` and `quantity`.
- **`agent_logs`** – reasoning or decision logs produced by the agent. Shown in the "Agent Reasoning Logs" list. Include a `timestamp` and text columns such as `reasoning` or `error`.
- **`workflow_errors`** – errors captured from the workflow. Displayed in the "Recent Errors" section. Should have `timestamp` and `message` fields.

## Running tests

Execute the Python and Node checks to ensure the code is valid:

```bash
pytest -q
npm test
```

## Docker

Build the Docker image:
```bash
docker build -t dashboard .
```
Run the container:
```bash
docker run -p 3000:3000 dashboard
```
Then open `http://localhost:3000`.
