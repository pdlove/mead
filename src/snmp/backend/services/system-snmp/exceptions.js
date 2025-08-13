class RequestInvalidError extends Error {
    constructor(message) {
        super(message);
        this.name = "RequestInvalidError";
    }
}

class ResponseInvalidError extends Error {
    constructor(message, code, info) {
        super(message);
        this.name = "ResponseInvalidError";
        this.code = code;
        this.info = info;
    }
}

exports = { RequestInvalidError, ResponseInvalidError }