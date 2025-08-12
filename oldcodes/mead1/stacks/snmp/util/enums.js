function _expandConstantObject (object) {
    var keys = [];
    for (var key in object)
        keys.push (key);
    for (var i = 0; i < keys.length; i++)
        object[object[keys[i]]] = parseInt (keys[i]);
}

var ErrorStatus = {
    0: "NoError",
    1: "TooBig",
    2: "NoSuchName",
    3: "BadValue",
    4: "ReadOnly",
    5: "GeneralError",
    6: "NoAccess",
    7: "WrongType",
    8: "WrongLength",
    9: "WrongEncoding",
    10: "WrongValue",
    11: "NoCreation",
    12: "InconsistentValue",
    13: "ResourceUnavailable",
    14: "CommitFailed",
    15: "UndoFailed",
    16: "AuthorizationError",
    17: "NotWritable",
    18: "InconsistentName"
};

_expandConstantObject (ErrorStatus);

var ObjectType = {
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
};

_expandConstantObject (ObjectType);

// ASN.1
ObjectType.INTEGER = ObjectType.Integer;
ObjectType["OCTET STRING"] = ObjectType.OctetString;
ObjectType["OBJECT IDENTIFIER"] = ObjectType.OID;
// SNMPv2-SMI
ObjectType.Integer32 = ObjectType.Integer;
ObjectType.Counter32 = ObjectType.Counter;
ObjectType.Gauge32 = ObjectType.Gauge;
ObjectType.Unsigned32 = ObjectType.Gauge32;

var PduType = {
    160: "GetRequest",
    161: "GetNextRequest",
    162: "GetResponse",
    163: "SetRequest",
    164: "Trap",
    165: "GetBulkRequest",
    166: "InformRequest",
    167: "TrapV2",
    168: "Report"
};

_expandConstantObject (PduType);

var TrapType = {
    0: "ColdStart",
    1: "WarmStart",
    2: "LinkDown",
    3: "LinkUp",
    4: "AuthenticationFailure",
    5: "EgpNeighborLoss",
    6: "EnterpriseSpecific"
};

_expandConstantObject (TrapType);

var SecurityLevel = {
    1: "noAuthNoPriv",
    2: "authNoPriv",
    3: "authPriv"
};

_expandConstantObject (SecurityLevel);

var AuthProtocols = {
    "1": "none",
    "2": "md5",
    "3": "sha",
    "4": "sha224",
    "5": "sha256",
    "6": "sha384",
    "7": "sha512"
};

_expandConstantObject (AuthProtocols);

var PrivProtocols = {
    "1": "none",
    "2": "des",
    "4": "aes",
    "6": "aes256b",
    "8": "aes256r"
};

_expandConstantObject (PrivProtocols);

var UsmStatsBase = "1.3.6.1.6.3.15.1.1";

var UsmStats = {
    "1": "Unsupported Security Level",
    "2": "Not In Time Window",
    "3": "Unknown User Name",
    "4": "Unknown Engine ID",
    "5": "Wrong Digest (incorrect password, community or key)",
    "6": "Decryption Error"
};

_expandConstantObject (UsmStats);

var MibProviderType = {
    "1": "Scalar",
    "2": "Table"
};

_expandConstantObject (MibProviderType);

var Version1 = 0;
var Version2c = 1;
var Version3 = 3;

var Version = {
    "1": Version1,
    "2c": Version2c,
    "3": Version3
};

var AgentXPduType = {
    1: "Open",
    2: "Close",
    3: "Register",
    4: "Unregister",
    5: "Get",
    6: "GetNext",
    7: "GetBulk",
    8: "TestSet",
    9: "CommitSet",
    10: "UndoSet",
    11: "CleanupSet",
    12: "Notify",
    13: "Ping",
    14: "IndexAllocate",
    15: "IndexDeallocate",
    16: "AddAgentCaps",
    17: "RemoveAgentCaps",
    18: "Response"
};

_expandConstantObject (AgentXPduType);

var AccessControlModelType = {
    0: "None",
    1: "Simple"
};

_expandConstantObject (AccessControlModelType);

var AccessLevel = {
    0: "None",
    1: "ReadOnly",
    2: "ReadWrite"
};

_expandConstantObject (AccessLevel);

// SMIv2 MAX-ACCESS values
var MaxAccess = {
    0: "not-accessible",
    1: "accessible-for-notify",
    2: "read-only",
    3: "read-write",
    4: "read-create"
};

_expandConstantObject (MaxAccess);

// SMIv1 ACCESS value mapping to SMIv2 MAX-ACCESS
var AccessToMaxAccess = {
    "not-accessible": "not-accessible",
    "read-only": "read-only",
    "read-write": "read-write",
    "write-only": "read-write"
};

var RowStatus = {
    // status values
    1: "active",
    2: "notInService",
    3: "notReady",

    // actions
    4: "createAndGo",
    5: "createAndWait",
    6: "destroy"
};

_expandConstantObject (RowStatus);

var ResponseInvalidCode = {
    1: "EIp4AddressSize",
    2: "EUnknownObjectType",
    3: "EUnknownPduType",
    4: "ECouldNotDecrypt",
    5: "EAuthFailure",
    6: "EReqResOidNoMatch",
//	7: "ENonRepeaterCountMismatch",  // no longer used
    8: "EOutOfOrder",
    9: "EVersionNoMatch",
    10: "ECommunityNoMatch",
    11: "EUnexpectedReport",
    12: "EResponseNotHandled",
    13: "EUnexpectedResponse"
};

_expandConstantObject (ResponseInvalidCode);

var OidFormat = {
    "oid": "oid",
    "path": "path",
    "module": "module"
};

module.exports = {
    ErrorStatus,
    ObjectType,
    PduType,
    TrapType,
    SecurityLevel,
    AuthProtocols,
    PrivProtocols,
    UsmStatsBase,
    UsmStats,
    MibProviderType,
    Version1,
    Version2c,
    Version3,
    Version,
    AgentXPduType,
    AccessControlModelType,
    AccessLevel,
    MaxAccess,
    AccessToMaxAccess,
    RowStatus,
    ResponseInvalidCode,
    OidFormat
};