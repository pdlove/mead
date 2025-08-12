var dgram = require("dgram");
var { Engine } = require("./engine");
var enums = require("./enums");
const { EventEmitter } = require("events");
const pdus = require("./pdus");
const { Message } = require("./message");
const exceptions = require("./exceptions");
class Session extends EventEmitter {
    // Default values for the session
    target = '127.0.0.1'
    version = enums.Version1
    community = 'public'
    transport = 'udp4'
    port = 161
    retries = 1
    timeout = 5000
    backoff = 1.0
    sourceAddress = undefined
    sourcePort = undefined
    idBitsSize = 32
    context = "" // Default to empty string
    backwardsGetNexts = true
    reportOidMismatchErrors = false
    DEBUG = false // Default to false
    engine = null
    dgram = null // The UDP Socket

    maxRepetitions = 50; // Default to 50

    rawRequests = {};
    reqCount = 0;

    constructor(options) {
        super();
        if (!options) {
            throw new Error("Options are required to create an SNMP session.");
        }
        // Ensure that options may be optional
        var version = options.version ?? enums.Version1;
        if (version != enums.Version1 && version != enums.Version2c) {
            // This is a version 3 request.
            // We should have user information
        } else {
            //We should have a target and community string but no user.
        }

        this.target = options.target ?? "127.0.0.1";
        this.version = options.version ?? enums.Version1;
        if (this.version == enums.Version3) {
            this.user = options.user;
        } else {
            this.community = options.community ?? "public";
        }
        this.transport = options.transport ?? "udp4";
        this.port = options.port ?? 161;
        this.trapPort = options.trapPort ?? 162;
        this.retries = options.retries ?? 1;
        this.timeout = options.timeout ?? 5000;
        this.backoff = options.backoff ?? 1.0;
        if (this.backoff < 1.0) this.backoff = 1.0;
        this.sourceAddress = options.sourceAddress ?? undefined;
        this.sourcePort = options.sourcePort ? parseInt(options.sourcePort) : undefined;
        this.idBitsSize = options.idBitsSize ? parseInt(options.idBitsSize) : 32;
        this.context = options.context ?? ""; // Default to empty string                    
        this.backwardsGetNexts = options.backwardsGetNexts ?? true;

        this.reportOidMismatchErrors = options.reportOidMismatchErrors ?? false;

        this.DEBUG = options.debug;

        this.engine = new Engine(options.engineID);

        this.dgram = dgram.createSocket(this.transport);

        this.dgram.on("message", this.onMsg.bind(this));
        this.dgram.on("close", this.onClose.bind(this));
        this.dgram.on("error", this.onError.bind(this));

        if (this.sourceAddress || this.sourcePort)
            this.dgram.bind(this.sourcePort, this.sourceAddress);
    };

    //#region "Request management"
    requestRegister(requestID, req) {
        if (!this.rawRequests[requestID]) {
            this.rawRequests[requestID] = req;
            this.reqCount++;
        }
        if (this.reqCount > 0) {
            this.dgram.ref();
        }
        req.retries = this.retries;
        req.timer = setTimeout(function () {
            this.requestTimeout(requestID, req);
        }.bind(this), this.timeout * this.backoff);
    };
    requestTimeout(requestID, req) {
        if (req.retries-- > 0) {
            console.log("Request timed out, retrying...");
            this.pduSend(req);
            req.timer = setTimeout(function () {
                this.requestTimeout(requestID, req);
            }.bind(this), this.timeout * this.backoff);
        } else {
            this.requestUnregister(requestID);
            req.reject(new exceptions.RequestTimedOutError(
                "Request timed out"));
        }
    }
    requestUnregister(requestID) {
        var req = this.rawRequests[requestID];
        if (req) {
            delete this.rawRequests[requestID];
            clearTimeout(req.timer);
            delete req.timer;
            this.reqCount--;
            if (this.reqCount <= 0)
                this.dgram.unref();
            return req;
        } else {
            return null;
        }

    };
    cancelAllRequests(error) {
        var requestID;
        for (requestID in this.reqs) {
            var req = this.reqs[requestID];
            this.requestUnregister(req.getId());
            req.reject(error);
        }
    };
    //#endregion "Request management"

    //#region "dgram Functions"
    onClose() {
        this.cancelAllRequests(new Error("Socket forcibly closed"));
        this.emit("close");
    };
    onError(error) {
        this.emit(error);
    };
    onMsg(buffer) {
        try {
            var message = Message.fromBuffer(buffer);
        } catch (error) {
            this.emit("error", error);
            return;
        }
        var req = this.requestUnregister(message.getReqId());
        if (!req)
            return;
        if (message.version != req.version) {
            req.reject(new exceptions.ResponseInvalidError("Version in request '" + req.version + "' does not match version in " + "response '" + message.version + "'", ResponseInvalidCode.EVersionNoMatch));
        } else if (message.community != req.community) {
            req.reject(new exceptions.ResponseInvalidError("Community '" + req.community + "' in request does not match " + "community '" + message.community + "' in response", ResponseInvalidCode.ECommunityNoMatch));
        } else if (message.pdu.type == enums.PduType.GetResponse) {
            req.resolve(message.pdu.varbinds);
        } else {
            req.reject(new exceptions.ResponseInvalidError("Unknown PDU type '"
                + message.pdu.type + "' in response", ResponseInvalidCode.EUnknownPduType));
        }
    };
    //#endregion "dgram Functions"


    async getValue(oidList, numEntries = 1, nonRepeaters = 0) {
        let oidRequests = [];
        if (Array.isArray(oidList)) {
            for (let oid of oidList) {
                if (typeof oid !== "string") {
                    throw new Error("OID must be a string or an array of strings.");
                }
                oidRequests.push({ oid })
            }
        } else {
            if (typeof oidList !== "string") {
                throw new Error("OID must be a string or an array of strings.");
            }
            oidRequests.push({ oid: oidList })
        }

        if (numEntries > 1) {
            // We need to do a getBulk request
            let myPDU = new pdus.GetBulkRequestPdu(oidRequests, nonRepeaters, numEntries);
            let myVal = await this.pduSendWithReply(myPDU);
            //console.log("Received value ",myVal);
            return myVal;
        } else {
            let myPDU = new pdus.GetRequestPdu(oidRequests);
            let myVal = await this.pduSendWithReply(myPDU);
            //console.log("Received value ",myVal);
            return myVal;
        }
    }

    async getFullWalk(oidStart = '0.0', stopCondition = null) {
        if (typeof oidStart !== "string") {
            throw new Error("OID must be a string.");
        }
        let fullWalk = {};
        let lastOID = oidStart;

        while (lastOID != '') {
            let reply = null;
            try {
                reply = await this.getValue([lastOID], 50);
            } catch (error) {
                if (error instanceof exceptions.RequestTimedOutError) {
                    console.log("Request timed out. Trying to continue with 1 non-repeater.");
                    try {
                        reply = await this.getValue([lastOID], 100, 1);
                    } catch (error2) {
                        console.log("Stopping walk with error. ", error2);
                        break;
                    }
                } else {
                    console.log("Error in getFullWalk: ", error);
                    break;
                }
            }
            for (let myVarBind of reply) {
                if (stopCondition)
                    if (stopCondition(myVarBind)) {
                        lastOID = '';
                        break;
                    }
                if (myVarBind.type === enums.ObjectType.EndOfMibView) {
                    lastOID = '';
                    break;
                }
                fullWalk[myVarBind.oid] = { type: myVarBind.type, value: myVarBind.value };
                lastOID = myVarBind.oid;
            }
            console.log(`${this.target}: Received ${reply.length} OIDs ending in ${lastOID}`);

        }
        return fullWalk;
    }
    async getSubtree(oidRoot) {
        if (typeof oidRoot !== "string") {
            throw new Error("OID must be a string.");
        }
        return this.getFullWalk(oidRoot, function (myVarBind) {
            return (!myVarBind.oid.startsWith(oidRoot + '.'));
        });
    }

    async getTable(tableDef) {
        let rowOID = tableDef.baseOID + '.' + (tableDef.rowGroup ?? '0');
        if (tableDef.rowGroup === '') rowOID = tableDef.baseOID;
        let tableData = await this.getSubtree(rowOID);
        let table = {};
        let indexFields = [];
        if (tableDef.rowIndex)
            indexFields = tableDef.rowIndex.split(',');
        for (let oidFull in tableData) {
            var oid = oidFull.replace(rowOID + ".", "");
            const lastPeriodIndex = oid.indexOf('.');
            const idxValue = oid.substring(lastPeriodIndex + 1);
            const colNum = oid.substring(0, lastPeriodIndex);
            const value = tableData[oidFull].value;
            if (tableDef.columns[colNum]) {
                const col = tableDef.columns[colNum];
                if (!table[idxValue]) {
                    let newRow = {};
                    if (indexFields.length == 0)
                        newRow.index = idxValue;
                    else if (indexFields.length == 1)
                        newRow[indexFields[0]] = idxValue;
                    else {
                        let idxValueParts = idxValue.split('.');
                        if (idxValueParts.length != indexFields.length) {
                            throw new Error(`Index value ${idxValue} does not match index fields ${indexFields}`);
                        }
                        for (let i = 0; i < indexFields.length; i++) {
                            newRow[indexFields[i]] = idxValueParts[i];
                        }
                    }
                    table[idxValue] = newRow;
                }
                switch (col.type) {
                    case 'string':
                        table[idxValue][col.name] = value.toString();
                        break;
                    case "utf8":
                        table[idxValue][col.name] = value;//.toString('utf8');
                        break;
                    case "ascii":
                        table[idxValue][col.name] = value;//.toString('ascii');
                        break;
                    case 'hex':
                        table[idxValue][col.name] = Buffer.from(value, 'ascii').toString('hex');
                        break;
                    case 'enum':
                        if (col.enum && col.enum[value])
                            table[idxValue][col.name] = col.enum[value];
                        else
                            table[idxValue][col.name] = value;
                        break;
                    case 'bitmap':
                        let bits = [];
                        let basebit = 0;
                        let buf = Buffer.from(value, 'latin1');
                        for (let i = 0; i < buf.length; i++) {
                            let byte = buf[i]; // Access buffer value directly
                            //Bits are left-right, so bit 8 is a 1, 7 is 2, etc.
                            if (byte & 128) bits.push(basebit+1);
                            if (byte & 64) bits.push(basebit+2);
                            if (byte & 32) bits.push(basebit+3);
                            if (byte & 16) bits.push(basebit+4);
                            if (byte & 8) bits.push(basebit+5);
                            if (byte & 4) bits.push(basebit+6);
                            if (byte & 2) bits.push(basebit+7);
                            if (byte & 1) bits.push(basebit+8);                            
                            basebit+=8;
                        }
                        if (col.enum) 
                            for (let i=0; i<bits.length; i++) 
                                if (col.enum[bits[i]]) bits[i]=col.enum[bits[i]];

                        table[idxValue][col.name] = bits;
                        break;

                    default:
                        table[idxValue][col.name] = tableData[oidFull].value;
                }
            } else {
                // if (!table[idxValue])
                //     table[idxValue] = { idxValue };
                // table[idxValue][colNum] = tableData[oidFull].value;
            }
        }
        return table;
    }
    pduSend({ pduInstance, reject }) {
        var message = Message.createCommunity(this.version, this.community, pduInstance);
        var buffer = message.toBuffer();
        if (this.DEBUG) {
            console.log("Sending message: ", buffer);
        }
        this.dgram.send(buffer, 0, buffer.length, this.port, this.target, function (error) {
            if (error) {
                reject(error);
            }
        });
        //console.log("Sent message: ", buffer);
    }

    pduSendWithReply(pduInstance) {
        return new Promise((resolve, reject) => {
            // Create a new request ID
            var requestID = this._generateId(this.idBitsSize);
            while (this.rawRequests[requestID] !== undefined) {
                // Generate a new request ID if it already exists
                requestID = this._generateId(this.idBitsSize);
            }

            // Assign the request ID to the PDU instance
            pduInstance.requestID = requestID;

            //The Resolve and Reject functions are being handed off to the request object.
            //When a related packet is received or timeout occurs then these will be called.
            this.requestRegister(requestID, { pduInstance, resolve, reject, timer: null, version: this.version, community: this.community });

            this.pduSend(this.rawRequests[requestID]);
            //     , function (error, response) {
            //     if (error) {
            //         reject(error);
            //     } else {
            //         resolve(response);
            //     }
            // });
        });
    }
    _generateId(bitSize) {
        if (bitSize === 16) {
            return Math.floor(Math.random() * 10000) % 65535;
        }
        return Math.floor(Math.random() * 100000000) % 4294967295;
    }
};


//#endregion "PDU-level Functions"

module.exports = { Session };