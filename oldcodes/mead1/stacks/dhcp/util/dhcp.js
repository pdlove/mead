const fs = require('fs');
const path = require('path');

const dgram = require('dgram');
const server = dgram.createSocket('udp4');

const dhcpPacket = require('./dhcpPacket')

// DHCP constants
const DHCP_MAGIC_COOKIE = Buffer.from([99, 130, 83, 99]);

const DHCPDISCOVER = 1;
const DHCPOFFER = 2;
const DHCPREQUEST = 3;
const DHCPDECLINE = 4;
const DHCPACK = 5;
const DHCPNAK = 6;
const DHCPRELEASE = 7;
const DHCPINFORM = 8;

server.on('listening', () => {
  const address = server.address();
  console.log(`DHCP server listening on ${address.address}:${address.port}`);
});

server.on('message', (msg, rinfo) => {
  try {
    const parsed = new dhcpPacket({ buffer: msg});
    console.log('DHCP Packet:', parsed);
    fs.appendFile("DHCP.json", JSON.stringify(parsed)+',\n', (err) => {
      if (err) console.error('Error appending to file:', err);      
    });
  } catch (err) {
    console.error('Failed to parse DHCP packet:', err.message);
  }
});


server.bind(67, '0.0.0.0', () => {
  server.setBroadcast(true);
});



function parseDhcpPacket(buf) {
  
  return packet;
}




function buildDhcpoffer(request, xid, macAddr) {
  const buf = Buffer.alloc(300);
  buf.writeUInt8(2, 0); // op = BOOTREPLY
  buf.writeUInt8(1, 1); // htype = Ethernet
  buf.writeUInt8(6, 2); // hlen = MAC length
  buf.writeUInt8(0, 3); // hops
  buf.writeUInt32BE(xid, 4); // xid from request
  buf.writeUInt16BE(0, 8); // secs
  buf.writeUInt16BE(0x8000, 10); // flags (broadcast)
  buf.writeUInt32BE(0, 12); // ciaddr
  buf.writeUInt32BE(ip2int('192.168.1.100'), 16); // yiaddr (your IP)
  buf.writeUInt32BE(ip2int('192.168.1.1'), 20); // siaddr (server IP)
  buf.writeUInt32BE(0, 24); // giaddr

  // chaddr (client MAC)
  const macParts = macAddr.split(':').map(p => parseInt(p, 16));
  macParts.forEach((v, i) => buf.writeUInt8(v, 28 + i));

  DHCP_MAGIC_COOKIE.copy(buf, 236);

  let optIndex = 240;
  buf.writeUInt8(53, optIndex++); // DHCP message type
  buf.writeUInt8(1, optIndex++);  // length
  buf.writeUInt8(DHCPOFFER, optIndex++); // offer

  buf.writeUInt8(1, optIndex++); // subnet mask
  buf.writeUInt8(4, optIndex++);
  [255, 255, 255, 0].forEach(b => buf.writeUInt8(b, optIndex++));

  buf.writeUInt8(3, optIndex++); // router
  buf.writeUInt8(4, optIndex++);
  [192, 168, 1, 1].forEach(b => buf.writeUInt8(b, optIndex++));

  buf.writeUInt8(6, optIndex++); // DNS
  buf.writeUInt8(4, optIndex++);
  [8, 8, 8, 8].forEach(b => buf.writeUInt8(b, optIndex++));

  buf.writeUInt8(51, optIndex++); // lease time
  buf.writeUInt8(4, optIndex++);
  buf.writeUInt32BE(86400, optIndex); optIndex += 4;

  buf.writeUInt8(54, optIndex++); // server identifier
  buf.writeUInt8(4, optIndex++);
  [192, 168, 1, 1].forEach(b => buf.writeUInt8(b, optIndex++));

  buf.writeUInt8(255, optIndex++); // end option

  return buf.slice(0, optIndex);
}

function ip2int(ip) {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0);
}
