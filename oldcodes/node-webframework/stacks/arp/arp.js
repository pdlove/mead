//Ethernet Packet
//ffffffffffff - Dest MAC
//00090f09001a - Source MAC
//8100 - VLAN
//0011 - VLAN 17
//0806 - Arp

//Arp Packet
//0001 - Hardware Type
//0800 - IPv4
//06 - Hardware Length (MAC Length)
//04 - Protocol Length (IP Length)
//0001 - Operation
//00090f09001a - Sender Hardware Address
//0a110101 - Sender Protocol Address
//000000000000 - Target Hardware Address
//0a11 - Target Protocol Address
//01910000 - CRC

console.log("Found ");

import cap from 'cap';
const Cap = cap.Cap;

class arpListener {
    ifName = '';
    captureInterface = null;
    async startListening(ifName) {
        
        //const device = cap.findDevice(ifName);
        //if (!device) throw new Error(`PCAP device for interface ${ifName} not found`);
        //console.log(device)
        this.ifName=ifName;

        const bufSize = 10 * 1024 * 1024;
        const buffer = Buffer.alloc(65535);

        const captureInterface = new Cap();
        if (!captureInterface) throw new Error(`PCAP device for interface ${ifName} not found`);
        const linkType = captureInterface.open(ifName, 'arp', bufSize, buffer);
        if (captureInterface.setMinBytes) captureInterface.setMinBytes(0);

        // Listen for ARP replies
        captureInterface.on('packet', nbytes => {
            if (linkType !== 'ETHERNET') return;
            let curByte = 0;
            const destMac = bufferToMAC(buffer.subarray(curByte, curByte+6));
            curByte+=6;
            const srcMac = bufferToMAC(buffer.subarray(curByte, curByte+6));
            curByte+=6;
            
            let etherType = buffer.readUInt16BE(curByte);
            curByte+=2

            let vlan=0;
            if (etherType == 0x8100) {
                vlan = buffer.readUInt16BE(curByte);
                curByte+=2
                etherType = buffer.readUInt16BE(curByte);
                curByte+=2
            }
            if (!vlan) return;
            if (etherType !== 0x0806) return; // Not ARP
            //console.log({destMac,srcMac,etherType,vlan});

            const opcode = buffer.readUInt16BE(20);
            //if (opcode !== 2) return; // Not a reply

            const senderMAC = bufferToMAC(buffer.subarray(22, 28));
            const senderIP = bufferToIP(buffer.subarray(28, 32));

            //addResult(senderIP, senderMAC);
            //console.log("Found " + senderIP + " at " + senderMAC + "on VLAN" + vlan);
            console.log(buffer.subarray(0,48).toString('hex'));
        });


    }
}
function bufferToIP(buf, curByte) {
  return [...buf].join('.');
}

function bufferToMAC(buf, curByte) {
  return [...buf].map(b => b.toString(16).padStart(2, '0')).join(':');
}

let test = new arpListener();
test.startListening('eth1');

        // // Result structure: { ip: string => { macs: Set<string>, timestamps: [Date], conflict: boolean } }
        // const results = new Map();

        // function addResult(ip, mac) {
        //     let r = results.get(ip);
        //     if (!r) {
        //         r = { macs: new Set(), timestamps: [], conflict: false };
        //         results.set(ip, r);
        //     }
        //     r.macs.add(mac);
        //     r.timestamps.push(new Date());
        //     r.conflict = r.macs.size > 1;
        // }

