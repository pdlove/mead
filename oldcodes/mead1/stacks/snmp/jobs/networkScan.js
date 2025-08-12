const ping = require('ping');
const os = require('os');

// Helper to expand IP range (only works on same subnet)
function expandRange(range) {
  const [start, end] = range.split('-');
  const startParts = start.split('.').map(Number);
  const endParts = end.includes('.') ? end.split('.').map(Number) : startParts.slice(0, 3).concat(Number(end));

  const ips = [];
  for (
    let i = startParts[3];
    i <= endParts[3];
    i++
  ) {
    ips.push(`${startParts[0]}.${startParts[1]}.${startParts[2]}.${i}`);
  }
  return ips;
}

// Ping an IP with up to 3 retries
async function pingWithRetries(ip, retries = 3) {
  for (let i = 0; i < retries; i++) {
    const res = await ping.promise.probe(ip, {
      timeout: 2,
      extra: ['-c', '1'], // only one ping per attempt
    });

    if (res.alive) {
      return parseFloat(res.time); // ms
    }
  }
  return null;
}

// Ping many IPs concurrently in batches
async function scanIPRange(range) {
  const ips = expandRange(range);
  const results = {};
  const concurrency = 20;

  for (let i = 0; i < ips.length; i += concurrency) {
    const batch = ips.slice(i, i + concurrency);
    const pings = batch.map(async ip => {
      const latency = await pingWithRetries(ip);
      results[ip] = latency;
    });

    await Promise.all(pings);
  }

  return results;
}

// Example usage
(async () => {
  const results = await scanIPRange('192.168.1.1-192.168.1.40');
  console.log(results);
})();
