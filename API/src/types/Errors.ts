class HttpError extends Error {
    status: Number;
    name: string;
    stack?: string | undefined;
    constructor (message: string | undefined, status: any, name: string = 'HttpError', stack?: string | undefined) {
        super(message);
        this.status = status;
        this.name = name;
        this.stack = stack;
    }
}

class BadRequestError extends HttpError {
    constructor (message: string | undefined) {
        super(message, 400, 'BadRequestError');
    }
}

class UnauthorizedError extends HttpError {
    constructor (message: string | undefined) {
        super(message, 401, 'UnauthorizedError');
    }
}

class ForbiddenError extends HttpError {
    constructor (message: string | undefined) {
        super(message, 403, 'ForbiddenError');
    }
}

class NotFoundError extends HttpError {
    constructor (message: string | undefined) {
        super(message, 404, 'NotFoundError');
    }
}

class ConflictError extends HttpError {
    constructor (message: string | undefined) {
        super(message, 409, 'ConflictError');
    }
}

class InternalServerError extends HttpError {
    constructor (message: string | undefined) {
        super(message, 500, 'InternalServerError');
    }
}

class NotImplementedError extends HttpError {
    constructor (message: string | undefined) {
        super(message, 501, 'NotImplementedError');
    }
}

class ServiceUnavailableError extends HttpError {
    constructor (message: string | undefined) {
        super(message, 503, 'ServiceUnavailableError');
    }
}

export {
    HttpError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    InternalServerError,
    NotImplementedError,
    ServiceUnavailableError,
};