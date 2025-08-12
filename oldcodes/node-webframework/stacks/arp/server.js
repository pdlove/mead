import express from 'express';
import { listInterfaces, startScan, getResults } from './arp-scan.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());
// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/interfaces', (req, res) => {
  const interfaces = listInterfaces();
  res.json(interfaces);
});

app.post('/scan', (req, res) => {
  const { iface, cidr, rate, timeout, clear } = req.body;
  if (!iface || !cidr) {
    return res.status(400).send('Missing parameters');
  }
  try {
    startScan({ iface, cidr, rate, timeout, clear });
    res.status(200).send('Scan started');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/results', (req, res) => {
  const results = getResults();
  res.json(results);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
