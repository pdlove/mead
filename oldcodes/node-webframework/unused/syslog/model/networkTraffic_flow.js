const zlib = require('zlib');
var ipaddr = require('ipaddr.js');
const { Buffer } = require('buffer');

function macToByteArray(macAddress) {
    if (!macAddress) return null;
    // Normalize the MAC address by removing any colons or dashes
    const cleanMac = macAddress.replace(/[:-]/g, '');

    // Ensure the MAC address is exactly 12 hexadecimal digits (6 bytes)
    if (cleanMac.length !== 12) {
        throw new Error('Invalid MAC address: ' + macAddress);
    }

    // Convert the MAC address to a byte array
    const byteArray = new Uint8Array(6);
    for (let i = 0; i < 6; i++) {
        // Convert each hex pair (2 characters) into a byte
        byteArray[i] = parseInt(cleanMac.substr(i * 2, 2), 16);
    }

    return byteArray;
}

class networkTraffic_flows {
    logSource=''
    logSourceIP=null
    logType=''
    logText=''
    logTime='2024-10-02T08:55:12-05:00'
    
    srcInterface=''
    srcMAC=null
    srcIP=null
    srcNatIP=null
    srcPort=0
    srcNatPort=0;

    dstInterface=''
    dstMAC=null
    dstIP=null
    dstNatIP=null
    dstPort=0
    dstNatPort=0;

    sessionID=0 
    ipProtocol=0

    fwAction=''
    fwPolicyID=0
    fwPolicyName=''

    statsDuration=0
    statsBytesSent=0
    statsBytesRcvd=0
    statsPacketsSent=0
    statsPacketsRcvd=0
    
    otherType=''
    constructor() {}
    loadFGData(data, msg, ip) {
        this.logSource = data.devname;
        this.logSourceIP = Buffer.from(ipaddr.parse(ip).toByteArray());
        this.logType = 'syslog';
//        this.logText = msg;
        this.logTime = `${data.date}T${data.time}${data.tz.substring(0,3)}:${data.tz.substring(3,5)}`;

        this.inInterface=data.srcintf;
        this.outInterface=data.dstintf;
        if (data.srcIP) {
            if (data.srcip.includes(":")) {
                this.ipVersion=6;
            } else {
                this.ipVersion=4;
            }
        } else this.ipVersion=4;
        this.ipProtocol=data.proto;
        
        if (data.srcMAC) this.srcMAC=Buffer.from(macToByteArray(data.srcmac));
        if (data.srcip) this.srcIP=Buffer.from(ipaddr.parse(data.srcip).toByteArray());
        if (data.transip) this.srcNatIP=Buffer.from(ipaddr.parse(data.transip).toByteArray());
        this.srcPort=data.srcport;
        if (data.transport) this.srcNatPort=data.transport;

        if (data.dstmac) this.dstMAC=Buffer.from(macToByteArray(data.dstmac));
        if (data.dstip) this.dstIP=Buffer.from(ipaddr.parse(data.dstip).toByteArray());
        if (data.tranip) this.dstNatIP=Buffer.from(ipaddr.parse(data.tranip).toByteArray());
        this.dstPort=data.dstport;
        if (data.tranport) this.dstNatPort=data.tranport;

        this.sessionID=data.sessionid;
        
        this.fwAction=data.action;
        this.fwPolicyID=data.policyid;
        this.fwPolicyName=data.policyname || data.policytype;

        this.statsDuration=data.duration;
        this.statsBytesSent=data.sentbyte;
        this.statsBytesRcvd=data.rcvdbyte;
        this.statsPacketsSent=data.sentpkt;
        this.statsPacketsRcvd=data.rcvdpkt;

        // Compress the msg string
        this.compressedLogText = zlib.deflateSync(msg).toByteArray();

        this.otherType=data.subtype
    }
    // Method to prepare data for bulk insert
    toBulkInsertRow() {
        return [
            this.logSource,
            this.logType,
            this.logText,
            this.logTime,

            this.srcInterface,
            this.srcMAC,
            this.srcIP,
            this.srcNatIP,
            this.srcPort,
            this.srcNatPort,

            this.dstInterface,
            this.dstMAC,
            this.dstIP,
            this.dstNatIP,
            this.dstPort,
            this.dstNatPort,

            this.sessionID,
            this.ipProtocol,

            this.fwAction,
            this.fwPolicyID,
            this.fwPolicyName,

            this.statsDuration,
            this.statsBytesSent,
            this.statsBytesRcvd,
            this.statsPacketsSent,
            this.statsPacketsRcvd,

            this.otherType
        ];
    }
}

module.exports = { networkTraffic_flows };