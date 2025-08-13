const express = require('express');
const { Server } = require('ws');
const { Cap, decoders } = require('cap');
const { EthernetPacket } = decoders;
const app = express();
const PORT = 3001;
const fs = require('fs');
const path = require('path');



class ArpProtocol extends EthernetProtocol {
    constructor(srcPacket) {
        super(srcPacket)
        const {
            //Need to verify Multiple VLANs and STP vs RSTP vs Other STPs
            hwType = 0,
            protoType = 0,
            hwAddrLen = 0,
            protoAddrLen = 0,
            opcode = 0,
            hwAddrSender = '',
            protoAddrSender = 0,
            hwAddrTarget = 0,
            protoAddrTarget = '',
        } = srcPacket.arp;
        this.packet.arp = { hwType, protoType, hwAddrLen, protoAddrLen, opcode, hwAddrSender, protoAddrSender, hwAddrTarget, protoAddrTarget }
    }
    static parse(buffer, offset = 0, packet = null) {
        if (!packet) throw new Error("Unable to import with a raw packet structure.")
        packet.arp = {}
        packet.arp.hwType = buffer.readUInt16BE(offset);
        offset += 2;
        packet.arp.protoType = buffer.readUInt16BE(offset);
        offset += 2;
        packet.arp.hwAddrLen = buffer.readUInt8(offset);
        offset += 1;
        packet.arp.protoAddrLen = buffer.readUInt8(offset);
        offset += 1;
        packet.arp.opcode = buffer.readUInt16BE(offset);
        offset += 2;
        packet.arp.hwAddrSender = bufferToMacAddress(buffer.subarray(offset, offset + packet.arp.hwAddrLen));
        offset += packet.arp.hwAddrLen;
        packet.arp.protoAddrSender = bufferToIPAddress(buffer.subarray(offset, offset + packet.arp.protoAddrLen));
        offset += packet.arp.protoAddrLen;
        packet.arp.hwAddrTarget = bufferToMacAddress(buffer.subarray(offset, offset + packet.arp.hwAddrLen));
        offset += packet.arp.hwAddrLen;
        packet.arp.protoAddrTarget = bufferToIPAddress(buffer.subarray(offset, offset + packet.arp.protoAddrLen));
        offset += packet.arp.protoAddrLen;

        let arpPacket = new ArpProtocol(packet);
        arpPacket.extraData = buffer.slice(offset);
        return arpPacket;
    }
}

class stpProtocol extends LLCProtocol {
    constructor(srcPacket) {
        super(srcPacket)
        const {
            //Need to verify Multiple VLANs and STP vs RSTP vs Other STPs
            protocolId = 0,
            version = 0,
            bpduType = 0,
            flags = 0,
            rootIdPriority = 0,
            rootIdMAC = '',
            rootPathCost = 0,
            bridgeIdPriority = 0,
            bridgeIdMAC = '',
            portId = 0,
            msgAge = 0,
            maxAge = 0,
            helloTime = 0,
            forwardDelay = 0,
            protocolName = 'Unknown'
        } = srcPacket.llc;
        this.packet.llc = { protocolId, version, bpduType, flags, rootIdPriority, rootIdMAC, rootPathCost, bridgeIdPriority, bridgeIdMAC, portId, msgAge, maxAge, helloTime, forwardDelay, protocolName }
    }
    static parse(buffer, offset = 0, packet = null) {
        if (!packet) throw new Error("Unable to import with a raw packet structure.")
        //Need to verify Multiple VLANs and STP vs RSTP vs Other STPs
        packet.stp.protocolId = buffer.readUInt16BE(offset); offset += 2;
        packet.stp.version = buffer.readUInt8(offset++);
        packet.stp.bpduType = buffer.readUInt8(offset++);
        packet.stp.flags = buffer.readUInt8(offset++);

        packet.stp.rootIdPriority = buffer.readUInt16BE(offset); offset += 2;
        packet.stp.rootIdMAC = buffer.slice(offset, offset + 6).toString('hex').match(/.{1,2}/g).join(':'); offset += 6;

        packet.stp.rootPathCost = buffer.readUInt32BE(offset); offset += 4;

        packet.stp.bridgeIdPriority = buffer.readUInt16BE(offset); offset += 2;
        packet.stp.bridgeIdMAC = buffer.slice(offset, offset + 6).toString('hex').match(/.{1,2}/g).join(':'); offset += 6;

        packet.stp.portId = buffer.readUInt16BE(offset); offset += 2;
        packet.stp.msgAge = buffer.readUInt16BE(offset) / 256.0; offset += 2;
        packet.stp.maxAge = buffer.readUInt16BE(offset) / 256.0; offset += 2;
        packet.stp.helloTime = buffer.readUInt16BE(offset) / 256.0; offset += 2;
        packet.stp.forwardDelay = buffer.readUInt16BE(offset) / 256.0; offset += 2;

        // Detect protocol version
        packet.stp.protocolName = 'Unknown';
        if (packet.stp.protocolId === 0x0000) {

            if (packet.stp.version === 0x00 && packet.stp.bpduType === 0x00) packet.stp.protocolName = 'STP';
            else if (packet.stp.version === 0x02 && packet.stp.bpduType === 0x02) packet.stp.protocolName = 'RSTP';
            else packet.stp.protocolName = '802.1D Variant';
        }

        let stpPacket = new stpProtocol(packet);
        stpPacket.extraData = buffer.slice(offset);
        return stpPacket;
    }
}
class LLCProtocol extends EthernetProtocol { //802.3
    constructor(srcPacket) {
        super(srcPacket)
        const {
            dsap = 0,
            ssap = 0,
            control = 0,
            OUI = '',
            PID = '',
        } = srcPacket.llc;
        this.packet.llc = { dsap, ssap, control, OUI, PID }
    }

    static protocols = {
        0x42: stpProtocol,
        '00:00:0C': {
            //0x2000: cdpProtocol,
            //0x2004: vtpProtocol,
        }
    }

    static parse(buffer, offset = 0, packet = null) {
        if (!packet) throw new Error("Unable to import with a raw packet structure.")
        packet.llc = {};
        packet.llc.dsap = buffer.readUInt8(offset++);
        packet.llc.ssap = buffer.readUInt8(offset++);
        packet.llc.control = buffer.readUInt8(offset++);
        let protocol = LLCProtocol.protocols[packet.llc.dsap];
        if (protoID === 0xaa) {
            packet.llc.OUI = bufferToMacAddress(buffer.subarray(offset, offset + 3)); offset += 3;
            packet.llc.PID = buffer.readUInt16BE(offset); offset += 2;
            protocol = LLCProtocol.protocols[packet.llc.OUI]
            if (protocol)
                protocol = protocol[packet.llc.PID]
        }
        if (!LLCProtocol.protocols[packet.llc_dsap]) {
            console.warn("Unknown LLC Protocol: " + JSON.stringify(packet.llc))
            const thisPacket = new LLCProtocol(packet);
            thisPacket.extraData = buffer.slice(offset); //Record all remaining data for future analysis.
            return thisPacket;
        }

        if (packet.llc_dsap === 0x42)
            return parseSTP(packet, buffer, curByte)
    }
}


class EthernetProtocol {
    packet = {};
    constructor(srcPacket) {
        const {
            destMac = 'defaultType',
            srcMac = 0,
            etherType = 0,
            vlanTagged = false,
            vlanID = 0,
        } = srcPacket.ether;
        this.packet.ether = { destMac, srcMac, etherType, vlanTagged, vlanID }
    }

    static protocols = {
        //0x0800: IPv4Protocol,
        0x0806: ArpProtocol,
        //0x8100: VLANProtocol, //This is handled in the Ethernet packet
        //0x88cc: lldpProtocol, //802.1ab
        //0x888e: PortAuthProtocol, //802.1x
        //0x86dd: IPv6Protocol,
        //0x8809: LACPProtocol, 
        //0x88ff: FortiLinkProtocol, //Fortinet's magic configuration process
    }

    static registerProtocol(protoID, protoClass) {
        EthernetProtocol.protocols[protoID] = protoClass;
    }
    static unregisterProtocol(protoID) {
        delete EthernetProtocol.protocols[protoID];
    }

    static parse(buffer, offset = 0, packet = null) {
        packet = { ether: { destMac: '', srcMac: '', etherType: 0, vlanTagged: false, vlanID: 0 } }
        packet.ether.destMac = bufferToMacAddress(buffer.subarray(offset, offset + 6)); offset += 6;
        packet.ether.srcMac = bufferToMacAddress(buffer.subarray(offset, offset + 6)); offset += 6;
        packet.ether.etherType = buffer.readUInt16BE(offset); offset += 2


        if (packet.ether_type == 0x8100) { //802.1q encapsulation
            header_8021q = buffer.readUInt16BE(offset);
            packet.ether.vlanID = header_8021q & 0xFFF;
            packet.ether.vlanTagged = true;
            offset += 2
            packet.ether.etherType = buffer.readUInt16BE(offset);
            offset += 2
        }

        if (packet.ether.etherType < 0x0600) {
            //This is an 802.3 packet (Assumed to be Link Layer Control)
            return LLCPacket.parse(buffer, offset, packet);
        } else {
            let proto = EthernetProtocol.protocols[packet.ether.etherType]
            if (proto) {
                return proto.parse(buffer, offset, packet);
            } else {
                console.warn("Unknown Ethernet Protocol: " + JSON.stringify(packet.ether))
                packet.extraData = buffer.slice(offset); //Record all remaining data for future analysis.
            }
        }
    }
}














// Path to your data file
const DATA_FILE = path.join(__dirname, 'data.json');
const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Load saved data at startup
function loadData() {
    if (fs.existsSync(DATA_FILE)) {
        try {
            const rawData = fs.readFileSync(DATA_FILE);
            const data = JSON.parse(rawData);
            discoveredMACs = data.discoveredMACs || {};
            discoveredVLANs = data.discoveredVLANs || {};
            captureDevice = data.captureDevice || null;
            console.log("Data loaded from file.");
        } catch (err) {
            console.error("Failed to load data:", err);
        }
    } else {
        console.log("No existing data file found. Starting fresh.");
    }
    if (captureDevice) startCapture(captureDevice);
}

// Save current data to file every 5 seconds
function startAutoSave() {
    setInterval(() => {
        const data = {
            discoveredMACs,
            discoveredVLANs,
            captureDevice
        };
        fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), err => {
            if (err) console.error("Failed to save data:", err);
            else console.log("Data saved.");
        });
    }, 60000);
}




const wss = new Server({ server });

let linkType;

let discoveredVLANs = {};
let discoveredMACs = {}
let captureInterface = null;
let captureDevice = null;

function getDevices() {
    const devices = Cap.deviceList();
    return devices;
}

function parsePacket(buffer) {
    if (linkType !== 'ETHERNET') return;
    const packet = {};
    let curByte = 0;
    packet.ether_destMac = bufferToMacAddress(buffer.subarray(curByte, curByte + 6));
    curByte += 6;
    packet.ether_srcMac = bufferToMacAddress(buffer.subarray(curByte, curByte + 6));
    curByte += 6;

    packet.ether_type = buffer.readUInt16BE(curByte);
    curByte += 2

    packet.ether_vlan = 1;
    if (packet.ether_type == 0x8100) { //802.1q encapsulation
        header_8021q = buffer.readUInt16BE(curByte);
        packet.ether_vlan = header_8021q & 0xFFF;
        curByte += 2
        packet.ether_type = buffer.readUInt16BE(curByte);
        curByte += 2
    }

    if (packet.ether_type < 0x0600) {
        //This is an 802.3 packet
        //Parse LLC Data
        packet.llc_dsap = buffer.readUInt8(curByte++);
        packet.llc_ssap = buffer.readUInt8(curByte++);
        packet.llc_control = buffer.readUInt8(curByte++);
        if (packet.llc_dsap === 0xaa) {
            packet.llc_OUI = bufferToMacAddress(buffer.subarray(curByte, curByte + 3));
            curByte += 3;
            packet.llc_PID = buffer.readUInt16BE(curByte);
            curByte += 2;
        }

        if (packet.llc_dsap === 0x42)
            return parseSTP(packet, buffer, curByte)

    } else {
        switch (packet.ether_type) {
            case 0x0806://ARP Packet        
                return parseArp(packet, buffer, curByte);
            case 0x88cc: //LLDP Packet
                return parseLLDP(packet, buffer, curByte);
            case 0x88ff: //FortiLink
                return parseFortiLink(packet, buffer, curByte);
            case 0x800: //IPv4

        }
    }
}

function parseArp(packet, buffer, curByte) {
    packet.arp_hwType = buffer.readUInt16BE(curByte);
    curByte += 2
    packet.arp_protoType = buffer.readUInt16BE(curByte);
    curByte += 2
    packet.arp_hwAddrLen = buffer.readUInt8(curByte);
    curByte += 1
    packet.arp_protoAddrLen = buffer.readUInt8(curByte);
    curByte += 1
    packet.arp_opcode = buffer.readUInt16BE(20);
    curByte += 2;
    packet.arp_hwAddrSender = bufferToMacAddress(buffer.subarray(curByte, curByte + packet.arp_hwAddrLen));
    curByte += packet.arp_hwAddrLen;
    packet.arp_protoAddrSender = bufferToIPAddress(buffer.subarray(curByte, curByte + packet.arp_protoAddrLen));
    curByte += packet.arp_protoAddrLen;
    packet.arp_hwAddrTarget = bufferToMacAddress(buffer.subarray(curByte, curByte + packet.arp_hwAddrLen));
    curByte += packet.arp_hwAddrLen;
    packet.arp_protoAddrTarget = bufferToIPAddress(buffer.subarray(curByte, curByte + packet.arp_protoAddrLen));
    curByte += packet.arp_protoAddrLen;
    curByte += 2; // Skip the CRC
    //THis should put us at the CRC or the end....

    let mac = packet.arp_hwAddrSender;
    let ip = packet.arp_protoAddrSender;
    if (packet.arp_opcode == 2) {
        mac = packet.arp_hwAddrTarget;
        ip = packet.arp_protoAddrTarget;
    }

    if (ip == '0.0.0.0') {
        return; //I really don't care about the data right nowif I don't have an IP for the packet.
    }

    let thisVLAN = discoveredVLANs[packet.ether_vlan];
    let thisMAC = discoveredMACs[mac]
    if (!thisVLAN) {
        thisVLAN = { vlanId: packet.ether_vlan, exampleIp: ip, firstSeen: new Date(), lastSeen: new Date() };
        discoveredVLANs[packet.ether_vlan] = thisVLAN;
    } else
        thisVLAN.lastSeen = new Date();
    if (!thisMAC) {
        thisMAC = { ip, mac, vlanId: packet.ether_vlan, firstSeen: new Date(), lastSeen: new Date() }
        discoveredMACs[mac] = thisMAC;
    } else
        thisMAC.lastSeen = new Date();
    sendChannel('broadcast', { type: 'vlan', data: thisVLAN });
    sendChannel('broadcast', { type: 'node', data: thisMAC });

};

lastSTP = {};
lastSTPChange = null;

function parseSTP(packet, buffer, curByte) {
    //Need to verify Multiple VLANs and STP vs RSTP vs Other STPs
    packet.stp_protocolId = buffer.readUInt16BE(curByte); curByte += 2;
    packet.stp_version = buffer.readUInt8(curByte++);
    packet.stp_bpduType = buffer.readUInt8(curByte++);
    packet.stp_flags = buffer.readUInt8(curByte++);

    packet.stp_rootId = {
        priority: buffer.readUInt16BE(curByte),
        mac: buffer.slice(curByte + 2, curByte + 8).toString('hex').match(/.{1,2}/g).join(':')
    };
    curByte += 8;

    packet.stp_rootPathCost = buffer.readUInt32BE(curByte); curByte += 4;

    packet.stp_bridgeId = {
        priority: buffer.readUInt16BE(curByte),
        mac: buffer.slice(curByte + 2, curByte + 8).toString('hex').match(/.{1,2}/g).join(':')
    };
    curByte += 8;

    packet.stp_portId = buffer.readUInt16BE(curByte); curByte += 2;
    packet.stp_msgAge = buffer.readUInt16BE(curByte) / 256.0; curByte += 2;
    packet.stp_maxAge = buffer.readUInt16BE(curByte) / 256.0; curByte += 2;
    packet.stp_helloTime = buffer.readUInt16BE(curByte) / 256.0; curByte += 2;
    packet.stp_forwardDelay = buffer.readUInt16BE(curByte) / 256.0; curByte += 2;

    // Detect protocol version
    packet.stp_protocolName = 'Unknown';
    if (packet.stp_protocolId === 0x0000) {

        if (packet.stp_version === 0x00 && packet.stp_bpduType === 0x00) packet.stp_protocolName = 'STP';
        else if (packet.stp_version === 0x02 && packet.stp_bpduType === 0x02) packet.stp_protocolName = 'RSTP';
        else packet.stp_protocolName = '802.1D Variant';
    }

    if (JSON.stringify(packet) != JSON.stringify(lastSTP)) {
        lastSTP = packet;
        lastSTPChange = new Date();
    }
    return curByte;
}

function parseLLDP(packet, buffer, curByte) {
    tlvIterator: while (curByte + 2 <= buffer.length) {
        const tlvHeader = buffer.readUInt16BE(curByte);
        const type = (tlvHeader >> 9) & 0x7F;
        const length = tlvHeader & 0x1FF;
        curByte += 2;

        if (curByte + length > buffer.length) {
            // Not enough data left
            break;
        }

        const value = buffer.slice(curByte, curByte + length);

        // Try decoding known TLV types
        switch (type) {
            case 0: // End of LLDPDU
                break tlvIterator;
            case 1: // Chassis ID
                packet.lldp_ChassisIDType = value[0];
                packet.lldp_ChassisIDValue = value.slice(1).toString('hex').match(/.{1,2}/g).join(':');
                break;
            case 2: // Port ID
                packet.lldp_PortIDType = value[0];
                packet.lldp_PortIDValue = value.slice(1).toString();
                break;
            case 3: // TTL
                packet.lldp_TTLsec = value.readUInt16BE(0);
                break;
            case 4: // Port Description
                packet.lldp_PortDescription = value.toString();
                break;
            case 5: // System Name
                packet.lldp_SystemName = value.toString();
                break;
            case 6: // System Description
                packet.lldp_SystemDescription = value.toString();
                break;
            case 7: // System Capabilities
                packet.lldp_Capabilities = value.readUInt16BE(0);
                packet.lldp_EnabledCapabilities = value.readUInt16BE(2);
                break;
            case 8: // Management Address
                packet.lldp_managementAddress = parseMgmtAddress(value);
                break;
            case 127: // Organizationally Specific
                if (value.length >= 4) {
                    const oui = value.slice(0, 3).toString('hex').toUpperCase().match(/.{1,2}/g).join(':');
                    const subtype = value[3];
                    const orgValue = value.slice(4);

                    switch (oui) {
                        case '00:80:C2':
                            switch (subtype) {
                                case 1: // Port VLAN ID (PVID)
                                    if (orgValue.length >= 2) {
                                        packet.lldp_PVLAN = orgValue.readUInt16BE(0);
                                    }
                                    break;

                                case 2: // Port and Protocol VLAN ID (PPVID)
                                    if (orgValue.length >= 3) {
                                        if (orgValue[0]) packet.lldp_PPVLAN = orgValue.readUInt16BE(1)
                                    }
                                    break;

                                case 3: // VLAN Name
                                    if (orgValue.length >= 2) {
                                        packet.lldp_PVLAN = orgValue.readUInt16BE(0);
                                        packet.lldp_PVLAN_name = orgValue.slice(2).toString();
                                    }
                                    break;

                                case 4: // Protocol Identity
                                    packet.lldp_protocolId = orgValue.toString('hex').match(/.{1,2}/g).join(':');
                                    break;

                                case 5: // VTP Management Domain (Cisco, legacy use)
                                    packet.lldp_vtp_domain = orgValue.toString();
                                    break;

                                default:
                                    if (!packet.lldp_extraTLVs) packet.lldp_extraTLVs = [];
                                    packet.lldp_extraTLVs.push('Unknown IEEE subtype for OUI ' + oui + ' type ' + subtype);
                            }
                            break;
                        case '00:12:0F':
                            switch (subtype) {
                                case 1: // MAC/PHY Configuration/Status
                                    if (orgValue.length >= 5) {
                                        packet.lldp_macPhy = {
                                            autonegSupported: !!(orgValue[0] & 0x80),
                                            autonegEnabled: !!(orgValue[0] & 0x40),
                                            advertisedCapabilities: orgValue.readUInt16BE(1),
                                            operationalMauType: orgValue.readUInt16BE(3),
                                        };
                                    }
                                    break;

                                case 2: // Power via MDI (PoE)
                                    if (orgValue.length >= 3) {
                                        packet.lldp_power = {
                                            deviceType: (orgValue[0] & 0x80) ? 'PSE' : 'PD',
                                            powerSource: (orgValue[0] >> 4) & 0x03,
                                            priority: (orgValue[0] >> 2) & 0x03,
                                            powerValueWatts: orgValue.readUInt16BE(1) / 10.0,
                                        };
                                    }
                                    break;

                                case 3: // Link Aggregation
                                    if (orgValue.length >= 5) {
                                        packet.lldp_linkAggregation = {
                                            supported: !!(orgValue[0] & 0x80),
                                            enabled: !!(orgValue[0] & 0x40),
                                            aggregationPortId: orgValue.readUInt32BE(1),
                                        };
                                    }
                                    break;

                                case 4: // Maximum Frame Size
                                    if (orgValue.length >= 2) {
                                        packet.lldp_maxFrameSize = orgValue.readUInt16BE(0);
                                        break;
                                    }
                                case 5:
                                    if (orgValue.length < 7) return null; // Minimum length expected
                                    packet.lldp_Power_powerMgmt = orgValue.readUInt8(0);
                                    packet.lldp_Power_powerClass = orgValue.readUInt8(1);
                                    packet.lldp_Power_powerSource = orgValue.readUInt8(2);
                                    packet.lldp_Power_requestedPowerRaw = orgValue.readUInt16BE(3) / 10;
                                    packet.lldp_Power_allocatedPowerRaw = orgValue.readUInt16BE(5) / 10;
                                    break
                                default:
                                    if (!packet.lldp_extraTLVs) packet.lldp_extraTLVs = [];
                                    packet.lldp_extraTLVs.push('Unknown IEEE subtype for OUI ' + oui + ' type ' + subtype);
                                    break;
                            }
                            break;
                        case '00:12:BB':
                            switch (subtype) {
                                case 1: // MAC Address
                                    const capabilities = orgValue.readUInt16BE(0);
                                    packet.lldp_capabilities_lldpMedCapable = Boolean(capabilities & 0x0001)
                                    packet.lldp_capabilities_networkPolicyCapable = Boolean(capabilities & 0x0002)
                                    packet.lldp_capabilities_locationIdentificationCapable = Boolean(capabilities & 0x0004)
                                    packet.lldp_capabilities_extendedPowerViaMdiCapable = Boolean(capabilities & 0x0008)
                                    break;
                                case 2: // Network Policies
                                    if (!packet.lldp_policies) packet.lldp_policies = [];
                                    for (let i = 0; i + 4 <= orgValue.length; i += 4) {
                                        const appType = orgValue.readUInt8(i);
                                        // skip buffer[i+1] (reserved)
                                        const vlanId = orgValue.readUInt16BE(i + 2);
                                        packet.lldp_policies.push({ applicationType: appType, vlanId });
                                    }
                                    break;
                                case 3: // Location Identification                                     
                                    packet.lldp_Location_Format = orgValue.readUInt8(0);
                                    packet.lldp_Location_Data = orgValue.slice(1).toString();
                                    break;

                                case 4: // Serial Number
                                    if (orgValue.length < 2) return null;
                                    packet.lldp_Power_Class = orgValue.readUInt8(0) & 0x0f;
                                    packet.lldp_Power_Source = orgValue.readUInt8(1) & 0x0f;
                                    break;
                                case 5:
                                    packet.lldp_HardwareRevision = orgValue.toString();
                                    break;
                                case 6:
                                    packet.lldp_FirmwareRevision = orgValue.toString(); // Binary content
                                    break;
                                case 7:
                                    packet.lldp_SoftwareRevision = orgValue.toString();
                                    break;
                                case 8:
                                    packet.lldp_SerialNumber = orgValue.toString();
                                    break;
                                case 9:
                                    packet.lldp_ManufacturerName = orgValue.toString();
                                    break;
                                case 10:
                                    packet.lldp_ModelName = orgValue.toString();
                                    break;
                                case 11:
                                    packet.lldp_AssetID = orgValue.toString();
                                    break;
                                default:
                                    if (!packet.lldp_extraTLVs) packet.lldp_extraTLVs = [];
                                    packet.lldp_extraTLVs.push('Unknown IEEE subtype for OUI ' + oui + ' type ' + subtype);
                                    break;
                            }
                            break;
                        case '08:5B:0E':
                            switch (subtype) {
                                case 1:
                                    packet.lldp_SystemName = orgValue.toString();
                                    break;
                                case 2:
                                    packet.lldp_SerialNumber = orgValue.toString();
                                    break;
                                default:
                                    if (!packet.lldp_extraTLVs) packet.lldp_extraTLVs = [];
                                    packet.lldp_extraTLVs.push('Unknown IEEE subtype for OUI ' + oui + ' type ' + subtype);
                                    break;
                            }
                            break;
                        default:
                            if (!packet.lldp_extraTLVs) packet.lldp_extraTLVs = [];
                            packet.lldp_extraTLVs.push('Unknown IEEE subtype for OUI ' + oui + ' type ' + subtype);
                            break;
                    }
                } else {
                    //tlv.error = 'Malformed Organizational TLV';
                }
                break;
            default:
            //tlv.description = 'Unknown or unparsed TLV';
        }

        curByte += length;
    }
    return curByte;
}

function parseMgmtAddress(value) {
    const addrLen = value[0];
    const addrSubtype = value[1];
    const addressBytes = value.slice(2, 2 + addrLen - 1);

    switch (addrSubtype) {
        case 1: return addressBytes.join('.');
        case 2: return addressBytes.toString('hex').match(/.{1,2}/g).join(':');
        default: return addressBytes.toString('hex');
    }
}
function parseFortiLink(packet, buffer, curByte) {
    curByte+=2; //Skip the first 2 bytes
    packet.fortilink_type = buffer.readUInt8(curByte++);
    curByte++;

    let tlvs = parseTLVs(buffer, curByte);
    return tlvs;
}
function parseTLVs(buffer, offset = 0, depth = 0) {
    const tlvs = [];

    while (offset + 4 <= buffer.length) {
        const type = buffer.readUInt16BE(offset);
        const length = buffer.readUInt16BE(offset + 2);
        offset += 4;

        if (offset + length > buffer.length) break;

        const value = buffer.slice(offset, offset + length);
        let children = [];

        // Heuristic: try to recursively parse if value looks like nested TLV (e.g., length > 4 and starts with valid TLV structure)
        if (length >= 4 && value.readUInt16BE(2) + 4 <= length) {
            try {
                children = parseTLVs(value, 0, depth + 1);
            } catch (e) {}
        }

        tlvs.push({ type, length, value, children });
        offset += length;
    }

    return tlvs;
}
wsChannels = { "broadcast": new Set }

function sendChannel(channel, data) {
    let strData = JSON.stringify(data);
    wsChannels[channel].forEach(function (client) {
        if (client.readyState === WebSocket.OPEN) client.send(strData);
    });
}

wss.on('connection', (ws) => {
    wsChannels.broadcast.add(ws);
    ws.on('close', () => {
        wsChannels['broadcast'].delete(ws);
        console.log('Client disconnected');
    });
    ws.on('error', (err) => {
        console.error('WebSocket error:', err);
    });

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        switch (data.type) {
            case "getDevices":
                ws.send(JSON.stringify({ type: "deviceList", data: getDevices() }));
                break;
            case "getInitialData":
                let thisData = { capturing: false, discoveredMACs, discoveredVLANs };
                if (captureInterface) thisData.capturing = true;
                ws.send(JSON.stringify({ type: "initialData", data: thisData }));
                break;
            case "startCapture":
                const device = data.device;
                startCapture(device);
        }

    });
});

loadData();
startAutoSave();


function startCapture(device) {
    console.log("Starting Capture on " + device);
    captureDevice = device;
    let filter = 'arp';
    filter += ' or ether[12:2] < 0x0600'; //802.3 Traffic
    filter += ' or ether host 01:80:C2:00:00:0E or ether host 01:80:C2:00:00:03 or ether host 01:80:C2:00:00:00'; //LLDP traffic
    filter += ' or broadcast'; //Just get all broadcast traffic
    captureInterface = new Cap();
    const bufferSize = 10 * 1024 * 1024;
    const buffer = Buffer.allocUnsafe(bufferSize);
    linkType = captureInterface.open(device, filter, bufferSize, buffer);
    captureInterface.on('packet', (nbytes, truncated) => {
        // Copy only the relevant part of the buffer
        const packetData = Buffer.from(buffer.subarray(0, nbytes)); // copy to avoid mutation
        // Send it to your parser
        //parsePacket(packetData, linkType);
        let thisPacket = EthernetProtocol.parse(packetData,0);
        thisPacket=thisPacket;
    });
}


process.on('uncaughtException', console.error);
process.on('unhandledRejection', console.error);
function bufferToMacAddress(buf) {
    return Array.from(buf)
        .map(b => b.toString(16).padStart(2, '0'))
        .join(':');
}
function bufferToIPAddress(buf) {
    return Array.from(buf)
        .map(b => b.toString(10))
        .join('.');
}

//module.exports = { EthernetProtocol, Arp }