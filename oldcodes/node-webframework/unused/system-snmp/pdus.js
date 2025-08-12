const { generateId, ObjectType, PduType, ResponseInvalidCode } = require('./enums');
const { RequestInvalidError, ResponseInvalidError  } = require('./exceptions');

class pduBinary {
    static MIN_SIGNED_INT32 = -2147483648;
    static MAX_SIGNED_INT32 = 2147483647;

    static MIN_UNSIGNED_INT32 = 0;
    static MAX_UNSIGNED_INT32 = 4294967295;

    static readInt32 (buffer) {
        var parsedInt = buffer.readInt ();
        if ( ! Number.isInteger(parsedInt) ) {
            throw new TypeError('Value read as integer ' + parsedInt + ' is not an integer');
        }
        if ( parsedInt < pduBinary.MIN_SIGNED_INT32 || parsedInt > pduBinary.MAX_SIGNED_INT32 ) {
            throw new RangeError('Read integer ' + parsedInt + ' is outside the signed 32-bit range');
        }
        return parsedInt;
    }
    static writeInt32 (buffer, type, value) {
        if ( ! Number.isInteger(value) ) {
            throw new TypeError('Value to write as integer ' + value + ' is not an integer');
        }
        if ( value < pduBinary.MIN_SIGNED_INT32 || value > pduBinary.MAX_SIGNED_INT32 ) {
            throw new RangeError('Integer to write ' + value + ' is outside the signed 32-bit range');
        }
        buffer.writeInt(value, type);
    }
    static readUint32 (buffer) {
        var parsedInt = buffer.readInt ();
        if ( ! Number.isInteger(parsedInt) ) {
            throw new TypeError('Value read as integer ' + parsedInt + ' is not an integer');
        }
        parsedInt = (parsedInt>>>0);
        if ( parsedInt < pduBinary.MIN_UNSIGNED_INT32 || parsedInt > pduBinary.MAX_UNSIGNED_INT32 ) {
            throw new RangeError('Read integer ' + parsedInt + ' is outside the unsigned 32-bit range');
        }
        return parsedInt;
    }
    static writeUint32 (buffer, type, value) {
        if ( ! Number.isInteger(value) ) {
            throw new TypeError('Value to write as integer ' + value + ' is not an integer');
        }
        if ( value < pduBinary.MIN_UNSIGNED_INT32 || value > pduBinary.MAX_UNSIGNED_INT32 ) {
            throw new RangeError('Integer to write ' + value + ' is outside the unsigned 32-bit range');
        }
        buffer.writeInt(value, type);
    }
    static readUint64 (buffer) {
        var value = buffer.readString (ObjectType.Counter64, true);
    
        return value;
    }
    static writeUint64 (buffer, value) {
        buffer.writeBuffer (value, ObjectType.Counter64);
    }
    static writeVarbinds (buffer, varbinds) {
        buffer.startSequence ();
        for (var i = 0; i < varbinds.length; i++) {
            buffer.startSequence ();
            buffer.writeOID (varbinds[i].oid);
    
            if (varbinds[i].type && Object.hasOwn(varbinds[i],"value")) {
                var type = varbinds[i].type;
                var value = varbinds[i].value;
    
                switch ( type ) {
                    case ObjectType.Boolean:
                        buffer.writeBoolean (value ? true : false);
                        break;
                    case ObjectType.Integer: // also Integer32
                        pduBinary.writeInt32 (buffer, ObjectType.Integer, value);
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
                        buffer.writeBuffer (buffer.from (bytes), 64);
                        break;
                    case ObjectType.Counter: // also Counter32
                        pduBinary.writeUint32 (buffer, ObjectType.Counter, value);
                        break;
                    case ObjectType.Gauge: // also Gauge32 & Unsigned32
                        pduBinary.writeUint32 (buffer, ObjectType.Gauge, value);
                        break;
                    case ObjectType.TimeTicks:
                        pduBinary.writeUint32 (buffer, ObjectType.TimeTicks, value);
                        break;
                    case ObjectType.Opaque:
                        buffer.writeBuffer (value, ObjectType.Opaque);
                        break;
                    case ObjectType.Counter64:
                        pduBinary.writeUint64 (buffer, value);
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
    static readVarbinds (buffer, varbinds) {
        buffer.readSequence ();
    
        while (true) {
            buffer.readSequence ();
            if ( buffer.peek () != ObjectType.OID )
                break;
            var oid = buffer.readOID ();
            var type = buffer.peek ();
    
            if (type == null)
                break;
    
            var value = pduBinary.readVarbindValue (buffer, type);
    
            varbinds.push ({
                oid: oid,
                type: type,
                value: value
            });
        }
    }
    readVarbindValue (buffer, type) {
        var value;
        if (type == ObjectType.Boolean) {
            value = buffer.readBoolean ();
        } else if (type == ObjectType.Integer) {
            value = pduBinary.readInt32 (buffer);
        } else if (type == ObjectType.BitString) {
            value = buffer.readBitString();
        } else if (type == ObjectType.OctetString) {
            value = buffer.readString (null, true);
        } else if (type == ObjectType.Null) {
            buffer.readByte ();
            buffer.readByte ();
            value = null;
        } else if (type == ObjectType.OID) {
            value = buffer.readOID ();
        } else if (type == ObjectType.IpAddress) {
            value = pduBinary.readIpAddress (buffer);
        } else if (type == ObjectType.Counter) {
            value = pduBinary.readUint32 (buffer);
        } else if (type == ObjectType.Gauge) {
            value = pduBinary.readUint32 (buffer);
        } else if (type == ObjectType.TimeTicks) {
            value = pduBinary.readUint32 (buffer);
        } else if (type == ObjectType.Opaque) {
            value = buffer.readString (ObjectType.Opaque, true);
        } else if (type == ObjectType.Counter64) {
            value = pduBinary.readUint64 (buffer);
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
}

class DataPdu {
    requestID = generateId;
    pduType = PduType.GetRequest;
    errorStatus = 0;
    errorIndex = 0;
    variableBindings = {};
    
    nonRepeaters = 0;
    maxRepetitions = 0;
    contextName = '';

    toBuffer(buffer) {
        buffer.startSequence (this.type);
        pduBinary.writeInt32 (buffer, ObjectType.Integer, this.id);
        pduBinary.writeInt32 (buffer, ObjectType.Integer, this.nonRepeaters);
        pduBinary.writeInt32 (buffer, ObjectType.Integer, this.maxRepetitions);
        pduBinary.writeVarbinds (buffer, this.varbinds);
        buffer.endSequence ();
    };
    fromBuffer(reader) {
        this.type = reader.peek ();
        reader.readSequence ();

        this.id = pduBinary.readInt32 (reader);
        this.nonRepeaters = pduBinary.readInt32 (reader);
        this.maxRepetitions = pduBinary.readInt32 (reader);

        this.varbinds = [];
        pduBinary.readVarbinds (reader, this.varbinds);
    };

    constructor(pduType, varbinds, options) {
        this.pduType=pduType;
        this.varbinds = varbinds;

		//Load any properties from options to override anything in the class at this point.
		for (let prop in options) {
			this[prop]=options[prop];
		}
    };

    

}

exports = { DataPdu };


// class TrapPdu {
//     // Trap-PDU ::=
//     // [4]

//     //      IMPLICIT SEQUENCE {
//     //         enterprise          -- type of object generating
//     //                             -- trap, see sysObjectID in [5]
//     //             OBJECT IDENTIFIER,

//     //         agent-addr          -- address of object generating
//     //             NetworkAddress, -- trap

//     //         generic-trap        -- generic trap type
//     //             INTEGER {
//     //                 coldStart(0),
//     //                 warmStart(1),
//     //                 linkDown(2),
//     //                 linkUp(3),
//     //                 authenticationFailure(4),
//     //                 egpNeighborLoss(5),
//     //                 enterpriseSpecific(6)
//     //             },

//     //         specific-trap     -- specific code, present even
//     //             INTEGER,      -- if generic-trap is not
//     //                           -- enterpriseSpecific

//     //         time-stamp        -- time elapsed between the last
//     //           TimeTicks,      -- (re)initialization of the network
//     //                           -- entity and the generation of the
//     //                              trap

//     //         variable-bindings   -- "interesting" information
//     //              VarBindList
//     //     }

// }
// // getResponsePduForRequest = function () {
// //     var responsePdu = GetResponsePdu.createFromVariables(this.id, [], {});
// //     if ( this.contextEngineID ) {
// //         responsePdu.contextEngineID = this.contextEngineID;
// //         responsePdu.contextName = this.contextName;
// //     }
// //     return responsePdu;
// // };

