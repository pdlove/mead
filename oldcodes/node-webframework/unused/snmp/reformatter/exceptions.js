class ResponseInvalidError extends Error {
    constructor(message, code, info) {
        super(message);
        this.name = "ResponseInvalidError";
        this.code = code;
        this.info = info;
        Error.captureStackTrace(this, ResponseInvalidError);
    }
}

class RequestInvalidError extends Error {
    constructor(message) {
        super(message);
        this.name = "RequestInvalidError";
        Error.captureStackTrace(this, RequestInvalidError);
    }
}

class RequestFailedError extends Error {
    constructor(message, status) {
        super(message);
        this.name = "RequestFailedError";
        this.status = status;
        Error.captureStackTrace(this, RequestFailedError);
    }
}

class RequestTimedOutError extends Error {
    constructor(message) {
        super(message);
        this.name = "RequestTimedOutError";
        Error.captureStackTrace(this, RequestTimedOutError);
    }
}

class ProcessingError extends Error {
    constructor(message, error, rinfo, buffer) {
        super(message);
        this.name = "ProcessingError";
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
