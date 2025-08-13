const fs = require('fs');

var snmp = require('net-snmp');

//getSwitchInformation('10.25.3.4');
getSwitchInformation('10.25.1.17');

async function getSwitchInformation(switchIP) {
    var mySwitch = {}
    mySwitch.snmpSession  = snmp.createSession(switchIP, 'Tacit321', { version: snmp.Version2c });
    var oids = ['1.3.6.1.2.1.1.1.0', '1.3.6.1.2.1.1.2.0', '1.3.6.1.2.1.1.3.0', '1.3.6.1.2.1.1.4.0', '1.3.6.1.2.1.1.5.0', '1.3.6.1.2.1.1.6.0', '1.3.6.1.2.1.1.7.0', '1.3.6.1.2.1.2.1.0'];
    console.log("Retrieving Basic Information");
    var varbinds = await mySwitch.snmpSession.getAsync(oids);
    for (var i = 0; i < varbinds.length; i++) {
        if (snmp.isVarbindError(varbinds[i]))
            console.error(snmp.varbindError(varbinds[i]))
        else
            switch (varbinds[i].oid) {
                case '1.3.6.1.2.1.1.1.0':
                    mySwitch.deviceDescription = varbinds[i].value.toString();
                    break;
                case '1.3.6.1.2.1.1.2.0':
                    mySwitch.snmpObjectID = varbinds[i].value;
                    break;
                case '1.3.6.1.2.1.1.3.0':
                    mySwitch.snmpUpTime = varbinds[i].value;
                    break;
                case '1.3.6.1.2.1.1.4.0':
                    mySwitch.deviceContact = varbinds[i].value.toString();
                    break;
                case '1.3.6.1.2.1.1.5.0':
                    mySwitch.deviceName = varbinds[i].value.toString();
                    break;
                case '1.3.6.1.2.1.1.6.0':
                    mySwitch.deviceLocation = varbinds[i].value.toString();
                    break;
                case '1.3.6.1.2.1.1.7.0':
                    mySwitch.deviceServices = varbinds[i].value;
                    break;
                case '1.3.6.1.2.1.2.1.0':
                    mySwitch.deviceInterfaceCount = varbinds[i].value;
                    break;
                default:
                    console.log("Unexpected oid: "+varbinds[i].oid);
            }
        }
    mySwitch.ports = {};
    mySwitch.vlans={};
    mySwitch.arpCache={};

    //Start getting the Interface Table
    console.log("Retrieving Interface Table");
    var ifTable = await mySwitch.snmpSession.tableAsync(InterfaceTableDefinition, 20);
    var hsTable = await mySwitch.snmpSession.tableAsync(HSInterfaceTableDefinition, 20);
    for (var id in ifTable) {
        var ifIndex = ifTable[id].ifIndex;
        if (mySwitch.ports[ifIndex]===undefined) mySwitch.ports[ifIndex]={};

        mySwitch.ports[ifIndex].ifIndex=ifTable[id].ifIndex;
        mySwitch.ports[ifIndex].ifDescr=ifTable[id].ifDescr;
        mySwitch.ports[ifIndex].ifType=ifTable[id].ifType;
        mySwitch.ports[ifIndex].ifMtu=ifTable[id].ifMtu;
        mySwitch.ports[ifIndex].ifSpeed=ifTable[id].ifSpeed;
        mySwitch.ports[ifIndex].ifPhysAddress=ifTable[id].ifPhysAddress;
        mySwitch.ports[ifIndex].ifAdminStatus=ifTable[id].ifAdminStatus;
        mySwitch.ports[ifIndex].ifOperStatus=ifTable[id].ifOperStatus;
        mySwitch.ports[ifIndex].ifLastChange=ifTable[id].ifLastChange;
        mySwitch.ports[ifIndex].ifSpecific=ifTable[id].ifSpecific;

        mySwitch.ports[ifIndex].hsName=hsTable[id].ifName;
        mySwitch.ports[ifIndex].hsLinkUpDownTrapEnable=hsTable[id].ifLinkUpDownTrapEnable;
        mySwitch.ports[ifIndex].hsHighSpeed=hsTable[id].ifHighSpeed;
        mySwitch.ports[ifIndex].hsPromiscuousMode=hsTable[id].ifPromiscuousMode;
        mySwitch.ports[ifIndex].hsConnectorPresent=hsTable[id].ifConnectorPresent;
        mySwitch.ports[ifIndex].hsAlias=hsTable[id].ifAlias;
        mySwitch.ports[ifIndex].LearnedAddresses={};
        mySwitch.ports[ifIndex].LLDPTable=[];
        mySwitch.ports[ifIndex].VlanSettings={ ingressAllowUntagged: true, ingressFiltering: false, ingressPvid:0, egressUntagged:0, egressForbidden:[], egressTagged:[] }; 

        if (mySwitch.ports[ifIndex].hsConnectorPresent==='false') 
            mySwitch.ports[ifIndex].status='not present';
        else if (mySwitch.ports[ifIndex].ifAdminStatus==='down') 
            mySwitch.ports[ifIndex].status='disabled';
        else if (mySwitch.ports[ifIndex].ifOperStatus==='down') 
            mySwitch.ports[ifIndex].status='down';
        else if (mySwitch.ports[ifIndex].ifOperStatus==='up') 
            mySwitch.ports[ifIndex].status='up';
        else
            mySwitch.ports[ifIndex].status='unknown';
        
            
    }



    console.log("Getting VLAN Data");
    var VLANTable = await getSwitchVLANInformation(mySwitch.snmpSession);
    
    for (var id in VLANTable) {
        mySwitch.vlans[VLANTable[id].vlanID]={};
        mySwitch.vlans[VLANTable[id].vlanID].vlanName=VLANTable[id].vlanName;
        for (var i in VLANTable[id].portsForbidden) {
            var portnum=VLANTable[id].portsAllowed[i];
            mySwitch.ports[portnum].VlanSettings.egressForbidden.push(id);
        }
        for (var i in VLANTable[id].portsAllowed) {
            var portnum=VLANTable[id].portsAllowed[i];
            if (VLANTable[id].portsUntagged.includes(portnum)) {
                if (mySwitch.ports[portnum].VlanSettings.egressUntagged!==0) console.log("Untagged already set?");
                mySwitch.ports[portnum].VlanSettings.egressUntagged=id;
            } else {
                mySwitch.ports[portnum].VlanSettings.egressTagged.push(id);
            }
        }
        for (var portnum in VLANTable[id].portsPVID) {
            mySwitch.ports[portnum].VlanSettings.ingressAllowUntagged=(VLANTable[id].portsPVID[portnum].frameTypes==='admitAll');
            mySwitch.ports[portnum].VlanSettings.ingressFiltering=(VLANTable[id].portsPVID[portnum].ingressFiltering===1)
            mySwitch.ports[portnum].VlanSettings.ingressPvid=id;
        }
    }

    console.log("Getting Learned Addresses");
    var LearnedAddresses = await getSwitchLearnedAddresses(mySwitch.snmpSession);
    for (var id in LearnedAddresses) {
        if (mySwitch.ports[id]===undefined) {
            console.log("Port Not Found!")            
        } else {
            for (var myMAC in LearnedAddresses[id]) {
                mySwitch.ports[id].LearnedAddresses[myMAC]=LearnedAddresses[id][myMAC];
            }
        }
    }
    
    console.log("Getting LLDP Tables");
    var LLDPTable = await getSwitchLLDPTable(mySwitch.snmpSession);
    for (var id in LLDPTable) {
        if (mySwitch.ports[id]===undefined) {
            console.log("Port Not Found!")            
        } else {
            for (var i=0;i<Object.keys(LLDPTable[id]).length;i++) {
                mySwitch.ports[id].LLDPTable.push(LLDPTable[id][i]);
            }
        }
    }
    mySwitch=mySwitch
}

async function getSwitchVLANInformation(snmpSession) {
    var vlans = {};

    vlanPortTable = await snmpSession.tableAsync(VLANStaticSettings,20);
    for (var vlanID in vlanPortTable) {
        vlans[vlanID]={ "vlanID": vlanID, "vlanName": vlanPortTable[vlanID].dot1qVlanStaticName, portsForbidden: [], portsAllowed: [], portsUntagged: [], portsPVID: {} };
        vlans[vlanID].portsAllowed=fromPortList(vlanPortTable[vlanID].dot1qVlanStaticEgressPorts);
        vlans[vlanID].portsUntagged=fromPortList(vlanPortTable[vlanID].dot1qVlanStaticUntaggedPorts);
        vlans[vlanID].portsForbidden=fromPortList(vlanPortTable[vlanID].dot1qVlanForbiddenEgressPorts);
    }
    vlanPVIDs = await snmpSession.tableAsync(VLANPVIDSettings,20);
    for (var portid in vlanPVIDs) {
        //portid here is dot1dBasePortEntry, not the port number. I suspect all of these VLAN ports are like that.
        if (vlans[vlanPVIDs[portid].dot1qPvid]===undefined)
            vlans[vlanPVIDs[portid].dot1qPvid]={ "vlanID": vlanPVIDs[portid].dot1qPvid, "vlanName": '', portsForbidden: [], portsAllowed: [], portsUntagged: [], portsPVID: {} };
        vlans[vlanPVIDs[portid].dot1qPvid].portsPVID[portid]= {
            "frameTypes": vlanPVIDs[portid].dot1qPortAcceptableFrameTypes,
            "ingressFiltering": vlanPVIDs[portid].dot1qPortIngressFiltering
        }
        
    }
    return vlans;

    function fromPortList(portBuffer) {
        var retValue = [];
        if (portBuffer===undefined) {
            console.log("Port List is undefined?");
            return retValue;
        }

        for (var i=0;i<portBuffer.length;i++) {
            var workbyte = portBuffer[i];
            var startport = (i+1)*8;
            for (var j=0;j<8;j++) {
                if ((workbyte&1)===1) retValue.push(startport-j);
                workbyte=workbyte>>1;
            }
        }
        return retValue;
    }
}

async function getSwitchLearnedAddresses(snmpSession) {
    var mydot1dBasePortTable = await snmpSession.tableAsync(dot1dBasePortTable, 20);
    var mydot1dTpFdbTable = await snmpSession.tableAsync(dot1dTpFdbTable, 20);
    var mydot1qTpFdbTable = await snmpSession.tableAsync(BridgeLearnedAddresses_dot1q, 20);
    //The 1q table should produce the same results as the 1d but with VLAN information
    var LearnedAddresses = {}; 

    for (var id in mydot1dTpFdbTable) {
        if (mydot1dTpFdbTable[id].dot1dTpFdbPort!==0) {
            var ifIndex = 0;
            if (mydot1dBasePortTable[mydot1dTpFdbTable[id].dot1dTpFdbPort]===undefined) {
                console.log("Error")
            } else {
                ifIndex = mydot1dBasePortTable[mydot1dTpFdbTable[id].dot1dTpFdbPort].dot1dBasePortIfIndex;
            }            
            var macAddress = mydot1dTpFdbTable[id].dot1dTpFdbAddress;;
            macAddress = getStringHex(macAddress,0,':');
            if (LearnedAddresses[ifIndex]===undefined) LearnedAddresses[ifIndex]=[];
            if (LearnedAddresses[ifIndex][macAddress]===undefined) LearnedAddresses[ifIndex][macAddress]={"vlan":[]};
        }
    }

    for (var id in mydot1qTpFdbTable) {
        if (mydot1qTpFdbTable[id].dot1qTpFdbPort!==0) {
            var ifIndex = 0;
            if (mydot1dBasePortTable[mydot1qTpFdbTable[id].dot1qTpFdbPort]===undefined) {
                console.log("Error")
            } else {
                ifIndex = mydot1dBasePortTable[mydot1qTpFdbTable[id].dot1qTpFdbPort].dot1dBasePortIfIndex;
            }
            
            var macAddress = id.split('.');
            var vlan = macAddress[0];
            var intMAC=[];
            for (var i=1;i<macAddress.length;i++) {
                intMAC.push(parseInt(macAddress[i]));
            }
            macAddress = getStringHex(intMAC,0,':');
            if (LearnedAddresses[ifIndex]===undefined) LearnedAddresses[ifIndex]=[];
            if (LearnedAddresses[ifIndex][macAddress]===undefined) LearnedAddresses[ifIndex][macAddress]={"vlan":[]};
            LearnedAddresses[ifIndex][macAddress].vlan.push(vlan);
        }
    }    
    return LearnedAddresses;
}

async function getSwitchLLDPTable(snmpSession) {
    var myval = await snmpSession.tableAsync(lldpRemTable,20);
    var lldpPortData={};    
    for (var id in myval) {
        var pkey = id.split('.');
        var localPort = pkey[1];
        myval[id]['localPort']=localPort;
        if (myval[id]['lldpRemChassisIdSubtype']==='macAddress') {
            myval[id]['lldpRemChassisId']=getStringHex(myval[id]['lldpRemChassisId'],0,':');
        } else if (myval[id]['lldpRemChassisIdSubtype']==='networkAddress') {
            myval[id]['lldpRemChassisId']=getStringDecimal(myval[id]['lldpRemChassisId'],1,'.');
        } else {
            myval[id]['lldpRemChassisId']=myval[id]['lldpRemChassisId'].toString();
        }
        if (myval[id]['lldpRemPortIdSubtype']==='macAddress') {
            myval[id]['lldpRemPortId']=getStringHex(myval[id]['lldpRemPortId'],0,':');
        } else if (myval[id]['lldpRemPortIdSubtype']==='networkAddress') {
            myval[id]['lldpRemPortId']=getStringDecimal(myval[id]['lldpRemPortId'],1,'.');
        } else {
            myval[id]['lldpRemPortId']=myval[id]['lldpRemPortId'].toString();
        }

        if (lldpPortData[localPort]===undefined) lldpPortData[localPort]=[];
        lldpPortData[localPort].push(myval[id]);
    }
    return lldpPortData;
}


//Helpers
function getStringDecimal(myBuffer, start, separator) {
    var retValue ='';
    for (var i=start;i<myBuffer.length;i++) {
        if (i>start) retValue += separator;
        retValue += myBuffer[i].toString();
    }
    return retValue
}

function getStringHex(myBuffer, start, separator) {
    var retValue ='';
    for (var i=start;i<myBuffer.length;i++) {
        if (i>start) retValue += separator;
        if (myBuffer[i]<16) retValue+='0';
        retValue += myBuffer[i].toString(16);
    }
    return retValue
}

//SNMP Table Definitions
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
        14: { name: "ifLinkUpDownTrapEnable", type: "enum", enum: {1: 'true', 2: 'false'}},
        15: { name: "ifHighSpeed" },
        16: { name: "ifPromiscuousMode", type: "enum", enum: {1: 'true', 2: 'false'}},
        17: { name: "ifConnectorPresent", type: "enum", enum: {1: 'true', 2: 'false'}},
        18: { name: "ifAlias", type: "string" },
        19: { name: "ifCounterDiscontinuityTime" }
    }
};

var dot1dBasePortTable = {
    BaseOID: '1.3.6.1.2.1.17.1.4',
    Columns: {
        1: { name: "dot1dBasePort" },
        2: { name: "dot1dBasePortIfIndex" },
        3: { name: "dot1dBasePortCircuit", type: "string" },
        4: { name: "dot1dBasePortDelayExceededDiscards" },
        5: { name: "dot1dBasePortMtuExceededDiscards" }
    }
};


var dot1dTpFdbTable = {
    BaseOID: '1.3.6.1.2.1.17.4.3',
    Columns: {
        1: { name: "dot1dTpFdbAddress" },
        2: { name: "dot1dTpFdbPort" },
        3: { name: "dot1dTpFdbStatus", type: "enum", enum: { 1: "other", 2: "invalid", 3: "learned", 4: "self", 5: "mgmt" } }
    }
};

var BridgeLearnedAddresses_dot1q = {
    BaseOID: '1.3.6.1.2.1.17.7.1.2.2',
    Columns: {
        1: { name: "dot1qTpFdbAddress" },
        2: { name: "dot1qTpFdbPort" },
        3: { name: "dot1qTpFdbStatus", type: "enum", enum: { 1: "other", 2: "invalid", 3: "learned", 4: "self", 5: "mgmt" } }
    }
};

var lldpRemTable = {
    BaseOID: '1.0.8802.1.1.2.1.4.1',
    Columns: {
        1: { name: "lldpRemTimeMark" },
        2: { name: "lldpRemLocalPortNum" },
        3: { name: "lldpRemIndex" },
        4: { name: "lldpRemChassisIdSubtype", type: "enum", enum: { 1:"chassisComponent", 2:"interfaceAlias", 3:"portComponent", 4:"macAddress", 5:"networkAddress", 6: "interfaceName", 7: "local"}},
        5: { name: "lldpRemChassisId" },
        6: { name: "lldpRemPortIdSubtype", type: "enum", enum: { 1:"interfaceAlias", 2:"portComponent", 3:"macAddress", 4:"networkAddress", 5: "interfaceName", 6: "agentCircuitId", 7: "local"}},
        7: { name: "lldpRemPortId"  },
        8: { name: "lldpRemPortDesc", type: "string"  },
        9: { name: "lldpRemSysName", type: "string"  },
        10: { name: "lldpRemSysDesc", type: "string"  },
        11: { name: "lldpRemSysCapSupported", type: "bitmap", enum: { 0:"other", 1:"repeater", 2:"bridge", 3:"wlanAccessPoint", 4: "router", 5: "telephone", 6: "docsisCableDevice", 7: "stationOnly"}},
        12: { name: "lldpRemSysCapEnabled", type: "bitmap", enum: { 0:"other", 1:"repeater", 2:"bridge", 3:"wlanAccessPoint", 4: "router", 5: "telephone", 6: "docsisCableDevice", 7: "stationOnly"}}
    }
};

var VLANPortSetup = {
    BaseOID: '1.3.6.1.2.1.17.7.1.4.2',
    Columns: {
        1: { name:'dot1qVlanTimeMark' },
        2: { name:'dot1qVlanIndex' },
        3: { name:'dot1qVlanFdbId' },
        4: { name:'dot1qVlanCurrentEgressPorts' },
        5: { name:'dot1qVlanCurrentUntaggedPorts' },
        6: { name:'dot1qVlanStatus', type: "enum", enum: { 1:"other", 2:"permanent", 3:"dynamicGvrp"} },
        7: { name:'dot1qVlanCreationTime' }
    }
}

var VLANStaticSettings = {
    BaseOID: '1.3.6.1.2.1.17.7.1.4.3',
    Columns: {
        1: { name: 'dot1qVlanStaticName', type: "string" },
        2: { name: 'dot1qVlanStaticEgressPorts' },
        3: { name: 'dot1qVlanForbiddenEgressPorts' },
        4: { name: 'dot1qVlanStaticUntaggedPorts' },
        5: { name: 'dot1qVlanStaticRowStatus', type: "enum", enum: { 1:"active", 2:"notInService", 3:"notReady"} }
    }
}

var VLANPVIDSettings = {
    BaseOID: '1.3.6.1.2.1.17.7.1.4.5',
    Index: 'dot1dBasePortEntry',
    Columns: {
        1: { name: 'dot1qPvid' },
        2: { name: 'dot1qPortAcceptableFrameTypes', type:"enum", enum: { 1:"admitAll", 2:"admitOnlyVlanTagged"} },
        3: { name: 'dot1qPortIngressFiltering' },
        4: { name: 'dot1qPortGvrpStatus' },
        5: { name: 'dot1qPortGvrpFailedRegistrations' },
        6: { name: 'dot1qPortGvrpLastPduOrigin', type: "mac" }
    }
}