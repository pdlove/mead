const { writeVarbinds, writeInt32, writeUint32, 
    readVarbinds, readInt32, readUint32, readIpAddress,
    ObjectType, PduType, TrapType } = require("./snmpGlobals");
    const Buffer = require("buffer").Buffer;
    const process = require("process");
//#region PDU Class Definitions
class SimplePdu {
  constructor() {
    this.id = null;
    this.varbinds = [];
    this.options = {};
    this.contextName = "";
  }

  toBuffer(buffer) {
    buffer.startSequence(this.type);

    writeInt32(buffer, ObjectType.Integer, this.id);
    writeInt32(
      buffer,
      ObjectType.Integer,
      this.type == PduType.GetBulkRequest
        ? this.options.nonRepeaters || 0
        : 0
    );
    writeInt32(
      buffer,
      ObjectType.Integer,
      this.type == PduType.GetBulkRequest
        ? this.options.maxRepetitions || 0
        : 0
    );

    writeVarbinds(buffer, this.varbinds);

    buffer.endSequence();
  }

  initializeFromVariables(id, varbinds, options) {
    this.id = id;
    this.varbinds = varbinds;
    this.options = options || {};
    this.contextName = options && options.context ? options.context : "";
  }

  initializeFromBuffer(reader) {
    this.type = reader.peek();
    reader.readSequence();

    this.id = readInt32(reader);
    this.nonRepeaters = readInt32(reader);
    this.maxRepetitions = readInt32(reader);

    this.varbinds = [];
    readVarbinds(reader, this.varbinds);
  }

  getResponsePduForRequest() {
    const responsePdu = GetResponsePdu.createFromVariables(this.id, [], {});
    if (this.contextEngineID) {
      responsePdu.contextEngineID = this.contextEngineID;
      responsePdu.contextName = this.contextName;
    }
    return responsePdu;
  }

  static createFromVariables(pduClass, id, varbinds, options) {
    const pdu = new pduClass(id, varbinds, options);
    pdu.id = id;
    pdu.varbinds = varbinds;
    pdu.options = options || {};
    pdu.contextName = options && options.context ? options.context : "";
    return pdu;
  }
}

class GetBulkRequestPdu extends SimplePdu {
  constructor() {
    super();
    this.type = PduType.GetBulkRequest;
  }

  static createFromBuffer(reader) {
    const pdu = new GetBulkRequestPdu();
    pdu.initializeFromBuffer(reader);
    return pdu;
  }
}

class GetNextRequestPdu extends SimplePdu {
  constructor() {
    super();
    
    this.type = PduType.GetNextRequest;
  }

  static createFromBuffer(reader) {
    const pdu = new GetNextRequestPdu();
    pdu.initializeFromBuffer(reader);
    return pdu;
  }
}

class GetRequestPdu extends SimplePdu {
  constructor() {
    super();
    this.type = PduType.GetRequest;
  }

  static createFromBuffer(reader) {
    const pdu = new GetRequestPdu();
    pdu.initializeFromBuffer(reader);
    return pdu;
  }

  static createFromVariables(id, varbinds, options) {
    const pdu = new GetRequestPdu();
    pdu.initializeFromVariables(id, varbinds, options);
    return pdu;
  }
}

class InformRequestPdu extends SimplePdu {
  constructor() {
    super();
    this.type = PduType.InformRequest;
  }

  static createFromBuffer(reader) {
    const pdu = new InformRequestPdu();
    pdu.initializeFromBuffer(reader);
    return pdu;
  }
}

class SetRequestPdu extends SimplePdu {
  constructor() {
    super();
    this.type = PduType.SetRequest;
  }

  static createFromBuffer(reader) {
    const pdu = new SetRequestPdu();
    pdu.initializeFromBuffer(reader);
    return pdu;
  }
}

class TrapPdu {
  constructor() {
    this.type = PduType.Trap;
  }

  toBuffer(buffer) {
    buffer.startSequence(this.type);

    buffer.writeOID(this.enterprise);
    buffer.writeBuffer(
        Buffer.from(this.agentAddr.split(".")),
      ObjectType.IpAddress
    );
    writeInt32(buffer, ObjectType.Integer, this.generic);
    writeInt32(buffer, ObjectType.Integer, this.specific);
    writeUint32(
      buffer,
      ObjectType.TimeTicks,
      this.upTime || Math.floor(process.uptime() * 100)
    );

    writeVarbinds(buffer, this.varbinds);

    buffer.endSequence();
  }

  static createFromBuffer(reader) {
    const pdu = new TrapPdu();
    reader.readSequence();

    pdu.enterprise = reader.readOID();
    pdu.agentAddr = readIpAddress(reader);
    pdu.generic = readInt32(reader);
    pdu.specific = readInt32(reader);
    pdu.upTime = readUint32(reader);

    pdu.varbinds = [];
    readVarbinds(reader, pdu.varbinds);

    return pdu;
  }

  static createFromVariables(typeOrOid, varbinds, options) {
    const pdu = new TrapPdu();
    pdu.agentAddr = options.agentAddr || "127.0.0.1";
    pdu.upTime = options.upTime;

    if (typeof typeOrOid == "string") {
      pdu.generic = TrapType.EnterpriseSpecific;
      pdu.specific = parseInt(typeOrOid.match(/\.(\d+)$/)[1]);
      pdu.enterprise = typeOrOid.replace(/\.(\d+)$/, "");
    } else {
      pdu.generic = typeOrOid;
      pdu.specific = 0;
      pdu.enterprise = "1.3.6.1.4.1";
    }

    pdu.varbinds = varbinds;

    return pdu;
  }
}

class TrapV2Pdu extends SimplePdu {
  constructor() {
    super();
    this.type = PduType.TrapV2;
  }

  static createFromBuffer(reader) {
    const pdu = new TrapV2Pdu();
    pdu.initializeFromBuffer(reader);
    return pdu;
  }

  static createFromVariables(id, varbinds, options) {
    const pdu = new TrapV2Pdu();
    pdu.initializeFromVariables(id, varbinds, options);
    return pdu;
  }
}

class SimpleResponsePdu {
  constructor() {
    this.id = null;
    this.varbinds = [];
    this.options = {};
  }

  toBuffer(writer) {
    writer.startSequence(this.type);

    writeInt32(writer, ObjectType.Integer, this.id);
    writeInt32(writer, ObjectType.Integer, this.errorStatus || 0);
    writeInt32(writer, ObjectType.Integer, this.errorIndex || 0);
    writeVarbinds(writer, this.varbinds);
    writer.endSequence();
  }

  initializeFromBuffer(reader) {
    reader.readSequence(this.type);

    this.id = readInt32(reader);
    this.errorStatus = readInt32(reader);
    this.errorIndex = readInt32(reader);

    this.varbinds = [];
    readVarbinds(reader, this.varbinds);
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
    this.type = PduType.GetResponse;
  }

  static createFromBuffer(reader) {
    const pdu = new GetResponsePdu();
    pdu.initializeFromBuffer(reader);
    return pdu;
  }

  static createFromVariables(id, varbinds, options) {
    const pdu = new GetResponsePdu();
    pdu.initializeFromVariables(id, varbinds, options);
    return pdu;
  }
}

class ReportPdu extends SimpleResponsePdu {
  constructor() {
    super();
    this.type = PduType.Report;
  }

  static createFromBuffer(reader) {
    const pdu = new ReportPdu();
    pdu.initializeFromBuffer(reader);
    return pdu;
  }

  static createFromVariables(id, varbinds, options) {
    const pdu = new ReportPdu();
    pdu.initializeFromVariables(id, varbinds, options);
    return pdu;
  }
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
  SimpleResponsePdu,
  GetResponsePdu,
  ReportPdu
};