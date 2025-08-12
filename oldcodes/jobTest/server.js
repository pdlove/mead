const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./jobs.db');
// Job system
const { registerJob, startJob, getRunningJobs, getJob, getRegisteredJobs } = require('./jobs/job-runner');
const SwitchDiscoveryJob = require('./jobs/switch-discovery');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// 🔧 Register job types here
registerJob('SwitchDiscovery', SwitchDiscoveryJob);

// 📡 REST Endpoints

// List all registered job types
app.get('/api/jobs/registered', (req, res) => {
  res.json(getRegisteredJobs());
});

// Start a new job
app.post('/api/jobs/start', (req, res) => {
  const { name, params } = req.body;
  try {
    const job = startJob(name, params);
    res.json({ jobId: job.id });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// List all running jobs
app.get('/api/jobs/running', (req, res) => {
  const jobs = getRunningJobs().map(job => ({
    id: job.id,
    name: job.name,
    status: job.status,
    created: job.created,
    progress: job.progress,
    params: job.params,
  }));
  res.json(jobs);
});

// Get a specific job's metadata
app.get('/api/jobs/:id', (req, res) => {
  const job = getJob(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });

  res.json({
    id: job.id,
    name: job.name,
    status: job.status,
    created: job.created,
    progress: job.progress,
    params: job.params,
  });
});

// Pause or cancel
app.post('/api/jobs/:id/:action', (req, res) => {
    const job = getJob(req.params.id);
    const action = req.params.action;
  
    if (!job) return res.status(404).json({ error: 'Job not found' });
  
    if (action === 'pause' && job.supportsPause()) {
      job.pause();
      return res.json({ message: 'Paused' });
    }
  
    if (action === 'cancel' && job.supportsCancel()) {
      job.cancel();
      return res.json({ message: 'Canceled' });
    }
  
    return res.status(400).json({ error: 'Action not supported or invalid' });
  });
  
  // Get historical logs
  app.get('/api/jobs/:id/logs', (req, res) => {
    db.all(`SELECT * FROM job_logs WHERE job_id = ? ORDER BY timestamp ASC`, [req.params.id], (err, rows) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(rows);
    });
  });
  
  // Get all past jobs
  app.get('/api/jobs/history', (req, res) => {
    db.all(`SELECT * FROM jobs ORDER BY created DESC LIMIT 100`, (err, rows) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(rows);
    });
  });
  

// 🧵 WebSocket for job updates
wss.on('connection', ws => {
  ws.on('message', msg => {
    let data;
    try {
      data = JSON.parse(msg);
    } catch (e) {
      return;
    }

    const job = getJob(data.jobId);
    if (!job) {
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid job ID' }));
      return;
    }

    // Bind event listeners to stream updates
    const send = (update) => ws.readyState === 1 && ws.send(JSON.stringify(update));
    const forward = (type) => (payload) => send({ type, ...payload });

    job.on('update', forward('progress'));
    job.on('log', forward('log'));
    job.on('step', forward('step'));
    job.on('done', () => send({ type: 'done' }));
    job.on('error', err => send({ type: 'error', message: err.message }));
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Job server running on http://localhost:${PORT}`);
});
