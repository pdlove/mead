var dgram = require ("dgram");
const { snmpVersion, ResponseInvalidError, ResponseInvalidCode } = require("./enums.js"); 

class Client {
    target = '127.0.0.1';
	version = snmpVersion.Version1;
	user = '';
	community = 'public';
	queryPort = 161;
	sourcePort = 0;
	sourceAddress = '0.0.0.0';
    transport = 'udp4';
    dgram = null;
    
    retries = 1;
	timeout = 5000;
	backoff = 1.0
	idBitSize = 32;
	context = "";
	backwardsGetNexts = true;
	reportOidMismatchErrors = false;
	#outRequests = {};
    #outRequestTimeoutTimers = {};

    constructor(targetHost, targetVersion, community, options ) {
        this.target = targetHost;
        this.version = targetVersion;
        this.community = community;

		//Load any properties from options to override anything in the class at this point.
		for (let prop in options) {
			this[prop]=options[prop];
		}

        if (this.backoff<1.0) options.backoff = 1.0;
        
        //If target is a hostname, fetch the IP for this test.
        //If target is IPv6, set transport to udp6.        
    }

  //////////////////////////////////////////////
 ///////////   Response Listener  /////////////
//////////////////////////////////////////////

    startListening() {
        if (dgram) {
            //This port is possibly already bound.
            return;
        }
        this.dgram = dgram.createSocket (this.transport);
        this.dgram.on ("message", this.#onMsg.bind(this));
		this.dgram.on ("close", this.#onClose.bind(this));
		this.dgram.on ("error", this.#onError.bind(this));
        this.dgram.bind(this.sourcePort, this.sourceAddress);
        this.realSourcePort = this.dgram.address().port;
    }
    stopListening() {
        if (!dgram) {
            //We're already closed.
            return;
        }
        this.cancelRequest(0, "Closing Port");
        this.dgram.close();
        this.dgram = null;
    }
    isListenting() { return (dgram===null) }

    #onClose() {
        this.cancelRequest(0, 'PortClosing');
    }

    cancelRequest(id, message) {
        if (id==0) {
            for (id in this.#outRequests) {
                this.cancelRequest(id,message)
            }
        } else {
            //Kill the timeout timer.
            if (this.#outRequestTimeoutTimers[id]) {
                clearTimeout(this.#outRequestTimeoutTimers[id]);
                delete this.#outRequestTimeoutTimers[id];                
            }            

            //Remove the request and issue a promise reject if there is a promise.
            if (this.#outRequests[id]) {
                var myRequest = this.#outRequests[id];
                if (myRequest.promiseReject) myRequest.promiseReject(message);
                delete this.#outRequests[id];
            }
        }
    }

    #onError(exception) {
        this.cancelRequest(0,exception);
        this.stopListening();
    }

  //////////////////////////////////////////////
 ///////////   Full Submission   //////////////
//////////////////////////////////////////////

    submitRequest(pduInstance) {
        
    }

    #onMsg(msg, rinfo) {
        
    }

  //////////////////////////////////////////////
 ///////////   Quick Submission   /////////////
//////////////////////////////////////////////

    snmpGet(pduType, oids) {

    }

    snmpGetNext(pduType, oids) {
        
    }

}