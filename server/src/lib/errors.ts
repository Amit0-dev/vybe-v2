export class AppError extends Error {
    public readonly statusCode: number;
    public readonly code: string;

    constructor(message: string, statusCode = 500, code = "INTERNAL_SERVER_ERROR") {
        super(message);
        this.name = "AppError";
        this.statusCode = statusCode;
        this.code = code;
    }
}

export class BadRequestError extends AppError {
    constructor(message = "Bad request", code = "BAD_REQUEST") {
        super(message, 400, code);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = "Authentication required", code = "UNAUTHORIZED") {
        super(message, 401, code);
    }
}

export class ForbiddenError extends AppError {
    constructor(message = "You do not have permission to perform this action", code = "FORBIDDEN") {
        super(message, 403, code);
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Resource not found", code = "NOT_FOUND") {
        super(message, 404, code);
    }
}

export class ConflictError extends AppError {
    constructor(message = "Resource already exists", code = "CONFLICT") {
        super(message, 409, code);
    }
}

export class UnprocessableEntityError extends AppError {
    constructor(message = "Unable to process request", code = "UNPROCESSABLE_ENTITY") {
        super(message, 422, code);
    }
}

export class ExternalServiceError extends AppError {
    constructor(message = "External service unavailable", code = "EXTERNAL_SERVICE_ERROR") {
        super(message, 502, code);
    }
}

export class TooManyRequestsError extends AppError {
    constructor(message = "Too Many Requests", code = "TOO_MANY_REQUESTS") {
        super(message, 429, code);
    }
}
