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
