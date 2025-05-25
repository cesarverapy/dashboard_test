import { supabase } from './supabaseClient.js';
const { useState, useEffect, useRef } = React;

function Dashboard() {
  const [errors, setErrors] = useState([]);
  const [executions, setExecutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
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
    fetchData();
    const id = setInterval(fetchData, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    const counts = {};
    errors.forEach((err) => {
      const day = err.timestamp.split('T')[0];
      counts[day] = (counts[day] || 0) + 1;
    });
    const labels = Object.keys(counts).sort();
    const data = labels.map((d) => counts[d]);

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Errors per day',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 1,
            data,
          },
        ],
      },
      options: {
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  }, [errors]);

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
      React.createElement('h2', null, 'Error Chart'),
      React.createElement('canvas', { ref: chartRef })
    )
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(Dashboard));
