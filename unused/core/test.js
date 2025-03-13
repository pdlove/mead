const { Op } = require('sequelize');

const { hotspringGlobal, hotspringStack, hotspringData }  = require('hotspring');
const snmp = require('../snmp/original');
const path = require('path');


async function runTest() {
    hotspringData.initialize('postgres',{server: 'localhost', user:'postgres',password:'Passw0rd',database:'mead'});
    hotspringData.loadModel(path.resolve(__dirname,'../','stacks','network_management','models','device.js'));
    hotspringData.loadModel(path.resolve(__dirname,'../','stacks','snmp','models','snmpWalk.js'));
    hotspringData.loadModel(path.resolve(__dirname,'../','stacks','snmp','models','snmpWalkValue.js'));
    hotspringData.loadModel(path.resolve(__dirname,'../','stacks','snmp','models','snmpWalkLatestValue.js'));
//    await hotspringData.sequelize.sync();

    await performSnmpWalkAndUpload("172.16.0.1","BW15NMp","1")
    //    let newStack = await hotspringStack.loadFromPath('snmp');
    //newStack=newStack;
}

async function getOrCreateDevice(ip, deviceData) {
    if (!deviceData) deviceData={name: ip};
    const device = await hotspringData.models.Device.findOne({ where: { managementIP: ip } });
    
    if (!device) {
        // If device doesn't exist, create a new one
        return await hotspringData.models.Device.create({
            name: deviceData.name,
            location: deviceData.location,
            managementIP: ip,
            managementVLAN: deviceData.managementVLAN,
            managementMAC: deviceData.managementMAC,
            snmpCommunity: deviceData.snmpCommunity,
            snmpVersion: deviceData.snmpVersion
        });
    }

    return device; // Return the existing device
}

async function fetchCurrentValuesForOIDTree(deviceId, rootOID) {
    return await hotspringData.models.snmpWalkLatestValue.findAll({
        where: {
            deviceId: deviceId,
            oid: {
                [Op.like]: `${rootOID}.%` // Fetch all OIDs that start with the rootOID
            }
        }
    });
}


async function performSnmpWalkAndUpload(ip, community, rootOID) {
    try {
        // Fetch or create the device by IP
        const device = await getOrCreateDevice(ip, {
            name: 'Device Name', // Add appropriate device name
            location: 'Device Location',
            snmpCommunity: community,
            snmpVersion: '2c' // Example SNMP version
        });

        // Create a new SNMP walk
        const newSnmpWalk = await createSnmpWalk(device.deviceId, ip, community, rootOID);

        // Call your existing fullWalk function to get the walk data
        const walkResults = await fullWalk(ip, community, rootOID);
        const walkTimeStamp = new Date();

        // Fetch all existing current values for the rootOID tree
        const currentValues = await fetchCurrentValuesForOIDTree(device.deviceId, rootOID);

        // Create a map for quick lookup by OID
        const currentValuesMap = {};
        currentValues.forEach(value => {
            value.used = false;
            currentValuesMap[value.oid] = value;

        });

        let walkDBEntries = [];
        // Iterate through the walk results and upload them
        for (const result of walkResults) {
            const existingCurrentValue = currentValuesMap[result.oid];
            
            let thisValue = {oid: result.oid,
                value: result.value,
                valueType: result.type,
                timestamp: walkTimeStamp,
                snmpWalkId: newSnmpWalk.snmpWalkId,
                deviceId: device.deviceId,
                isRemoved: false }

            if (existingCurrentValue) { //This is a pre-existing value
                existingCurrentValue.used = true;    
                thisValue.isNew = false;                 

                //Determine if the value has changed since the last walk.
                if (result.value!=existingCurrentValue.value) {
                    thisValue.isChanged = true;
                } else {
                    thisValue.isChanged = false;
                }

                // Seconds since the last check of this OID.
                thisValue.changedSeconds = Math.floor((walkTimeStamp - existingCurrentValue.lastSeen) / 1000);
                
                // Calculate the change amount - Only really valid for numbers.
                thisValue.changedAmount = parseFloat(result.value) - parseFloat(existingCurrentValue.value);
                if (isNaN(thisValue.changedAmount)) thisValue.changedAmount=null;
                
            } else { //This is a brand new entry.
                thisValue.isNew = true;
                thisValue.isChanged = true;
                thisValue.changeAmount = null;
                thisValue.changedSeconds = null;
            }
            walkDBEntries.push(thisValue);
        }

        // Handle missing OIDs (values that were in the current table but are not in the new walk)
        var allunused = currentValues.filter(result => !result.used);
        for (const unusedValue of allunused) {
            // This OID doesn't exist in the new results and thus has been removed.
            let thisValue = {oid: unusedValue.oid,
                value: null,
                valueType: unusedValue.valueType,
                timestamp: walkTimeStamp,
                snmpWalkId: newSnmpWalk.snmpWalkId,
                deviceId: device.deviceId,
                isRemoved: true, 
                isNew: false, 
                isChanged: true, 
                changedAmount: null 
            }
            // Seconds since the last check of this OID.
            thisValue.changedSeconds = Math.floor((walkTimeStamp - unusedValue.lastSeen) / 1000);
            walkDBEntries.push(thisValue);                        
        }
        await hotspringData.models.snmpWalkValue.bulkCreate(walkDBEntries);
        walkDBEntries=walkDBEntries;
    } catch (err) {
        console.error(`Error performing SNMP walk for ${ip} and uploading data: ${err}`);
    }
}



async function createSnmpWalk(deviceId, host, community, rootOID) {
    return await hotspringData.models.snmpWalk.create({
        deviceId: deviceId,
        host: host,
        community: community,
        rootOID: rootOID,
        walkTime: new Date()
    });
}


async function fullWalk(ip, community) {
    let lastOID = '1.0';
    var varBinds = null;
    let fullSet = [];
    const repeaters=50;
    let snmpSession = snmp.createSession(ip, community, { version: snmp.Version2c });
    let isDone = false;
    while (!isDone) {
        varBinds = await snmpSession.getBulkAsync([lastOID],0,repeaters);
        for (let myVarBind of varBinds) {
            if (snmp.ObjectType[myVarBind.type]) 
                myVarBind.type = snmp.ObjectType[myVarBind.type];
            else
                console.log(`Unknown Type ${myVarBind.type}`);
            fullSet.push(myVarBind);
            if (lastOID==myVarBind.oid && varBinds.length==1) {
                console.log(`Duplicate OID: ${lastOID}`);
                isDone=true;
            }
            lastOID = myVarBind.oid;
        }
        console.log(`Received ${varBinds.length} OIDs from ${ip} ending in ${lastOID}`);
    }
    console.log(`Received a total of ${fullSet.length} OIDs from ${ip}.`);
    return fullSet;
}


runTest();