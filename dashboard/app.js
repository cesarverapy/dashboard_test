import { supabase } from './supabaseClient.js';
const { useState, useEffect, useRef } = React;

function Dashboard() {
  const [errors, setErrors] = useState([]);
  const [executions, setExecutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const execChartRef = useRef(null);
  const errorChartRef = useRef(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  async function fetchData() {
    const { data: errorData } = await supabase
      .from('error_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(50);

    const { data: execData } = await supabase
      .from('execution_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(50);

    const errorsList = errorData ?? [];
    const executionsList = execData ?? [];
    setErrors(errorsList);
    setExecutions(executionsList);
    setLoading(false);
    updateCharts(errorsList, executionsList);
  }

  function updateCharts(errorsList, executionsList) {
    // Execution chart: counts per action (buy/sell)
    const actionCounts = executionsList.reduce((acc, e) => {
      if (e.action) {
        acc[e.action] = (acc[e.action] || 0) + 1;
      }
      return acc;
    }, {});
    const actions = Object.keys(actionCounts);
    const actionValues = Object.values(actionCounts);

    if (execChartRef.current) {
      execChartRef.current.destroy();
    }
    const ctx1 = document.getElementById('executionChart').getContext('2d');
    execChartRef.current = new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: actions,
        datasets: [{ label: 'Executions', data: actionValues, backgroundColor: '#60a5fa' }]
      }
    });

    // Error chart: count per day
    const errorCounts = errorsList.reduce((acc, e) => {
      const day = e.timestamp ? e.timestamp.slice(0, 10) : 'unknown';
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});
    const days = Object.keys(errorCounts);
    const dayValues = Object.values(errorCounts);

    if (errorChartRef.current) {
      errorChartRef.current.destroy();
    }
    const ctx2 = document.getElementById('errorChart').getContext('2d');
    errorChartRef.current = new Chart(ctx2, {
      type: 'line',
      data: {
        labels: days,
        datasets: [{ label: 'Errors', data: dayValues, borderColor: '#f87171', fill: false }]
      }
    });
  }

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
    ),
    React.createElement(
      'section',
      null,
      React.createElement('h2', null, 'Execution Summary'),
      React.createElement('canvas', { id: 'executionChart' })
    ),
    React.createElement(
      'section',
      null,
      React.createElement('h2', null, 'Error Trend'),
      React.createElement('canvas', { id: 'errorChart' })
    )
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(Dashboard));
