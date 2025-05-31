import { supabase } from './supabaseClient.js';
const { useState, useEffect, useRef } = React;

function Dashboard() {
  const [errors, setErrors] = useState([]);
  const [executions, setExecutions] = useState([]);
  const [trades, setTrades] = useState([]);
  const [logs, setLogs] = useState([]);
  const [portfolio, setPortfolio] = useState({});
  const [profitSeries, setProfitSeries] = useState([]);
  const [strategyStats, setStrategyStats] = useState({});
  const [winLoss, setWinLoss] = useState({ wins: 0, losses: 0 });
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const profitRef = useRef(null);
  const profitInstance = useRef(null);

  async function fetchData() {
    const { data: errorData } = await supabase
      .from('workflow_errors')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(20);

    const { data: execData } = await supabase
      .from('execution_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(50);

    const { data: tradeData } = await supabase
      .from('executed_trades')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(50);

    const { data: logData } = await supabase
      .from('agent_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(20);

    setErrors(errorData ?? []);
    setExecutions(execData ?? []);
    setTrades(tradeData ?? []);
    setLogs(logData ?? []);

    computeStats(tradeData ?? []);
    setLoading(false);
  }

  function computeStats(tradeRows) {
    const sorted = [...tradeRows].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const positions = {};
    const strat = {};
    const series = [];
    let wins = 0;
    let losses = 0;
    let running = 0;
    for (const t of sorted) {
      const qty = Number(t.quantity) || 0;
      const price = Number(t.price) || 0;
      positions[t.symbol] = positions[t.symbol] || { qty: 0, avg: 0 };
      if (t.side === 'BUY') {
        const p = positions[t.symbol];
        const cost = p.avg * p.qty + price * qty;
        p.qty += qty;
        p.avg = p.qty ? cost / p.qty : 0;
      } else if (t.side === 'SELL') {
        const p = positions[t.symbol];
        const pnl = (price - p.avg) * qty;
        running += pnl;
        if (pnl >= 0) wins++; else losses++;
        p.qty -= qty;
        strat[t.strategy] = (strat[t.strategy] || 0) + pnl;
        series.push({ time: t.timestamp, profit: running });
      }
    }
    const port = {};
    for (const [sym, p] of Object.entries(positions)) {
      if (p.qty) port[sym] = p.qty;
    }
    setPortfolio(port);
    setProfitSeries(series);
    setStrategyStats(strat);
    setWinLoss({ wins, losses });
  }

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;
    const counts = executions.reduce((acc, e) => {
      acc[e.action] = (acc[e.action] || 0) + 1;
      return acc;
    }, {});
    const labels = Object.keys(counts);
    const data = Object.values(counts);
    if (chartInstance.current) chartInstance.current.destroy();
    chartInstance.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Executions',
            data,
            backgroundColor: '#666',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
      },
    });
  }, [executions]);

  useEffect(() => {
    if (!profitRef.current) return;
    const labels = profitSeries.map(p => new Date(p.time).toLocaleString());
    const data = profitSeries.map(p => p.profit);
    if (profitInstance.current) profitInstance.current.destroy();
    profitInstance.current = new Chart(profitRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'Profit', data, borderColor: '#555', backgroundColor: 'rgba(0,0,0,0)' }
        ],
      },
      options: { responsive: true, plugins: { legend: { display: false } } },
    });
  }, [profitSeries]);

  if (loading) {
    return React.createElement('div', { className: 'loading' }, 'Loading...');
  }

  return React.createElement(
    'div',
    { className: 'dashboard' },
    React.createElement('h1', null, 'Agent Dashboard'),
    React.createElement(
      'section',
      null,
      React.createElement('h2', null, 'Execution Summary'),
      React.createElement('canvas', { ref: chartRef, id: 'execChart' })
    ),
    React.createElement(
      'section',
      null,
      React.createElement('h2', null, 'Performance'),
      React.createElement(
        'p',
        null,
        `Wins: ${winLoss.wins} Losses: ${winLoss.losses}`
      ),
      React.createElement('canvas', { ref: profitRef, id: 'profitChart' })
    ),
    React.createElement(
      'section',
      null,
      React.createElement('h2', null, 'Portfolio Overview'),
      React.createElement(
        'table',
        null,
        React.createElement(
          'thead',
          null,
          React.createElement(
            'tr',
            null,
            React.createElement('th', null, 'Symbol'),
            React.createElement('th', null, 'Quantity')
          )
        ),
        React.createElement(
          'tbody',
          null,
          Object.entries(portfolio).map(([sym, qty]) =>
            React.createElement(
              'tr',
              { key: sym },
              React.createElement('td', null, sym),
              React.createElement('td', null, qty)
            )
          )
        )
      )
    ),
    React.createElement(
      'section',
      null,
      React.createElement('h2', null, 'Recent Executions'),
      React.createElement(
        'table',
        null,
        React.createElement(
          'thead',
          null,
          React.createElement(
            'tr',
            null,
            React.createElement('th', null, 'Timestamp'),
            React.createElement('th', null, 'Action'),
            React.createElement('th', null, 'Symbol'),
            React.createElement('th', null, 'Details')
          )
        ),
        React.createElement(
          'tbody',
          null,
          executions.map((exec, index) =>
            React.createElement(
              'tr',
              { key: index },
              React.createElement('td', null, exec.timestamp),
              React.createElement('td', null, exec.action),
              React.createElement('td', null, exec.symbol),
              React.createElement('td', null, exec.details)
            )
          )
        )
      )
    ),
    React.createElement(
      'section',
      null,
      React.createElement('h2', null, 'Latest Trades'),
      React.createElement(
        'table',
        null,
        React.createElement(
          'thead',
          null,
          React.createElement(
            'tr',
            null,
            React.createElement('th', null, 'Timestamp'),
            React.createElement('th', null, 'Side'),
            React.createElement('th', null, 'Symbol'),
            React.createElement('th', null, 'Price'),
            React.createElement('th', null, 'Qty'),
            React.createElement('th', null, 'Strategy')
          )
        ),
        React.createElement(
          'tbody',
          null,
          trades.map((t, idx) =>
            React.createElement(
              'tr',
              { key: idx },
              React.createElement('td', null, t.timestamp),
              React.createElement('td', null, t.side),
              React.createElement('td', null, t.symbol),
              React.createElement('td', null, t.price),
              React.createElement('td', null, t.quantity),
              React.createElement('td', null, t.strategy)
            )
          )
        )
      )
    ),
    React.createElement(
      'section',
      null,
      React.createElement('h2', null, 'Agent Reasoning Logs'),
      React.createElement(
        'ul',
        null,
        logs.map((l, idx) =>
          React.createElement(
            'li',
            { key: idx },
            React.createElement('span', { className: 'error-time' }, l.timestamp),
            React.createElement('span', null, ` ${l.reasoning || ''}`)
          )
        )
      )
    ),
    React.createElement(
      'section',
      null,
      React.createElement('h2', null, 'Strategy Effectiveness'),
      React.createElement(
        'table',
        null,
        React.createElement(
          'thead',
          null,
          React.createElement(
            'tr',
            null,
            React.createElement('th', null, 'Strategy'),
            React.createElement('th', null, 'Profit')
          )
        ),
        React.createElement(
          'tbody',
          null,
          Object.entries(strategyStats).map(([s, p]) =>
            React.createElement(
              'tr',
              { key: s },
              React.createElement('td', null, s),
              React.createElement('td', null, p.toFixed(2))
            )
          )
        )
      )
    ),
    React.createElement(
      'section',
      null,
      React.createElement('h2', null, 'Recent Errors'),
      React.createElement(
        'ul',
        null,
        errors.map((err, index) =>
          React.createElement(
            'li',
            { key: index },
            React.createElement('span', { className: 'error-time' }, err.timestamp),
            React.createElement('span', { className: 'error-message' }, err.message)
          )
        )
      )

    )
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(Dashboard));
