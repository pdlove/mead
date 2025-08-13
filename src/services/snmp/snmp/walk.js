const snmp = require('./original');
const fs = require('fs').promises;

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

async function fullWalk(ip, community) {
    let lastOID = '1.0';
    var varBinds = null;
    let fullSet = [];
    const repeaters=50;
    let snmpSession = snmp.createSession(ip, community, { version: snmp.Version2c });
    do {
        varBinds = await snmpSession.getBulkAsync([lastOID],0,repeaters);
        for (let myVarBind of varBinds) {
            if (snmp.ObjectType[myVarBind.type]) 
                myVarBind.type = snmp.ObjectType[myVarBind.type];
            else
                console.log(`Unknown Type ${myVarBind.type}`);
            fullSet.push(myVarBind);
            lastOID = myVarBind.oid;
            sleep(10);
        }
        console.log(`Received ${varBinds.length} OIDs ending in ${lastOID}`);
    } while(varBinds.length>1)
    return fullSet;
}

async function fullWalkAndSave(ip,community) {
    var test = await fullWalk(ip,community);
    var outText = '';
    for (const res of test) { 
        outText+=res.oid+": "+res.type+": "+res.value+"\n";        
    }
    fs.writeFile(ip+'.txt',outText);
    fs.writeFile(ip+'.json',JSON.stringify(test));

}

async function go() {
    var test = await fullWalkAndSave("192.168.4.2","BW15NMp");    
}
go();