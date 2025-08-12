"use strict";
var snmp = require('./original');

class SNMP_NetDevice {
    constructor(myaddress, snmp_community) {
        this.management = {} //Stores information on the management of the device.
        this.info = {}; //Basic information about this device. This data doesn't change often.
        this.stats = {}; //Stores statistical data. This is data that changes constantly.
        this.temp = {}; //Used for temporary storage between processes. This is purged each time the object finished doing something.

        this.management.ipaddress = myaddress;
        this.management.controlType = 'SNMP';
        this.management.credentialValue = snmp_community;
        this.snmpSession = snmp.createSession(myaddress, snmp_community, { version: snmp.Version2c });
        this.management.lastStatsUpdate = null;
        this.stats.lastInterfaceStatistics = {};
        this.stats.lastInterfaceDeltaTime = {};
        this.stats.lastInterfaceSeconds = -1;
    }

    async UpdateDetails() {
        this.temp = { working: true };
        //Get the basic system information.
        var oids = ['1.3.6.1.2.1.1.1.0', '1.3.6.1.2.1.1.2.0', '1.3.6.1.2.1.1.3.0', '1.3.6.1.2.1.1.4.0', '1.3.6.1.2.1.1.5.0', '1.3.6.1.2.1.1.6.0', '1.3.6.1.2.1.1.7.0', '1.3.6.1.2.1.2.1.0'];
        console.log("Retrieving Basic Information");
        let myBinds = await this.snmpSession.getAsync(oids);
        console.log("Processing Basic Information");
        const varbinds = myBinds;
        for (var i = 0; i < varbinds.length; i++) {
            if (snmp.isVarbindError(varbinds[i]))
                console.error(snmp.varbindError(varbinds[i]))
            else
                switch (varbinds[i].oid) {
                    case '1.3.6.1.2.1.1.1.0':
                        this.info.deviceDescription = varbinds[i].value.toString();
                        break;
                    case '1.3.6.1.2.1.1.2.0':
                        this.info.snmpObjectID = varbinds[i].value;
                        break;
                    case '1.3.6.1.2.1.1.3.0':
                        this.info.snmpUpTime = varbinds[i].value;
                        break;
                    case '1.3.6.1.2.1.1.4.0':
                        this.info.deviceContact = varbinds[i].value.toString();
                        break;
                    case '1.3.6.1.2.1.1.5.0':
                        this.info.deviceName = varbinds[i].value.toString();
                        break;
                    case '1.3.6.1.2.1.1.6.0':
                        this.info.deviceLocation = varbinds[i].value.toString();
                        break;
                    case '1.3.6.1.2.1.1.7.0':
                        this.info.deviceServices = varbinds[i].value;
                        break;
                    case '1.3.6.1.2.1.2.1.0':
                        this.info.deviceInterfaceCount = varbinds[i].value;
                        break;
                        default:
                        console.log("Unexpected oid: "+varbinds[i].oid);
                }
            }
        this.info.switchPorts = this.info.switchPorts || {};
        this.stats.switchPorts = this.stats.switchPorts || {};
        this.stats.switchPorts.currentPoll = {};
        //Start getting the Interface Table
        console.log("Retrieving Interface Table");
        
        let table = await this.snmpSession.tableAsync(InterfaceTableDefinition, 20);
        
        console.log("Processing Interface Table");
        for (var myID in table) {
            if (this.info.switchPorts[myID] === undefined)
                this.info.switchPorts[myID] = { BridgedMACs: {} };
            if (this.stats.switchPorts.currentPoll[myID] === undefined)
                this.stats.switchPorts.currentPoll[myID] = {};
            this.info.switchPorts[myID].ifIndex = table[myID].ifIndex;
            this.info.switchPorts[myID].ifDescr = table[myID].ifDescr;
            this.info.switchPorts[myID].ifType = table[myID].ifType;
            this.info.switchPorts[myID].ifMtu = table[myID].ifMtu;
            this.info.switchPorts[myID].ifSpeed = table[myID].ifSpeed;
            this.info.switchPorts[myID].ifPhysAddress = table[myID].ifPhysAddress;
            this.info.switchPorts[myID].ifAdminStatus = table[myID].ifAdminStatus;
            this.info.switchPorts[myID].ifOperStatus = table[myID].ifOperStatus;
            this.info.switchPorts[myID].ifLastChange = table[myID].ifLastChange;
            this.stats.switchPorts.currentPoll[myID].ifInOctets = table[myID].ifInOctets;
            this.stats.switchPorts.currentPoll[myID].ifInUcastPkts = table[myID].ifInUcastPkts;
            this.stats.switchPorts.currentPoll[myID].ifInNUcastPkts = table[myID].ifInNUcastPkts;
            this.stats.switchPorts.currentPoll[myID].ifInDiscards = table[myID].ifInDiscards;
            this.stats.switchPorts.currentPoll[myID].ifInErrors = table[myID].ifInErrors;
            this.stats.switchPorts.currentPoll[myID].ifInUnknownProtos = table[myID].ifInUnknownProtos;
            this.stats.switchPorts.currentPoll[myID].ifOutOctets = table[myID].ifOutOctets;
            this.stats.switchPorts.currentPoll[myID].ifOutUcastPkts = table[myID].ifOutUcastPkts;
            this.stats.switchPorts.currentPoll[myID].ifOutNUcastPkts = table[myID].ifOutNUcastPkts;
            this.stats.switchPorts.currentPoll[myID].ifOutDiscards = table[myID].ifOutDiscards;
            this.stats.switchPorts.currentPoll[myID].ifOutErrors = table[myID].ifOutErrors;
            this.stats.switchPorts.currentPoll[myID].ifOutQLen = table[myID].ifOutQLen;
            this.stats.switchPorts.currentPoll[myID].ifSpecific = table[myID].ifSpecific;
        }
        //Next get the Highspeed Table
        console.log("Retrieving HighSpeed Interface Table");
        
        table = await this.snmpSession.tableAsync(HSInterfaceTableDefinition, 20);
        
        console.log("Processing HighSpeed Interface Table");
        for (var myID in table) {
            if (this.info.switchPorts[myID] === undefined)
                this.info.switchPorts[myID] = {};
            if (this.stats.switchPorts.currentPoll[myID] === undefined)
                this.stats.switchPorts.currentPoll[myID] = {};
            this.info.switchPorts[myID].ifName = table[myID].ifName;
            this.stats.switchPorts.currentPoll[myID].ifInMulticastPkts = table[myID].ifInMulticastPkts;
            this.stats.switchPorts.currentPoll[myID].ifInBroadcastPkts = table[myID].ifInBroadcastPkts;
            this.stats.switchPorts.currentPoll[myID].ifOutMulticastPkts = table[myID].ifOutMulticastPkts;
            this.stats.switchPorts.currentPoll[myID].ifOutBroadcastPkts = table[myID].ifOutBroadcastPkts;
            this.stats.switchPorts.currentPoll[myID].ifHCInOctets = table[myID].ifHCInOctets;
            this.stats.switchPorts.currentPoll[myID].ifHCInUcastPkts = table[myID].ifHCInUcastPkts;
            this.stats.switchPorts.currentPoll[myID].ifHCInMulticastPkts = table[myID].ifHCInMulticastPkts;
            this.stats.switchPorts.currentPoll[myID].ifHCInBroadcastPkts = table[myID].ifHCInBroadcastPkts;
            this.stats.switchPorts.currentPoll[myID].ifHCOutOctets = table[myID].ifHCOutOctets;
            this.stats.switchPorts.currentPoll[myID].ifHCOutUcastPkts = table[myID].ifHCOutUcastPkts;
            this.stats.switchPorts.currentPoll[myID].ifHCOutMulticastPkts = table[myID].ifHCOutMulticastPkts;
            this.stats.switchPorts.currentPoll[myID].ifHCOutBroadcastPkts = table[myID].ifHCOutBroadcastPkts;
            this.info.switchPorts[myID].ifLinkUpDownTrapEnable = table[myID].ifLinkUpDownTrapEnable;
            this.info.switchPorts[myID].ifHighSpeed = table[myID].ifHighSpeed;
            this.info.switchPorts[myID].ifPromiscuousMode = table[myID].ifPromiscuousMode;
            this.info.switchPorts[myID].ifConnectorPresent = table[myID].ifConnectorPresent;
            this.info.switchPorts[myID].ifAlias = table[myID].ifAlias;
            this.info.switchPorts[myID].ifCounterDiscontinuityTime = table[myID].ifCounterDiscontinuityTime;
        }
        //Get the Bridge Port ID for the Interfaces
        console.log("Retrieving Bridge Interface Table");
        table = await this.snmpSession.tableAsync(BridgeInterfaceInformation, 20);
        console.log("Processing Bridge Interface Table");
        this.temp.BridgeToInterface = {};
        for (var myID in table) {
            this.temp.BridgeToInterface[table[myID].dot1dBasePort] = table[myID].dot1dBasePortIfIndex;
        }
        console.log("Retrieving Bridge Learned Address Table");
        table = await this.snmpSession.tableAsync(BridgeLearnedAddresses_dot1d, 20);
        console.log("Processing Bridge Learned Address Table");
        for (var myID in table) {
            table[myID].realMAC = '';
            table[myID].interface = this.temp.BridgeToInterface[table[myID].dot1dTpFdbPort];
            myID.split(".").forEach(
                function (currentValue) { 
                    if (table[myID].realMAC!="") table[myID].realMAC+=":";
                    table[myID].realMAC += parseInt(currentValue).toString(16).padStart(2,'0')
                });
            
            if (this.info.switchPorts[table[myID].interface]) 
                this.info.switchPorts[table[myID].interface].BridgedMACs[table[myID].realMAC] = new Date();
            else 
                console.log("Unknown Bridge Port  "+table[myID].dot1dTpFdbPort+" with MAC address of "+ table[myID].realMAC)
        }

        table = await  this.snmpSession.tableAsync(BridgeLearnedAddresses_dot1q, 20);
        console.log("Processing Bridge Learned Address Table");
        for (var myID in table) {
            table[myID].realMAC = '';
            table[myID].interface = this.temp.BridgeToInterface[table[myID].dot1qTpFdbPort];
            myID.split(".").forEach(
                function (currentValue) { 
                    if (table[myID].realMAC!="") table[myID].realMAC+=":";
                    table[myID].realMAC += parseInt(currentValue).toString(16).padStart(2,'0')
                });
            
            if (this.info.switchPorts[table[myID].interface]) 
                this.info.switchPorts[table[myID].interface].BridgedMACs[table[myID].realMAC] = new Date();
            else 
                console.log("Unknown Bridge Port  "+table[myID].dot1qTpFdbPort+" with MAC address of "+ table[myID].realMAC)
        }

        console.log("Completed");
    }

    UpdatePortLearnedMACs() {
        // firstThingAsync()
        //     .then(function (result1) {
        //         return Promise.all([result1, secondThingAsync(result1)]);
        //     })
        //     .then(function (results) {
        //         // do something with results array: results[0], results[1]
        //     })
        //     .catch(function (err) { /* ... */ });
        //
        this.snmpSession.table(BridgeInterfaceInformation, 20,
            function (error, table) {
                if (error) {
                    console.error(error.toString());
                } else {
                    var BridgeIDs = {}
                    for (var myID in table) {
                        BridgeIDs[myID] = table[myID].dot1dBasePortIfIndex;
                    }
                    this.snmpSession.table(BridgeLearnedAddresses, 20,
                        function (error, table) {
                            if (error) {
                                console.error(error.toString());
                            } else {
                                for (var myID in table) {
                                    table[myID].realMAC = '';
                                    table[myID].interface = BridgeIDs[table[myID].dot1dTpFdbPort];
                                    myID.split(".").forEach(function (currentValue) { table[myID].realMAC += parseInt(currentValue).toString(16) });
                                    console.log(JSON.stringify(table[myID]));
                                }
                            }
                        }.bind(this))
                }
            }.bind(this))
    }

}
                    case '1.3.6.1.2.1.1.1.0':
                        this.info.deviceDescription = varbinds[i].value.toString();
                        break;
                    case '1.3.6.1.2.1.1.2.0':
                        this.info.snmpObjectID = varbinds[i].value;
                        break;
                    case '1.3.6.1.2.1.1.3.0':
                        this.info.snmpUpTime = varbinds[i].value;
                        break;
                    case '1.3.6.1.2.1.1.4.0':
                        this.info.deviceContact = varbinds[i].value.toString();
                        break;
                    case '1.3.6.1.2.1.1.5.0':
                        this.info.deviceName = varbinds[i].value.toString();
                        break;
                    case '1.3.6.1.2.1.1.6.0':
                        this.info.deviceLocation = varbinds[i].value.toString();
                        break;
                    case '1.3.6.1.2.1.1.7.0':
                        this.info.deviceServices = varbinds[i].value;
                        break;
                    case '1.3.6.1.2.1.2.1.0':
                        this.info.deviceInterfaceCount = varbinds[i].value;
var InterfaceTableDefinition = {
    BaseOID: "1.3.6.1.2.1.2.2",
    Columns: {
        1: { name: "ifIndex" },
        2: { name: "ifDescr", type: "string" },
        3: { name: "ifType", type: "enum", enum: { 1: 'other', 2: 'regular1822', 3: 'hdh1822', 4: 'ddn-x25', 5: 'rfc877-x25', 6: 'ethernet-csmacd', 7: 'iso88023-csmacd', 8: 'iso88024-tokenBus', 9: 'iso88025-tokenRing', 10: 'iso88026-man', 11: 'starLan', 12: 'proteon-10Mbit', 13: 'proteon-80Mbit', 14: 'hyperchannel', 15: 'fddi', 16: 'lapb', 17: 'sdlc', 18: 'ds1', 19: 'e1', 20: 'basicISDN', 21: 'primaryISDN', 22: 'propPointToPointSerial', 23: 'ppp', 24: 'softwareLoopback', 25: 'eon', 26: 'ethernet-3Mbit', 27: 'nsip', 28: 'slip', 29: 'ultra', 30: 'ds3', 31: 'sip', 32: 'frame-relay' } },
        4: { name: "ifMtu" },
        5: { name: "ifSpeed" },
        6: { name: "ifPhysAddress", type: "hex" },
        7: { name: "ifAdminStatus", type: "enum", enum: { 1: "up", 2: "down", 3: "testing" } },
        8: { name: "ifOperStatus", type: "enum", enum: { 1: "up", 2: "down", 3: "testing" } },
        9: { name: "ifLastChange" },
        10: { name: "ifInOctets" },
        11: { name: "ifInUcastPkts" },
        12: { name: "ifInNUcastPkts" },
        13: { name: "ifInDiscards" },
        14: { name: "ifInErrors" },
        15: { name: "ifInUnknownProtos" },
        16: { name: "ifOutOctets" },
        17: { name: "ifOutUcastPkts" },
        18: { name: "ifOutNUcastPkts" },
        19: { name: "ifOutDiscards" },
        20: { name: "ifOutErrors" },
        21: { name: "ifOutQLen" },
        22: { name: "ifSpecific" }
    }
};

var HSInterfaceTableDefinition = {
    BaseOID: '1.3.6.1.2.1.31.1.1',
    Columns: {
        1: { name: "ifName", type: "string" },
        2: { name: "ifInMulticastPkts" },
        3: { name: "ifInBroadcastPkts" },
        4: { name: "ifOutMulticastPkts" },
        5: { name: "ifOutBroadcastPkts" },
        6: { name: "ifHCInOctets", type: "uint64" },
        7: { name: "ifHCInUcastPkts", type: "uint64" },
        8: { name: "ifHCInMulticastPkts", type: "uint64" },
        9: { name: "ifHCInBroadcastPkts", type: "uint64" },
        10: { name: "ifHCOutOctets", type: "uint64" },
        11: { name: "ifHCOutUcastPkts", type: "uint64" },
        12: { name: "ifHCOutMulticastPkts", type: "uint64" },
        13: { name: "ifHCOutBroadcastPkts", type: "uint64" },
        14: { name: "ifLinkUpDownTrapEnable" },
        15: { name: "ifHighSpeed" },
        16: { name: "ifPromiscuousMode" },
        17: { name: "ifConnectorPresent" },
        18: { name: "ifAlias", type: "string" },
        19: { name: "ifCounterDiscontinuityTime" }
    }
};

var BridgeInterfaceInformation = {
    BaseOID: '1.3.6.1.2.1.17.1.4',
    Columns: {
        1: { name: "dot1dBasePort" },
        2: { name: "dot1dBasePortIfIndex" },
        3: { name: "dot1dBasePortCircuit", type: "string" },
        4: { name: "dot1dBasePortDelayExceededDiscards" },
        5: { name: "dot1dBasePortMtuExceededDiscards" }
    }
};

var BridgeLearnedAddresses_dot1d = {
    BaseOID: '1.3.6.1.2.1.17.4.3',
    Columns: {
        1: { name: "dot1dTpFdbAddress", type: "hex" },
        2: { name: "dot1dTpFdbPort" },
        3: { name: "dot1dTpFdbStatus", type: "enum", enum: { 1: "other", 2: "invalid", 3: "learned", 4: "self", 5: "mgmt" } }
    }
};

var BridgeLearnedAddresses_dot1q = {
    BaseOID: '1.3.6.1.2.1.17.7.1.2.2',
    Columns: {
        1: { name: "dot1qTpFdbAddress", type: "hex" },
        2: { name: "dot1qTpFdbPort" },
        3: { name: "dot1qTpFdbStatus", type: "enum", enum: { 1: "other", 2: "invalid", 3: "learned", 4: "self", 5: "mgmt" } }
    }
};

var cpeExtPsePortTable = {
    BaseOID: ''
}
module.exports.SNMP_NetDevice = SNMP_NetDevice;