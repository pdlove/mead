const ping = require('ping');
const { Buffer } = require('buffer');
const net = require('net');
const tls = require('tls');

class netscan {
    host="127.0.0.1"
    port="0"
    protocol="TCP"
    timeout=10000
    //protocolName="" //Must Override this.
    
    portOpen = false;
    serverHeader = null;
    serverPublicKey = null;
    serverCertFingerprint = null;
    serverCertIssuer = null;
    serverCertSubject = null;

    additionalData = null;

    constructor(host, port = 80, timeout = 10000, performScan = false) {
        this.host=host;
        this.port=port;
        this.timeout=timeout
        if (performScan) this.scanProtocol();
    }

// Check if a TCP port is open
    static isPortOpen(host, port) {
        return new Promise((resolve) => {
            const socket = new net.Socket();

            socket.setTimeout(2000);
            socket.once('connect', () => {
                socket.destroy();
                resolve(true);
            });
            socket.once('timeout', () => {
                socket.destroy();
                resolve(false);
            });
            socket.once('error', () => {
                resolve(false);
            });

            socket.connect(port, host);
        });
    }
}

class netscan_http extends netscan {
    protocol = "TCP"
    protocolName="HTTP"
    constructor(host, port = 80, timeout = 10000, performScan = false) {
        super(host, port, timeout, performScan);
    }

    async scanProtocol() {
        this.portOpen = await netscan.isPortOpen(this.host, this.port);
        if (this.portOpen) {
            this.serverHeader = await this.getHttpBanner();
        }
        return this.portOpen;
    }

    getHttpBanner() {
        return new Promise(function(resolve, reject){
            const client = net.createConnection({ host: this.host, port: this.port }, () => {
                // Send a simple HTTP GET request
                client.write(`HEAD / HTTP/1.1\r\nHost: ${this.host}\r\nConnection: close\r\n\r\n`);
            });
    
            let banner = '';
            client.on('data', (data) => {
                banner += data.toString();
            });
    
            client.on('end', () => {
                // Extract the Server header from the response
                const serverHeader = banner.split('\r\n').find(line => line.startsWith('Server:'));
                resolve(serverHeader ? serverHeader : 'No Server header found');
            });
    
            client.on('error', (err) => {
                reject(err);
            });
        }.bind(this));
    }
}

class netscan_ftp extends netscan {
    protocol = "TCP"
    protocolName="FTP"
    constructor(host, port = 21, timeout = 10000, performScan = false) {
        super(host, port, timeout, performScan);
    }

    async scanProtocol() {
        this.portOpen = await netscan.isPortOpen(this.host, this.port);
        if (this.portOpen) {
            this.serverHeader = await this.getFtpBanner();
        }
        return this.portOpen;
    }

    getFtpBanner() {
        return new Promise(function(resolve, reject){
            const client = net.createConnection({ host: this.host, port: this.port }, () => {
            });
    
            let banner = '';
            client.on('data', (data) => {
                banner += data.toString();
                client.end();
            });
    
            client.on('end', () => {
                // Extract the Server header from the response
                const serverHeader = banner.split('\r\n').find(line => line.startsWith('220 '));;
                resolve(serverHeader ? serverHeader : 'No Server header found');
            });
    
            client.on('error', (err) => {
                reject(err);
            });
        }.bind(this));
    }
}

class netscan_lpd extends netscan {
    protocol = "TCP"
    protocolName="LPD"
    constructor(host, port = 515, timeout = 10000, performScan = false) {
        super(host, port, timeout, performScan);
    }

    async scanProtocol() {
        this.portOpen = await netscan.isPortOpen(this.host, this.port);
        if (this.portOpen) {
           // this.serverHeader = await this.getLPDBanner();
        }
        return this.portOpen;
    }

    // getLPDBanner() {
    //     return new Promise(function(resolve, reject){
    //         const client = net.createConnection({ host: this.host, port: this.port }, () => {
    //             // Construct LPD request for the list of queues (This sends the LIST command)
    //             // The LPD LIST command is typically sent as an empty request or with a queue name to query.
    //             const listCommand = Buffer.from('\x04raw\r'); // LPD LIST command byte
                
    //             // Send LIST command to get available queues
    //             client.write(listCommand);
    //         });
    
    //         let banner = '';
    //         client.on('data', (data) => {
    //             banner += data.toString();
    //         });
    
    //         client.on('end', () => {
    //             // Extract the Server header from the response
    //             const serverHeader = banner.split('\r\n').find(line => line.startsWith('Server:'));
    //             resolve(serverHeader ? serverHeader : 'No Server header found');
    //         });
    
    //         client.on('error', (err) => {
    //             reject(err);
    //         });
    //     }.bind(this));
    // }
}

class netscan_jetdirect extends netscan {
    protocol = "TCP"
    protocolName="JetDirect"
    constructor(host, port = 9100, timeout = 10000, performScan = false) {
        super(host, port, timeout, performScan);
    }

    async scanProtocol() {
        this.portOpen = await netscan.isPortOpen(this.host, this.port);
        return this.portOpen;
    }
}

class netscan_smtp extends netscan {
    protocol = "TCP"
    protocolName="SMTP"
    constructor(host, port = 25, timeout = 10000, performScan = false) {
        super(host, port, timeout, performScan);
    }

    async scanProtocol() {
        this.portOpen = await netscan.isPortOpen(this.host, this.port);
        if (this.portOpen) {
            this.serverHeader = await this.getSmtpBanner();
        }
        return this.portOpen;
    }

    getSmtpBanner() {
        return new Promise(function(resolve, reject){
            const client = net.createConnection({ host: this.host, port: this.port }, () => {
            });
    
            let banner = '';
            client.on('data', (data) => {
                banner += data.toString();
                client.end();
            });
    
            client.on('end', () => {
                // Extract the Server header from the response
                const serverHeader = banner.split('\r\n').find(line => line.startsWith('220 '));;
                resolve(serverHeader ? serverHeader : 'No Server header found');
            });
    
            client.on('error', (err) => {
                reject(err);
            });
        }.bind(this));
    }
}

class netscan_https extends netscan {
    protocol = "TCP"
    protocolName="HTTPS"
    constructor(host, port = 443, timeout = 10000, performScan = false) {
        super(host, port, timeout, performScan);
    }

    async scanProtocol() {
        this.portOpen = await netscan.isPortOpen(this.host, this.port);
        if (this.portOpen) {
            const cert = await this.getSSLCertificate();
            this.serverCertSubject = cert.subject;
            this.serverCertIssuer = cert.issuer;
            this.serverPublicKey = cert.publicKey;
            this.serverCertFingerprint = cert.fingerprint
            this.serverHeader = await this.getHttpsBanner();
            
        }
        return this.portOpen;
    }

    getHttpsBanner() {
        return new Promise(function (resolve, reject) {
            const client = tls.connect(this.port, this.host, { rejectUnauthorized: false, minVersion: 'TLSv1', ciphers: 'ALL' }, () => {
                client.write(`HEAD / HTTP/1.1\r\nHost: ${this.host}\r\nConnection: close\r\n\r\n`);
            });
    
            let banner = '';
            client.on('data', (data) => {
                banner += data.toString();
            });
    
            client.on('end', () => {
                const serverHeader = banner.split('\r\n').find(line => line.startsWith('Server:'));
                resolve(serverHeader ? serverHeader : 'No Server header found');
            });
    
            client.on('error', (err) => {
                reject(err);
            });
        }.bind(this));
    }
    
    getSSLCertificate() {
        return new Promise(function(resolve, reject) {
            const socket = tls.connect(this.port, this.host, { rejectUnauthorized: false, minVersion: 'TLSv1', ciphers: 'ALL' }, () => {
                const certificate = socket.getPeerCertificate();
    
                if (certificate && certificate.subject && certificate.issuer) {
                    resolve({
                        subject: certificate.subject,
                        issuer: certificate.issuer,
                        publicKey: certificate.pubkey.toString('base64'),
                        fingerprint: certificate.fingerprint
                    });
                } else {
                    reject(new Error('No certificate information available'));
                }
                socket.end();
            });
    
            socket.on('error', (err) => {
                reject(err);
            });
        }.bind(this));
    }
}

class netscan_rdp extends netscan {
    protocol = "TCP"
    protocolName="RDP"
    constructor(host, port = 3389, timeout = 10000, performScan = false) {
        super(host, port, timeout, performScan);
    }

    async scanProtocol() {
        this.portOpen = await netscan.isPortOpen(this.host, this.port);
        if (this.portOpen) {
            const cert = await this.getSSLCertificate();
            this.serverCertSubject = cert.subject;
            this.serverCertIssuer = cert.issuer;
            this.serverPublicKey = cert.publicKey;
            this.serverCertFingerprint = cert.fingerprint
            
        }
        return this.portOpen;
    }

    getHttpsBanner() {
        return new Promise(function (resolve, reject) {
            const client = tls.connect(this.port, this.host, { rejectUnauthorized: false, minVersion: 'TLSv1', ciphers: 'ALL' }, () => {
                client.write(`HEAD / HTTP/1.1\r\nHost: ${this.host}\r\nConnection: close\r\n\r\n`);
            });
    
            let banner = '';
            client.on('data', (data) => {
                banner += data.toString();
            });
    
            client.on('end', () => {
                const serverHeader = banner.split('\r\n').find(line => line.startsWith('Server:'));
                resolve(serverHeader ? serverHeader : 'No Server header found');
            });
    
            client.on('error', (err) => {
                reject(err);
            });
        }.bind(this));
    }
    
    getSSLCertificate() {
        return new Promise(function(resolve, reject) {
            const socket = tls.connect(this.port, this.host, { rejectUnauthorized: false, minVersion: 'TLSv1', ciphers: 'ALL' }, () => {
                const certificate = socket.getPeerCertificate();
    
                if (certificate && certificate.subject && certificate.issuer) {
                    resolve({
                        subject: certificate.subject,
                        issuer: certificate.issuer,
                        publicKey: certificate.pubkey.toString('base64'),
                        fingerprint: certificate.fingerprint
                    });
                } else {
                    reject(new Error('No certificate information available'));
                }
                socket.end();
            });
    
            socket.on('error', (err) => {
                reject(err);
            });
        }.bind(this));
    }
}

class netscan_ssh extends netscan {
    protocol = "TCP"
    protocolName="SSH"
    constructor(host, port = 22, timeout = 10000, performScan = false) {
        super(host, port, timeout, performScan);
    }

    async scanProtocol() {
        this.portOpen = await netscan.isPortOpen(this.host, this.port);
        if (this.portOpen) {
            this.serverHeader = await this.getSSHBanner();            
        }
        return this.portOpen;
    }


    getSSHBanner() {
        return new Promise(function(resolve, reject) {
          const socket = net.createConnection(this.port, this.host, () => {
            // Set the timeout for the connection
            socket.setTimeout(this.timeout);
      
            // Receive the banner data
            socket.once('data', (data) => {
              const banner = data.toString().trim();
              resolve(banner);
              socket.end(); // Close the connection
            });
          });
      
          socket.on('timeout', () => {
            reject(new Error('Connection timed out'));
            socket.end();
          });
      
          socket.on('error', (err) => {
            reject(err);
            socket.end();
          });
        }.bind(this));
      }      
}

class netscan_rtsp extends netscan {
    protocol = "TCP"
    protocolName="RSTP"
    constructor(host, port = 554, timeout = 10000, performScan = false) {
        super(host, port, timeout, performScan);
    }

    async scanProtocol() {
        this.portOpen = await netscan.isPortOpen(this.host, this.port);
        if (this.portOpen) {
           // this.serverHeader = await this.getLPDBanner();
        }
        return this.portOpen;
    }

    // getLPDBanner() {
    //     return new Promise(function(resolve, reject){
    //         const client = net.createConnection({ host: this.host, port: this.port }, () => {
    //             // Construct LPD request for the list of queues (This sends the LIST command)
    //             // The LPD LIST command is typically sent as an empty request or with a queue name to query.
    //             const listCommand = Buffer.from('\x04raw\r'); // LPD LIST command byte
                
    //             // Send LIST command to get available queues
    //             client.write(listCommand);
    //         });
    
    //         let banner = '';
    //         client.on('data', (data) => {
    //             banner += data.toString();
    //         });
    
    //         client.on('end', () => {
    //             // Extract the Server header from the response
    //             const serverHeader = banner.split('\r\n').find(line => line.startsWith('Server:'));
    //             resolve(serverHeader ? serverHeader : 'No Server header found');
    //         });
    
    //         client.on('error', (err) => {
    //             reject(err);
    //         });
    //     }.bind(this));
    // }
}
/**
 * Scan an IP to check ping latency, TCP port status, and SSL certificate info.
 * @param {string} ip - The IP address to scan.
 * @returns {Promise<object>} - The scan results.
 */
async function scanIP(ip) {
    const result = { ip, pingable: false, latency: null, openPorts: {}, ssl: null };

    // Ping the IP
    try {
        const pingResult = await ping.promise.probe(ip, { timeout: 5 });
        result.pingable = pingResult.alive;
        result.latency = pingResult.alive ? pingResult.time : null;
    } catch (err) {
        console.error(`Error pinging IP ${ip}:`, err.message);
    }

    const ftpScanner = new netscan_ftp(ip); //Port 21 (FTP)
    await ftpScanner.scanProtocol();
    
    const sshScanner = new netscan_ssh(ip); //Port 22 (SSH)
    await sshScanner.scanProtocol();
    
    const smtpScanner = new netscan_smtp(ip); //Port 25 (SMTP)
    await smtpScanner.scanProtocol();
    
    const httpScanner = new netscan_http(ip); //Port 80 (HTTP)
    await httpScanner.scanProtocol();
    
    //Port 139 (NetBIOS)
    const httpsScanner = new netscan_https(ip); //Port 443 (HTTPS)
    await httpsScanner.scanProtocol();
    
    //Port 445 (SMB)


    //Port 465 (SMTPS_OLD)
    
    
    const lpdScanner = new netscan_lpd(ip) //Port 515 (LPD Printing)
    await lpdScanner.scanProtocol();
    
    const rtspScanner = new netscan_rtsp(ip); //Port 554 (RTSP)
    await rtspScanner.scanProtocol();    

    //Port 587 (SMTPS)
    
    const rdpScanner = new netscan_rdp(ip); //Port 3389 (RDP)
    await rdpScanner.scanProtocol();
    
    const winrmScanner = new netscan_http(ip,5985); //Port 5985 (WinRM)
    await winrmScanner.scanProtocol();

    const winrmsScanner = new netscan_https(ip,5986); //Port 5985 (WinRM TLS)
    await winrmsScanner.scanProtocol();

    const jdScanner = new netscan_jetdirect(ip) //Port 9100 (PDL Printing)
    await jdScanner.scanProtocol();
    
    
    return result;
}




// Example usage
(async () => {
    const ip = '192.168.4.102';
    const result = await scanIP(ip);
    console.log(result);
})();


