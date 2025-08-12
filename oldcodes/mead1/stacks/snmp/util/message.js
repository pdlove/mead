var ber = require ("asn1-ber").Ber;
const enums = require("./enums");
const { readInt32,readUint32,readUint64,readIpAddress,readVarbindValue,readVarbinds,writeInt32,writeUint32,writeUint64,writeVarbinds,readInt64BEasFloat } = require("./rawBinary");
const pdus = require("./pdus");
class Message {
    constructor() {
    }
    getReqId() {
        return this.pdu.id;
    }
    toBuffer() {
        if (this.version == enums.Version3) {
            throw new Error("Use SNMPv3 not currently supported.");
        } else {
            if (this.buffer) return this.buffer;
            var writer = new ber.Writer();
            writer.startSequence();
            writeInt32(writer, enums.ObjectType.Integer, this.version);
            writer.writeString(this.community);
            this.pdu.toBuffer(writer);
            writer.endSequence();
            this.buffer = writer.buffer;
            return this.buffer;
        }
    }
    static fromBuffer(buffer) {
        var reader = new ber.Reader(buffer);
        var message = new Message();
        reader.readSequence();
        message.version = readInt32(reader);

        if (message.version == 3) {
            throw new Error("SNMPv3 not currently supported.");
        } else {
            message.community = reader.readString();
            message.pdu = pdus.SimplePdu.readPdu(reader);
        }
        
        return message;
    }


    




    createReportResponseMessage(engine, context) {
        var user = {
            name: "",
            level: SecurityLevel.noAuthNoPriv,
        };
        var responseSecurityParameters = {
            msgAuthoritativeEngineID: engine.engineID,
            msgAuthoritativeEngineBoots: engine.engineBoots,
            msgAuthoritativeEngineTime: engine.engineTime,
            msgUserName: user.name,
            msgAuthenticationParameters: "",
            msgPrivacyParameters: "",
        };
        var reportPdu = ReportPdu.createFromVariables(this.pdu.id, [], {});
        reportPdu.contextName = context;
        var responseMessage = Message.createRequestV3(user, responseSecurityParameters, reportPdu);
        responseMessage.msgGlobalData.msgID = this.msgGlobalData.msgID;
        return responseMessage;
    }

    createResponseForRequest(responsePdu) {
        if (this.version == Version3) {
            return this.createV3ResponseFromRequest(responsePdu);
        } else {
            return this.createCommunityResponseFromRequest(responsePdu);
        }
    }

    createCommunityResponseFromRequest(responsePdu) {
        return Message.createCommunity(this.version, this.community, responsePdu);
    }

    static createCommunity(version, community, pdu) {
        var message = new Message();
        message.version = version;
        message.community = community;
        message.pdu = pdu;
        return message;
    }



}
module.exports = { Message };