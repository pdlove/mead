const Buffer = require('buffer').Buffer; 
const exceptions = require('./exceptions.js');

var MIN_SIGNED_INT32 = -2147483648;
var MAX_SIGNED_INT32 = 2147483647;
var MIN_UNSIGNED_INT32 = 0;
var MAX_UNSIGNED_INT32 = 4294967295;

function _expandConstantObject (object) {
	var keys = [];
	for (var key in object)
		keys.push (key);
	for (var i = 0; i < keys.length; i++)
		object[object[keys[i]]] = parseInt (keys[i]);
}

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

//#region Writing functions
function writeVarbinds (buffer, varbinds) {
    buffer.startSequence ();
    for (var i = 0; i < varbinds.length; i++) {
        buffer.startSequence ();
        buffer.writeOID (varbinds[i].oid);

        if (varbinds[i].type && Object.hasOwn(varbinds[i], "value")) {
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
                        throw new exceptions.RequestInvalidError ("Invalid IP address '"
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
                    throw new exceptions.RequestInvalidError ("Unknown type '" + type
                        + "' in request");
            }
        } else {
            buffer.writeNull ();
        }

        buffer.endSequence ();
    }
    buffer.endSequence ();
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

function readInt64BEasFloat(buffer, offset) {
    while (buffer.length<8)
		buffer = Buffer.concat([Buffer([0]),buffer])
	
	var low = buffer.readInt32BE(offset + 4);
  var n = buffer.readInt32BE(offset) * 4294967296.0 + low;
  if (low < 0) n += 4294967296;
  return n;
}

//#endregion

//#region Reading functions
function readVarbinds (buffer, varbinds) {
	buffer.readSequence ();

	while (true) {
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
        throw new exceptions.ResponseInvalidError ("Unknown type '" + type
                + "' in response", exceptions.ResponseInvalidCode.EUnknownObjectType);
    }
    return value;
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
		throw new exceptions.ResponseInvalidError ("Length '" + bytes.length
				+ "' of IP address '" + bytes.toString ("hex")
				+ "' is not 4", exceptions.ResponseInvalidCode.EIp4AddressSize);
	var value = bytes[0] + "." + bytes[1] + "." + bytes[2] + "." + bytes[3];
	return value;
}

//#endregion
module.exports = { MIN_SIGNED_INT32, MAX_SIGNED_INT32, MIN_UNSIGNED_INT32, MAX_UNSIGNED_INT32, 
    writeVarbinds, writeInt32, writeUint32, writeUint64, 
    readVarbinds, readVarbindValue, readInt32, readUint32, readUint64, readIpAddress,
    readInt64BEasFloat, ObjectType, PduType, TrapType };