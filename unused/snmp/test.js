const MIBLoader = require('./mibProcessor/MIBLoader');
const myLoader = new MIBLoader();
myLoader.loadMIBDir('c:\\tools\\mib');



// const snmp = require('./original');

// var {SNMP_NetDevice} = require('./snmp_networking');

// async function fullWalk(ip, community) {
//     let lastOID = '1.3.6.1.2.1.2.2';
//     var varBinds = null;
//     let fullSet = [];
//     const repeaters=50;
//     let snmpSession = snmp.createSession(ip, community, { version: snmp.Version2c });
//     do {
//         varBinds = await snmpSession.getBulkAsync([lastOID],0,repeaters);
//         for (let myVarBind of varBinds) {
//             if (snmp.ObjectType[myVarBind.type]) 
//                 myVarBind.type = snmp.ObjectType[myVarBind.type];
//             else
//                 console.log(`Unknown Type ${myVarBind.type}`);
//             fullSet.push(myVarBind);
//             lastOID = myVarBind.oid;
//         }
//         console.log(`Received ${varBinds.length} OIDs ending in ${lastOID}`);
//     } while(varBinds.length>1)
    
// }

// async function BasicTables(ip, community) {
//   let responses = {};
//   let snmpSession = snmp.createSession(ip, community, { version: snmp.Version2c });
//   responses.InterfaceTableDefinition = await snmpSession.tableAsync(InterfaceTableDefinition);
//   responses.HSInterfaceTableDefinition = await snmpSession.tableAsync(HSInterfaceTableDefinition);
//   responses.BridgeInterfaceInformation = await snmpSession.tableAsync(BridgeInterfaceInformation);
//   responses.BridgeLearnedAddresses_dot1d = await snmpSession.tableAsync(BridgeLearnedAddresses_dot1d);
//   responses.BridgeLearnedAddresses_dot1q = await snmpSession.tableAsync(BridgeLearnedAddresses_dot1q);
//   return responses;
// }

// const limitConcurrent = (limit, array, asyncFn) => {
//     let activePromises = 0;
//     let currentIndex = 0;
//     const results = [];
//     const promises = [];
  
//     // Create a recursive function to handle the limiting logic
//     const executeNext = () => {
//       if (currentIndex >= array.length) {
//         return Promise.resolve(); // We're done
//       }
//       const item = array[currentIndex++];
//       activePromises++;
  
//       const promise = asyncFn(item)
//         .then(result => results.push(result))
//         .finally(() => {
//           activePromises--;
//           return executeNext(); // Start the next task when this one finishes
//         });
  
//       promises.push(promise);
  
//       if (activePromises < limit) {
//         return executeNext(); // Fill up the limit
//       }
//       return Promise.resolve(); // Wait until one finishes
//     };
  
//     // Start the first batch of executions
//     for (let i = 0; i < limit; i++) {
//       executeNext();
//     }
  
//     // Wait for all promises to complete
//     return Promise.all(promises).then(() => results);
//   };

//   async function main() {
//     const arrayOfObjects = [
//         {ip:'172.16.0.20', community: 'public' },
//         {ip:'192.168.7.2', community: 'BW15NMp' },
//         {ip:'172.16.0.1', community: 'BW15NMp' },
//         {ip:'192.168.14.7', community: 'BW15NMp' },
//         {ip:'192.168.17.2', community: 'BW15NMp' },
//         {ip:'172.16.0.198', community: 'BW15NMp' },
//         {ip:'172.16.0.199', community: 'BW15NMp' },
//         {ip:'192.168.113.5', community: 'BW15NMp' },
//         {ip:'192.168.113.6', community: 'BW15NMp' },
//         {ip:'192.168.113.3', community: 'BW15NMp' },
//         {ip:'192.168.113.4', community: 'BW15NMp' },
//         {ip:'192.168.113.8', community: 'BW15NMp' },
//         {ip:'192.168.113.7', community: 'BW15NMp' },
//         {ip:'192.168.3.8', community: 'BW15NMp' },
//         {ip:'192.168.10.3', community: 'BW15NMp' },
//         {ip:'192.168.202.5', community: 'BW15NMp' },
//         {ip:'192.168.14.8', community: 'BW15NMp' },
//         {ip:'192.168.14.9', community: 'BW15NMp' },
//         {ip:'192.168.202.9', community: 'BW15NMp' },
//         {ip:'192.168.4.9', community: 'BW15NMp' },
//         {ip:'192.168.5.3', community: 'BW15NMp' },
//         {ip:'192.168.202.6', community: 'BW15NMp' },
//         {ip:'192.168.202.7', community: 'BW15NMp' },
//         {ip:'192.168.3.9', community: 'BW15NMp' },
//         {ip:'172.16.0.63', community: 'BW15NMp' },
//         {ip:'172.16.0.64', community: 'BW15NMp' },
//         {ip:'192.168.113.9', community: 'BW15NMp' },
//         {ip:'172.16.0.114', community: 'BW15NMp' },
//         {ip:'192.168.113.12', community: 'BW15NMp' },
//         {ip:'192.168.113.2', community: 'BW15NMp' },
//         {ip:'192.168.6.3', community: 'BW15NMp' },
//         {ip:'192.168.9.2', community: 'BW15NMp' },
//         {ip:'192.168.19.2', community: 'BW15NMp' },
//         {ip:'192.168.21.2', community: 'BW15NMp' },
//         {ip:'192.168.202.2', community: 'BW15NMp' },
//         {ip:'192.168.7.4', community: 'BW15NMp' },
//         {ip:'192.168.8.4', community: 'BW15NMp' },
//         {ip:'192.168.3.2', community: 'BW15NMp' },
//         {ip:'192.168.3.254', community: 'BW15NMp' },
//         {ip:'192.168.3.3', community: 'BW15NMp' },
//         {ip:'172.16.0.123', community: 'BW15NMp' },
//         {ip:'192.168.11.2', community: 'BW15NMp' },
//         {ip:'192.168.4.8', community: 'BW15NMp' },
//         {ip:'192.168.8.3', community: 'BW15NMp' },
//         {ip:'172.16.0.44', community: 'BW15NMp' },
//         {ip:'192.168.15.2', community: 'BW15NMp' },
//         {ip:'192.168.10.2', community: 'BW15NMp' },
//         {ip:'192.168.14.2', community: 'BW15NMp' },
//         {ip:'192.168.17.3', community: 'BW15NMp' },
//         {ip:'192.168.18.2', community: 'BW15NMp' },
//         {ip:'192.168.4.2', community: 'BW15NMp' },
//         {ip:'192.168.5.2', community: 'BW15NMp' },
//         {ip:'172.16.1.126', community: 'BW15NMp' },
//         {ip:'172.16.1.127', community: 'BW15NMp' },
//         {ip:'192.168.19.203', community: 'public' },
//         {ip:'192.168.19.202', community: 'BW15NMp' },
//         {ip:'172.16.0.187', community: 'BW15NMp' },
//         {ip:'172.16.0.188', community: 'BW15NMp' },
//         {ip:'192.168.202.12', community: 'BW15NMp' },
//         {ip:'192.168.202.13', community: 'BW15NMp' },
//         {ip:'172.16.9.110', community: 'BW15NMp' },
//         {ip:'172.16.9.112', community: 'BW15NMp' },
//         {ip:'172.16.9.113', community: 'BW15NMp' },
//         {ip:'172.16.9.114', community: 'BW15NMp' },
//         {ip:'172.16.9.115', community: 'BW15NMp' },
//         {ip:'172.16.9.116', community: 'BW15NMp' },
//         {ip:'172.16.1.120', community: 'BW15NMp' },
//         {ip:'172.16.1.121', community: 'BW15NMp' },
//         {ip:'172.16.1.122', community: 'BW15NMp' },
//         {ip:'172.16.2.180', community: 'BW15NMp' },
//         {ip:'172.16.2.181', community: 'BW15NMp' },
//         {ip:'192.168.18.4', community: 'BW15NMp' },
//         {ip:'192.168.10.5', community: 'BW15NMp' },
//         {ip:'192.168.15.4', community: 'BW15NMp' },
//         {ip:'192.168.7.3', community: 'BW15NMp' },
//         {ip:'192.168.19.4', community: 'BW15NMp' },
//         {ip:'192.168.10.6', community: 'BW15NMp' },
//         {ip:'192.168.4.4', community: 'BW15NMp' },
//         {ip:'192.168.8.2', community: 'BW15NMp' },
//         {ip:'192.168.8.7', community: 'BW15NMp' },
//         {ip:'192.168.14.5', community: 'BW15NMp' },
//         {ip:'192.168.18.5', community: 'BW15NMp' },
//         {ip:'192.168.4.5', community: 'BW15NMp' },
//         {ip:'192.168.5.4', community: 'BW15NMp' },
//         {ip:'192.168.8.5', community: 'BW15NMp' },
//         {ip:'192.168.10.4', community: 'BW15NMp' },
//         {ip:'172.16.0.10', community: 'BW15NMp' },
//         {ip:'172.16.0.11', community: 'BW15NMp' },
//         {ip:'192.168.10.10', community: 'BW15NMp' },
//         {ip:'192.168.15.10', community: 'BW15NMp' },
//         {ip:'192.168.19.10', community: 'BW15NMp' },
//         {ip:'192.168.6.10', community: 'BW15NMp' },
//         {ip:'192.168.8.10', community: 'BW15NMp' },
//         {ip:'192.168.14.10', community: 'BW15NMp' },
//         {ip:'192.168.17.10', community: 'BW15NMp' },
//         {ip:'172.16.0.208', community: 'private' },
//         {ip:'192.168.10.205', community: 'private' },
//         {ip:'192.168.17.205', community: 'private' },
//         {ip:'192.168.21.10', community: 'private' },
//         {ip:'192.168.10.53', community: 'private' },
//         {ip:'192.168.113.30', community: 'private' },
//         {ip:'192.168.17.21', community: 'private' },
//         {ip:'192.168.18.24', community: 'private' },
//         {ip:'192.168.3.31', community: 'private' },
//         {ip:'192.168.4.67', community: 'private' },
//         {ip:'192.168.7.30', community: 'private' },
//         {ip:'192.168.9.88', community: 'private' },
//         {ip:'192.168.113.200', community: 'public' },
//         {ip:'192.168.10.200', community: 'public' },
//         {ip:'192.168.17.201', community: 'public' },
//         {ip:'192.168.14.208', community: 'public' },
//         {ip:'192.168.9.202', community: 'public' },
//         {ip:'192.168.3.191', community: 'public' },
//         {ip:'192.168.7.202', community: 'public' },
//         {ip:'192.168.17.55', community: 'public' },
//         {ip:'192.168.202.204', community: 'public' },
//         {ip:'192.168.15.204', community: 'public' },
//         {ip:'192.168.18.203', community: 'public' },
//         {ip:'192.168.8.201', community: 'public' },
//         {ip:'192.168.113.207', community: 'public' },
//         {ip:'192.168.113.215', community: 'public' },
//         {ip:'192.168.202.14', community: 'public' },
//         {ip:'172.16.0.185', community: 'public' },
//         {ip:'172.16.0.219', community: 'public' },
//         {ip:'172.16.0.43', community: 'public' },
//         {ip:'172.16.0.47', community: 'public' },
//         {ip:'172.16.0.53', community: 'public' },
//         {ip:'172.16.0.54', community: 'public' },
//         {ip:'172.16.0.67', community: 'public' },
//         {ip:'172.16.0.78', community: 'public' },
//         {ip:'172.16.0.79', community: 'public' },
//         {ip:'192.168.10.212', community: 'public' },
//         {ip:'192.168.11.204', community: 'public' },
//         {ip:'192.168.11.33', community: 'public' },
//         {ip:'192.168.113.165', community: 'public' },
//         {ip:'192.168.113.201', community: 'public' },
//         {ip:'192.168.113.202', community: 'public' },
//         {ip:'192.168.113.205', community: 'public' },
//         {ip:'192.168.113.214', community: 'public' },
//         {ip:'192.168.113.242', community: 'public' },
//         {ip:'192.168.14.206', community: 'public' },
//         {ip:'192.168.18.202', community: 'public' },
//         {ip:'192.168.3.175', community: 'public' },
//         {ip:'192.168.3.192', community: 'public' },
//         {ip:'192.168.3.194', community: 'public' },
//         {ip:'192.168.3.202', community: 'public' },
//         {ip:'192.168.4.202', community: 'public' },
//         {ip:'192.168.4.56', community: 'public' },
//         {ip:'192.168.5.206', community: 'public' },
//         {ip:'192.168.7.200', community: 'public' },
//         {ip:'192.168.9.201', community: 'public' },
//         {ip:'172.16.0.222', community: 'public' },
//         {ip:'172.16.0.57', community: 'public' },
//         {ip:'172.16.0.235', community: 'public' },
//         {ip:'172.16.0.245', community: 'public' },
//         {ip:'192.168.10.208', community: 'public' },
//         {ip:'192.168.14.205', community: 'public' },
//         {ip:'192.168.17.200', community: 'public' },
//         {ip:'172.16.0.45', community: 'public' },
//         {ip:'192.168.3.206', community: 'public' },
//         {ip:'172.16.0.242', community: 'public' },
//         {ip:'192.168.5.207', community: 'public' },
//         {ip:'172.16.0.203', community: 'public' },
//         {ip:'172.16.0.243', community: 'public' },
//         {ip:'192.168.5.209', community: 'public' },
//         {ip:'192.168.3.199', community: 'public' },
//         {ip:'192.168.4.201', community: 'public' },
//         {ip:'192.168.7.201', community: 'public' },
//         {ip:'172.16.0.205', community: 'public' },
//         {ip:'192.168.202.201', community: 'public' },
//         {ip:'192.168.6.201', community: 'public' },
//         {ip:'192.168.14.200', community: 'public' },
//         {ip:'192.168.5.200', community: 'public' },
//         {ip:'192.168.202.203', community: 'public' },
//         {ip:'172.16.0.239', community: 'public' },
//         {ip:'192.168.10.206', community: 'public' },
//         {ip:'192.168.21.202', community: 'public' },
//         {ip:'192.168.3.208', community: 'public' },
//         {ip:'172.16.0.241', community: 'public' },
//         {ip:'192.168.9.200', community: 'public' },
//         {ip:'172.16.0.204', community: 'public' },
//         {ip:'192.168.18.204', community: 'public' },
//         {ip:'192.168.8.202', community: 'public' },
//         {ip:'192.168.10.209', community: 'public' },
//         {ip:'192.168.10.207', community: 'public' },
//         {ip:'192.168.15.202', community: 'public' },
//         {ip:'192.168.6.203', community: 'public' },
//         {ip:'192.168.6.205', community: 'public' },
//         {ip:'172.16.0.197', community: 'public' },
//         {ip:'192.168.4.207', community: 'public' },
//         {ip:'192.168.15.203', community: 'public' },
//         {ip:'192.168.11.202', community: 'public' },
//         {ip:'192.168.20.201', community: 'public' },
//         {ip:'192.168.20.203', community: 'public' },
//         {ip:'192.168.11.203', community: 'public' },
//         {ip:'192.168.21.203', community: 'public' },
//         {ip:'172.16.0.240', community: 'public' },
//         {ip:'172.16.0.77', community: 'public' },
//         {ip:'192.168.3.195', community: 'public' },
//         {ip:'172.16.0.92', community: 'public' },
//         {ip:'192.168.3.193', community: 'public' },
//         {ip:'172.16.0.216', community: 'public' },
//         {ip:'192.168.3.197', community: 'public' },
//         {ip:'172.16.0.42', community: 'public' },
//         {ip:'172.16.0.25', community: 'public' },
//         {ip:'192.168.3.196', community: 'public' },
//         {ip:'192.168.3.198', community: 'public' },
//         {ip:'192.168.3.190', community: 'public' },
//         {ip:'172.16.0.224', community: 'public' },
//         {ip:'172.16.0.218', community: 'public' },
//         {ip:'172.16.0.46', community: 'public' },
//         {ip:'172.16.0.202', community: 'public' },
//         {ip:'192.168.113.206', community: 'public' },
//         {ip:'192.168.7.205', community: 'public' },
//         {ip:'192.168.5.208', community: 'public' },
//         {ip:'192.168.3.210', community: 'public' },
//         {ip:'192.168.10.32', community: 'public' },
//         {ip:'192.168.15.27', community: 'public' },
//         {ip:'192.168.113.33', community: 'public' },
//         {ip:'192.168.14.25', community: 'public' },
//         {ip:'192.168.17.31', community: 'public' },
//         {ip:'192.168.21.26', community: 'public' },
//         {ip:'192.168.7.22', community: 'public' },
//         {ip:'192.168.8.21', community: 'public' },
//         {ip:'192.168.8.22', community: 'public' },
//         {ip:'192.168.113.29', community: 'public' },
//         {ip:'192.168.113.31', community: 'public' },
//         {ip:'192.168.113.35', community: 'public' },
//         {ip:'192.168.113.42', community: 'public' },
//         {ip:'192.168.113.44', community: 'public' },
//         {ip:'192.168.113.46', community: 'public' },
//         {ip:'192.168.113.58', community: 'public' },
//         {ip:'192.168.14.22', community: 'public' },
//         {ip:'192.168.14.23', community: 'public' },
//         {ip:'192.168.14.29', community: 'public' },
//         {ip:'192.168.14.31', community: 'public' },
//         {ip:'192.168.14.42', community: 'public' },
//         {ip:'192.168.17.35', community: 'public' },
//         {ip:'192.168.19.27', community: 'public' },
//         {ip:'192.168.202.23', community: 'public' },
//         {ip:'192.168.202.25', community: 'public' },
//         {ip:'192.168.202.26', community: 'public' },
//         {ip:'192.168.202.40', community: 'public' },
//         {ip:'192.168.202.41', community: 'public' },
//         {ip:'192.168.202.46', community: 'public' },
//         {ip:'192.168.202.47', community: 'public' },
//         {ip:'192.168.202.52', community: 'public' },
//         {ip:'192.168.3.22', community: 'public' },
//         {ip:'192.168.3.34', community: 'public' },
//         {ip:'192.168.3.42', community: 'public' },
//         {ip:'192.168.3.45', community: 'public' },
//         {ip:'192.168.3.48', community: 'public' },
//         {ip:'192.168.4.40', community: 'public' },
//         {ip:'192.168.5.57', community: 'public' },
//         {ip:'172.16.0.172', community: 'public' },
//         {ip:'172.16.10.18', community: 'public' },
//         {ip:'192.168.14.254', community: 'public' },
//         {ip:'192.168.4.206', community: 'public' },
//         {ip:'172.16.0.56', community: 'public' },
//         {ip:'192.168.6.202', community: 'public' },
//         {ip:'192.168.8.203', community: 'public' },
//         {ip:'192.168.3.201', community: 'public' },
//         {ip:'172.16.0.55', community: 'public' },
//         {ip:'192.168.10.202', community: 'public' },
//         {ip:'192.168.113.209', community: 'public' },
//         {ip:'192.168.4.210', community: 'public' },
//         {ip:'192.168.202.200', community: 'public' },
//         {ip:'172.16.0.49', community: 'public' },
//         {ip:'172.16.0.194', community: 'public' },
//         {ip:'192.168.113.212', community: 'public' },
//         {ip:'192.168.113.27', community: 'public' },
//         {ip:'192.168.202.10', community: 'public' },
//         {ip:'192.168.5.10', community: 'public' },
//     ];
  
//     const results = await limitConcurrent(10, arrayOfObjects, obj =>
//       BasicTables(obj.ip, obj.community)
//     );
  
//     console.log('All tasks finished:', results);
//   }



//   var InterfaceTableDefinition = {
//     BaseOID: "1.3.6.1.2.1.2.2",
//     Columns: {
//         1: { name: "ifIndex" },
//         2: { name: "ifDescr", type: "string" },
//         3: { name: "ifType", type: "enum", enum: { 1: 'other', 2: 'regular1822', 3: 'hdh1822', 4: 'ddn-x25', 5: 'rfc877-x25', 6: 'ethernet-csmacd', 7: 'iso88023-csmacd', 8: 'iso88024-tokenBus', 9: 'iso88025-tokenRing', 10: 'iso88026-man', 11: 'starLan', 12: 'proteon-10Mbit', 13: 'proteon-80Mbit', 14: 'hyperchannel', 15: 'fddi', 16: 'lapb', 17: 'sdlc', 18: 'ds1', 19: 'e1', 20: 'basicISDN', 21: 'primaryISDN', 22: 'propPointToPointSerial', 23: 'ppp', 24: 'softwareLoopback', 25: 'eon', 26: 'ethernet-3Mbit', 27: 'nsip', 28: 'slip', 29: 'ultra', 30: 'ds3', 31: 'sip', 32: 'frame-relay' } },
//         4: { name: "ifMtu" },
//         5: { name: "ifSpeed" },
//         6: { name: "ifPhysAddress", type: "hex" },
//         7: { name: "ifAdminStatus", type: "enum", enum: { 1: "up", 2: "down", 3: "testing" } },
//         8: { name: "ifOperStatus", type: "enum", enum: { 1: "up", 2: "down", 3: "testing" } },
//         9: { name: "ifLastChange" },
//         10: { name: "ifInOctets" },
//         11: { name: "ifInUcastPkts" },
//         12: { name: "ifInNUcastPkts" },
//         13: { name: "ifInDiscards" },
//         14: { name: "ifInErrors" },
//         15: { name: "ifInUnknownProtos" },
//         16: { name: "ifOutOctets" },
//         17: { name: "ifOutUcastPkts" },
//         18: { name: "ifOutNUcastPkts" },
//         19: { name: "ifOutDiscards" },
//         20: { name: "ifOutErrors" },
//         21: { name: "ifOutQLen" },
//         22: { name: "ifSpecific" }
//     }
// };

// var HSInterfaceTableDefinition = {
//     BaseOID: '1.3.6.1.2.1.31.1.1',
//     Columns: {
//         1: { name: "ifName", type: "string" },
//         2: { name: "ifInMulticastPkts" },
//         3: { name: "ifInBroadcastPkts" },
//         4: { name: "ifOutMulticastPkts" },
//         5: { name: "ifOutBroadcastPkts" },
//         6: { name: "ifHCInOctets", type: "uint64" },
//         7: { name: "ifHCInUcastPkts", type: "uint64" },
//         8: { name: "ifHCInMulticastPkts", type: "uint64" },
//         9: { name: "ifHCInBroadcastPkts", type: "uint64" },
//         10: { name: "ifHCOutOctets", type: "uint64" },
//         11: { name: "ifHCOutUcastPkts", type: "uint64" },
//         12: { name: "ifHCOutMulticastPkts", type: "uint64" },
//         13: { name: "ifHCOutBroadcastPkts", type: "uint64" },
//         14: { name: "ifLinkUpDownTrapEnable" },
//         15: { name: "ifHighSpeed" },
//         16: { name: "ifPromiscuousMode" },
//         17: { name: "ifConnectorPresent" },
//         18: { name: "ifAlias", type: "string" },
//         19: { name: "ifCounterDiscontinuityTime" }
//     }
// };

// var BridgeInterfaceInformation = {
//     BaseOID: '1.3.6.1.2.1.17.1.4',
//     Columns: {
//         1: { name: "dot1dBasePort" },
//         2: { name: "dot1dBasePortIfIndex" },
//         3: { name: "dot1dBasePortCircuit", type: "string" },
//         4: { name: "dot1dBasePortDelayExceededDiscards" },
//         5: { name: "dot1dBasePortMtuExceededDiscards" }
//     }
// };

// var BridgeLearnedAddresses_dot1d = {
//     BaseOID: '1.3.6.1.2.1.17.4.3',
//     Columns: {
//         1: { name: "dot1dTpFdbAddress", type: "hex" },
//         2: { name: "dot1dTpFdbPort" },
//         3: { name: "dot1dTpFdbStatus", type: "enum", enum: { 1: "other", 2: "invalid", 3: "learned", 4: "self", 5: "mgmt" } }
//     }
// };

// var BridgeLearnedAddresses_dot1q = {
//     BaseOID: '1.3.6.1.2.1.17.7.1.2.2',
//     Columns: {
//         1: { name: "dot1qTpFdbAddress", type: "hex" },
//         2: { name: "dot1qTpFdbPort" },
//         3: { name: "dot1qTpFdbStatus", type: "enum", enum: { 1: "other", 2: "invalid", 3: "learned", 4: "self", 5: "mgmt" } }
//     }
// };



// main();