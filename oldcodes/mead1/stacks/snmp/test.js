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


// Ping many IPs concurrently in batches
async function scanIPRange(range) {
  const ips = expandRange(range);
  const results = {};
  const concurrency = 20;
  for (let ip of ips) {
    let result = await ping.promise.probe(ip, { timeout: 2 });
    if (result.alive) console.log(ip+" is alive.")
  }

  return results;
}

// Example usage
// (async () => {
//   const results = await scanIPRange('10.17.1.1-10.17.1.254');
//   console.log(results);
// })();












// const job = require('./jobs/snmpDeviceDiscovery')
// const myJob = new job()

// const config = {hosts: ['10.17.1.11','10.17.1.114','10.17.1.12','10.17.1.13','10.17.1.15','10.17.1.16','10.17.1.180','10.17.1.181','10.17.1.184','10.17.1.6','10.17.1.7','10.17.1.91','10.17.102.11','10.17.102.12','10.17.102.13','10.17.102.14','10.17.102.15',
// '10.17.104.13','10.17.104.15','10.17.107.12','10.17.113.12','10.17.113.13','10.17.113.14','10.17.113.15','10.17.113.16','10.17.113.17','172.16.0.1','172.16.0.10','172.16.0.11','172.16.0.172','172.16.0.185','172.16.0.187','172.16.0.188','172.16.0.197','172.16.0.198',
// '172.16.0.199','172.16.0.203','172.16.0.204','172.16.0.205','172.16.0.216','172.16.0.218','172.16.0.219','172.16.0.222','172.16.0.224','172.16.0.235','172.16.0.239','172.16.0.240','172.16.0.241','172.16.0.242','172.16.0.243','172.16.0.245','172.16.0.25','192.168.3.9',
// '172.16.0.41','172.16.0.42','172.16.0.43','172.16.0.45','172.16.0.46','172.16.0.47','172.16.0.53','172.16.0.54','172.16.0.57','172.16.0.63','172.16.0.64','172.16.0.67','172.16.0.77','172.16.0.79','172.16.0.92','172.16.1.120','172.16.1.121','172.16.1.122','172.16.1.126',
// '172.16.1.127','172.16.10.18','172.16.2.180','172.16.2.181','172.16.9.110','172.16.9.112','172.16.9.113','172.16.9.114','172.16.9.115','172.16.9.116','192.168.10.2','192.168.10.200','192.168.10.206','192.168.10.207','192.168.10.208','192.168.10.209','192.168.10.212',
// '192.168.10.10','192.168.10.3','192.168.10.53','192.168.202.14','192.168.11.2','192.168.11.202','192.168.11.203','192.168.11.204','192.168.113.215','172.16.0.56','192.168.8.203','192.168.6.202','192.168.3.201','192.168.113.209','172.16.0.55','192.168.202.200','192.168.4.210',
// '192.168.4.206','192.168.17.55','192.168.10.202','172.16.0.20','192.168.113.212','172.16.0.194','192.168.11.33','192.168.113.165','192.168.18.4','192.168.7.3','192.168.10.5','192.168.15.4','192.168.4.4','192.168.4.7','192.168.10.6','192.168.4.5','192.168.5.4','192.168.14.5',
// '192.168.18.5','192.168.10.4','192.168.113.200','192.168.113.201','192.168.113.202','192.168.113.27','172.16.0.202','192.168.3.205','192.168.5.204','192.168.113.206','172.16.0.209','192.168.113.205','192.168.113.214','192.168.113.242','192.168.113.250','192.168.113.30',
// '192.168.14.2','192.168.14.200','192.168.14.205','192.168.14.206','192.168.14.207','192.168.14.208','192.168.15.10','192.168.14.254','192.168.5.205','192.168.113.251','172.16.0.207','192.168.14.7','192.168.14.8','192.168.14.9','172.16.0.49','192.168.17.10','192.168.19.10',
// '192.168.15.2','192.168.15.202','192.168.15.203','192.168.15.204','192.168.17.2','192.168.17.200','192.168.17.201','192.168.17.3','192.168.17.46','192.168.18.202','192.168.18.203','192.168.18.204','192.168.18.24','192.168.19.202','192.168.19.203','192.168.19.204',
// '192.168.202.10','192.168.20.200','192.168.20.201','192.168.20.203','192.168.202.12','192.168.202.13','192.168.202.201','192.168.202.202','192.168.202.203','192.168.202.204','192.168.21.10','192.168.202.26','192.168.21.2','192.168.21.202','192.168.21.203','192.168.3.175',
// '192.168.3.188','192.168.3.190','192.168.3.191','192.168.3.192','192.168.3.193','192.168.3.194','192.168.3.195','192.168.3.196','192.168.3.197','192.168.3.198','192.168.3.199','192.168.3.2','192.168.3.202','192.168.3.206','192.168.3.208','192.168.3.210','192.168.3.254',
// '192.168.3.3','192.168.3.31','192.168.3.8','192.168.4.2','192.168.4.201','192.168.4.202','192.168.4.207','192.168.5.10','192.168.4.56','192.168.4.67','192.168.4.8','192.168.4.9','192.168.5.2','192.168.5.200','192.168.5.206','192.168.5.207','192.168.5.208','192.168.5.209',
// '192.168.6.10','192.168.5.3','192.168.5.31','192.168.6.201','192.168.6.203','192.168.6.205','192.168.6.3','192.168.7.200','192.168.7.201','192.168.7.202','192.168.7.30','192.168.7.4','192.168.8.201','192.168.8.202','192.168.8.10','192.168.8.3','192.168.8.4','192.168.9.2',
// '192.168.9.200','192.168.9.201','192.168.9.202'],
// communities: ['BW15NMp', 'BW15NMpro', 'BW15NMprw', 'private', 'public']}
// myJob.runJob(config)





















// let snmp = require('./util');
// const fs = require('fs'); // Add this to handle file writing
// const tables = require('./util/snmpTableDefinitions');
// const { parse } = require('json2csv'); // Add this to handle CSV conversion

// let switches=[];
// let vlans = {};

// function getTimeAgo(sysUpTimeCentisecs) {
//     const uptimeMs = sysUpTimeCentisecs * 10; // 100ths of a second to milliseconds
//     const now = Date.now(); // current time in ms
//     const bootTime = new Date(now - uptimeMs);
//     return bootTime;
//   }

// async function walkIt(ip, community) {
//     console.log(`Walking ${ip}...`);
//     let snmpSession = new snmp.Session({ target: ip, community: community, version: snmp.enums.Version['2c'] });
//     let fullWalk = await snmpSession.getFullWalk('1.0');
    
//     // Convert BigInt values to strings
//     const sanitizedWalk = JSON.parse(JSON.stringify(fullWalk, (key, value) =>
//         typeof value === 'bigint' ? value.toString() : value
//     ));
    
//     // Write sanitizedWalk to a JSON file named by the IP
//     fs.writeFileSync(`${ip}.json`, JSON.stringify(sanitizedWalk, null, 2));
//     console.log(`Full walk for ${ip} saved to ${ip}.json`);
// }

// async function getSubtree(ip, community, oid) {
//     let snmpSession = new snmp.Session({ target: ip, community: community, version: snmp.enums.Version['2c'] });
//     let subtree = await snmpSession.getSubtree(oid);
// }

// async function getInterfaceTable(ip, community, tableDef) {
//     let snmpSession = new snmp.Session({ target: ip, community: community, version: snmp.enums.Version['2c'] });
//     let interfaceTable = await snmpSession.getTable(tableDef);
//     return interfaceTable;
// }

// async function exportInterfaceRowsToCSV(interfaceRows, filename) {
//     try {
//         const rows = Object.values(interfaceRows); // Convert object to array
//         const csv = parse(rows); // Convert JSON to CSV
//         fs.writeFileSync(filename, csv); // Write CSV to file
//         console.log(`Interface rows exported to ${filename}`);
//     } catch (error) {
//         console.error('Error exporting interface rows to CSV:', error);
//     }
// }

// async function appendInterfaceRowsToCSV(interfaceRows, filename) {
//     try {
//         const rows = Object.values(interfaceRows); // Convert object to array
//         const csv = parse(rows, { header: false }); // Convert JSON to CSV without headers
//         fs.appendFileSync(filename, '\n' + csv); // Append CSV to file
//         console.log(`Interface rows appended to ${filename}`);
//     } catch (error) {
//         console.error('Error appending interface rows to CSV:', error);
//     }
// }

// async function getSwitchData(ip, community) {
//     let myConfig = { vlans: {}, switchInformation: {}, interfaces: {}, devices: [] };
//     let snmpSession = new snmp.Session({ target: ip, community: community, version: snmp.enums.Version['2c'] });
//     let SystemInfoScalar = await snmpSession.getTable(tables['SystemInfoScalar']);
//     let interfaceTable = await snmpSession.getTable(tables['InterfaceTable']);
//     let highspeedTable = await snmpSession.getTable(tables['HighSpeedInterfaceTable']);
//     let dot1dPort = await snmpSession.getTable(tables['dot1dBasePortTable']);
//     let entPhysicalTable = await snmpSession.getTable(tables['entPhysicalTable']);
//     let entAliasMappingTable = await snmpSession.getTable(tables['entAliasMappingTable']);
//     let pethPsePortTable = await snmpSession.getTable(tables['pethPsePortTable']);

//     //Most switches use these for VLANs
//     let dot1qVlanCurrentTable = await snmpSession.getTable(tables['dot1qVlanCurrentTable']);
//     let dot1qVlanStaticTable = await snmpSession.getTable(tables['dot1qVlanStaticTable']);

//     //Older Ciscos use these for VLANs:
//     let vlanTrunkPortTable = await snmpSession.getTable(tables['vlanTrunkPortTable']);

//     let dot1xPaePortTable = await snmpSession.getTable(tables['dot1xPaePortTable']);
//     let dot1dTpFdbTable = await snmpSession.getTable(tables['dot1dTpFdbTable']);
//     let dot1qTpFdbTable = await snmpSession.getTable(tables['dot1qTpFdbTable']);
//     let lldpRemTable = await snmpSession.getTable(tables['lldpRemTable']);
//     pethPsePortTable=pethPsePortTable;
//     let interfaceRows = {};

//     //Basic System Information
//     myConfig.switchInformation.name = SystemInfoScalar[0].sysName;
//     myConfig.switchInformation.description = SystemInfoScalar[0].sysDescr;
//     myConfig.switchInformation.location = SystemInfoScalar[0].sysLocation;
//     myConfig.switchInformation.contact = SystemInfoScalar[0].sysContact;
//     myConfig.switchInformation.lastBoot = getTimeAgo(SystemInfoScalar[0].sysUpTime)

//     //Build Entity Physical Table
//     let physical = {};
//     for (let idx in entPhysicalTable) {
//         const myentry = entPhysicalTable[idx];
//         let component = {};
//         component.physicalComponentID = myentry.entPhysicalIndex;
//         component.componentClass = myentry.entPhysicalClass;
//         component.name = myentry.entPhysicalName;
//         component.parentID = myentry.entPhysicalContainedIn;
//         component.parentOrder = myentry.entPhysicalParentRelPos;
//         component.physicalDescription = myentry.entPhysicalDescr;
//         component.manufacturerName = myentry.entPhysicalMfgName;
//         component.modelName = myentry.entPhysicalModelName;
//         component.serialNumber = myentry.entPhysicalSerialNum;
//         component.softwareRevision = myentry.entPhysicalSoftwareRev;
//         component.isFRU = myentry.entPhysicalIsFRU;
//         component.children = [];
//         physical[myentry.entPhysicalIndex]=component;
//     }

//     for (let phyid in physical) {
//         const thisEntry = physical[phyid];
//         const parentEntry = physical[thisEntry.parentID];

//         if (physical[phyid].parentID==0) {
//             if (myConfig.physical)
//                 throw new Error("There are more than one physical roots!");
//             myConfig.physical=physical[phyid]
//             continue;
//         }
//         if (!parentEntry) {
//             console.warn("Unable to find parent entity!");
//             continue;
//         }
//         parentEntry.children.push(thisEntry);
//     }

//     for (let idx in interfaceTable) {
//         //idx is ifIndex here.
//         if (!interfaceRows[idx]) 
//             interfaceRows[idx] = {};
//         thisRow = interfaceRows[idx];
//         thisRow.ip=ip;
//         thisRow.ifIndex = interfaceTable[idx].ifIndex;
//         thisRow.ifName = interfaceTable[idx].ifName;
//         thisRow.ifDescr = interfaceTable[idx].ifDescr;
//         thisRow.ifType = interfaceTable[idx].ifType;
//         thisRow.ifMtu = interfaceTable[idx].ifMtu;
//         thisRow.ifSpeed = interfaceTable[idx].ifSpeed;
//         thisRow.ifPhysAddress = interfaceTable[idx].ifPhysAddress;
//         thisRow.ifAdminStatus = interfaceTable[idx].ifAdminStatus;
//         thisRow.ifOperStatus = interfaceTable[idx].ifOperStatus;
//         if (interfaceTable[idx].ifLastChange>0)
//             thisRow.ifLastChange = getTimeAgo(interfaceTable[idx].ifLastChange);
//         else
//             thisRow.ifLastChange = getTimeAgo(SystemInfoScalar[0].sysUpTime)
//         thisRow.ifLastChange = interfaceTable[idx].ifLastChange;
//         thisRow.vlanTagged = [];
//         thisRow.vlanUntagged = [];
//         thisRow.vlanNative = 0;
//         thisRow.lldpRemotes=[];
//         thisRow.MACTable=[];
//     }
//     for (let idx in highspeedTable) {
//         if (!interfaceRows[idx]) 
//             interfaceRows[idx] = {};
//         thisRow = interfaceRows[idx];
//         thisRow.ifHighSpeed = highspeedTable[idx].ifHighSpeed;
//         thisRow.ifName = highspeedTable[idx].ifName;
//         thisRow.ifAlias = highspeedTable[idx].ifAlias;
//     }
//     for (let idx in dot1dPort) {
//         //idx is dot1dBasePort here. ifIndex is in dot1dBasePortIfIndex        
//         const ifIndex = dot1dPort[idx].dot1dBasePortIfIndex;
//         if (!interfaceRows[ifIndex]) 
//             interfaceRows[ifIndex] = {};
//         thisRow = interfaceRows[ifIndex];
//         thisRow.dot1dBasePort = dot1dPort[idx].dot1dBasePort;
//     }
//     if (Object.keys(dot1dPort).length==0) {
//         //Since the dot1d Bridgeport information isn't filled in, we're going to set it to the same as the ifIndex in an attempt to fill in gaps.
//         for (const idx in interfaceRows)
//             interfaceRows[idx].dot1dBasePort=interfaceRows[idx].ifIndex;
//     }
//     for (let idx in pethPsePortTable) {
//     //idx is dot1dBasePort here. ifIndex is in dot1dBasePortIfIndex
//     let dot1dBasePort = pethPsePortTable[idx].pethPsePortIndex //This is wrong, but I'm going with it for now on the Fortiswitch. Need to check Cisco.
//         let ifaceRow = Object.values(interfaceRows).find(a => ((a.dot1dBasePort??0) == dot1dBasePort));
//         if (!ifaceRow) {
//             console.warn("Unable to find POE port!");
//             continue;
//         }
//         let ifIndex = ifaceRow.ifIndex //This is wrong, but I'm going with it for now on the Fortiswitch. Need to check Cisco.
//         interfaceRows[ifIndex].pethPsePortAdminEnable = pethPsePortTable[idx].pethPsePortAdminEnable;    
//         interfaceRows[ifIndex].pethPsePortDetectionStatus = pethPsePortTable[idx].pethPsePortDetectionStatus;    
//         interfaceRows[ifIndex].pethPsePortType = pethPsePortTable[idx].pethPsePortType;    
//         interfaceRows[ifIndex].pethPsePortPowerClassifications = pethPsePortTable[idx].pethPsePortPowerClassifications;    
//     }

//     //VLAN Data
//     for (const idx in dot1qVlanStaticTable) {
//         vlanRow = dot1qVlanStaticTable[idx];
//         vlanID = vlanRow.dot1qVlanIndex;
//         if (typeof vlanID === 'string')
//             vlanID = parseInt(vlanID.split('.').slice(-1)[0])

//         if (!myConfig.vlans[vlanID]) myConfig.vlans[vlanID] = { name: vlanRow.dot1qVlanStaticName }
//         for (portnum of vlanRow.dot1qVlanStaticUntaggedPorts) {
//             let ifaceRow = Object.values(interfaceRows).find(a => ((a.dot1dBasePort??0) == portnum));
//             if (!ifaceRow)
//                 throw new Error("Interface not found!");
//             if (!ifaceRow.vlanNative) ifaceRow.vlanNative = vlanID;
//             if (!ifaceRow.vlanUntagged.includes(vlanID)) ifaceRow.vlanUntagged.push(vlanID);
         
//         }
//         for (portnum of vlanRow.dot1qVlanStaticEgressPorts) {
//             let ifaceRow = Object.values(interfaceRows).find(a => ((a.dot1dBasePort??0) == portnum));
//             if (!ifaceRow)
//                 throw new Error("Interface not found!");
//             if (!ifaceRow.vlanUntagged.includes(vlanID)&&!ifaceRow.vlanTagged.includes(vlanID)) ifaceRow.vlanTagged.push(vlanID);
         
//         }
//     }
//     for (const idx in dot1qVlanCurrentTable) {
//         vlanRow = dot1qVlanCurrentTable[idx];
//         vlanID = vlanRow.dot1qVlanIndex;
//         if (typeof vlanID === 'string')
//             vlanID = parseInt(vlanID.split('.').slice(-1)[0])
//         if (!myConfig.vlans[vlanID]) myConfig.vlans[vlanID] = { name: 'vlan'+vlanID }
//         for (portnum of vlanRow.dot1qVlanCurrentUntaggedPorts) {
//             let ifaceRow = Object.values(interfaceRows).find(a => ((a.dot1dBasePort??0) == portnum));
//             if (!ifaceRow)
//                 throw new Error("Interface not found!");
//             if (!ifaceRow.vlanNative) ifaceRow.vlanNative = vlanID;
//             if (!ifaceRow.vlanUntagged.includes(vlanID)) ifaceRow.vlanUntagged.push(vlanID);
         
//         }
//         for (portnum of vlanRow.dot1qVlanCurrentEgressPorts) {
//             let ifaceRow = Object.values(interfaceRows).find(a => ((a.dot1dBasePort??0) == portnum));
//             if (!ifaceRow)
//                 throw new Error("Interface not found!");
//             if (!ifaceRow.vlanUntagged.includes(vlanID)&&!ifaceRow.vlanTagged.includes(vlanID)) ifaceRow.vlanTagged.push(vlanID);
         
//         }
//     }
//     //STP Data

//     //LLDP Data
//     //await exportInterfaceRowsToCSV(lldpRemTable, 'lldp.csv');
//     for (const idx in lldpRemTable) {

//         let lldpRow = lldpRemTable[idx];
//         lldpRow=lldpRow;


//         let ifIndex = null;
//         let macAddress = '';
//         let macAddress2 = '';
//         let ipAddress = '';
//         let portID = '';
//         let portDescription = '';
//         let remName = '';
//         let remSysDescription = '';

//         let ifaceRow = Object.values(interfaceRows).find(a => ((a.dot1dBasePort??0) == lldpRow.lldpRemLocalPortNum));
//         if (!ifaceRow) {
//             console.warn("Interface not found. dot1d index is ",lldpRow.lldpRemLocalPortNum);
//             continue;
//         }
//             //throw new Error("Interface not found!");
//         ifIndex = ifaceRow.ifIndex;

//         switch (lldpRow.lldpRemChassisIdSubtype) {
//             case "local":
//                 remName = lldpRow.lldpRemChassisId;
//                 break;
//             case "macAddress":
//                 macAddress = lldpRow.lldpRemChassisId;
//                 break;
//             case "networkAddress":
//                 ipAddress = lldpRow.lldpRemChassisId;
//                 break;
//             default:
//                 console.log("Unknown chassis ID",lldpRow.lldpRemChassisIdSubtype)
//         }
//         switch (lldpRow.lldpRemPortIdSubtype) {
//             case "portComponent":
//                 if (!macAddress)
//                     macAddress = lldpRow.lldpRemPortId;
//                 else
//                     macAddress2 = lldpRow.lldpRemPortId;                
//                 break;
//             case "networkAddress":
//                 portID = lldpRow.lldpRemPortId;
//                 break;
//             default:
//                 console.log("Unknown port ID",lldpRow.lldpRemPortIdSubtype)
//         }
//         if (lldpRow.lldpRemPortDesc)
//             portDescription = lldpRow.lldpRemPortDesc;
//         if (lldpRow.lldpRemSysName)
//             remName = lldpRow.lldpRemSysName;
//         if (lldpRow.lldpRemSysDesc)
//             remSysDescription = lldpRow.lldpRemSysDesc;
//         if (macAddress.length == 6) {
//             macAddress = Array.from(macAddress, byte => byte.charCodeAt(0).toString(16).padStart(2, '0') ).join(':');
//         }
//         if (macAddress2.length == 6) {
//             macAddress2 = Array.from(macAddress2, byte => byte.charCodeAt(0).toString(16).padStart(2, '0') ).join(':');
//         }
//         if (ipAddress.length == 4) {
//             ipAddress = Array.from(ipAddress, byte => byte.charCodeAt(0).toString() ).join('.');
//         }
//         if (ipAddress.length == 5) {
//             ipAddress = Array.from(ipAddress.slice(1), byte => byte.charCodeAt(0).toString() ).join('.');
//         }
//         if (macAddress == macAddress2) macAddress2 = '';
//         ifaceRow.lldpRemotes.push({ macAddress, macAddress2, ipAddress, portID, portDescription, remName, remSysDescription})
//     }
//     //MAC Data

//     myConfig.interfaces=interfaceRows;

//     const csvFilename = `interfaceRows.csv`;

//     // Export or append interfaceRows to CSV
//     if (fs.existsSync(csvFilename)) {
//         await appendInterfaceRowsToCSV(interfaceRows, csvFilename);
//     } else {
//         await exportInterfaceRowsToCSV(interfaceRows, csvFilename);
//     }
// }



// //getInterfaceTable('10.17.1.16', 'BW15NMp', tables['dot1qVlanStaticTable'])

// async function getAllTables(ip,community) {
//     let tblResults = {};
//     for (let tblName in tables) {
//         console.log(tblName)
//         tblResults[tblName] = await getInterfaceTable(ip, community,tables[tblName]);
// }    
//     tblResults=tblResults;
// }



// async function snmpCheck(hostname, community, version) {

// }

// async function runTest() {
//     const mySession = await snmpCheck('172.16.0.119','BW15NMp', '1');
//     if (!mySession) {
//         console.log("Failed")
//     }
//     //await getSwitchData('172.16.0.119','BW15NMp')
//     //let test3 = await getInterfaceTable('10.17.1.11','BW15NMp',tables['ipNetToMediaTable'])
//     console.log("Done!!!!");
    
// }
// //runTest();


// function cleanupWalk(ip) {
//     let knownOids = [];
//     for (let tblName in tables) {
//         let baseOID = tables[tblName].baseOID;
//         if ((tables[tblName].rowGroup??'1')!=='') 
//             baseOID+='.'+(tables[tblName].rowGroup??'1');
//         for (let colNum in tables[tblName].columns) {
//             let colOID = baseOID + '.' + colNum + '.';
//             knownOids.push(colOID);
//         }
//     }
    
//     let myWalk = JSON.parse(fs.readFileSync(`${ip}.json`, 'utf8'));
//     let oidCount = Object.keys(myWalk).length;
//     for (let oid in myWalk) {
//         for (let knownOid of knownOids) {
//             if (oid.startsWith(knownOid)) {
//                 delete myWalk[oid]
//                 break;
//             }
//         }
//     }    
//     fs.writeFileSync(`${ip}.json`, JSON.stringify(myWalk, null, 2));
//     console.log(`Removed ${oidCount - Object.keys(myWalk).length} OIDs from ${ip}.json`);
// }
// ;




// //Interface
// //HighSpeed
// //STP Information
// //PoE Information
// //LLDP Information
// //VLAN Information
// //MAC Address Table

// //Other: ARP Table
