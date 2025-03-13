
// Copyright 2013 Stephen Vickers <stephen.vickers.sv@gmail.com>

var ber = require ("asn1-ber").Ber;
var dgram = require ("dgram");
var events = require ("events");
var util = require ("util");
var crypto = require ("crypto");
var DEBUG = false;

var MIN_SIGNED_INT32 = -2147483648;
var MAX_SIGNED_INT32 = 2147483647;
var MIN_UNSIGNED_INT32 = 0;
var MAX_UNSIGNED_INT32 = 4294967295;

function debug (line) {
	if ( DEBUG ) {
		console.debug (line);
	}
}

/*****************************************************************************
 ** Constants
 **/


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

/*****************************************************************************
 ** Exception class definitions
 **/

function ResponseInvalidError (message, code, info) {
	this.name = "ResponseInvalidError";
	this.message = message;
	this.code = code;
	this.info = info;
	Error.captureStackTrace(this, ResponseInvalidError);
}
util.inherits (ResponseInvalidError, Error);

function RequestInvalidError (message) {
	this.name = "RequestInvalidError";
	this.message = message;
	Error.captureStackTrace(this, RequestInvalidError);
}
util.inherits (RequestInvalidError, Error);

function RequestFailedError (message, status) {
	this.name = "RequestFailedError";
	this.message = message;
	this.status = status;
	Error.captureStackTrace(this, RequestFailedError);
}
util.inherits (RequestFailedError, Error);

function RequestTimedOutError (message) {
	this.name = "RequestTimedOutError";
	this.message = message;
	Error.captureStackTrace(this, RequestTimedOutError);
}
util.inherits (RequestTimedOutError, Error);

function ProcessingError (message, error, rinfo, buffer) {
	this.name = "ProcessingError";
	this.message = message;
	this.error = error;
	this.rinfo = rinfo;
	this.buffer = buffer;
	Error.captureStackTrace(this, ProcessingError);
}
util.inherits (ProcessingError, Error);

/*****************************************************************************
 ** OID and varbind helper functions
 **/

function readInt64BEasFloat(buffer, offset) {
    while (buffer.length<8)
		buffer = Buffer.concat([Buffer([0]),buffer])
	
	var low = buffer.readInt32BE(offset + 4);
  var n = buffer.readInt32BE(offset) * 4294967296.0 + low;
  if (low < 0) n += 4294967296;
  return n;
}

function isVarbindError (varbind) {
	return !!(varbind.type == ObjectType.NoSuchObject
	|| varbind.type == ObjectType.NoSuchInstance
	|| varbind.type == ObjectType.EndOfMibView);
}

function varbindError (varbind) {
	return (ObjectType[varbind.type] || "NotAnError") + ": " + varbind.oid;
}

function oidFollowsOid (oidString, nextString) {
	var oid = {str: oidString, len: oidString.length, idx: 0};
	var next = {str: nextString, len: nextString.length, idx: 0};
	var dotCharCode = ".".charCodeAt (0);

	function getNumber (item) {
		var n = 0;
		if (item.idx >= item.len)
			return null;
		while (item.idx < item.len) {
			var charCode = item.str.charCodeAt (item.idx++);
			if (charCode == dotCharCode)
				return n;
			n = (n ? (n * 10) : n) + (charCode - 48);
		}
		return n;
	}

	while (1) {
		var oidNumber = getNumber (oid);
		var nextNumber = getNumber (next);

		if (oidNumber !== null) {
			if (nextNumber !== null) {
				if (nextNumber > oidNumber) {
					return true;
				} else if (nextNumber < oidNumber) {
					return false;
				}
			} else {
				return true;
			}
		} else {
			return true;
		}
	}
}

function oidInSubtree (oidString, nextString) {
	var oid = oidString.split (".");
	var next = nextString.split (".");

	if (oid.length > next.length)
		return false;

	for (var i = 0; i < oid.length; i++) {
		if (next[i] != oid[i])
			return false;
	}

	return true;
}

function readInt32 (buffer) {
	var parsedInt = buffer.readInt ();
	if ( ! Number.isInteger(parsedInt) ) {
		throw new TypeError('Value read as integer ' + parsedInt + ' is not an integer');
	}
	if ( parsedInt < MIN_SIGNED_INT32 || parsedInt > MAX_SIGNED_INT32 ) {
		throw new RangeError('Read integer ' + parsedInt + ' is outside the signed 32-bit range');
	}
	return parsedInt;
}

function readUint32 (buffer) {
	var parsedInt = buffer.readInt ();
	if ( ! Number.isInteger(parsedInt) ) {
		throw new TypeError('Value read as integer ' + parsedInt + ' is not an integer');
	}
	parsedInt = (parsedInt>>>0);
	if ( parsedInt < MIN_UNSIGNED_INT32 || parsedInt > MAX_UNSIGNED_INT32 ) {
		throw new RangeError('Read integer ' + parsedInt + ' is outside the unsigned 32-bit range');
	}
	return parsedInt;
}

function readUint64 (buffer) {
	var value = buffer.readString (ObjectType.Counter64, true);

	return value;
}

function readIpAddress (buffer) {
	var bytes = buffer.readString (ObjectType.IpAddress, true);
	if (bytes.length != 4)
		throw new ResponseInvalidError ("Length '" + bytes.length
				+ "' of IP address '" + bytes.toString ("hex")
				+ "' is not 4", ResponseInvalidCode.EIp4AddressSize);
	var value = bytes[0] + "." + bytes[1] + "." + bytes[2] + "." + bytes[3];
	return value;
}

function readVarbindValue (buffer, type) {
	var value;
	if (type == ObjectType.Boolean) {
		value = buffer.readBoolean ();
	} else if (type == ObjectType.Integer) {
		value = readInt32 (buffer);
	} else if (type == ObjectType.BitString) {
		value = buffer.readBitString();
	} else if (type == ObjectType.OctetString) {
		value = buffer.readString (null, true);
		value = value.toString();
	} else if (type == ObjectType.Null) {
		buffer.readByte ();
		buffer.readByte ();
		value = null;
	} else if (type == ObjectType.OID) {
		value = buffer.readOID ();
	} else if (type == ObjectType.IpAddress) {
		value = readIpAddress (buffer);
	} else if (type == ObjectType.Counter) {
		value = readUint32 (buffer);
	} else if (type == ObjectType.Gauge) {
		value = readUint32 (buffer);
	} else if (type == ObjectType.TimeTicks) {
		value = readUint32 (buffer);
	} else if (type == ObjectType.Opaque) {
		value = buffer.readString (ObjectType.Opaque, true);
	} else if (type == ObjectType.Counter64) {
		value = readUint64 (buffer);
	} else if (type == ObjectType.NoSuchObject) {
		buffer.readByte ();
		buffer.readByte ();
		value = null;
	} else if (type == ObjectType.NoSuchInstance) {
		buffer.readByte ();
		buffer.readByte ();
		value = null;
	} else if (type == ObjectType.EndOfMibView) {
		buffer.readByte ();
		buffer.readByte ();
		value = null;
	} else {
		throw new ResponseInvalidError ("Unknown type '" + type
				+ "' in response", ResponseInvalidCode.EUnknownObjectType);
	}
	return value;
}

function readVarbinds (buffer, varbinds) {
	buffer.readSequence ();

	while (1) {
		buffer.readSequence ();
		if ( buffer.peek () != ObjectType.OID )
			break;
		var oid = buffer.readOID ();
		var type = buffer.peek ();

		if (type == null)
			break;

		var value = readVarbindValue (buffer, type);

		varbinds.push ({
			oid: oid,
			type: type,
			value: value
		});
	}
}

function writeInt32 (buffer, type, value) {
	if ( ! Number.isInteger(value) ) {
		throw new TypeError('Value to write as integer ' + value + ' is not an integer');
	}
	if ( value < MIN_SIGNED_INT32 || value > MAX_SIGNED_INT32 ) {
		throw new RangeError('Integer to write ' + value + ' is outside the signed 32-bit range');
	}
	buffer.writeInt(value, type);
}

function writeUint32 (buffer, type, value) {
	if ( ! Number.isInteger(value) ) {
		throw new TypeError('Value to write as integer ' + value + ' is not an integer');
	}
	if ( value < MIN_UNSIGNED_INT32 || value > MAX_UNSIGNED_INT32 ) {
		throw new RangeError('Integer to write ' + value + ' is outside the unsigned 32-bit range');
	}
	buffer.writeInt(value, type);
}

function writeUint64 (buffer, value) {
	buffer.writeBuffer (value, ObjectType.Counter64);
}

function writeVarbinds (buffer, varbinds) {
	buffer.startSequence ();
	for (var i = 0; i < varbinds.length; i++) {
		buffer.startSequence ();
		buffer.writeOID (varbinds[i].oid);

		if (varbinds[i].type && varbinds[i].hasOwnProperty("value")) {
			var type = varbinds[i].type;
			var value = varbinds[i].value;

			switch ( type ) {
				case ObjectType.Boolean:
					buffer.writeBoolean (value ? true : false);
					break;
				case ObjectType.Integer: // also Integer32
					writeInt32 (buffer, ObjectType.Integer, value);
					break;
				case ObjectType.OctetString:
					if (typeof value == "string")
						buffer.writeString (value);
					else
						buffer.writeBuffer (value, ObjectType.OctetString);
					break;
				case ObjectType.Null:
					buffer.writeNull ();
					break;
				case ObjectType.OID:
					buffer.writeOID (value);
					break;
				case ObjectType.IpAddress:
					var bytes = value.split (".");
					if (bytes.length != 4)
						throw new RequestInvalidError ("Invalid IP address '"
								+ value + "'");
					buffer.writeBuffer (Buffer.from (bytes), 64);
					break;
				case ObjectType.Counter: // also Counter32
					writeUint32 (buffer, ObjectType.Counter, value);
					break;
				case ObjectType.Gauge: // also Gauge32 & Unsigned32
					writeUint32 (buffer, ObjectType.Gauge, value);
					break;
				case ObjectType.TimeTicks:
					writeUint32 (buffer, ObjectType.TimeTicks, value);
					break;
				case ObjectType.Opaque:
					buffer.writeBuffer (value, ObjectType.Opaque);
					break;
				case ObjectType.Counter64:
					writeUint64 (buffer, value);
					break;
				case ObjectType.NoSuchObject:
				case ObjectType.NoSuchInstance:
				case ObjectType.EndOfMibView:
					buffer.writeByte (type);
					buffer.writeByte (0);
					break;
				default:
					throw new RequestInvalidError ("Unknown type '" + type
						+ "' in request");
			}
		} else {
			buffer.writeNull ();
		}

		buffer.endSequence ();
	}
	buffer.endSequence ();
}

/*****************************************************************************
 ** PDU class definitions
 **/

var SimplePdu = function () {
};

SimplePdu.prototype.toBuffer = function (buffer) {
	buffer.startSequence (this.type);

	writeInt32 (buffer, ObjectType.Integer, this.id);
	writeInt32 (buffer, ObjectType.Integer,
			(this.type == PduType.GetBulkRequest)
			? (this.options.nonRepeaters || 0)
			: 0);
	writeInt32 (buffer, ObjectType.Integer,
			(this.type == PduType.GetBulkRequest)
			? (this.options.maxRepetitions || 0)
			: 0);

	writeVarbinds (buffer, this.varbinds);

	buffer.endSequence ();
};

SimplePdu.prototype.initializeFromVariables = function (id, varbinds, options) {
	this.id = id;
	this.varbinds = varbinds;
	this.options = options || {};
	this.contextName = (options && options.context) ? options.context : "";
};

SimplePdu.prototype.initializeFromBuffer = function (reader) {
	this.type = reader.peek ();
	reader.readSequence ();

	this.id = readInt32 (reader);
	this.nonRepeaters = readInt32 (reader);
	this.maxRepetitions = readInt32 (reader);

	this.varbinds = [];
	readVarbinds (reader, this.varbinds);
};

SimplePdu.prototype.getResponsePduForRequest = function () {
	var responsePdu = GetResponsePdu.createFromVariables(this.id, [], {});
	if ( this.contextEngineID ) {
		responsePdu.contextEngineID = this.contextEngineID;
		responsePdu.contextName = this.contextName;
	}
	return responsePdu;
};

SimplePdu.createFromVariables = function (pduClass, id, varbinds, options) {
	var pdu = new pduClass (id, varbinds, options);
	pdu.id = id;
	pdu.varbinds = varbinds;
	pdu.options = options || {};
	pdu.contextName = (options && options.context) ? options.context : "";
	return pdu;
};

var GetBulkRequestPdu = function () {
	this.type = PduType.GetBulkRequest;
	GetBulkRequestPdu.super_.apply (this, arguments);
};

util.inherits (GetBulkRequestPdu, SimplePdu);

GetBulkRequestPdu.createFromBuffer = function (reader) {
	var pdu = new GetBulkRequestPdu ();
	pdu.initializeFromBuffer (reader);
	return pdu;
};

var GetNextRequestPdu = function () {
	this.type = PduType.GetNextRequest;
	GetNextRequestPdu.super_.apply (this, arguments);
};

util.inherits (GetNextRequestPdu, SimplePdu);

GetNextRequestPdu.createFromBuffer = function (reader) {
	var pdu = new GetNextRequestPdu ();
	pdu.initializeFromBuffer (reader);
	return pdu;
};

var GetRequestPdu = function () {
	this.type = PduType.GetRequest;
	GetRequestPdu.super_.apply (this, arguments);
};

util.inherits (GetRequestPdu, SimplePdu);

GetRequestPdu.createFromBuffer = function (reader) {
	var pdu = new GetRequestPdu();
	pdu.initializeFromBuffer (reader);
	return pdu;
};

GetRequestPdu.createFromVariables = function (id, varbinds, options) {
	var pdu = new GetRequestPdu();
	pdu.initializeFromVariables (id, varbinds, options);
	return pdu;
};

var InformRequestPdu = function () {
	this.type = PduType.InformRequest;
	InformRequestPdu.super_.apply (this, arguments);
};

util.inherits (InformRequestPdu, SimplePdu);

InformRequestPdu.createFromBuffer = function (reader) {
	var pdu = new InformRequestPdu();
	pdu.initializeFromBuffer (reader);
	return pdu;
};

var SetRequestPdu = function () {
	this.type = PduType.SetRequest;
	SetRequestPdu.super_.apply (this, arguments);
};

util.inherits (SetRequestPdu, SimplePdu);

SetRequestPdu.createFromBuffer = function (reader) {
	var pdu = new SetRequestPdu ();
	pdu.initializeFromBuffer (reader);
	return pdu;
};

var TrapPdu = function () {
	this.type = PduType.Trap;
};

TrapPdu.prototype.toBuffer = function (buffer) {
	buffer.startSequence (this.type);

	buffer.writeOID (this.enterprise);
	buffer.writeBuffer (Buffer.from (this.agentAddr.split (".")),
			ObjectType.IpAddress);
	writeInt32 (buffer, ObjectType.Integer, this.generic);
	writeInt32 (buffer, ObjectType.Integer, this.specific);
	writeUint32 (buffer, ObjectType.TimeTicks,
			this.upTime || Math.floor (process.uptime () * 100));

	writeVarbinds (buffer, this.varbinds);

	buffer.endSequence ();
};

TrapPdu.createFromBuffer = function (reader) {
	var pdu = new TrapPdu();
	reader.readSequence ();

	pdu.enterprise = reader.readOID ();
	pdu.agentAddr = readIpAddress (reader);
	pdu.generic = readInt32 (reader);
	pdu.specific = readInt32 (reader);
	pdu.upTime = readUint32 (reader);

	pdu.varbinds = [];
	readVarbinds (reader, pdu.varbinds);

	return pdu;
};

TrapPdu.createFromVariables = function (typeOrOid, varbinds, options) {
	var pdu = new TrapPdu ();
	pdu.agentAddr = options.agentAddr || "127.0.0.1";
	pdu.upTime = options.upTime;

	if (typeof typeOrOid == "string") {
		pdu.generic = TrapType.EnterpriseSpecific;
		pdu.specific = parseInt (typeOrOid.match (/\.(\d+)$/)[1]);
		pdu.enterprise = typeOrOid.replace (/\.(\d+)$/, "");
	} else {
		pdu.generic = typeOrOid;
		pdu.specific = 0;
		pdu.enterprise = "1.3.6.1.4.1";
	}

	pdu.varbinds = varbinds;

	return pdu;
};

var TrapV2Pdu = function () {
	this.type = PduType.TrapV2;
	TrapV2Pdu.super_.apply (this, arguments);
};

util.inherits (TrapV2Pdu, SimplePdu);

TrapV2Pdu.createFromBuffer = function (reader) {
	var pdu = new TrapV2Pdu();
	pdu.initializeFromBuffer (reader);
	return pdu;
};

TrapV2Pdu.createFromVariables = function (id, varbinds, options) {
	var pdu = new TrapV2Pdu();
	pdu.initializeFromVariables (id, varbinds, options);
	return pdu;
};

var SimpleResponsePdu = function() {
};

SimpleResponsePdu.prototype.toBuffer = function (writer) {
	writer.startSequence (this.type);

	writeInt32 (writer, ObjectType.Integer, this.id);
	writeInt32 (writer, ObjectType.Integer, this.errorStatus || 0);
	writeInt32 (writer, ObjectType.Integer, this.errorIndex || 0);
	writeVarbinds (writer, this.varbinds);
	writer.endSequence ();

};

SimpleResponsePdu.prototype.initializeFromBuffer = function (reader) {
	reader.readSequence (this.type);

	this.id = readInt32 (reader);
	this.errorStatus = readInt32 (reader);
	this.errorIndex = readInt32 (reader);

	this.varbinds = [];
	readVarbinds (reader, this.varbinds);
};

SimpleResponsePdu.prototype.initializeFromVariables = function (id, varbinds, options) {
	this.id = id;
	this.varbinds = varbinds;
	this.options = options || {};
};

var GetResponsePdu = function () {
	this.type = PduType.GetResponse;
	GetResponsePdu.super_.apply (this, arguments);
};

util.inherits (GetResponsePdu, SimpleResponsePdu);

GetResponsePdu.createFromBuffer = function (reader) {
	var pdu = new GetResponsePdu ();
	pdu.initializeFromBuffer (reader);
	return pdu;
};

GetResponsePdu.createFromVariables = function (id, varbinds, options) {
	var pdu = new GetResponsePdu();
	pdu.initializeFromVariables (id, varbinds, options);
	return pdu;
};

var ReportPdu = function () {
	this.type = PduType.Report;
	ReportPdu.super_.apply (this, arguments);
};

util.inherits (ReportPdu, SimpleResponsePdu);

ReportPdu.createFromBuffer = function (reader) {
	var pdu = new ReportPdu ();
	pdu.initializeFromBuffer (reader);
	return pdu;
};

ReportPdu.createFromVariables = function (id, varbinds, options) {
	var pdu = new ReportPdu();
	pdu.initializeFromVariables (id, varbinds, options);
	return pdu;
};

var readPdu = function (reader, scoped) {
	var pdu;
	var contextEngineID;
	var contextName;
	if ( scoped ) {
		reader = new ber.Reader (reader.readString (ber.Sequence | ber.Constructor, true));
		contextEngineID = reader.readString (ber.OctetString, true);
		contextName = reader.readString ();
	}
	var type = reader.peek ();

	if (type == PduType.GetResponse) {
		pdu = GetResponsePdu.createFromBuffer (reader);
	} else if (type == PduType.Report ) {
		pdu = ReportPdu.createFromBuffer (reader);
	} else if (type == PduType.Trap ) {
		pdu = TrapPdu.createFromBuffer (reader);
	} else if (type == PduType.TrapV2 ) {
		pdu = TrapV2Pdu.createFromBuffer (reader);
	} else if (type == PduType.InformRequest ) {
		pdu = InformRequestPdu.createFromBuffer (reader);
	} else if (type == PduType.GetRequest ) {
		pdu = GetRequestPdu.createFromBuffer (reader);
	} else if (type == PduType.SetRequest ) {
		pdu = SetRequestPdu.createFromBuffer (reader);
	} else if (type == PduType.GetNextRequest ) {
		pdu = GetNextRequestPdu.createFromBuffer (reader);
	} else if (type == PduType.GetBulkRequest ) {
		pdu = GetBulkRequestPdu.createFromBuffer (reader);
	} else {
		throw new ResponseInvalidError ("Unknown PDU type '" + type
				+ "' in response", ResponseInvalidCode.EUnknownPduType);
	}
	if ( scoped ) {
		pdu.contextEngineID = contextEngineID;
		pdu.contextName = contextName;
	}
	pdu.scoped = scoped;
	return pdu;
};

var createDiscoveryPdu = function (context) {
	return GetRequestPdu.createFromVariables(_generateId(), [], {context: context});
};

var Authentication = {};

Authentication.HMAC_BUFFER_SIZE = 1024*1024;

Authentication.algorithms = {};

Authentication.algorithms[AuthProtocols.md5] = {
	KEY_LENGTH: 16,
	AUTHENTICATION_CODE_LENGTH: 12,
	CRYPTO_ALGORITHM: 'md5'
};

Authentication.algorithms[AuthProtocols.sha] = {
	KEY_LENGTH: 20,
	AUTHENTICATION_CODE_LENGTH: 12,
	CRYPTO_ALGORITHM: 'sha1'
};

Authentication.algorithms[AuthProtocols.sha224] = {
	KEY_LENGTH: 28,
	AUTHENTICATION_CODE_LENGTH: 16,
	CRYPTO_ALGORITHM: 'sha224'
};

Authentication.algorithms[AuthProtocols.sha256] = {
	KEY_LENGTH: 32,
	AUTHENTICATION_CODE_LENGTH: 24,
	CRYPTO_ALGORITHM: 'sha256'
};

Authentication.algorithms[AuthProtocols.sha384] = {
	KEY_LENGTH: 48,
	AUTHENTICATION_CODE_LENGTH: 32,
	CRYPTO_ALGORITHM: 'sha384'
};

Authentication.algorithms[AuthProtocols.sha512] = {
	KEY_LENGTH: 64,
	AUTHENTICATION_CODE_LENGTH: 48,
	CRYPTO_ALGORITHM: 'sha512'
};

Authentication.authToKeyCache = {};

Authentication.computeCacheKey = function (authProtocol, authPasswordString, engineID) {
	var engineIDString = engineID.toString('base64');
	return authProtocol + authPasswordString + engineIDString;
};

// Adapted from RFC3414 Appendix A.2.1. Password to Key Sample Code for MD5
Authentication.passwordToKey = function (authProtocol, authPasswordString, engineID) {
	var hashAlgorithm;
	var firstDigest;
	var finalDigest;
	var buf;
	var cryptoAlgorithm = Authentication.algorithms[authProtocol].CRYPTO_ALGORITHM;

	var cacheKey = Authentication.computeCacheKey(authProtocol, authPasswordString, engineID);
	if (Authentication.authToKeyCache[cacheKey] !== undefined) {
		return Authentication.authToKeyCache[cacheKey];
	}

	buf = Buffer.alloc (Authentication.HMAC_BUFFER_SIZE, authPasswordString);

	hashAlgorithm = crypto.createHash(cryptoAlgorithm);
	hashAlgorithm.update(buf);
	firstDigest = hashAlgorithm.digest();
	// debug ("First digest:  " + firstDigest.toString('hex'));

	hashAlgorithm = crypto.createHash(cryptoAlgorithm);
	hashAlgorithm.update(firstDigest);
	hashAlgorithm.update(engineID);
	hashAlgorithm.update(firstDigest);
	finalDigest = hashAlgorithm.digest();
	// debug ("Localized key: " + finalDigest.toString('hex'));

	Authentication.authToKeyCache[cacheKey] = finalDigest;
	return finalDigest;
};

Authentication.getParametersLength = function (authProtocol) {
	return Authentication.algorithms[authProtocol].AUTHENTICATION_CODE_LENGTH;
};

Authentication.writeParameters = function (messageBuffer, authProtocol, authPassword, engineID, digestInMessage) {
	var digestToAdd;

	digestToAdd = Authentication.calculateDigest (messageBuffer, authProtocol, authPassword, engineID);
	digestToAdd.copy (digestInMessage);
	// debug ("Added Auth Parameters: " + digestToAdd.toString('hex'));
};

Authentication.isAuthentic = function (messageBuffer, authProtocol, authPassword, engineID, digestInMessage) {
	var savedDigest;
	var calculatedDigest;

	if (digestInMessage.length !== Authentication.algorithms[authProtocol].AUTHENTICATION_CODE_LENGTH)
		return false;

	// save original authenticationParameters field in message
	savedDigest = Buffer.from (digestInMessage);

	// clear the authenticationParameters field in message
	digestInMessage.fill (0);

	calculatedDigest = Authentication.calculateDigest (messageBuffer, authProtocol, authPassword, engineID);

	// replace previously cleared authenticationParameters field in message
	savedDigest.copy (digestInMessage);

	// debug ("Digest in message: " + digestInMessage.toString('hex'));
	// debug ("Calculated digest: " + calculatedDigest.toString('hex'));
	return calculatedDigest.equals (digestInMessage);
};

Authentication.calculateDigest = function (messageBuffer, authProtocol, authPassword, engineID) {
	var authKey = Authentication.passwordToKey (authProtocol, authPassword, engineID);

	var cryptoAlgorithm = Authentication.algorithms[authProtocol].CRYPTO_ALGORITHM;
	var hmacAlgorithm = crypto.createHmac (cryptoAlgorithm, authKey);
	hmacAlgorithm.update (messageBuffer);
	var digest = hmacAlgorithm.digest ();
	return digest.subarray (0, Authentication.algorithms[authProtocol].AUTHENTICATION_CODE_LENGTH);
};

var Encryption = {};

Encryption.encryptPdu = function (privProtocol, scopedPdu, privPassword, authProtocol, engine) {
	var encryptFunction = Encryption.algorithms[privProtocol].encryptPdu;
	return encryptFunction (scopedPdu, privProtocol, privPassword, authProtocol, engine);
};

Encryption.decryptPdu = function (privProtocol, encryptedPdu, privParameters, privPassword, authProtocol, engine) {
	var decryptFunction = Encryption.algorithms[privProtocol].decryptPdu;
	return decryptFunction (encryptedPdu, privProtocol, privParameters, privPassword, authProtocol, engine);
};

Encryption.debugEncrypt = function (encryptionKey, iv, plainPdu, encryptedPdu) {
	debug ("Key: " + encryptionKey.toString ('hex'));
	debug ("IV:  " + iv.toString ('hex'));
	debug ("Plain:     " + plainPdu.toString ('hex'));
	debug ("Encrypted: " + encryptedPdu.toString ('hex'));
};

Encryption.debugDecrypt = function (decryptionKey, iv, encryptedPdu, plainPdu) {
	debug ("Key: " + decryptionKey.toString ('hex'));
	debug ("IV:  " + iv.toString ('hex'));
	debug ("Encrypted: " + encryptedPdu.toString ('hex'));
	debug ("Plain:     " + plainPdu.toString ('hex'));
};

Encryption.generateLocalizedKey = function (algorithm, authProtocol, privPassword, engineID) {
	var privLocalizedKey;
	var encryptionKey;

	privLocalizedKey = Authentication.passwordToKey (authProtocol, privPassword, engineID);
	encryptionKey = Buffer.alloc (algorithm.KEY_LENGTH);
	privLocalizedKey.copy (encryptionKey, 0, 0, algorithm.KEY_LENGTH);

	return encryptionKey;
};

Encryption.generateLocalizedKeyBlumenthal = function (algorithm, authProtocol, privPassword, engineID) {
	let authKeyLength;
	let privLocalizedKey;
	let encryptionKey;
	let rounds;
	let hashInput;
	let nextHash;
	let hashAlgorithm;

	authKeyLength = Authentication.algorithms[authProtocol].KEY_LENGTH;
	rounds = Math.ceil (algorithm.KEY_LENGTH / authKeyLength );
	encryptionKey = Buffer.alloc (algorithm.KEY_LENGTH);
	privLocalizedKey = Authentication.passwordToKey (authProtocol, privPassword, engineID);
	nextHash = privLocalizedKey;

	for ( let round = 0 ; round < rounds ; round++ ) {
		nextHash.copy (encryptionKey, round * authKeyLength, 0, authKeyLength);
		if ( round < rounds - 1 ) {
			hashAlgorithm = crypto.createHash (Authentication.algorithms[authProtocol].CRYPTO_ALGORITHM);
			hashInput = Buffer.alloc ( (round + 1) * authKeyLength);
			encryptionKey.copy (hashInput, round * authKeyLength, 0, (round + 1) * authKeyLength);
			hashAlgorithm.update (hashInput);
			nextHash = hashAlgorithm.digest ();
		}
	}

	return encryptionKey;
};

Encryption.generateLocalizedKeyReeder = function (algorithm, authProtocol, privPassword, engineID) {
	let authKeyLength;
	let privLocalizedKey;
	let encryptionKey;
	let rounds;
	let nextPasswordInput;

	authKeyLength = Authentication.algorithms[authProtocol].KEY_LENGTH;
	rounds = Math.ceil (algorithm.KEY_LENGTH / authKeyLength );
	encryptionKey = Buffer.alloc (algorithm.KEY_LENGTH);
	nextPasswordInput = privPassword;

	for ( let round = 0 ; round < rounds ; round++ ) {
		privLocalizedKey = Authentication.passwordToKey (authProtocol, nextPasswordInput, engineID);
		privLocalizedKey.copy (encryptionKey, round * authKeyLength, 0, authKeyLength);
		nextPasswordInput = privLocalizedKey;
	}

	return encryptionKey;
};

Encryption.encryptPduDes = function (scopedPdu, privProtocol, privPassword, authProtocol, engine) {
	var des = Encryption.algorithms[PrivProtocols.des];
	var privLocalizedKey;
	var encryptionKey;
	var preIv;
	var salt;
	var iv;
	var i;
	var paddedScopedPduLength;
	var paddedScopedPdu;
	var encryptedPdu;
	var cipher;

	encryptionKey = Encryption.generateLocalizedKey (des, authProtocol, privPassword, engine.engineID);
	privLocalizedKey = Authentication.passwordToKey (authProtocol, privPassword, engine.engineID);
	encryptionKey = Buffer.alloc (des.KEY_LENGTH);
	privLocalizedKey.copy (encryptionKey, 0, 0, des.KEY_LENGTH);
	preIv = Buffer.alloc (des.BLOCK_LENGTH);
	privLocalizedKey.copy (preIv, 0, des.KEY_LENGTH, des.KEY_LENGTH + des.BLOCK_LENGTH);

	salt = Buffer.alloc (des.BLOCK_LENGTH);
	// set local SNMP engine boots part of salt to 1, as we have no persistent engine state
	salt.fill ('00000001', 0, 4, 'hex');
	// set local integer part of salt to random
	salt.fill (crypto.randomBytes (4), 4, 8);
	iv = Buffer.alloc (des.BLOCK_LENGTH);
	for (i = 0; i < iv.length; i++) {
		iv[i] = preIv[i] ^ salt[i];
	}
	
	if (scopedPdu.length % des.BLOCK_LENGTH == 0) {
		paddedScopedPdu = scopedPdu;
	} else {
		paddedScopedPduLength = des.BLOCK_LENGTH * (Math.floor (scopedPdu.length / des.BLOCK_LENGTH) + 1);
		paddedScopedPdu = Buffer.alloc (paddedScopedPduLength);
		scopedPdu.copy (paddedScopedPdu, 0, 0, scopedPdu.length);
	}
	cipher = crypto.createCipheriv (des.CRYPTO_ALGORITHM, encryptionKey, iv);
	encryptedPdu = cipher.update (paddedScopedPdu);
	encryptedPdu = Buffer.concat ([encryptedPdu, cipher.final()]);
	// Encryption.debugEncrypt (encryptionKey, iv, paddedScopedPdu, encryptedPdu);

	return {
		encryptedPdu: encryptedPdu,
		msgPrivacyParameters: salt
	};
};

Encryption.decryptPduDes = function (encryptedPdu, privProtocol, privParameters, privPassword, authProtocol, engine) {
	var des = Encryption.algorithms[PrivProtocols.des];
	var privLocalizedKey;
	var decryptionKey;
	var preIv;
	var salt;
	var iv;
	var i;
	var decryptedPdu;
	var decipher;

	privLocalizedKey = Authentication.passwordToKey (authProtocol, privPassword, engine.engineID);
	decryptionKey = Buffer.alloc (des.KEY_LENGTH);
	privLocalizedKey.copy (decryptionKey, 0, 0, des.KEY_LENGTH);
	preIv = Buffer.alloc (des.BLOCK_LENGTH);
	privLocalizedKey.copy (preIv, 0, des.KEY_LENGTH, des.KEY_LENGTH + des.BLOCK_LENGTH);

	salt = privParameters;
	iv = Buffer.alloc (des.BLOCK_LENGTH);
	for (i = 0; i < iv.length; i++) {
		iv[i] = preIv[i] ^ salt[i];
	}
	
	decipher = crypto.createDecipheriv (des.CRYPTO_ALGORITHM, decryptionKey, iv);
	decipher.setAutoPadding(false);
	decryptedPdu = decipher.update (encryptedPdu);
	decryptedPdu = Buffer.concat ([decryptedPdu, decipher.final()]);
	// Encryption.debugDecrypt (decryptionKey, iv, encryptedPdu, decryptedPdu);

	return decryptedPdu;
};

Encryption.generateIvAes = function (aes, engineBoots, engineTime, salt) {
	var iv;
	var engineBootsBuffer;
	var engineTimeBuffer;

	// iv = engineBoots(4) | engineTime(4) | salt(8)
	iv = Buffer.alloc (aes.BLOCK_LENGTH);
	engineBootsBuffer = Buffer.alloc (4);
	engineBootsBuffer.writeUInt32BE (engineBoots);
	engineTimeBuffer = Buffer.alloc (4);
	engineTimeBuffer.writeUInt32BE (engineTime);
	engineBootsBuffer.copy (iv, 0, 0, 4);
	engineTimeBuffer.copy (iv, 4, 0, 4);
	salt.copy (iv, 8, 0, 8);

	return iv;
};

Encryption.encryptPduAes = function (scopedPdu, privProtocol, privPassword, authProtocol, engine) {
	var aes = Encryption.algorithms[privProtocol];
	var localizationAlgorithm = aes.localizationAlgorithm;
	var encryptionKey;
	var salt;
	var iv;
	var cipher;
	var encryptedPdu;

	encryptionKey = localizationAlgorithm (aes, authProtocol, privPassword, engine.engineID);
	salt = Buffer.alloc (8).fill (crypto.randomBytes (8), 0, 8);
	iv = Encryption.generateIvAes (aes, engine.engineBoots, engine.engineTime, salt);
	cipher = crypto.createCipheriv (aes.CRYPTO_ALGORITHM, encryptionKey, iv);
	encryptedPdu = cipher.update (scopedPdu);
	encryptedPdu = Buffer.concat ([encryptedPdu, cipher.final()]);
	// Encryption.debugEncrypt (encryptionKey, iv, scopedPdu, encryptedPdu);

	return {
		encryptedPdu: encryptedPdu,
		msgPrivacyParameters: salt
	};
};

Encryption.decryptPduAes = function (encryptedPdu, privProtocol, privParameters, privPassword, authProtocol, engine) {
	var aes = Encryption.algorithms[privProtocol];
	var localizationAlgorithm = aes.localizationAlgorithm;
	var decryptionKey;
	var iv;
	var decipher;
	var decryptedPdu;

	decryptionKey = localizationAlgorithm (aes, authProtocol, privPassword, engine.engineID);
	iv = Encryption.generateIvAes (aes, engine.engineBoots, engine.engineTime, privParameters);
	decipher = crypto.createDecipheriv (aes.CRYPTO_ALGORITHM, decryptionKey, iv);
	decryptedPdu = decipher.update (encryptedPdu);
	decryptedPdu = Buffer.concat ([decryptedPdu, decipher.final()]);
	// Encryption.debugDecrypt (decryptionKey, iv, encryptedPdu, decryptedPdu);

	return decryptedPdu;
};

Encryption.algorithms = {};

Encryption.algorithms[PrivProtocols.des] = {
	CRYPTO_ALGORITHM: 'des-cbc',
	KEY_LENGTH: 8,
	BLOCK_LENGTH: 8,
	encryptPdu: Encryption.encryptPduDes,
	decryptPdu: Encryption.decryptPduDes,
	localizationAlgorithm: Encryption.generateLocalizedKey
};

Encryption.algorithms[PrivProtocols.aes] = {
	CRYPTO_ALGORITHM: 'aes-128-cfb',
	KEY_LENGTH: 16,
	BLOCK_LENGTH: 16,
	encryptPdu: Encryption.encryptPduAes,
	decryptPdu: Encryption.decryptPduAes,
	localizationAlgorithm: Encryption.generateLocalizedKey
};

Encryption.algorithms[PrivProtocols.aes256b] = {
	CRYPTO_ALGORITHM: 'aes-256-cfb',
	KEY_LENGTH: 32,
	BLOCK_LENGTH: 16,
	encryptPdu: Encryption.encryptPduAes,
	decryptPdu: Encryption.decryptPduAes,
	localizationAlgorithm: Encryption.generateLocalizedKeyBlumenthal
};

Encryption.algorithms[PrivProtocols.aes256r] = {
	CRYPTO_ALGORITHM: 'aes-256-cfb',
	KEY_LENGTH: 32,
	BLOCK_LENGTH: 16,
	encryptPdu: Encryption.encryptPduAes,
	decryptPdu: Encryption.decryptPduAes,
	localizationAlgorithm: Encryption.generateLocalizedKeyReeder
};

/*****************************************************************************
 ** Message class definition
 **/

var Message = function () {
};

Message.prototype.getReqId = function () {
	return this.version == Version3 ? this.msgGlobalData.msgID : this.pdu.id;
};

Message.prototype.toBuffer = function () {
	if ( this.version == Version3 ) {
		return this.toBufferV3();
	} else {
		return this.toBufferCommunity();
	}
};

Message.prototype.toBufferCommunity = function () {
	if (this.buffer)
		return this.buffer;

	var writer = new ber.Writer ();

	writer.startSequence ();

	writeInt32 (writer, ObjectType.Integer, this.version);
	writer.writeString (this.community);

	this.pdu.toBuffer (writer);

	writer.endSequence ();

	this.buffer = writer.buffer;

	return this.buffer;
};

Message.prototype.toBufferV3 = function () {
	var encryptionResult;

	if (this.buffer)
		return this.buffer;

	// ScopedPDU
	var scopedPduWriter = new ber.Writer ();
	scopedPduWriter.startSequence ();
	var contextEngineID = this.pdu.contextEngineID ? this.pdu.contextEngineID : this.msgSecurityParameters.msgAuthoritativeEngineID;
	if ( contextEngineID.length == 0 ) {
		scopedPduWriter.writeString ("");
	} else {
		scopedPduWriter.writeBuffer (contextEngineID, ber.OctetString);
	}
	scopedPduWriter.writeString (this.pdu.contextName);
	this.pdu.toBuffer (scopedPduWriter);
	scopedPduWriter.endSequence ();

	if ( this.hasPrivacy() ) {
		var authoritativeEngine = {
			engineID: this.msgSecurityParameters.msgAuthoritativeEngineID,
			engineBoots: this.msgSecurityParameters.msgAuthoritativeEngineBoots,
			engineTime: this.msgSecurityParameters.msgAuthoritativeEngineTime,
		};
		encryptionResult = Encryption.encryptPdu (this.user.privProtocol, scopedPduWriter.buffer,
				this.user.privKey, this.user.authProtocol, authoritativeEngine);
	}

	var writer = new ber.Writer ();

	writer.startSequence ();

	writeInt32 (writer, ObjectType.Integer, this.version);

	// HeaderData
	writer.startSequence ();
	writeInt32 (writer, ObjectType.Integer, this.msgGlobalData.msgID);
	writeInt32 (writer, ObjectType.Integer, this.msgGlobalData.msgMaxSize);
	writer.writeByte (ber.OctetString);
	writer.writeByte (1);
	writer.writeByte (this.msgGlobalData.msgFlags);
	writeInt32 (writer, ObjectType.Integer, this.msgGlobalData.msgSecurityModel);
	writer.endSequence ();

	// msgSecurityParameters
	writer.startSequence (ber.OctetString);
	writer.startSequence ();
	//writer.writeString (this.msgSecurityParameters.msgAuthoritativeEngineID);
	// writing a zero-length buffer fails - should fix asn1-ber for this condition
	if ( this.msgSecurityParameters.msgAuthoritativeEngineID.length == 0 ) {
		writer.writeString ("");
	} else {
		writer.writeBuffer (this.msgSecurityParameters.msgAuthoritativeEngineID, ber.OctetString);
	}
	writeInt32 (writer, ObjectType.Integer, this.msgSecurityParameters.msgAuthoritativeEngineBoots);
	writeInt32 (writer, ObjectType.Integer, this.msgSecurityParameters.msgAuthoritativeEngineTime);
	writer.writeString (this.msgSecurityParameters.msgUserName);

	var msgAuthenticationParameters = '';
	if ( this.hasAuthentication() ) {
		var authParametersLength = Authentication.getParametersLength (this.user.authProtocol);
		msgAuthenticationParameters = Buffer.alloc (authParametersLength);
		writer.writeBuffer (msgAuthenticationParameters, ber.OctetString);
	} else {
		writer.writeString ("");
	}
	var msgAuthenticationParametersOffset = writer._offset - msgAuthenticationParameters.length;

	if ( this.hasPrivacy() ) {
		writer.writeBuffer (encryptionResult.msgPrivacyParameters, ber.OctetString);
	} else {
		writer.writeString ("");
	}
	msgAuthenticationParametersOffset -= writer._offset;
	writer.endSequence ();
	writer.endSequence ();
	msgAuthenticationParametersOffset += writer._offset;

	if ( this.hasPrivacy() ) {
		writer.writeBuffer (encryptionResult.encryptedPdu, ber.OctetString);
	} else {
		writer.writeBuffer (scopedPduWriter.buffer);
	}

	msgAuthenticationParametersOffset -= writer._offset;
	writer.endSequence ();
	msgAuthenticationParametersOffset += writer._offset;

	this.buffer = writer.buffer;

	if ( this.hasAuthentication() ) {
		msgAuthenticationParameters = this.buffer.subarray (msgAuthenticationParametersOffset,
			msgAuthenticationParametersOffset + msgAuthenticationParameters.length);
		Authentication.writeParameters (this.buffer, this.user.authProtocol, this.user.authKey,
			this.msgSecurityParameters.msgAuthoritativeEngineID, msgAuthenticationParameters);
	}

	return this.buffer;
};

Message.prototype.processIncomingSecurity = function (user, responseCb) {
	if ( this.hasPrivacy() ) {
		if ( ! this.decryptPdu(user, responseCb) ) {
			return false;
		}
	}

	if ( this.hasAuthentication() && ! this.isAuthenticationDisabled() ) {
		return this.checkAuthentication(user, responseCb);
	} else {
		return true;
	}
};

Message.prototype.decryptPdu = function (user, responseCb) {
	var decryptedPdu;
	var decryptedPduReader;
	try {
		var authoratitiveEngine = {
			engineID: this.msgSecurityParameters.msgAuthoritativeEngineID,
			engineBoots: this.msgSecurityParameters.msgAuthoritativeEngineBoots,
			engineTime: this.msgSecurityParameters.msgAuthoritativeEngineTime
		};
		decryptedPdu = Encryption.decryptPdu(user.privProtocol, this.encryptedPdu,
				this.msgSecurityParameters.msgPrivacyParameters, user.privKey, user.authProtocol,
				authoratitiveEngine);
		decryptedPduReader = new ber.Reader (decryptedPdu);
		this.pdu = readPdu(decryptedPduReader, true);
		return true;
	} catch (error) {
		responseCb (new ResponseInvalidError ("Failed to decrypt PDU: " + error,
				ResponseInvalidCode.ECouldNotDecrypt));
		return false;
	}

};

Message.prototype.checkAuthentication = function (user, responseCb) {
	if ( Authentication.isAuthentic(this.buffer, user.authProtocol, user.authKey,
			this.msgSecurityParameters.msgAuthoritativeEngineID, this.msgSecurityParameters.msgAuthenticationParameters) ) {
		return true;
	} else {
		responseCb (new ResponseInvalidError ("Authentication digest "
				+ this.msgSecurityParameters.msgAuthenticationParameters.toString ('hex')
				+ " received in message does not match digest "
				+ Authentication.calculateDigest (this.buffer, user.authProtocol, user.authKey,
					this.msgSecurityParameters.msgAuthoritativeEngineID).toString ('hex')
				+ " calculated for message", ResponseInvalidCode.EAuthFailure, { user }));
		return false;
	}

};

Message.prototype.setMsgFlags = function (bitPosition, flag) {
	if ( this.msgGlobalData && this.msgGlobalData !== undefined && this.msgGlobalData !== null ) {
		if ( flag ) {
			this.msgGlobalData.msgFlags = this.msgGlobalData.msgFlags | ( 2 ** bitPosition );
		} else {
			this.msgGlobalData.msgFlags = this.msgGlobalData.msgFlags & ( 255 - 2 ** bitPosition );
		}
	}
};

Message.prototype.hasAuthentication = function () {
	return this.msgGlobalData && this.msgGlobalData.msgFlags && this.msgGlobalData.msgFlags & 1;
};

Message.prototype.setAuthentication = function (flag) {
	this.setMsgFlags (0, flag);
};

Message.prototype.hasPrivacy = function () {
	return this.msgGlobalData && this.msgGlobalData.msgFlags && this.msgGlobalData.msgFlags & 2;
};

Message.prototype.setPrivacy = function (flag) {
	this.setMsgFlags (1, flag);
};

Message.prototype.isReportable = function () {
	return this.msgGlobalData && this.msgGlobalData.msgFlags && this.msgGlobalData.msgFlags & 4;
};

Message.prototype.setReportable = function (flag) {
	this.setMsgFlags (2, flag);
};

Message.prototype.isAuthenticationDisabled = function () {
	return this.disableAuthentication;
};

Message.prototype.hasAuthoritativeEngineID = function () {
	return this.msgSecurityParameters && this.msgSecurityParameters.msgAuthoritativeEngineID &&
		this.msgSecurityParameters.msgAuthoritativeEngineID != "";
};

Message.prototype.createReportResponseMessage = function (engine, context) {
	var user = {
		name: "",
		level: SecurityLevel.noAuthNoPriv
	};
	var responseSecurityParameters = {
		msgAuthoritativeEngineID: engine.engineID,
		msgAuthoritativeEngineBoots: engine.engineBoots,
		msgAuthoritativeEngineTime: engine.engineTime,
		msgUserName: user.name,
		msgAuthenticationParameters: "",
		msgPrivacyParameters: ""
	};
	var reportPdu = ReportPdu.createFromVariables (this.pdu.id, [], {});
	reportPdu.contextName = context;
	var responseMessage = Message.createRequestV3 (user, responseSecurityParameters, reportPdu);
	responseMessage.msgGlobalData.msgID = this.msgGlobalData.msgID;
	return responseMessage;
};

Message.prototype.createResponseForRequest = function (responsePdu) {
	if ( this.version == Version3 ) {
		return this.createV3ResponseFromRequest(responsePdu);
	} else {
		return this.createCommunityResponseFromRequest(responsePdu);
	}
};

Message.prototype.createCommunityResponseFromRequest = function (responsePdu) {
	return Message.createCommunity(this.version, this.community, responsePdu);
};

Message.prototype.createV3ResponseFromRequest = function (responsePdu) {
	var responseUser = {
		name: this.user.name,
		level: this.user.level,
		authProtocol: this.user.authProtocol,
		authKey: this.user.authKey,
		privProtocol: this.user.privProtocol,
		privKey: this.user.privKey
	};
	var responseSecurityParameters = {
		msgAuthoritativeEngineID: this.msgSecurityParameters.msgAuthoritativeEngineID,
		msgAuthoritativeEngineBoots: this.msgSecurityParameters.msgAuthoritativeEngineBoots,
		msgAuthoritativeEngineTime: this.msgSecurityParameters.msgAuthoritativeEngineTime,
		msgUserName: this.msgSecurityParameters.msgUserName,
		msgAuthenticationParameters: "",
		msgPrivacyParameters: ""
	};
	var responseGlobalData = {
		msgID: this.msgGlobalData.msgID,
		msgMaxSize: 65507,
		msgFlags: this.msgGlobalData.msgFlags & (255 - 4),
		msgSecurityModel: 3
	};
	return Message.createV3 (responseUser, responseGlobalData, responseSecurityParameters, responsePdu);
};

Message.createCommunity = function (version, community, pdu) {
	var message = new Message ();

	message.version = version;
	message.community = community;
	message.pdu = pdu;

	return message;
};

Message.createRequestV3 = function (user, msgSecurityParameters, pdu) {
	var authFlag = user.level == SecurityLevel.authNoPriv || user.level == SecurityLevel.authPriv ? 1 : 0;
	var privFlag = user.level == SecurityLevel.authPriv ? 1 : 0;
	var reportableFlag = ( pdu.type == PduType.GetResponse || pdu.type == PduType.TrapV2 ) ? 0 : 1;
	var msgGlobalData = {
		msgID: _generateId(), // random ID
		msgMaxSize: 65507,
		msgFlags: reportableFlag * 4 | privFlag * 2 | authFlag * 1,
		msgSecurityModel: 3
	};
	return Message.createV3 (user, msgGlobalData, msgSecurityParameters, pdu);
};

Message.createV3 = function (user, msgGlobalData, msgSecurityParameters, pdu) {
	var message = new Message ();

	message.version = 3;
	message.user = user;
	message.msgGlobalData = msgGlobalData;
	message.msgSecurityParameters = {
		msgAuthoritativeEngineID: msgSecurityParameters.msgAuthoritativeEngineID || Buffer.from(""),
		msgAuthoritativeEngineBoots: msgSecurityParameters.msgAuthoritativeEngineBoots || 0,
		msgAuthoritativeEngineTime: msgSecurityParameters.msgAuthoritativeEngineTime || 0,
		msgUserName: user.name || "",
		msgAuthenticationParameters: "",
		msgPrivacyParameters: ""
	};
	message.pdu = pdu;

	return message;
};

Message.createDiscoveryV3 = function (pdu) {
	var msgSecurityParameters = {
		msgAuthoritativeEngineID: Buffer.from(""),
		msgAuthoritativeEngineBoots: 0,
		msgAuthoritativeEngineTime: 0
	};
	var emptyUser = {
		name: "",
		level: SecurityLevel.noAuthNoPriv
	};
	return Message.createRequestV3 (emptyUser, msgSecurityParameters, pdu);
};

Message.createFromBuffer = function (buffer, user) {
	var reader = new ber.Reader (buffer);
	var message = new Message();

	reader.readSequence ();

	message.version = readInt32 (reader);

	if (message.version != 3) {
		message.community = reader.readString ();
		message.pdu = readPdu(reader, false);
	} else {
		// HeaderData
		message.msgGlobalData = {};
		reader.readSequence ();
		message.msgGlobalData.msgID = readInt32 (reader);
		message.msgGlobalData.msgMaxSize = readInt32 (reader);
		message.msgGlobalData.msgFlags = reader.readString (ber.OctetString, true)[0];
		message.msgGlobalData.msgSecurityModel = readInt32 (reader);

		// msgSecurityParameters
		message.msgSecurityParameters = {};
		var msgSecurityParametersReader = new ber.Reader (reader.readString (ber.OctetString, true));
		msgSecurityParametersReader.readSequence ();
		message.msgSecurityParameters.msgAuthoritativeEngineID = msgSecurityParametersReader.readString (ber.OctetString, true);
		message.msgSecurityParameters.msgAuthoritativeEngineBoots = readInt32 (msgSecurityParametersReader);
		message.msgSecurityParameters.msgAuthoritativeEngineTime = readInt32 (msgSecurityParametersReader);
		message.msgSecurityParameters.msgUserName = msgSecurityParametersReader.readString ();
		message.msgSecurityParameters.msgAuthenticationParameters = msgSecurityParametersReader.readString (ber.OctetString, true);
		message.msgSecurityParameters.msgPrivacyParameters = Buffer.from(msgSecurityParametersReader.readString (ber.OctetString, true));

		if ( message.hasPrivacy() ) {
			message.encryptedPdu = reader.readString (ber.OctetString, true);
			message.pdu = null;
		} else {
			message.pdu = readPdu(reader, true);
		}
	}

	message.buffer = buffer;

	return message;
};


var Req = function (session, message, feedCb, responseCb, options) {

	this.message = message;
	this.responseCb = responseCb;
	this.retries = session.retries;
	this.timeout = session.timeout;
	// Add timeout backoff
	this.backoff = session.backoff;
	this.onResponse = session.onSimpleGetResponse;
	this.feedCb = feedCb;
	this.port = (options && options.port) ? options.port : session.port;
	this.context = session.context;
};

Req.prototype.getId = function() {
	return this.message.getReqId ();
};


/*****************************************************************************
 ** Session class definition
 **/

var Session = function (target, authenticator, options) {
	this.target = target || "127.0.0.1";

	options = options || {};
	this.version = options.version
			? options.version
			: Version1;

	if ( this.version == Version3 ) {
		this.user = authenticator;
	} else {
		this.community = authenticator || "public";
	}

	this.transport = options.transport
			? options.transport
			: "udp4";
	this.port = options.port
			? options.port
			: 161;
	this.trapPort = options.trapPort
			? options.trapPort
			: 162;

	this.retries = (options.retries || options.retries == 0)
			? options.retries
			: 3;
	this.timeout = options.timeout
			? options.timeout
			: 5000;

	this.backoff = options.backoff >= 1.0
			? options.backoff
			: 1.0;

	this.sourceAddress = options.sourceAddress
			? options.sourceAddress
			: undefined;
	this.sourcePort = options.sourcePort
			? parseInt(options.sourcePort)
			: undefined;

	this.idBitsSize = options.idBitsSize
			? parseInt(options.idBitsSize)
			: 32;

	this.context = options.context
			? options.context
			: "";

	this.backwardsGetNexts = (typeof options.backwardsGetNexts !== 'undefined')
			? options.backwardsGetNexts
			: true;

	this.reportOidMismatchErrors = (typeof options.reportOidMismatchErrors !== 'undefined')
            ? options.reportOidMismatchErrors
            : false;

	DEBUG = options.debug;

	this.engine = new Engine (options.engineID);
	this.reqs = {};
	this.reqCount = 0;

	this.dgram = dgram.createSocket (this.transport);
	this.dgram.unref();
	
	var me = this;
	this.dgram.on ("message", me.onMsg.bind (me));
	this.dgram.on ("close", me.onClose.bind (me));
	this.dgram.on ("error", me.onError.bind (me));

	if (this.sourceAddress || this.sourcePort)
		this.dgram.bind (this.sourcePort, this.sourceAddress);
};

util.inherits (Session, events.EventEmitter);

Session.prototype.close = function () {
	this.dgram.close ();
	return this;
};

Session.prototype.cancelRequests = function (error) {
	var id;
	for (id in this.reqs) {
		var req = this.reqs[id];
		this.unregisterRequest (req.getId ());
		req.responseCb (error);
	}
};

function _generateId (bitSize) {
	if (bitSize === 16) {
		return Math.floor(Math.random() * 10000) % 65535;
	}
	return Math.floor(Math.random() * 100000000) % 4294967295;
}

Session.prototype.getAsync = function(oids) {
	return new Promise(function(resolve, reject) {
			this.get(oids, function(error, varbinds) {
					if (error) reject(error);
					resolve(varbinds);
			})}.bind(this));
}

Session.prototype.get = function (oids, responseCb) {
	var reportOidMismatchErrors = this.reportOidMismatchErrors;

	function feedCb (req, message) {
		var pdu = message.pdu;
		var varbinds = [];

		if (req.message.pdu.varbinds.length != pdu.varbinds.length) {
			req.responseCb (new ResponseInvalidError ("Requested OIDs do not "
					+ "match response OIDs", ResponseInvalidCode.EReqResOidNoMatch));
		} else {
			for (var i = 0; i < req.message.pdu.varbinds.length; i++) {
				if ( reportOidMismatchErrors && req.message.pdu.varbinds[i].oid != pdu.varbinds[i].oid ) {
					req.responseCb (new ResponseInvalidError ("OID '"
							+ req.message.pdu.varbinds[i].oid
							+ "' in request at position '" + i + "' does not "
							+ "match OID '" + pdu.varbinds[i].oid + "' in response "
							+ "at position '" + i + "'", ResponseInvalidCode.EReqResOidNoMatch));
					return;
				} else {
					varbinds.push (pdu.varbinds[i]);
				}
			}

			req.responseCb (null, varbinds);
		}
	}

	var pduVarbinds = [];

	for (var i = 0; i < oids.length; i++) {
		var varbind = {
			oid: oids[i]
		};
		pduVarbinds.push (varbind);
	}

	this.simpleGet (GetRequestPdu, feedCb, pduVarbinds, responseCb);

	return this;
};

Session.prototype.getBulkAsync = function(oids, nonRepeaters, maxRepetitions) {
	return new Promise(function(resolve, reject) {
			this.getBulk(oids, nonRepeaters, maxRepetitions, function(error, varbinds) {
					if (error) reject(error);
					resolve(varbinds);
			})}.bind(this));
}

Session.prototype.getBulk = function (oids, nonRepeaters, maxRepetitions, responseCb) {
	var reportOidMismatchErrors = this.reportOidMismatchErrors;
	var backwardsGetNexts = this.backwardsGetNexts;

	nonRepeaters = nonRepeaters || 0;
	maxRepetitions = maxRepetitions || 10;
	
	function feedCb (req, message) {
		var pdu = message.pdu;
		var reqVarbinds = req.message.pdu.varbinds;
		var varbinds = [];
		var i = 0;

		for ( ; i < reqVarbinds.length && i < pdu.varbinds.length; i++) {
			if (isVarbindError (pdu.varbinds[i])) {
				if ( reportOidMismatchErrors && reqVarbinds[i].oid != pdu.varbinds[i].oid ) {
					req.responseCb (new ResponseInvalidError ("OID '" + reqVarbinds[i].oid
							+ "' in request at position '" + i + "' does not "
							+ "match OID '" + pdu.varbinds[i].oid + "' in response "
							+ "at position '" + i + "'", ResponseInvalidCode.EReqResOidNoMatch));
					return;
				}
			} else {
				if ( ! backwardsGetNexts && ! oidFollowsOid (reqVarbinds[i].oid, pdu.varbinds[i].oid)) {
					req.responseCb (new ResponseInvalidError ("OID '" + reqVarbinds[i].oid
							+ "' in request at positiion '" + i + "' does not "
							+ "precede OID '" + pdu.varbinds[i].oid + "' in response "
							+ "at position '" + i + "'", ResponseInvalidCode.EOutOfOrder));
					return;
				}
			}
			if (i < nonRepeaters)
				varbinds.push (pdu.varbinds[i]);
			else
				varbinds.push ([pdu.varbinds[i]]);
		}

		var repeaters = reqVarbinds.length - nonRepeaters;

		for ( ; i < pdu.varbinds.length; i++) {
			var reqIndex = (i - nonRepeaters) % repeaters + nonRepeaters;
			var prevIndex = i - repeaters;
			var prevOid = pdu.varbinds[prevIndex].oid;

			if (isVarbindError (pdu.varbinds[i])) {
				if ( reportOidMismatchErrors && prevOid != pdu.varbinds[i].oid ) {
					req.responseCb (new ResponseInvalidError ("OID '" + prevOid
							+ "' in response at position '" + prevIndex + "' does not "
							+ "match OID '" + pdu.varbinds[i].oid + "' in response "
							+ "at position '" + i + "'", ResponseInvalidCode.EReqResOidNoMatch));
					return;
				}
			} else {
				if ( ! backwardsGetNexts && ! oidFollowsOid (prevOid, pdu.varbinds[i].oid)) {
					req.responseCb (new ResponseInvalidError ("OID '" + prevOid
							+ "' in response at positiion '" + prevIndex + "' does not "
							+ "precede OID '" + pdu.varbinds[i].oid + "' in response "
							+ "at position '" + i + "'", ResponseInvalidCode.EOutOfOrder));
					return;
				}
			}
			varbinds[reqIndex].push (pdu.varbinds[i]);
		}
		if (oids.length===1) varbinds=varbinds[0];
		req.responseCb (null, varbinds);
	}

	var pduVarbinds = [];

	for (var i = 0; i < oids.length; i++) {
		var varbind = {
			oid: oids[i]
		};
		pduVarbinds.push (varbind);
	}

	var options = {
		nonRepeaters: nonRepeaters,
		maxRepetitions: maxRepetitions
	};

	this.simpleGet (GetBulkRequestPdu, feedCb, pduVarbinds, responseCb,
			options);

	return this;
};

Session.prototype.getNextAsync = function(oids) {
	return new Promise(function(resolve, reject) {
			this.getNext(oids, function(error, varbinds) {
					if (error) reject(error);
					resolve(varbinds);
			})}.bind(this));
}
Session.prototype.getNext = function (oids, responseCb) {
	var backwardsGetNexts = this.backwardsGetNexts;

	function feedCb (req, message) {
		var pdu = message.pdu;
		var varbinds = [];

		if (req.message.pdu.varbinds.length != pdu.varbinds.length) {
			req.responseCb (new ResponseInvalidError ("Requested OIDs do not "
					+ "match response OIDs", ResponseInvalidCode.EReqResOidNoMatch));
		} else {
			for (var i = 0; i < req.message.pdu.varbinds.length; i++) {
				if (isVarbindError (pdu.varbinds[i])) {
					varbinds.push (pdu.varbinds[i]);
				} else if ( ! backwardsGetNexts && ! oidFollowsOid (req.message.pdu.varbinds[i].oid,
						pdu.varbinds[i].oid)) {
					req.responseCb (new ResponseInvalidError ("OID '"
							+ req.message.pdu.varbinds[i].oid + "' in request at "
							+ "positiion '" + i + "' does not precede "
							+ "OID '" + pdu.varbinds[i].oid + "' in response "
							+ "at position '" + i + "'", ResponseInvalidCode.OutOfOrder));
					return;
				} else {
					varbinds.push (pdu.varbinds[i]);
				}
			}

			req.responseCb (null, varbinds);
		}
	}

	var pduVarbinds = [];

	for (var i = 0; i < oids.length; i++) {
		var varbind = {
			oid: oids[i]
		};
		pduVarbinds.push (varbind);
	}

	this.simpleGet (GetNextRequestPdu, feedCb, pduVarbinds, responseCb);

	return this;
};

Session.prototype.inform = function () {
	var typeOrOid = arguments[0];
	var varbinds, options = {}, responseCb;

	/**
	 ** Support the following signatures:
	 ** 
	 **    typeOrOid, varbinds, options, callback
	 **    typeOrOid, varbinds, callback
	 **    typeOrOid, options, callback
	 **    typeOrOid, callback
	 **/
	if (arguments.length >= 4) {
		varbinds = arguments[1];
		options = arguments[2];
		responseCb = arguments[3];
	} else if (arguments.length >= 3) {
		if (arguments[1].constructor != Array) {
			varbinds = [];
			options = arguments[1];
			responseCb = arguments[2];
		} else {
			varbinds = arguments[1];
			responseCb = arguments[2];
		}
	} else {
		varbinds = [];
		responseCb = arguments[1];
	}

	if ( this.version == Version1 ) {
		responseCb (new RequestInvalidError ("Inform not allowed for SNMPv1"));
		return;
	}

	function feedCb (req, message) {
		var pdu = message.pdu;
		var varbinds = [];

		if (req.message.pdu.varbinds.length != pdu.varbinds.length) {
			req.responseCb (new ResponseInvalidError ("Inform OIDs do not "
					+ "match response OIDs", ResponseInvalidCode.EReqResOidNoMatch));
		} else {
			for (var i = 0; i < req.message.pdu.varbinds.length; i++) {
				if (req.message.pdu.varbinds[i].oid != pdu.varbinds[i].oid) {
					req.responseCb (new ResponseInvalidError ("OID '"
							+ req.message.pdu.varbinds[i].oid
							+ "' in inform at positiion '" + i + "' does not "
							+ "match OID '" + pdu.varbinds[i].oid + "' in response "
							+ "at position '" + i + "'", ResponseInvalidCode.EReqResOidNoMatch));
					return;
				} else {
					varbinds.push (pdu.varbinds[i]);
				}
			}

			req.responseCb (null, varbinds);
		}
	}

	if (typeof typeOrOid != "string")
		typeOrOid = "1.3.6.1.6.3.1.1.5." + (typeOrOid + 1);

	var pduVarbinds = [
		{
			oid: "1.3.6.1.2.1.1.3.0",
			type: ObjectType.TimeTicks,
			value: options.upTime || Math.floor (process.uptime () * 100)
		},
		{
			oid: "1.3.6.1.6.3.1.1.4.1.0",
			type: ObjectType.OID,
			value: typeOrOid
		}
	];

	for (var i = 0; i < varbinds.length; i++) {
		var varbind = {
			oid: varbinds[i].oid,
			type: varbinds[i].type,
			value: varbinds[i].value
		};
		pduVarbinds.push (varbind);
	}
	
	options.port = this.trapPort;

	this.simpleGet (InformRequestPdu, feedCb, pduVarbinds, responseCb, options);

	return this;
};

Session.prototype.onClose = function () {
	this.cancelRequests (new Error ("Socket forcibly closed"));
	this.emit ("close");
};

Session.prototype.onError = function (error) {
	this.emit (error);
};

Session.prototype.onMsg = function (buffer) {
	try {
		var message = Message.createFromBuffer (buffer);
	} catch (error) {
		this.emit("error", error);
		return;
	}

	var req = this.unregisterRequest (message.getReqId ());
	if ( ! req )
		return;

	if ( ! message.processIncomingSecurity (this.user, req.responseCb) )
		return;

	if (message.version != req.message.version) {
		req.responseCb (new ResponseInvalidError ("Version in request '"
				+ req.message.version + "' does not match version in "
				+ "response '" + message.version + "'", ResponseInvalidCode.EVersionNoMatch));
	} else if (message.community != req.message.community) {
		req.responseCb (new ResponseInvalidError ("Community '"
				+ req.message.community + "' in request does not match "
				+ "community '" + message.community + "' in response", ResponseInvalidCode.ECommunityNoMatch));
	} else if (message.pdu.type == PduType.Report) {
		this.msgSecurityParameters = {
			msgAuthoritativeEngineID: message.msgSecurityParameters.msgAuthoritativeEngineID,
			msgAuthoritativeEngineBoots: message.msgSecurityParameters.msgAuthoritativeEngineBoots,
			msgAuthoritativeEngineTime: message.msgSecurityParameters.msgAuthoritativeEngineTime
		};
		if ( this.proxy ) {
			this.msgSecurityParameters.msgUserName = this.proxy.user.name;
			this.msgSecurityParameters.msgAuthenticationParameters = "";
			this.msgSecurityParameters.msgPrivacyParameters = "";
		} else {
			if ( ! req.originalPdu || ! req.allowReport ) {
				if (Array.isArray(message.pdu.varbinds) && message.pdu.varbinds[0] && message.pdu.varbinds[0].oid.indexOf(UsmStatsBase) === 0) {
					this.userSecurityModelError (req, message.pdu.varbinds[0].oid);
					return;
				}
				req.responseCb (new ResponseInvalidError ("Unexpected Report PDU", ResponseInvalidCode.EUnexpectedReport) );
				return;
			}
			req.originalPdu.contextName = this.context;
			var timeSyncNeeded = ! message.msgSecurityParameters.msgAuthoritativeEngineBoots && ! message.msgSecurityParameters.msgAuthoritativeEngineTime;
			this.sendV3Req (req.originalPdu, req.feedCb, req.responseCb, req.options, req.port, timeSyncNeeded);
		}
	} else if ( this.proxy ) {
		this.onProxyResponse (req, message);
	} else if (message.pdu.type == PduType.GetResponse) {
		req.onResponse (req, message);
	} else {
		req.responseCb (new ResponseInvalidError ("Unknown PDU type '"
				+ message.pdu.type + "' in response", ResponseInvalidCode.EUnknownPduType));
	}
};

Session.prototype.onSimpleGetResponse = function (req, message) {
	var pdu = message.pdu;

	if (pdu.errorStatus > 0) {
		var statusString = ErrorStatus[pdu.errorStatus]
				|| ErrorStatus.GeneralError;
		var statusCode = ErrorStatus[statusString]
				|| ErrorStatus[ErrorStatus.GeneralError];

		if (pdu.errorIndex <= 0 || pdu.errorIndex > pdu.varbinds.length) {
			req.responseCb (new RequestFailedError (statusString, statusCode));
		} else {
			var oid = pdu.varbinds[pdu.errorIndex - 1].oid;
			var error = new RequestFailedError (statusString + ": " + oid,
					statusCode);
			req.responseCb (error);
		}
	} else {
		req.feedCb (req, message);
	}
};

Session.prototype.registerRequest = function (req) {
	if (! this.reqs[req.getId ()]) {
		this.reqs[req.getId ()] = req;
		if (this.reqCount <= 0)
			this.dgram.ref();
		this.reqCount++;
	}
	var me = this;
	req.timer = setTimeout (function () {
		if (req.retries-- > 0) {
			me.send (req);
		} else {
			me.unregisterRequest (req.getId ());
			req.responseCb (new RequestTimedOutError (
					"Request timed out"));
		}
	}, req.timeout);
	// Apply timeout backoff
	if (req.backoff && req.backoff >= 1)
		req.timeout *= req.backoff;
};

Session.prototype.send = function (req, noWait) {
	try {
		var me = this;
		
		var buffer = req.message.toBuffer ();

		this.dgram.send (buffer, 0, buffer.length, req.port, this.target,
				function (error, bytes) {
			if (error) {
				req.responseCb (error);
			} else {
				if (noWait) {
					req.responseCb (null);
				} else {
					me.registerRequest (req);
				}
			}
		});
	} catch (error) {
		req.responseCb (error);
	}
	
	return this;
};

Session.prototype.set = function (varbinds, responseCb) {
	var reportOidMismatchErrors = this.reportOidMismatchErrors;

	function feedCb (req, message) {
		var pdu = message.pdu;
		var varbinds = [];

		if (req.message.pdu.varbinds.length != pdu.varbinds.length) {
			req.responseCb (new ResponseInvalidError ("Requested OIDs do not "
					+ "match response OIDs", ResponseInvalidCode.EReqResOidNoMatch));
		} else {
			for (var i = 0; i < req.message.pdu.varbinds.length; i++) {
				if ( reportOidMismatchErrors && req.message.pdu.varbinds[i].oid != pdu.varbinds[i].oid ) {
					req.responseCb (new ResponseInvalidError ("OID '"
							+ req.message.pdu.varbinds[i].oid
							+ "' in request at position '" + i + "' does not "
							+ "match OID '" + pdu.varbinds[i].oid + "' in response "
							+ "at position '" + i + "'", ResponseInvalidCode.EReqResOidNoMatch));
					return;
				} else {
					varbinds.push (pdu.varbinds[i]);
				}
			}

			req.responseCb (null, varbinds);
		}
	}

	var pduVarbinds = [];

	for (var i = 0; i < varbinds.length; i++) {
		var varbind = {
			oid: varbinds[i].oid,
			type: varbinds[i].type,
			value: varbinds[i].value
		};
		pduVarbinds.push (varbind);
	}

	this.simpleGet (SetRequestPdu, feedCb, pduVarbinds, responseCb);

	return this;
};

Session.prototype.simpleGet = function (pduClass, feedCb, varbinds,
		responseCb, options) {
	var id = _generateId (this.idBitsSize);
	options = Object.assign({}, options, { context: this.context });
	var pdu = SimplePdu.createFromVariables (pduClass, id, varbinds, options);
	var message;
	var req;

	if ( this.version == Version3 ) {
		if ( this.msgSecurityParameters ) {
			this.sendV3Req (pdu, feedCb, responseCb, options, this.port, true);
		} else {
			this.sendV3Discovery (pdu, feedCb, responseCb, options);
		}
	} else {
		message = Message.createCommunity (this.version, this.community, pdu);
		req = new Req (this, message, feedCb, responseCb, options);
		this.send (req);
	}
};

function subtreeCb (req, varbinds) {
	var done = 0;

	for (var i = varbinds.length; i > 0; i--) {
		if (! oidInSubtree (req.baseOid, varbinds[i - 1].oid)) {
			done = 1;
			varbinds.pop ();
		}
	}

	if (varbinds.length > 0) {
		if (req.feedCb (varbinds)) {
			done = 1;
		}
	}

	if (done)
		return true;
}

Session.prototype.subtree  = function () {
	var me = this;
	var oid = arguments[0];
	var maxRepetitions, feedCb, doneCb;

	if (arguments.length < 4) {
		maxRepetitions = 20;
		feedCb = arguments[1];
		doneCb = arguments[2];
	} else {
		maxRepetitions = arguments[1];
		feedCb = arguments[2];
		doneCb = arguments[3];
	}

	var req = {
		feedCb: feedCb,
		doneCb: doneCb,
		maxRepetitions: maxRepetitions,
		baseOid: oid
	};

	this.walk (oid, maxRepetitions, subtreeCb.bind (me, req), doneCb);

	return this;
};

function tableColumnsResponseCb (req, error) {
	if (error) {
		req.responseCb (error);
	} else if (req.error) {
		req.responseCb (req.error);
	} else {
		if (req.columns.length > 0) {
			var column = req.columns.pop ();
			var me = this;
			this.subtree (req.rowOid + column, req.maxRepetitions,
					tableColumnsFeedCb.bind (me, req),
					tableColumnsResponseCb.bind (me, req));
		} else {
			req.responseCb (null, req.table);
		}
	}
}

function tableColumnsFeedCb (req, varbinds) {
	for (var i = 0; i < varbinds.length; i++) {
		if (isVarbindError (varbinds[i])) {
			req.error = new RequestFailedError (varbindError (varbinds[i]));
			return true;
		}

		var oid = varbinds[i].oid.replace (req.rowOid, "");
		if (oid && oid != varbinds[i].oid) {
			var match = oid.match (/^(\d+)\.(.+)$/);
			if (match && match[1] > 0) {
				if (! req.table[match[2]])
					req.table[match[2]] = {};
				req.table[match[2]][match[1]] = varbinds[i].value;
			}
		}
	}
}

Session.prototype.tableColumns = function () {
	var me = this;

	var oid = arguments[0];
	var columns = arguments[1];
	var maxRepetitions, responseCb;

	if (arguments.length < 4) {
		responseCb = arguments[2];
		maxRepetitions = 20;
	} else {
		maxRepetitions = arguments[2];
		responseCb = arguments[3];
	}

	var req = {
		responseCb: responseCb,
		maxRepetitions: maxRepetitions,
		baseOid: oid,
		rowOid: oid + ".1.",
		columns: columns.slice(0),
		table: {}
	};

	if (req.columns.length > 0) {
		var column = req.columns.pop ();
		this.subtree (req.rowOid + column, maxRepetitions,
				tableColumnsFeedCb.bind (me, req),
				tableColumnsResponseCb.bind (me, req));
	}

	return this;
};

function tableResponseCb (req, error) {
	if (error)
		req.responseCb (error);
	else if (req.error)
		req.responseCb (req.error);
	else
		req.responseCb (null, req.table);
}

function tableFeedCb (req, varbinds) {
	for (var i = 0; i < varbinds.length; i++) {
		if (isVarbindError (varbinds[i])) {
			req.error = new RequestFailedError (varbindError (varbinds[i]));
			return true;
		}

		var oid = varbinds[i].oid.replace (req.rowOid, "");
		if (oid && oid != varbinds[i].oid) {
			var match = oid.match (/^(\d+)\.(.+)$/);
			if (match && match[1] > 0) {
				if (! req.table[match[2]])
					req.table[match[2]] = {};
				var colInfo = req.columns[match[1]];
				var colName = match[1];
				var thisValue = varbinds[i].value;
				if (colInfo && colInfo.name)
					colName = colInfo.name;
				if (colInfo && colInfo.type) {
					switch(colInfo.type) {
						case 'string':
							thisValue = thisValue.toString();
							break;
						case 'hex':
							thisValue = thisValue.toString('hex');
							break;
						case 'uint64':
							thisValue = readInt64BEasFloat(thisValue,0);
							break;
						case 'enum':
							if (colInfo.enum && colInfo.enum[varbinds[i].value])
							thisValue = colInfo.enum[varbinds[i].value];
							break;
					}
				}

					
				
				req.table[match[2]][colName] = thisValue;
			}
		}
	}
}

Session.prototype.tableAsync = function(tableOptions,maxRepetitions) {
	return new Promise(function(resolve, reject) {
		this.table(tableOptions,maxRepetitions, function(error, table) {
			if (error) reject(error);
			resolve(table);
	})}.bind(this));
}
Session.prototype.table = function () {
	var me = this;
	
	var tableOptions, maxRepetitions, responseCb;
	tableOptions = arguments[0];
	
	if ((typeof tableOptions)!=="object") //This is the old format
		tableOptions = {BaseOID: tableOptions}

	if (arguments.length < 3) {
		responseCb = arguments[1];
		maxRepetitions=20;
	} else {
		maxRepetitions = arguments[1] || 50;
		responseCb = arguments[2];
	}

	
	var req = {
		responseCb: responseCb,
		maxRepetitions: maxRepetitions,
		baseOid: tableOptions.BaseOID,
		rowOid: tableOptions.BaseOID + ".1.",
		columns: (tableOptions.Columns) ? tableOptions.Columns : {},
		table: {}
	};

	this.subtree (tableOptions.BaseOID, maxRepetitions, tableFeedCb.bind (me, req),
			tableResponseCb.bind (me, req));

	return this;
};

Session.prototype.trap = function () {
	var req = {};

	var typeOrOid = arguments[0];
	var varbinds, options = {}, responseCb;
	var message;

	/**
	 ** Support the following signatures:
		** 
		**    typeOrOid, varbinds, options, callback
		**    typeOrOid, varbinds, agentAddr, callback
		**    typeOrOid, varbinds, callback
		**    typeOrOid, agentAddr, callback
		**    typeOrOid, options, callback
		**    typeOrOid, callback
		**/
	if (arguments.length >= 4) {
		varbinds = arguments[1];
		if (typeof arguments[2] == "string") {
			options.agentAddr = arguments[2];
		} else if (arguments[2].constructor != Array) {
			options = arguments[2];
		}
		responseCb = arguments[3];
	} else if (arguments.length >= 3) {
		if (typeof arguments[1] == "string") {
			varbinds = [];
			options.agentAddr = arguments[1];
		} else if (arguments[1].constructor != Array) {
			varbinds = [];
			options = arguments[1];
		} else {
			varbinds = arguments[1];
			options.agentAddr = null;
		}
		responseCb = arguments[2];
	} else {
		varbinds = [];
		responseCb = arguments[1];
	}

	var pdu, pduVarbinds = [];

	for (var i = 0; i < varbinds.length; i++) {
		var varbind = {
			oid: varbinds[i].oid,
			type: varbinds[i].type,
			value: varbinds[i].value
		};
		pduVarbinds.push (varbind);
	}
	
	var id = _generateId (this.idBitsSize);

	if (this.version == Version2c || this.version == Version3 ) {
		if (typeof typeOrOid != "string")
			typeOrOid = "1.3.6.1.6.3.1.1.5." + (typeOrOid + 1);

		pduVarbinds.unshift (
			{
				oid: "1.3.6.1.2.1.1.3.0",
				type: ObjectType.TimeTicks,
				value: options.upTime || Math.floor (process.uptime () * 100)
			},
			{
				oid: "1.3.6.1.6.3.1.1.4.1.0",
				type: ObjectType.OID,
				value: typeOrOid
			}
		);

		pdu = TrapV2Pdu.createFromVariables (id, pduVarbinds, options);
	} else {
		pdu = TrapPdu.createFromVariables (typeOrOid, pduVarbinds, options);
	}

	if ( this.version == Version3 ) {
		var msgSecurityParameters = {
			msgAuthoritativeEngineID: this.engine.engineID,
			msgAuthoritativeEngineBoots: 0,
			msgAuthoritativeEngineTime: 0
		};
		message = Message.createRequestV3 (this.user, msgSecurityParameters, pdu);
	} else {
		message = Message.createCommunity (this.version, this.community, pdu);
	}

	req = {
		id: id,
		message: message,
		responseCb: responseCb,
		port: this.trapPort
	};

	this.send (req, true);

	return this;
};

Session.prototype.unregisterRequest = function (id) {
	var req = this.reqs[id];
	if (req) {
		delete this.reqs[id];
		clearTimeout (req.timer);
		delete req.timer;
		this.reqCount--;
		if (this.reqCount <= 0)
			this.dgram.unref();
		return req;
	} else {
		return null;
	}
};

function walkCb (req, error, varbinds) {
	var done = 0;
	var oid;

	if (error) {
		if (error instanceof RequestFailedError) {
			if (error.status != ErrorStatus.NoSuchName) {
				req.doneCb (error);
				return;
			} else {
				// signal the version 1 walk code below that it should stop
				done = 1;
			}
		} else {
			req.doneCb (error);
			return;
		}
	}

	if ( ! varbinds || ! varbinds.length ) {
		req.doneCb(null);
		return;
	}

	if (this.version == Version2c || this.version == Version3) {
		for (var i = varbinds.length; i > 0; i--) {
			if (varbinds[i - 1].type == ObjectType.EndOfMibView) {
				varbinds.pop ();
				done = 1;
			}
		}
		if (req.feedCb (varbinds))
			done = 1;
		if (! done)
			oid = varbinds[varbinds.length - 1].oid;
	} else {
		if (! done) {
			if (req.feedCb (varbinds)) {
				done = 1;
			} else {
				oid = varbinds.oid;
			}
		}
	}

	if (done)
		req.doneCb (null);
	else
		this.walk (oid, req.maxRepetitions, req.feedCb, req.doneCb,
				req.baseOid);
}

Session.prototype.walk  = function () {
	var me = this;
	var oid = arguments[0];
	var maxRepetitions, feedCb, doneCb;

	if (arguments.length < 4) {
		maxRepetitions = 20;
		feedCb = arguments[1];
		doneCb = arguments[2];
	} else {
		maxRepetitions = arguments[1];
		feedCb = arguments[2];
		doneCb = arguments[3];
	}

	var req = {
		maxRepetitions: maxRepetitions,
		feedCb: feedCb,
		doneCb: doneCb
	};

	if (this.version == Version2c || this.version == Version3)
		this.getBulk ([oid], 0, maxRepetitions,
				walkCb.bind (me, req));
	else
		this.getNext ([oid], walkCb.bind (me, req));

	return this;
};

Session.prototype.sendV3Req = function (pdu, feedCb, responseCb, options, port, allowReport) {
	var message = Message.createRequestV3 (this.user, this.msgSecurityParameters, pdu);
	var reqOptions = options || {};
	var req = new Req (this, message, feedCb, responseCb, reqOptions);
	req.port = port;
	req.originalPdu = pdu;
	req.allowReport = allowReport;
	this.send (req);
};

Session.prototype.sendV3Discovery = function (originalPdu, feedCb, responseCb, options) {
	var discoveryPdu = createDiscoveryPdu(this.context);
	var discoveryMessage = Message.createDiscoveryV3 (discoveryPdu);
	var discoveryReq = new Req (this, discoveryMessage, feedCb, responseCb, options);
	discoveryReq.originalPdu = originalPdu;
	discoveryReq.allowReport = true;
	this.send (discoveryReq);
};

Session.prototype.userSecurityModelError = function (req, oid) {
	var oidSuffix = oid.replace (UsmStatsBase + '.', '').replace (/\.0$/, '');
	var errorType = UsmStats[oidSuffix] || "Unexpected Report PDU";
	req.responseCb (new ResponseInvalidError (errorType, ResponseInvalidCode.EAuthFailure) );
};

Session.prototype.onProxyResponse = function (req, message) {
	if ( message.version != Version3 ) {
		this.callback (new RequestFailedError ("Only SNMP version 3 contexts are supported"));
		return;
	}
	message.pdu.contextName = this.proxy.context;
	message.user = req.proxiedUser;
	message.setAuthentication ( ! (req.proxiedUser.level == SecurityLevel.noAuthNoPriv));
	message.setPrivacy (req.proxiedUser.level == SecurityLevel.authPriv);
	message.msgSecurityParameters = {
		msgAuthoritativeEngineID: req.proxiedEngine.engineID,
		msgAuthoritativeEngineBoots: req.proxiedEngine.engineBoots,
		msgAuthoritativeEngineTime: req.proxiedEngine.engineTime,
		msgUserName: req.proxiedUser.name,
		msgAuthenticationParameters: "",
		msgPrivacyParameters: ""
	};
	message.buffer = null;
	message.pdu.contextEngineID = message.msgSecurityParameters.msgAuthoritativeEngineID;
	message.pdu.contextName = this.proxy.context;
	message.pdu.id = req.proxiedPduId;
	this.proxy.listener.send (message, req.proxiedRinfo);
};

Session.create = function (target, community, options) {
	// Ensure that options may be optional
	var version = (options && options.version) ? options.version : Version1;
	if (version != Version1 && version != Version2c) {
		throw new ResponseInvalidError ("SNMP community session requested but version '" + options.version + "' specified in options not valid",
				ResponseInvalidCode.EVersionNoMatch);
	} else {
		if (!options)
			options = {};
		options.version = version;
		return new Session (target, community, options);
	}
};

Session.createV3 = function (target, user, options) {
	// Ensure that options may be optional
	if ( options && options.version && options.version != Version3 ) {
		throw new ResponseInvalidError ("SNMPv3 session requested but version '" + options.version + "' specified in options",
				ResponseInvalidCode.EVersionNoMatch);
	} else {
		if (!options)
			options = {};
		options.version = Version3;
	}
	return new Session (target, user, options);
};

var Engine = function (engineID, engineBoots, engineTime) {
	if ( engineID ) {
		if ( ! (engineID instanceof Buffer) ) {
			engineID = engineID.replace('0x', '');
			this.engineID = Buffer.from((engineID.toString().length % 2 == 1 ? '0' : '') + engineID.toString(), 'hex');
		} else {
			this.engineID = engineID;
		}
	} else {
		this.generateEngineID ();
	}
	this.engineBoots = 0;
	this.engineTime = 10;
};

Engine.prototype.generateEngineID = function() {
	// generate a 17-byte engine ID in the following format:
	// 0x80 | 0x00B983 (enterprise OID) | 0x80 (enterprise-specific format) | 12 bytes of random
	this.engineID = Buffer.alloc (17);
	this.engineID.fill ('8000B98380', 'hex', 0, 5);
	this.engineID.fill (crypto.randomBytes (12), 5, 17, 'hex');
};

var Listener = function (options, receiver) {
	this.receiver = receiver;
	this.callback = receiver.onMsg;
	this.family = options.transport || 'udp4';
	this.port = options.port || 161;
	this.address = options.address;
	this.disableAuthorization = options.disableAuthorization || false;
};

Listener.prototype.startListening = function () {
	var me = this;
	this.dgram = dgram.createSocket (this.family);
	this.dgram.on ("error", me.receiver.callback);
	this.dgram.bind (this.port, this.address);
	this.dgram.on ("message", me.callback.bind (me.receiver));
};

Listener.prototype.send = function (message, rinfo) {
	// var me = this;
	
	var buffer = message.toBuffer ();

	this.dgram.send (buffer, 0, buffer.length, rinfo.port, rinfo.address,
			function (error, bytes) {
		if (error) {
			// me.callback (error);
			console.error ("Error sending: " + error.message);
		} else {
			// debug ("Listener sent response message");
		}
	});
};

Listener.formatCallbackData = function (pdu, rinfo) {
	if ( pdu.contextEngineID ) {
		pdu.contextEngineID = pdu.contextEngineID.toString('hex');
	}
	delete pdu.nonRepeaters;
	delete pdu.maxRepetitions;
	return {
		pdu: pdu,
		rinfo: rinfo 
	};
};

Listener.processIncoming = function (buffer, authorizer, callback) {
	var message = Message.createFromBuffer (buffer);
	var community;

	// Authorization
	if ( message.version == Version3 ) {
		message.user = authorizer.users.filter( localUser => localUser.name ==
				message.msgSecurityParameters.msgUserName )[0];
		message.disableAuthentication = authorizer.disableAuthorization;
		if ( ! message.user ) {
			if ( message.msgSecurityParameters.msgUserName != "" && ! authorizer.disableAuthorization ) {
				callback (new RequestFailedError ("Local user not found for message with user " +
						message.msgSecurityParameters.msgUserName));
				return;
			} else if ( message.hasAuthentication () ) {
				callback (new RequestFailedError ("Local user not found and message requires authentication with user " +
						message.msgSecurityParameters.msgUserName));
				return;
			} else {
				message.user = {
					name: "",
					level: SecurityLevel.noAuthNoPriv
				};
			}
		}
		if ( (message.user.level == SecurityLevel.authNoPriv || message.user.level == SecurityLevel.authPriv) && ! message.hasAuthentication() ) {
			callback (new RequestFailedError ("Local user " + message.msgSecurityParameters.msgUserName +
					" requires authentication but message does not provide it"));
			return;
		}
		if ( message.user.level == SecurityLevel.authPriv && ! message.hasPrivacy() ) {
			callback (new RequestFailedError ("Local user " + message.msgSecurityParameters.msgUserName +
					" requires privacy but message does not provide it"));
			return;
		}
		if ( ! message.processIncomingSecurity (message.user, callback) ) {
			return;
		}
	} else {
		community = authorizer.communities.filter( localCommunity => localCommunity == message.community )[0];
		if ( ! community && ! authorizer.disableAuthorization ) {
			callback (new RequestFailedError ("Local community not found for message with community " + message.community));
			return;
		}
	}

	return message;
};

Listener.prototype.close = function () {
	if ( this.dgram ) {
		this.dgram.close ();
	}
};

var Authorizer = function (options) {
	this.communities = [];
	this.users = [];
	this.disableAuthorization = options.disableAuthorization;
	this.accessControlModelType = options.accessControlModelType || AccessControlModelType.None;

	if ( this.accessControlModelType == AccessControlModelType.None ) {
		this.accessControlModel = null;
	} else if ( this.accessControlModelType == AccessControlModelType.Simple ) {
		this.accessControlModel = new SimpleAccessControlModel ();
	}
};

Authorizer.prototype.addCommunity = function (community) {
	if ( this.getCommunity (community) ) {
		return;
	} else {
		this.communities.push (community);
		if ( this.accessControlModelType == AccessControlModelType.Simple ) {
			this.accessControlModel.setCommunityAccess (community, AccessLevel.ReadOnly);
		}
	}
};

Authorizer.prototype.getCommunity = function (community) {
	return this.communities.filter( localCommunity => localCommunity == community )[0] || null;
};

Authorizer.prototype.getCommunities = function () {
	return this.communities;
};

Authorizer.prototype.deleteCommunity = function (community) {
	var index = this.communities.indexOf(community);
	if ( index > -1 ) {
		this.communities.splice(index, 1);
	}
};

Authorizer.prototype.addUser = function (user) {
	if ( this.getUser (user.name) ) {
		this.deleteUser (user.name);
	}
	this.users.push (user);
	if ( this.accessControlModelType == AccessControlModelType.Simple ) {
		this.accessControlModel.setUserAccess (user.name, AccessLevel.ReadOnly);
	}
};

Authorizer.prototype.getUser = function (userName) {
	return this.users.filter( localUser => localUser.name == userName )[0] || null;
};

Authorizer.prototype.getUsers = function () {
	return this.users;
};

Authorizer.prototype.deleteUser = function (userName) {
	var index = this.users.findIndex(localUser => localUser.name == userName );
	if ( index > -1 ) {
		this.users.splice(index, 1);
	}
};

Authorizer.prototype.getAccessControlModelType = function () {
	return this.accessControlModelType;
};

Authorizer.prototype.getAccessControlModel = function () {
	return this.accessControlModel;
};

Authorizer.prototype.isAccessAllowed = function (securityModel, securityName, pduType) {
	if ( this.accessControlModel ) {
		return this.accessControlModel.isAccessAllowed (securityModel, securityName, pduType);
	} else {
		return true;
	}
};

var SimpleAccessControlModel = function () {
	this.communitiesAccess = [];
	this.usersAccess = [];
};

SimpleAccessControlModel.prototype.getCommunityAccess = function (community) {
	return this.communitiesAccess.find (entry => entry.community == community );
};

SimpleAccessControlModel.prototype.getCommunityAccessLevel = function (community) {
	var communityAccessEntry = this.getCommunityAccess (community);
	return communityAccessEntry ? communityAccessEntry.level : AccessLevel.None;
};

SimpleAccessControlModel.prototype.getCommunitiesAccess = function () {
	return this.communitiesAccess;
};

SimpleAccessControlModel.prototype.setCommunityAccess = function (community, accessLevel) {
	let accessEntry = this.getCommunityAccess (community);
	if ( accessEntry ) {
		accessEntry.level = accessLevel;
	} else {
		this.communitiesAccess.push ({
			community: community,
			level: accessLevel
		});
		this.communitiesAccess.sort ((a, b) => (a.community > b.community) ? 1 : -1);
	}
};

SimpleAccessControlModel.prototype.removeCommunityAccess = function (community) {
	this.communitiesAccess.splice ( this.communitiesAccess.findIndex (entry => entry.community == community), 1);
};

SimpleAccessControlModel.prototype.getUserAccess = function (userName) {
	return this.usersAccess.find (entry => entry.userName == userName );
};

SimpleAccessControlModel.prototype.getUserAccessLevel = function (user) {
	var userAccessEntry = this.getUserAccess (user);
	return userAccessEntry ? userAccessEntry.level : AccessLevel.None;
};

SimpleAccessControlModel.prototype.getUsersAccess = function () {
	return this.usersAccess;
};

SimpleAccessControlModel.prototype.setUserAccess = function (userName, accessLevel) {
	let accessEntry = this.getUserAccess (userName);
	if ( accessEntry ) {
		accessEntry.level = accessLevel;
	} else {
		this.usersAccess.push ({
			userName: userName,
			level: accessLevel
		});
		this.usersAccess.sort ((a, b) => (a.userName > b.userName) ? 1 : -1);
	}
};

SimpleAccessControlModel.prototype.removeUserAccess = function (userName) {
	this.usersAccess.splice ( this.usersAccess.findIndex (entry => entry.userName == userName), 1);
};

SimpleAccessControlModel.prototype.isAccessAllowed = function (securityModel, securityName, pduType) {
	var accessLevelConfigured;
	var accessLevelRequired;

	switch ( securityModel ) {
		case Version1:
		case Version2c:
			accessLevelConfigured = this.getCommunityAccessLevel (securityName);
			break;
		case Version3:
			accessLevelConfigured = this.getUserAccessLevel (securityName);
			break;
	}
	switch ( pduType ) {
		case PduType.SetRequest:
			accessLevelRequired = AccessLevel.ReadWrite;
			break;
		case PduType.GetRequest:
		case PduType.GetNextRequest:
		case PduType.GetBulkRequest:
			accessLevelRequired = AccessLevel.ReadOnly;
			break;
		default:
			accessLevelRequired = AccessLevel.None;
			break;
	}
	switch ( accessLevelRequired ) {
		case AccessLevel.ReadWrite:
			return accessLevelConfigured == AccessLevel.ReadWrite;
		case AccessLevel.ReadOnly:
			return accessLevelConfigured == AccessLevel.ReadWrite || accessLevelConfigured == AccessLevel.ReadOnly;
		case AccessLevel.None:
			return true;
		default:
			return false;
	}
};


/*****************************************************************************
 ** Receiver class definition
 **/

var Receiver = function (options, callback) {
	DEBUG = options.debug;
	this.listener = new Listener (options, this);
	this.authorizer = new Authorizer (options);
	this.engine = new Engine (options.engineID);

	this.engineBoots = 0;
	this.engineTime = 10;
	this.disableAuthorization = false;

	this.callback = callback;
	this.family = options.transport || 'udp4';
	this.port = options.port || 162;
	options.port = this.port;
	this.disableAuthorization = options.disableAuthorization || false;
	this.includeAuthentication = options.includeAuthentication || false;
	this.context = (options && options.context) ? options.context : "";
	this.listener = new Listener (options, this);
};

Receiver.prototype.getAuthorizer = function () {
	return this.authorizer;
};

Receiver.prototype.onMsg = function (buffer, rinfo) {

	let message;

	try {
		message = Listener.processIncoming (buffer, this.authorizer, this.callback);
	} catch (error) {
		this.callback (new ProcessingError ("Failure to process incoming message", error, rinfo, buffer));
		return;
	}

	if ( ! message ) {
		return;
	}

	// The only GetRequest PDUs supported are those used for SNMPv3 discovery
	if ( message.pdu.type == PduType.GetRequest ) {
		if ( message.version != Version3 ) {
			this.callback (new RequestInvalidError ("Only SNMPv3 discovery GetRequests are supported"));
			return;
		} else if ( message.hasAuthentication() ) {
			this.callback (new RequestInvalidError ("Only discovery (noAuthNoPriv) GetRequests are supported but this message has authentication"));
			return;
		} else if ( ! message.isReportable () ) {
			this.callback (new RequestInvalidError ("Only discovery GetRequests are supported and this message does not have the reportable flag set"));
			return;
		}
		let reportMessage = message.createReportResponseMessage (this.engine, this.context);
		this.listener.send (reportMessage, rinfo);
		return;
	}

	// Inform/trap processing
	// debug (JSON.stringify (message.pdu, null, 2));
	if ( message.pdu.type == PduType.Trap || message.pdu.type == PduType.TrapV2 ) {
		this.callback (null, this.formatCallbackData (message, rinfo) );
	} else if ( message.pdu.type == PduType.InformRequest ) {
		message.pdu.type = PduType.GetResponse;
		message.buffer = null;
		message.setReportable (false);
		this.listener.send (message, rinfo);
		message.pdu.type = PduType.InformRequest;
		this.callback (null, this.formatCallbackData (message, rinfo) );
	} else {
		this.callback (new RequestInvalidError ("Unexpected PDU type " + message.pdu.type + " (" + PduType[message.pdu.type] + ")"));
	}
};

Receiver.prototype.formatCallbackData = function (message, rinfo) {
	if ( message.pdu.contextEngineID ) {
		message.pdu.contextEngineID = message.pdu.contextEngineID.toString('hex');
	}
	delete message.pdu.nonRepeaters;
	delete message.pdu.maxRepetitions;
	const formattedData = {
		pdu: message.pdu,
		rinfo: rinfo
	};
	if (this.includeAuthentication) {
		if (message.community) {
			formattedData.pdu.community = message.community;
		} else if (message.user) {
			formattedData.pdu.user = message.user.name;
		}
	}

	return formattedData;
};

Receiver.prototype.close  = function() {
	this.listener.close ();
};

Receiver.create = function (options, callback) {
	var receiver = new Receiver (options, callback);
	receiver.listener.startListening ();
	return receiver;
};

/*****************************************************************************
 ** Exports
 **/

exports.Session = Session;

exports.createSession = Session.create;
exports.createV3Session = Session.createV3;

exports.createReceiver = Receiver.create;

exports.isVarbindError = isVarbindError;
exports.varbindError = varbindError;

exports.Version1 = Version1;
exports.Version2c = Version2c;
exports.Version3 = Version3;
exports.Version = Version;

exports.ErrorStatus = ErrorStatus;
exports.TrapType = TrapType;
exports.ObjectType = ObjectType;
exports.PduType = PduType;
exports.AgentXPduType = AgentXPduType;
exports.MibProviderType = MibProviderType;
exports.SecurityLevel = SecurityLevel;
exports.AuthProtocols = AuthProtocols;
exports.PrivProtocols = PrivProtocols;
exports.AccessControlModelType = AccessControlModelType;
exports.AccessLevel = AccessLevel;
exports.MaxAccess = MaxAccess;
exports.RowStatus = RowStatus;
exports.OidFormat = OidFormat;

exports.ResponseInvalidCode = ResponseInvalidCode;
exports.ResponseInvalidError = ResponseInvalidError;
exports.RequestInvalidError = RequestInvalidError;
exports.RequestFailedError = RequestFailedError;
exports.RequestTimedOutError = RequestTimedOutError;

/**
 ** Added for testing
 **/
exports.ObjectParser = {
	readInt32: readInt32,
	readUint32: readUint32,
	readVarbindValue: readVarbindValue
};
exports.Authentication = Authentication;
exports.Encryption = Encryption;