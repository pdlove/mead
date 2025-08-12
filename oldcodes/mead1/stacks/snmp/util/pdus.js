const { readInt32,readUint32,readUint64,readIpAddress,readVarbindValue,readVarbinds,writeInt32,writeUint32,writeUint64,writeVarbinds,readInt64BEasFloat } = require("./rawBinary");
const enums = require("./enums");

class SimplePdu {
    requestID = 0;
    varbinds = [];
    
    //These are only used for the GetBulkRequest PDU
    nonRepeaters = 0;
    maxRepetitions = 0;

    toBuffer(buffer) {
        buffer.startSequence (this.type);

        writeInt32 (buffer, enums.ObjectType.Integer, this.requestID);
        writeInt32 (buffer, enums.ObjectType.Integer,
                (this.type == enums.PduType.GetBulkRequest)
                ? (this.nonRepeaters || 0)
                : 0);
        writeInt32 (buffer, enums.ObjectType.Integer,
                (this.type == enums.PduType.GetBulkRequest)
                ? (this.maxRepetitions || 0)
                : 0);

        writeVarbinds (buffer, this.varbinds);

        buffer.endSequence ();
    }

    constructor(inputValue) {
         if (Buffer.isBuffer(inputValue)) {
            this.initializeFromBuffer(inputValue);
        } else {
            this.initializeFromObject(inputValue);
        }
    }

    initializeFromObject(inputValue) {
        if (!inputValue)  inputValue = [];
        if (typeof input === 'object') 
            this.varbinds = inputValue.varbinds || [];
        else if (Array.isArray(inputValue)) {
            this.varbinds = inputValue;
        } else {
            this.varbinds = [inputValue];
        }
    }

    initializeFromBuffer(reader) {
        this.type = reader.peek ();
        reader.readSequence ();

        this.id = readInt32 (reader);
        this.nonRepeaters = readInt32 (reader);
        this.maxRepetitions = readInt32 (reader);

        this.varbinds = [];
        readVarbinds (reader, this.varbinds);
    }

    createFromVariables(pduClass, id, varbinds, options) {
        var pdu = new pduClass (id, varbinds, options);
        pdu.id = id;
        pdu.varbinds = varbinds;
        pdu.options = options || {};
        pdu.contextName = (options && options.context) ? options.context : "";
        return pdu;
    }
    static readPdu(reader) {
        let pdu;
        let type = reader.peek ();
        if (type == enums.PduType.GetResponse) {
            pdu = GetResponsePdu.createFromBuffer (reader);
        } else if (type == enums.PduType.Report ) {
            pdu = ReportPdu.createFromBuffer (reader);
        } else if (type == enums.PduType.Trap ) {
            pdu = TrapPdu.createFromBuffer (reader);
        } else if (type == enums.PduType.TrapV2 ) {
            pdu = TrapV2Pdu.createFromBuffer (reader);
        } else if (type == enums.PduType.InformRequest ) {
            pdu = InformRequestPdu.createFromBuffer (reader);
        } else if (type == enums.PduType.GetRequest ) {
            pdu = GetRequestPdu.createFromBuffer (reader);
        } else if (type == enums.PduType.SetRequest ) {
            pdu = SetRequestPdu.createFromBuffer (reader);
        } else if (type == enums.PduType.GetNextRequest ) {
            pdu = GetNextRequestPdu.createFromBuffer (reader);
        } else if (type == enums.PduType.GetBulkRequest ) {
            pdu = GetBulkRequestPdu.createFromBuffer (reader);
        } else {
            throw new ResponseInvalidError ("Unknown PDU type '" + type
                    + "' in response", ResponseInvalidCode.EUnknownPduType);
        }        
        return pdu;
    };
    
}   

class GetRequestPdu extends SimplePdu{
    constructor(inputValue) {
        super(inputValue);
        this.type = enums.PduType.GetRequest;
    }    
}



class GetBulkRequestPdu extends SimplePdu{
    constructor(inputValue, nonRepeaters, maxRepetitions) {
        super(inputValue);        
        this.type = enums.PduType.GetBulkRequest;
        this.nonRepeaters = nonRepeaters || 0;
        this.maxRepetitions = maxRepetitions || 0;
    }    

    static createFromBuffer(reader) {
        var pdu = new GetBulkRequestPdu ();
        pdu.initializeFromBuffer (reader);
        return pdu;
    }
}
class GetNextRequestPdu extends SimplePdu{
    constructor() {
        super();
        this.type = enums.PduType.GetNextRequest;
    }    

    static createFromBuffer(reader) {
        var pdu = new GetNextRequestPdu ();
        pdu.initializeFromBuffer (reader);
        return pdu;
    };    
}

class InformRequestPdu extends SimplePdu{
    constructor() {
        super();
        this.type = enums.PduType.InformRequest;
    }    

    static createFromBuffer(reader) {
        var pdu = new InformRequestPdu ();
        pdu.initializeFromBuffer (reader);
        return pdu;
    };    
}

class SetRequestPdu extends SimplePdu{
    constructor() {
        super();
        this.type = enums.PduType.SetRequest;
    }    

    static createFromBuffer(reader) {
        var pdu = new SetRequestPdu ();
        pdu.initializeFromBuffer (reader);
        return pdu;
    };    
}

class TrapPdu extends SimplePdu{
    constructor() {
        super();
        this.type = enums.PduType.Trap;
    }    
    static createFromBuffer(reader) {
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
    }
    static createFromVariables(typeOrOid, varbinds, options) {
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
    }
    toBuffer(buffer) {
        buffer.startSequence (this.type);
    
        buffer.writeOID (this.enterprise);
        buffer.writeBuffer (Buffer.from (this.agentAddr.split (".")),
                enums.ObjectType.IpAddress);
        writeInt32 (buffer, enums.ObjectType.Integer, this.generic);
        writeInt32 (buffer, enums.ObjectType.Integer, this.specific);
        writeUint32 (buffer, enums.ObjectType.TimeTicks,
                this.upTime || Math.floor (process.uptime () * 100));
    
        writeVarbinds (buffer, this.varbinds);
    
        buffer.endSequence ();
    };    
}
class TrapV2Pdu extends SimplePdu{
    constructor() {
        super();
        this.type = enums.PduType.TrapV2;
    }    
    static createFromBuffer(reader) {
        var pdu = new TrapV2Pdu ();
        pdu.initializeFromBuffer (reader);
        return pdu;
    };    
    static createFromVariables(id, varbinds, options) {
        var pdu = new TrapV2Pdu ();
        pdu.initializeFromVariables (id, varbinds, options);
        return pdu;
    };    
}


class SimpleResponsePdu {
    constructor() {
    }
    toBuffer(writer) {
        writer.startSequence (this.type);
        writeInt32 (writer, enums.ObjectType.Integer, this.id);
        writeInt32 (writer, enums.ObjectType.Integer, this.errorStatus || 0);
        writeInt32 (writer, enums.ObjectType.Integer, this.errorIndex || 0);
        writeVarbinds (writer, this.varbinds);
        writer.endSequence ();
    }
    initializeFromBuffer(reader) {
        reader.readSequence (this.type);

        this.id = readInt32 (reader);
        this.errorStatus = readInt32 (reader);
        this.errorIndex = readInt32 (reader);

        this.varbinds = [];
        readVarbinds (reader, this.varbinds);
    }

    initializeFromVariables(id, varbinds, options) {
        this.id = id;
        this.varbinds = varbinds;
        this.options = options || {};
    }
}

class GetResponsePdu extends SimpleResponsePdu {
    constructor() {
        super();
        this.type = enums.PduType.GetResponse;
    }    
    static createFromBuffer(reader) {
        var pdu = new GetResponsePdu ();
        pdu.initializeFromBuffer (reader);
        return pdu;
    };    
    static createFromVariables(id, varbinds, options) {
        var pdu = new GetResponsePdu ();
        pdu.initializeFromVariables (id, varbinds, options);
        return pdu;
    };    
}

class ReportPdu extends SimpleResponsePdu {
    constructor() {
        super();
        this.type = enums.PduType.Report;
    }    
    static createFromBuffer(reader) {
        var pdu = new ReportPdu ();
        pdu.initializeFromBuffer (reader);
        return pdu;
    };    
    static createFromVariables(id, varbinds, options) {
        var pdu = new ReportPdu ();
        pdu.initializeFromVariables (id, varbinds, options);
        return pdu;
    };    
}

module.exports = {
    SimplePdu,
    GetBulkRequestPdu,
    GetNextRequestPdu,
    GetRequestPdu,
    InformRequestPdu,
    SetRequestPdu,
    TrapPdu,
    TrapV2Pdu,
    GetResponsePdu,
    ReportPdu
};