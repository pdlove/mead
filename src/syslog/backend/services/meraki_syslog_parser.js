module.exports.meraki_ParseMXSyslog = meraki_ParseMXSyslog;
module.exports.meraki_ParseAPSyslog = meraki_ParseAPSyslog;

const ip = require('./util/ip')
const fs = require('fs');


function meraki_syslog_processValues(receivingObject, values, startIndex, endIndex) {
    var curIndex = startIndex;
    while (curIndex <= endIndex) {
        var parts = values[curIndex++].split("=");
        if (parts.length > 2) {
            var newParts = [];
            newParts.push(parts[0])
            var secondPart = parts[1];
            for (var i = 2; i < parts.length; i++) {
                secondPart += '=' + parts[i]
            }
            newParts.push(secondPart);
            parts = newParts
        }
        if (parts.length == 2) {
            receivingObject[parts[0]] = parts[1];
            if (receivingObject[parts[0]][0] == "'") {
                while ((curIndex <= endIndex) && (!receivingObject[parts[0]].endsWith("'"))) {
                    receivingObject[parts[0]] += ' ' + values[curIndex++];
                }
            }
        } else {
            //First part is the 

            parts = parts;
        }
    }
}

function meraki_syslog_processFlow(OriginalMessage, msg) {
    if (!msg) msg = OriginalMessage.split(' ');
    var myObject = {}
    myObject.merakiType = 'flows'
    myObject.merakiDevice = msg[0]
    myObject.originalMessage = OriginalMessage;

    var lastIndex = msg.length - 1;
    var curIndex = 2;

    //a flow typically ends in "pattern:" but sometimes doesn't.
    myObject['action'] = msg[curIndex++];
    
    //Now the remaining information is all going to be field=value items.
    meraki_syslog_processValues(myObject, msg, curIndex, lastIndex);

    //Now we need to go ahead and to basic analysis of this packet so the database doesn't have to.
    //First, convert the IPs into integers
    if (myObject.src) {
        myObject.srcIP=myObject.src;
        myObject.src = ip.toLong(myObject.src);
    }        
    if (myObject.sport)
        myObject.sport = Number(myObject.sport)
    if (myObject.dst) {
        myObject.dstIP=myObject.dst;
        myObject.dst = ip.toLong(myObject.dst);
    }
    if (myObject.dport)
        myObject.dport = Number(myObject.dport)
   
    if (myObject.mac)
        myObject.macNum = parseInt(myObject.mac.split(':').join(''), 16);

    switch (myObject.action) {
        case 'Allow':
        case 'allow':
        case '1':
            myObject.action=1;
            break;
        case 'Deny':
        case 'deny':
        case '0':
            myObject.action=2;
            break;
        default:
            console.log("MerakiMX Flow Log - Unknown Action: "+myObject.action)
    }
        
    switch (myObject.protocol) {
        case 'icmp':
            myObject.protocol=1
            myObject.dport = Number(myObject.type)
            break;
        case 'icmp6':
            myObject.protocol=11
            myObject.dport = Number(myObject.type)
            break;            
        case 'tcp':
            myObject.protocol=2
            break;
        case 'udp':
            myObject.protocol=3
            break;
        default:
            myObject.protocol = Number(myObject.protocol);
            console.log("MerakiMX Flow Log - Unknown Protocol: "+myObject.protocol)
    }

    return myObject;
    //Next, determine the VLAN for each IP

    //Flag the 

}
function meraki_syslog_processMXFlow(msg) {
    var myObject = {}
    myObject.merakiType = 'flows'
    myObject.merakiDevice = msg[0]

    var lastIndex = msg.length - 1;
    var curIndex = 2;

    //an MX flow ends in "pattern:" but sometimes doesn't.
    var patternIndex = msg.indexOf('pattern:');
    var workIndex = patternIndex + 1;
    if (msg[workIndex]==='Group') workIndex+=2;
    myObject['action'] = msg[workIndex++];
    myObject['pattern'] = '';
    while (workIndex < lastIndex) {
        myObject['pattern'] += msg[workIndex++] + ' ';
    }
    myObject['pattern'] += msg[workIndex];
    lastIndex = patternIndex - 1;
    
    //Now the remaining information is all going to be field=value items.
    meraki_syslog_processValues(myObject, msg, curIndex, lastIndex);

    //Now we need to go ahead and to basic analysis of this packet so the database doesn't have to.
    //First, convert the IPs into integers
    if (myObject.src) {
        myObject.srcIP=myObject.src;
        myObject.src = ip.toLong(myObject.src);
    }        
    if (myObject.sport)
        myObject.sport = Number(myObject.sport)
    if (myObject.dst) {
        myObject.dstIP=myObject.dst;
        myObject.dst = ip.toLong(myObject.dst);
    }
    if (myObject.dport)
        myObject.dport = Number(myObject.dport)
   
    if (myObject.mac)
        myObject.macNum = parseInt(myObject.mac.split(':').join(''), 16);

    switch (myObject.action) {
        case 'Allow':
        case 'allow':
        case '1':
            myObject.action=1;
            break;
        case 'Deny':
        case 'deny':
        case '0':
            myObject.action=2;
            break;
        default:
            console.log("MerakiMX Flow Log - Unknown Action: "+myObject.action)
    }
        
    switch (myObject.protocol) {
        case 'icmp':
            myObject.protocol=1
            myObject.dport = Number(myObject.type)
            break;
        case 'tcp':
            myObject.protocol=2
            break;
        case 'udp':
            myObject.protocol=3
            break;
        default:
            myObject.protocol = Number(myObject.protocol);
            console.log("MerakiMX Flow Log - Unknown Protocol: "+myObject.protocol)
    }
        
    return myObject;
}

function meraki_syslog_processURL(OriginalMessage, msg) {
    if (!msg) msg = OriginalMessage.split(' ');
    var myObject = {}
    myObject.merakiDevice = msg[0]
    myObject.merakiType = 'urls';
    myObject.originalMessage = OriginalMessage;

    var lastIndex = msg.length - 1;
    var curIndex = 1;

    myObject['action'] = msg[curIndex++];
    var requestIndex = msg.indexOf('request:');
    var workIndex = requestIndex + 1
    myObject['url'] = '';
    while (workIndex < lastIndex) {
        myObject['url'] += msg[workIndex++] + ' ';
    }
    myObject['url'] += msg[workIndex++];
    lastIndex = requestIndex - 1;

    //Now the remaining information is all going to be field=value items.
    meraki_syslog_processValues(myObject, msg, curIndex, lastIndex);

    //Now we need to go ahead and to basic analysis of this packet so the database doesn't have to.
    //First, convert the IPs into integers
    if (myObject.src) {
        var ip_port = myObject.src.split(':');
        myObject.src = ip_port[0];
        myObject.srcPort = Number(ip_port[1]);
    }

    if (myObject.dst) {
        var ip_port = myObject.dst.split(':');
        myObject.dst = ip_port[0];
        myObject.dstPort = Number(ip_port[1]);
    }
    return myObject;
}

function meraki_ParseMXSyslog(syslogPacket) {
    var msg = syslogPacket.msg.split(' ');
    var merakiType = msg[1];
    
    switch (merakiType) {
        case 'flows':            
            return meraki_syslog_processMXFlow(msg);            
            break;
        case 'urls':
            return meraki_syslog_processURL(syslogPacket.msg, msg);
            break;
        case 'l7_firewall':
            fs.appendFileSync('MerakiMX_'+merakiType+'.txt', syslogPacket.msg+'\n');
            break;
        case 'security_event':
            fs.appendFileSync('MerakiMX_'+merakiType+'.txt', syslogPacket.msg+'\n');
            break;
        case 'events':
            fs.appendFileSync('MerakiMX_'+merakiType+'.txt', syslogPacket.msg+'\n');
            break;
        case 'ip_flow_start':
            break;
        case 'ip_flow_end':
            break;
        default:
            if (merakiType.startsWith('src=')) {
                merakiType='events';
                //Packet is malformed
            } else {
                console.log("Unknown MX Event Type: "+merakiType)
            }
            break;
    }


    syslogPacket.merakiType = merakiType;
    syslogPacket[syslogPacket.merakiType] = {};
    var lastIndex = msg.length - 1;
    var curIndex = 2;
    //Flow packets have two methods
    // 1) Allow/Deny at the begining
    // 2) pattern: at the end
    if (syslogPacket.merakiType === 'security_event') {
        //Similar to flows
        var requestIndex = msg.indexOf('message:');
        syslogPacket[syslogPacket.merakiType]['action'] = msg[curIndex++];
        var workIndex = requestIndex + 1;
        syslogPacket[syslogPacket.merakiType]['msgType'] = msg[workIndex++];
        syslogPacket[syslogPacket.merakiType]['msg'] = ''
        while (workIndex < lastIndex) {
            syslogPacket[syslogPacket.merakiType]['msg'] += msg[workIndex++] + ' ';
        }
        syslogPacket[syslogPacket.merakiType]['msg'] += msg[workIndex++];
        lastIndex = requestIndex - 1;
    } else if (syslogPacket.merakiType === 'events') {
        //For now just grab it all
        syslogPacket[syslogPacket.merakiType]['msg'] = ''
        while (curIndex < lastIndex) {
            syslogPacket[syslogPacket.merakiType]['msg'] += msg[curIndex++] + ' ';
        }
        syslogPacket[syslogPacket.merakiType]['msg'] += msg[curIndex++];
    }


    syslogPacket[syslogPacket.merakiType].eventDevice = syslogPacket.sourceIP;
    syslogPacket[syslogPacket.merakiType].eventTime = syslogPacket.time;
    syslogPacket[syslogPacket.merakiType].original = syslogPacket.original;

    syslogPacket.msg = null;
    return syslogPacket;
}

function meraki_ParseAPSyslog(syslogPacket) {
    var msg = syslogPacket.msg.split(' ');
    var merakiType = msg[1];
    switch (merakiType) {
        case 'flows':
            return meraki_syslog_processFlow(syslogPacket.msg, msg);
        case 'urls':
            return meraki_syslog_processURL(syslogPacket.msg, msg);
        default:
            fs.appendFileSync('MerakiAP_'+merakiType+'.txt', syslogPacket.msg+'\n');
            console.log("AP Event: "+merakiType);

    }


    syslogPacket.merakiType = merakiType;
    syslogPacket[syslogPacket.merakiType] = {};
    var lastIndex = msg.length - 1;
    var curIndex = 2;
    //Flow packets have two methods
    // 1) Allow/Deny at the begining
    // 2) pattern: at the end
    if (syslogPacket.merakiType === 'security_event') {
        //Similar to flows
        var requestIndex = msg.indexOf('message:');
        syslogPacket[syslogPacket.merakiType]['action'] = msg[curIndex++];
        var workIndex = requestIndex + 1;
        syslogPacket[syslogPacket.merakiType]['msgType'] = msg[workIndex++];
        syslogPacket[syslogPacket.merakiType]['msg'] = ''
        while (workIndex < lastIndex) {
            syslogPacket[syslogPacket.merakiType]['msg'] += msg[workIndex++] + ' ';
        }
        syslogPacket[syslogPacket.merakiType]['msg'] += msg[workIndex++];
        lastIndex = requestIndex - 1;
    } else if (syslogPacket.merakiType === 'events') {
        //For now just grab it all
        syslogPacket[syslogPacket.merakiType]['msg'] = ''
        while (curIndex < lastIndex) {
            syslogPacket[syslogPacket.merakiType]['msg'] += msg[curIndex++] + ' ';
        }
        syslogPacket[syslogPacket.merakiType]['msg'] += msg[curIndex++];
    }


    syslogPacket[syslogPacket.merakiType].eventDevice = syslogPacket.sourceIP;
    syslogPacket[syslogPacket.merakiType].eventTime = syslogPacket.time;
    syslogPacket[syslogPacket.merakiType].original = syslogPacket.original;

    syslogPacket.msg = null;
    return syslogPacket;
}