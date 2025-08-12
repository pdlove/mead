const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./db/models');
const ping = require('ping');

async function createWindow() {
  await db.init();

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });

  win.loadFile('renderer/index.html');
}

app.whenReady().then(createWindow);

ipcMain.handle('ping-range', async (_event, cidr) => {
  const ips = getIpRange(cidr); // naive implementation
  const results = [];

  for (const ip of ips) {
    const res = await ping.promise.probe(ip);
    results.push({ ip, alive: res.alive });
    await db.Host.create({ ip, alive: res.alive });
  }

  return results;
});

function getIpRange(cidr) {
  // Placeholder: hardcoded sample IPs for demonstration
  return ['192.168.1.1', '192.168.1.2', '192.168.1.3'];
}

async function getNetworkAdapters() {
    //Use cap to get network adapters and addresses assigned to them
    const cap = require('cap');
    const devices = cap.deviceList();
    const test = devices.map(device => ({
        name: device.name,
        description: device.description,
        addresses: device.addresses.map(addr => addr.addr)
    }));
    return test;
}
ipcMain.handle('get-adapters', getNetworkAdapters);
console.log(process.version);
// ipcMain.handle('start-arp-monitor', async (_event, adapterName) => {
//     const cap = require('cap');
//     const device = cap.findDevice(adapterName);
//     if (!device) {
//         throw new Error(`Adapter ${adapterName} not found`);
//     }

//     const c = new cap.Cap();
//     c.open(device, 'arp', true);
    
//     c.on('packet', (rawPacket) => {
//         const packet = cap.decode.packet(rawPacket);
//         // Process ARP packet here
//         console.log('Received ARP packet:', packet);
//     });

//     return `Monitoring ARP packets on ${adapterName}`;
// }