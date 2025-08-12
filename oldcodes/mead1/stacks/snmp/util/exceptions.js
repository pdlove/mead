class ResponseInvalidError extends Error {
    constructor(message, code, info) {
        super(message)
	    this.name = "ResponseInvalidError";
	    this.message = message;
	    this.code = code;
	    this.info = info;
	    Error.captureStackTrace(this, ResponseInvalidError);
    }
}

class RequestInvalidError extends Error {
    constructor(message) {
        super(message)
	    this.name = "RequestInvalidError";
	    this.message = message;
	    Error.captureStackTrace(this, ResponseInvalidError);
    }
}

class RequestFailedError extends Error {
    constructor(message, status) {
        super(message)
	    this.name = "RequestFailedError";
	    this.message = message;
	    this.status = status;
	    Error.captureStackTrace(this, ResponseInvalidError);
    }
}

class RequestTimedOutError extends Error {
    constructor(message) {
        super(message)
	    this.name = "RequestTimedOutError";
	    this.message = message;
	    Error.captureStackTrace(this, ResponseInvalidError);
    }
}

class ProcessingError extends Error {
    constructor(message, error, rinfo, buffer) {
        this.name = "ProcessingError";
        this.message = message;
        this.error = error;
        this.rinfo = rinfo;
        this.buffer = buffer;
        Error.captureStackTrace(this, ProcessingError);
    }
}

module.exports = {
    ResponseInvalidError,
    RequestInvalidError,
    RequestFailedError,
    RequestTimedOutError,
    ProcessingError
};