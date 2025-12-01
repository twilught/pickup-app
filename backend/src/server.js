const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Demo services data for dashboard
app.get('/services', (req, res) => {
  const services = [
    {
      name: 'Frontend',
      key: 'frontend',
      status: 'running',
      port: 3000,
      description: 'Nginx serving static dashboard UI',
      lastDeploy: new Date().toISOString()
    },
    {
      name: 'API',
      key: 'api',
      status: 'running',
      port: parseInt(port, 10),
      description: 'Node.js Express API',
      lastDeploy: new Date().toISOString()
    },
    {
      name: 'Database',
      key: 'db',
      status: 'running',
      port: 5432,
      description: 'PostgreSQL instance',
      lastDeploy: new Date().toISOString()
    },
    {
      name: 'Jenkins',
      key: 'jenkins',
      status: 'running',
      port: 8080,
      description: 'CI/CD server (outside this compose file)',
      lastDeploy: null
    }
  ];

  res.json({ services });
});

// Example users route (demo)
app.get('/users', (req, res) => {
  res.json({
    users: [
      { id: 1, name: 'Alice', role: 'Admin' },
      { id: 2, name: 'Bob', role: 'User' },
      { id: 3, name: 'Charlie', role: 'DevOps' }
    ]
  });
});

app.listen(port, () => {
  console.log(`API on ${port}`);
});
