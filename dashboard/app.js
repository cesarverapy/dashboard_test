import { supabase } from './supabaseClient.js';
const { useState, useEffect, useRef } = React;

function Dashboard() {
  const [errors, setErrors] = useState([]);
  const [executions, setExecutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

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

    setErrors(errorData ?? []);
    setExecutions(execData ?? []);
    setLoading(false);
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
            backgroundColor: '#3b82f6',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
      },
    });
  }, [executions]);

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

    )
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(Dashboard));
