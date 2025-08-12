let mibs = {};
mibs['Q-BRIDGE-MIB'] = { OID: '1.3.6.1.2.1.17.7', type: 'MIB', children: {} };
mibs['Q-BRIDGE-MIB'].children['qBridgeMIBObjects'] = { OID: '1.3.6.1.2.1.17.7.1', type: 'group', children: {} };
mibs['Q-BRIDGE-MIB'].children['qBridgeMIBObjects'].children['dot1qBase'] = { OID: '1.3.6.1.2.1.17.7.1.1', type: 'group', children: {} };
mibs['Q-BRIDGE-MIB'].children['qBridgeMIBObjects'].children['dot1qBase'].children['dot1qVlanVersionNumber'] = { OID: '1.3.6.1.2.1.17.7.1.1.1', type: "enum", writable: false, enum: { 1: "version1" } };
mibs['Q-BRIDGE-MIB'].children['qBridgeMIBObjects'].children['dot1qBase'].children['dot1qMaxVlanId'] = { OID: '1.3.6.1.2.1.17.7.1.1.2', type: "number", writable: false };
//Additional children can be added here as needed

mibs['Q-BRIDGE-MIB'].children['qBridgeMIBObjects'].children['dot1qVlan'] = { OID: '1.3.6.1.2.1.17.7.1.4', type: 'group', children: {} };
mibs['Q-BRIDGE-MIB'].children['qBridgeMIBObjects'].children['dot1qVlan'].children['dot1qVlanCurrentTable'] = { OID: '1.3.6.1.2.1.17.7.1.4.2', type: 'table', children: {} };
mibs['Q-BRIDGE-MIB'].children['qBridgeMIBObjects'].children['dot1qVlan'].children['dot1qVlanCurrentTable'].children['dot1qVlanCurrentEntry'] = { OID: '1.3.6.1.2.1.17.7.1.4.2.1', type: 'row', rowIndex: 'dot1qVlanTimeMark, dot1qVlanIndex', children: {} };
mibs['Q-BRIDGE-MIB'].children['qBridgeMIBObjects'].children['dot1qVlan'].children['dot1qVlanCurrentTable'].children['dot1qVlanCurrentEntry'].children['dot1qVlanTimeMark'] = { OID: '1.3.6.1.2.1.17.7.1.4.2.1.1', type: 'number', writable: false, children: {} };
mibs['Q-BRIDGE-MIB'].children['qBridgeMIBObjects'].children['dot1qVlan'].children['dot1qVlanCurrentTable'].children['dot1qVlanCurrentEntry'].children['dot1qVlanIndex'] = { OID: '1.3.6.1.2.1.17.7.1.4.2.1.2', type: "number", writable: false },
mibs['Q-BRIDGE-MIB'].children['qBridgeMIBObjects'].children['dot1qVlan'].children['dot1qVlanCurrentTable'].children['dot1qVlanCurrentEntry'].children['dot1qVlanFdbId'] = { OID: '1.3.6.1.2.1.17.7.1.4.2.1.3', type: "number", writable: false },
mibs['Q-BRIDGE-MIB'].children['qBridgeMIBObjects'].children['dot1qVlan'].children['dot1qVlanCurrentTable'].children['dot1qVlanCurrentEntry'].children['dot1qVlanCurrentEgressPorts'] = { OID: '1.3.6.1.2.1.17.7.1.4.2.1.4', type: "bitmap", writable: false },
mibs['Q-BRIDGE-MIB'].children['qBridgeMIBObjects'].children['dot1qVlan'].children['dot1qVlanCurrentTable'].children['dot1qVlanCurrentEntry'].children['dot1qVlanCurrentUntaggedPorts'] = { OID: '1.3.6.1.2.1.17.7.1.4.2.1.5', type: "bitmap", writable: false },
mibs['Q-BRIDGE-MIB'].children['qBridgeMIBObjects'].children['dot1qVlan'].children['dot1qVlanCurrentTable'].children['dot1qVlanCurrentEntry'].children['dot1qVlanStatus'] = { OID: '1.3.6.1.2.1.17.7.1.4.2.1.6', type: "enum", writable: false, enum: { 1: "other", 2: "permanent", 3: "dynamicGvrp" } },
mibs['Q-BRIDGE-MIB'].children['qBridgeMIBObjects'].children['dot1qVlan'].children['dot1qVlanCurrentTable'].children['dot1qVlanCurrentEntry'].children['dot1qVlanCreationTime'] = { OID: '1.3.6.1.2.1.17.7.1.4.2.1.7', type: "SNMP_UINT64", writable: false },


mibs['Q-BRIDGE-MIB'].scalars['dot1qVlanVersionNumber'] = { OID: '1.3.6.1.2.1.17.7.1.1.1',  type: "enum", writable: false, enum: { 1: "version1" }, mibName: 'Q-BRIDGE-MIB' },
    

let snmpTableDefinitions = {};
snmpTableDefinitions['SystemInfoScalar'] = { baseOID: '1.3.6.1.2.1.1', rowGroup: '', rowIndex: '', columns: {
    1: { name: "sysDescr", type: "ascii", writable: false },
    2: { name: "sysObjectID", type: "ascii", writable: false },
    3: { name: "sysUpTime", type: "timespan", writable: false },
    4: { name: "sysContact", type: "utf8", writable: true },
    5: { name: "sysName", type: "utf8", writable: true },
    6: { name: "sysLocation", type: "utf8", writable: true },
    7: { name: "sysServices", type: "number", writable: false, comments: "Bit shifted network levels" },
}};
snmpTableDefinitions['InterfaceTable'] = { 
    baseOID: '1.3.6.1.2.1.2.2', 
    rowGroup: '1', 
    rowIndex: 'ifIndex', 
    columns: {
        1: { name: "ifIndex", type: "number", writable: false },
        2: { name: "ifDescr", type: "ascii", writable: false },
        3: { name: "ifType", type: "enum", writable: false, enum: { 1: "other", 2: "regular1822", 3: "hdh1822", 4: "ddn-x25", 5: "rfc877-x25", 6: "ethernet-csmacd", 7: "iso88023-csmacd", 8: "iso88024-tokenBus", 9: "iso88025-tokenRing", 10: "iso88026-man", 11: "starLan", 12: "proteon-10Mbit", 13: "proteon-80Mbit", 14: "hyperchannel", 15: "fddi", 16: "lapb", 17: "sdlc", 18: "ds1", 19: "e1", 20: "basicISDN", 21: "primaryISDN", 22: "propPointToPointSerial", 23: "ppp", 24: "softwareLoopback", 25: "eon", 26: "ethernet-3Mbit", 27: "nsip", 28: "slip", 29: "ultra", 30: "ds3", 31: "sip", 32: "frame-relay" } },
        4: { name: "ifMtu", type: "number", writable: false },
        5: { name: "ifSpeed", type: "number", writable: false },
        6: { name: "ifPhysAddress", type: "hex", writable: false },
        7: { name: "ifAdminStatus", type: "enum", writable: false, enum: { 1: "up", 2: "down", 3: "testing", 4: "unknown", 5: "dormant", 6: "notPresent", 7: "lowerLayerDown" } },
        8: { name: "ifOperStatus", type: "enum", writable: false, enum: { 1: "up", 2: "down", 3: "testing", 4: "unknown", 5: "dormant", 6: "notPresent", 7: "lowerLayerDown" } },
        9: { name: "ifLastChange", type: "timespan", writable: false },
        10: { name: "ifInOctets", type: "number", writable: false },
        11: { name: "ifInUcastPkts", type: "number", writable: false },
        12: { name: "ifInNUcastPkts", type: "number", writable: false },
        13: { name: "ifInDiscards", type: "number", writable: false },
        14: { name: "ifInErrors", type: "number", writable: false },
        15: { name: "ifInUnknownProtos", type: "number", writable: false },
        16: { name: "ifOutOctets", type: "number", writable: false },
        17: { name: "ifOutUcastPkts", type: "number", writable: false },
        18: { name: "ifOutNUcastPkts", type: "number", writable: false },
        19: { name: "ifOutDiscards", type: "number", writable: false },
        20: { name: "ifOutErrors", type: "number", writable: false },
        21: { name: "ifOutQLen", type: "number", writable: false },
        22: { name: "ifSpecific", type: "ascii", writable: false },
}};
snmpTableDefinitions['HighSpeedInterfaceTable'] = { 
    baseOID: '1.3.6.1.2.1.31.1.1', 
    rowGroup: '1', 
    rowIndex: 'ifIndex', 
    columns: {
        1: { name: "ifName", type: "utf8", writable: false },
        2: { name: "ifInMulticastPkts", type: "number", writable: false },
        3: { name: "ifInBroadcastPkts", type: "number", writable: false },
        4: { name: "ifOutMulticastPkts", type: "number", writable: false },
        5: { name: "ifOutBroadcastPkts", type: "number", writable: false },
        6: { name: "ifHCInOctets", type: "SNMP_UINT64", writable: false },
        7: { name: "ifHCInUcastPkts", type: "SNMP_UINT64", writable: false },
        8: { name: "ifHCInMulticastPkts", type: "SNMP_UINT64", writable: false },
        9: { name: "ifHCInBroadcastPkts", type: "SNMP_UINT64", writable: false },
        10: { name: "ifHCOutOctets", type: "SNMP_UINT64", writable: false },
        11: { name: "ifHCOutUcastPkts", type: "SNMP_UINT64", writable: false },
        12: { name: "ifHCOutMulticastPkts", type: "SNMP_UINT64", writable: false },
        13: { name: "ifHCOutBroadcastPkts", type: "SNMP_UINT64", writable: false },
        14: { name: "ifLinkUpDownTrapEnable", type: "number", writable: false },
        15: { name: "ifHighSpeed", type: "number", writable: false },
        16: { name: "ifPromiscuousMode", type: "enum", writable: false, enum: { 1: "true", 2: "false" } },
        17: { name: "ifConnectorPresent", type: "enum", writable: false, enum: { 1: "true", 2: "false" } },
        18: { name: "ifAlias", type: "utf8", writable: false },
        19: { name: "ifCounterDiscontinuityTime", type: "timespan", writable: false },
}};
snmpTableDefinitions['dot1dBasePortTable'] = { baseOID: '1.3.6.1.2.1.17.1.4', rowGroup: '1', rowIndex: 'dot1dBasePort', columns: {
    1: { name: "dot1dBasePort", type: "number", writable: false },
    2: { name: "dot1dBasePortIfIndex", type: "number", writable: false },
    3: { name: "dot1dBasePortCircuit", type: "string", writable: false },
    4: { name: "dot1dBasePortDelayExceededDiscards", type: "number", writable: false },
    5: { name: "dot1dBasePortMtuExceededDiscards", type: "number", writable: false },
}};
snmpTableDefinitions['dot1dTpFdbTable'] = { baseOID: '1.3.6.1.2.1.17.4.3', rowGroup: '1', rowIndex: 'dot1dTpFdbAddressOriginal', columns: {
    1: { name: "dot1dTpFdbAddress", type: "hex", writable: false },
    2: { name: "dot1dTpFdbPort", type: "number", writable: false },
    3: { name: "dot1dTpFdbStatus", type: "enum", writable: false, enum: { 1: "other", 2: "invalid", 3: "learned", 4: "self", 5: "mgmt" } },
}};
snmpTableDefinitions['dot1qTpFdbTable'] = { baseOID: '1.3.6.1.2.1.17.7.1.2.2', rowGroup: '1', rowIndex: 'dot1qTpFdbAddressOriginal', columns: {
    1: { name: "dot1qTpFdbAddress", type: "hex", writable: false },
    2: { name: "dot1qTpFdbPort", type: "number", writable: false },
    3: { name: "dot1qTpFdbStatus", type: "enum", writable: false, enum: { 1: "other", 2: "invalid", 3: "learned", 4: "self", 5: "mgmt" } },
}};
snmpTableDefinitions['dot1qVlanCurrentTable'] = { baseOID: '1.3.6.1.2.1.17.7.1.4.2', rowGroup: '1', rowIndex: 'dot1qVlanIndex', columns: {
    1: { name: "dot1qVlanTimeMark", type: "number", writable: false },
    2: { name: "dot1qVlanIndex", type: "number", writable: false },
    3: { name: "dot1qVlanFdbId", type: "number", writable: false },
    4: { name: "dot1qVlanCurrentEgressPorts", type: "bitmap", writable: false },
    5: { name: "dot1qVlanCurrentUntaggedPorts", type: "bitmap", writable: false },
    6: { name: "dot1qVlanStatus", type: "enum", writable: false, enum: { 1: "other", 2: "permanent", 3: "dynamicGvrp" } },
    7: { name: "dot1qVlanCreationTime", type: "SNMP_UINT64", writable: false },
}};
snmpTableDefinitions['lldpRemTable'] = { baseOID: '1.0.8802.1.1.2.1.4.1', rowGroup: '1', rowIndex: 'lldpRemTimeMark,lldpRemLocalPortNum,lldpRemIndex', columns: {
    1: { name: "lldpRemTimeMark", type: "number", writable: false },
    2: { name: "lldpRemLocalPortNum", type: "number", writable: false },
    3: { name: "lldpRemIndex", type: "number", writable: false },
    4: { name: "lldpRemChassisIdSubtype", type: "enum", writable: false, enum: { 1: "chassisComponent", 2: "interfaceAlias", 3: "portComponent", 4: "macAddress", 5: "networkAddress", 6: "interfaceName", 7: "local" } },
    5: { name: "lldpRemChassisId", type: "string", writable: false },
    6: { name: "lldpRemPortIdSubtype", type: "enum", writable: false, enum: { 1: "chassisComponent", 2: "interfaceAlias", 3: "portComponent", 4: "macAddress", 5: "networkAddress", 6: "interfaceName", 7: "local" } },
    7: { name: "lldpRemPortId", type: "string", writable: false },
    8: { name: "lldpRemPortDesc", type: "string", writable: false },
    9: { name: "lldpRemSysName", type: "string", writable: false },
    10: { name: "lldpRemSysDesc", type: "string", writable: false },
    11: { name: "lldpRemSysCapSupported", type: "bitmap", writable: false, enum: { 1: "other", 2: "repeater", 3: "bridge", 4: "wlanAccessPoint", 5: "router", 6: "telephone", 7: "docsisCableDevice", 8: "stationOnly"} },
    12: { name: "lldpRemSysCapEnabled", type: "bitmap", writable: false, enum: { 1: "other", 2: "repeater", 3: "bridge", 4: "wlanAccessPoint", 5: "router", 6: "telephone", 7: "docsisCableDevice", 8: "stationOnly"} }, 
}};
snmpTableDefinitions['dot1xPaePortTable'] = { baseOID: '1.0.8802.1.1.1.1.1.2', rowGroup: '1', rowIndex: 'dot1xPaePortNumber', columns: {
    1: { name: "dot1xPaePortNumber", type: "number", writable: false },
    2: { name: "dot1xPaePortProtocolVersion", type: "number", writable: false },
    3: { name: "dot1xPaePortCapabilities", type: "enum", writable: false, enum: { 0: "dot1xPaePortAuthCapable", 1: "dot1xPaePortSuppCapable" } },
    4: { name: "dot1xPaePortInitialize", type: "SNMP_BOOL", writable: true },
    5: { name: "dot1xPaePortReauthenticate", type: "SNMP_BOOL", writable: true },
}};

snmpTableDefinitions['pethPsePortTable'] = { baseOID: '1.3.6.1.2.1.105.1.1', rowGroup: '1', rowIndex: 'pethPsePortGroupIndex,pethPsePortIndex',
    columns: {
        1: { name: "pethPsePortGroupIndex", type: "number", writable: false },
        2: { name: "pethPsePortIndex", type: "number", writable: false },
        3: { name: "pethPsePortAdminEnable", type: "enum", writable: true, enum: { 1: "true", 2: "false" } },
        4: { name: "pethPsePortPowerPairsControlAbility", type: "enum", writable: false, enum: { 1: "true", 2: "false" } },
        5: { name: "pethPsePortPowerPairs", type: "enum", writable: true, enum: { 1: "signal", 2: "spare" } },
        6: { name: "pethPsePortDetectionStatus", type: "enum", writable: false, enum: { 1: "disabled", 2: "searching", 3: "deliveringPower", 4: "fault", 5: "test", 6: "otherFault" } },
        7: { name: "pethPsePortPowerPriority", type: "enum", writable: true, enum: { 1: "critical", 2: "high", 3: "low" } },
        8: { name: "pethPsePortMPSAbsentCounter", type: "number", writable: false },
        9: { name: "pethPsePortType", type: "string", writable: true },
        10: { name: "pethPsePortPowerClassifications", type: "enum", writable: false, enum: { 1: "class0", 2: "class1", 3: "class2", 4: "class3", 5: "class4" } },
        11: { name: "pethPsePortInvalidSignatureCounter", type: "number", writable: false },
        12: { name: "pethPsePortPowerDeniedCounter", type: "number", writable: false },
        13: { name: "pethPsePortOverLoadCounter", type: "number", writable: false },
        14: { name: "pethPsePortShortCounter", type: "number", writable: false }
    }
};

snmpTableDefinitions['dot1qVlanStaticTable'] = { baseOID: '1.3.6.1.2.1.17.7.1.4.3', rowGroup: '1', rowIndex: 'dot1qVlanIndex',
    columns: {
        1: { name: "dot1qVlanStaticName", type: "string", writable: true },
        2: { name: "dot1qVlanStaticEgressPorts", type: "bitmap", writable: false },
        3: { name: "dot1qVlanForbiddenEgressPorts", type: "bitmap", writable: false },
        4: { name: "dot1qVlanStaticUntaggedPorts", type: "bitmap", writable: false },
        5: { name: "dot1qVlanStaticRowStatus", type: "enum", writable: true, enum: { 1: "other", 2: "invalid", 3: "valid" } }
        
    }
};

snmpTableDefinitions['entPhysicalTable'] = { baseOID: '1.3.6.1.2.1.47.1.1.1', rowGroup: '1', rowIndex: 'entPhysicalIndex', columns: {
    1: { name: "entPhysicalIndex", type: "number", writable: false },
    2: { name: "entPhysicalDescr", type: "string", writable: false },
    3: { name: "entPhysicalVendorType", type: "oid", writable: false },
    4: { name: "entPhysicalContainedIn", type: "number", writable: false },
    5: { name: "entPhysicalClass", type: "enum", writable: false, enum: { 1: "other", 2: "unknown", 3: "chassis", 4: "backplane", 5: "container", 6: "powerSupply", 7: "fan", 8: "sensor", 9: "module", 10: "port", 11: "stack", 12: "cpu" } },
    6: { name: "entPhysicalParentRelPos", type: "number", writable: false },
    7: { name: "entPhysicalName", type: "string", writable: false },
    8: { name: "entPhysicalHardwareRev", type: "string", writable: false },
    9: { name: "entPhysicalFirmwareRev", type: "string", writable: false },
    10: { name: "entPhysicalSoftwareRev", type: "string", writable: false },
    11: { name: "entPhysicalSerialNum", type: "string", writable: false },
    12: { name: "entPhysicalMfgName", type: "string", writable: false },
    13: { name: "entPhysicalModelName", type: "string", writable: false },
    14: { name: "entPhysicalAlias", type: "string", writable: false },
    15: { name: "entPhysicalAssetID", type: "string", writable: false },
    16: { name: "entPhysicalIsFRU", type: "enum", writable: false, enum: { 1: "true", 2: "false" } },
    17: { name: "entPhysicalMfgDate", type: "string", writable: false },
    18: { name: "entPhysicalUris", type: "string", writable: false },
    19: { name: "entPhysicalUUID", type: "string", writable: false },    
}};

snmpTableDefinitions['entAliasMappingTable'] = { baseOID: '1.3.6.1.2.1.47.1.3.2', rowGroup: '1', rowIndex: 'entPhysicalIndex, entAliasLogicalIndexOrZero', columns: {
    1: { name: "entAliasLogicalIndexOrZero", type: "number", writable: false },
    2: { name: "entAliasMappingIdentifier", type: "string", writable: false },
}};

snmpTableDefinitions['vmMembership'] = { 
    baseOID: '1.3.6.1.4.1.9.9.46.1.3.1', 
    rowGroup: '1', 
    rowIndex: 'vmVlan', 
    columns: {
        1: { name: "vmVlan", type: "number", writable: false },
        2: { name: "vmPort", type: "string", writable: false },
        3: { name: "vmStatus", type: "enum", writable: false, enum: { 1: "other", 2: "invalid", 3: "active" } },
    }
};

snmpTableDefinitions['vlanTrunkPortTable'] = { 
    baseOID: '1.3.6.1.4.1.9.9.46.1.6.1', 
    rowGroup: '1', 
    rowIndex: 'vlanTrunkPortIfIndex', 
    columns: {
        1: { name: "vlanTrunkPortIfIndex", type: "number", writable: false },
        2: { name: "vlanTrunkPortManagementDomain", type: "number", writable: false },
        3: { name: "vlanTrunkPortEncapsulationType", type: "enum", writable: true, enum: { 1: "isl", 2: "dot10", 3: "lane", 4: 'dot1q', 5:"negotiate" } },
        4: { name: "vlanTrunkPortVlansEnabled", type: "bitmap", writable: true },
        5: { name: "vlanTrunkPortNativeVlan", type: "number", writable: true },
        
    }
};

snmpTableDefinitions['ipNetToMediaTable'] = { baseOID: '1.3.6.1.2.1.4.22', rowGroup: '1', rowIndex: 'ipAdEntAddr', columns: {
    1: { name: "ipNetToMediaIfIndex", type: "number", writable: false },
    2: { name: "ipNetToMediaPhysAddress", type: "hex", writable: false },
    3: { name: "ipNetToMediaNetAddress", type: "string", writable: false },
    4: { name: "ipNetToMediaType", type: "enum", writable: false, enum: { 1: "other", 2: "invalid", 3: "dynamic", 4: "static" } },
}};

module.exports = snmpTableDefinitions;


