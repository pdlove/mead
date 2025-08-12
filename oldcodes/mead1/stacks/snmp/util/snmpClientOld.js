
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



/*****************************************************************************
 ** PDU class definitions
 **/




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

Session.prototype.close = function () {
	this.dgram.close ();
	return this;
};



function _generateId (bitSize) {
	if (bitSize === 16) {
		return Math.floor(Math.random() * 10000) % 65535;
	}
	return Math.floor(Math.random() * 100000000) % 4294967295;
}



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

Session.prototype.subtree = function(oid, maxRepetitions) {
	return new Promise(function(resolve, reject) {
		this.subtree(tableOptions,maxRepetitions, function(error, table) {
			if (error) reject(error);
			resolve(table);
	})}.bind(this));
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
Session.prototype.table = function (tableOptions,maxRepetitions, responseCb) {
	var me = this;
	
	if ((typeof tableOptions)!=="object") //This is the old format
		tableOptions = {BaseOID: tableOptions}
	if (!maxRepetitions) maxRepetitions = 50;
	
	tableOptions.rowGroup ??= "1";
	var req = {
		responseCb: responseCb,
		maxRepetitions: maxRepetitions,
		baseOid: tableOptions.baseOID,
		rowOid: tableOptions.baseOID + "." + tableOptions.rowGroup + ".",
		columns: tableOptions.columns ?? {},
		table: {}
	};

	this.subtree (tableOptions.baseOID, maxRepetitions, tableFeedCb.bind (me, req),
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