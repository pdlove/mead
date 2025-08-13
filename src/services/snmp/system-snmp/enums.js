function getExpandedObject (object) {
	const outObject={};
	for (const idx in object) {
		outObject[idx]=object[idx];
		outObject[object[idx]]=idx;		
	}
	return outObject
}

const ObjectType = getExpandedObject({
	1: "Boolean",
	2: "Integer",
	3: "BitString",
	4: "OctetString",
	5: "Null",
	6: "OID",
	64: "IpAddress",
	65: "Counter",
	66: "Gauge",
	67: "TimeTicks",
	68: "Opaque",
	70: "Counter64",
	128: "NoSuchObject",
	129: "NoSuchInstance",
	130: "EndOfMibView"
});

// ASN.1
ObjectType["INTEGER"] = ObjectType.Integer;
ObjectType["OCTET STRING"] = ObjectType.OctetString;
ObjectType["OBJECT IDENTIFIER"] = ObjectType.OID;
// SNMPv2-SMI
ObjectType["Integer32"] = ObjectType.Integer;
ObjectType["Counter32"] = ObjectType.Counter;
ObjectType["Gauge32"] = ObjectType.Gauge;
ObjectType["Unsigned32"] = ObjectType.Gauge32;

const PduType = getExpandedObject({
	160: "GetRequest",
	161: "GetNextRequest",
	162: "GetResponse",
	163: "SetRequest",
	164: "Trap",
	165: "GetBulkRequest",
	166: "InformRequest",
	167: "TrapV2",
	168: "Report"
})

const ResponseInvalidCode = getExpandedObject({
	1: "EIp4AddressSize",
	2: "EUnknownObjectType",
	3: "EUnknownPduType",
	4: "ECouldNotDecrypt",
	5: "EAuthFailure",
	6: "EReqResOidNoMatch",
	7: "ENonRepeaterCountMismatch",  // no longer used
	8: "EOutOfOrder",
	9: "EVersionNoMatch",
	10: "ECommunityNoMatch",
	11: "EUnexpectedReport",
	12: "EResponseNotHandled",
	13: "EUnexpectedResponse"
});

function generateId(bitSize) {
    if (!bitSize) bitSize = this.idBitSize;
    let maxSize = 2 ^ bitSize;
    return Math.floor(Math.random() * maxSize);
}
exports = { generateId, ObjectType, PduType, ResponseInvalidCode }