const dgram = require('dgram');
const EventEmitter = require('events');

class Syslogd extends EventEmitter {
    constructor(opt = {}) {
        super();
        this.opt = opt;
        this.server = dgram.createSocket('udp4');
    }

    startListening(port = 514, cb = () => {}) {
        if (this.port) {
            console.log(`Server has already bound to ${port}`);
            return;
        }

        console.log(`Attempting to bind to port ${port}`);
        this.port = port;

        this.server
            .on('error', (err) => {
                console.log('Binding error: %o', err);
                this.emit('error', err);
                cb(err);
            })
            .on('listening', () => {
                console.log('Binding successful');
                this.emit('listening');
                cb(null);
            })
            .on('message', (msg, rinfo) => {
                const info = this.#parser(msg, rinfo);
                this.emit('message', info);
            })
            .bind(port, this.opt.address);

        return this;
    }
    stopListening() {
        this.server.close();
    }
    #parsePRI(raw) {
        const priority = parseInt(raw);
        if (isNaN(priority)) {
            return null;
        }
        const facility = Math.floor(priority / 8);
        const severity = priority % 8;
        return { facility, severity };
    }

    #parser(msg, rinfo) {
        msg = msg.toString(); // Ensure msg is a string
    
        // Extract PRI (enclosed in '<' and '>')
        const priStart = msg.indexOf('<');
        const priEnd = msg.indexOf('>');
        
        // If PRI is missing, return the entire message as the 'msg'
        if (priStart === -1 || priEnd === -1) {
            return {
                facility: null,
                severity: null,
                time: new Date(),
                hostname: null,
                msg: msg.trim(),
                sourceIP: rinfo.address,
                original: msg
            };
        }
    
        // Parse the PRI
        const pri = msg.substring(priStart + 1, priEnd);
        const priInfo = this.#parsePRI(pri);
    
        if (!priInfo) {
            // If PRI fails to parse, return the entire message as the 'msg'
            return {
                facility: null,
                severity: null,
                time: new Date(),
                hostname: null,
                msg: msg.trim(),
                sourceIP: rinfo.address,
                original: msg
            };
        }
    
        // Remove PRI from the message
        let message = msg.substring(priEnd + 1).trim();
    
        // Extract timestamp (assume it's the first part of the remaining message)
        const timestampEnd = message.indexOf(' ');
        const timestamp = message.substring(0, timestampEnd).trim();
        let time;
    
        try {
            time = new Date(timestamp); // Try parsing the timestamp (ISO format for RFC 5424)
        } catch {
            time = null;  // If timestamp parsing fails, set time to null
        }
    
        if (isNaN(time)) {
            time = null;  // If parsing fails, nullify the time
        }
    
        // If timestamp fails, return everything but PRI as the message
        if (!time) {
            return {
                facility: priInfo.facility,
                severity: priInfo.severity,
                time: new Date(),
                hostname: null,
                msg: message.trim(),
                sourceIP: rinfo.address,
                original: msg
            };
        }
    
        // Remove the timestamp from the message
        message = message.substring(timestampEnd + 1).trim();
    
        // Extract hostname (next token in the message)
        const hostnameEnd = message.indexOf(' ');
        const hostname = message.substring(0, hostnameEnd);
    
        // Extract the remaining message (appname, PID, and actual message)
        const remainingMessage = message.substring(hostnameEnd + 1).trim();
    
        // Construct the syslog packet
        const syslogPacket = {
            facility: priInfo.facility,
            severity: priInfo.severity,
            time,
            hostname,
            msg: remainingMessage,
            sourceIP: rinfo.address,
            original: msg
        };
    
        return syslogPacket;
    }
}

// Severity Levels
const Severity = {};
'Emergency Alert Critical Error Warning Notice Informational Debug'.split(' ').forEach((x, i) => {
    Severity[x.toUpperCase()] = i;
});

exports.Syslogd = Syslogd;
exports.Severity = Severity;
