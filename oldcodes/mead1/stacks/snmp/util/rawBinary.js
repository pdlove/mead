const enums = require('./enums');

var MIN_SIGNED_INT32 = -2147483648;
var MAX_SIGNED_INT32 = 2147483647;
var MIN_UNSIGNED_INT32 = 0;
var MAX_UNSIGNED_INT32 = 4294967295;


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
    var value = buffer.readString (enums.ObjectType.Counter64, true);

    return value;
}

function readIpAddress (buffer) {
    var bytes = buffer.readString (enums.ObjectType.IpAddress, true);
    if (bytes.length != 4)
        throw new ResponseInvalidError ("Length '" + bytes.length
                + "' of IP address '" + bytes.toString ("hex")
                + "' is not 4", ResponseInvalidCode.EIp4AddressSize);
    var value = bytes[0] + "." + bytes[1] + "." + bytes[2] + "." + bytes[3];
    return value;
}

function readVarbindValue (buffer, type) {
    var value;
    if (type == enums.ObjectType.Boolean) {
        value = buffer.readBoolean ();
    } else if (type == enums.ObjectType.Integer) {
        value = readInt32 (buffer);
    } else if (type == enums.ObjectType.BitString) {
        value = buffer.readBitString();
    } else if (type == enums.ObjectType.OctetString) {
        value = buffer.readString (null, true);
        value = value.toString('latin1');
    } else if (type == enums.ObjectType.Null) {
        buffer.readByte ();
        buffer.readByte ();
        value = null;
    } else if (type == enums.ObjectType.OID) {
        value = buffer.readOID ();
    } else if (type == enums.ObjectType.IpAddress) {
        value = readIpAddress (buffer);
    } else if (type == enums.ObjectType.Counter) {
        value = readUint32 (buffer);
    } else if (type == enums.ObjectType.Gauge) {
        value = readUint32 (buffer);
    } else if (type == enums.ObjectType.TimeTicks) {
        value = readUint32 (buffer);
    } else if (type == enums.ObjectType.Opaque) {
        value = buffer.readString (ObjectType.Opaque, true);
    } else if (type == enums.ObjectType.Counter64) {
        value = BigInt('0x'+readUint64(buffer).toString('hex')); 
    } else if (type == enums.ObjectType.NoSuchObject) {
        buffer.readByte ();
        buffer.readByte ();
        value = null;
    } else if (type == enums.ObjectType.NoSuchInstance) {
        buffer.readByte ();
        buffer.readByte ();
        value = null;
    } else if (type == enums.ObjectType.EndOfMibView) {
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
        if ( buffer.peek () != enums.ObjectType.OID )
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
    buffer.writeBuffer (value, enums.ObjectType.Counter64);
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
                case enums.ObjectType.Boolean:
                    buffer.writeBoolean (value ? true : false);
                    break;
                case enums.ObjectType.Integer: // also Integer32
                    writeInt32 (buffer, enums.ObjectType.Integer, value);
                    break;
                case enums.ObjectType.OctetString:
                    if (typeof value == "string")
                        buffer.writeString (value);
                    else
                        buffer.writeBuffer (value, enums.ObjectType.OctetString);
                    break;
                case enums.ObjectType.Null:
                    buffer.writeNull ();
                    break;
                case enums.ObjectType.OID:
                    buffer.writeOID (value);
                    break;
                case enums.ObjectType.IpAddress:
                    var bytes = value.split (".");
                    if (bytes.length != 4)
                        throw new RequestInvalidError ("Invalid IP address '"
                                + value + "'");
                    buffer.writeBuffer (Buffer.from (bytes), 64);
                    break;
                case enums.ObjectType.Counter: // also Counter32
                    writeUint32 (buffer, enums.ObjectType.Counter, value);
                    break;
                case enums.ObjectType.Gauge: // also Gauge32 & Unsigned32
                    writeUint32 (buffer, enums.ObjectType.Gauge, value);
                    break;
                case enums.ObjectType.TimeTicks:
                    writeUint32 (buffer, enums.ObjectType.TimeTicks, value);
                    break;
                case enums.ObjectType.Opaque:
                    buffer.writeBuffer (value, enums.ObjectType.Opaque);
                    break;
                case enums.ObjectType.Counter64:
                    writeUint64 (buffer, value);
                    break;
                case enums.ObjectType.NoSuchObject:
                case enums.ObjectType.NoSuchInstance:
                case enums.ObjectType.EndOfMibView:
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

function readInt64BEasFloat(buffer, offset) {
    while (buffer.length<8)
		buffer = Buffer.concat([Buffer([0]),buffer])
	
	var low = buffer.readInt32BE(offset + 4);
  var n = buffer.readInt32BE(offset) * 4294967296.0 + low;
  if (low < 0) n += 4294967296;
  return n;
}

module.exports = {
    readInt32,
    readUint32,
    readUint64,
    readIpAddress,
    readVarbindValue,
    readVarbinds,
    writeInt32,
    writeUint32,
    writeUint64,
    writeVarbinds,
    readInt64BEasFloat
};