import { NextResponse } from "next/server";

export class ApiErrorDetails {
    [key: string]: unknown;
}

export class ApiResponse {
    static ok<T>(data: T) {
        return NextResponse.json(data, { status: 200 });
    }

    static okMessage(message: string, details?: ApiErrorDetails) {
        return this.message(message, 200, details);
    }

    static created<T>(data: T) {
        return NextResponse.json(data, { status: 201 });
    }

    static badRequest(message: string, details?: ApiErrorDetails) {
        return this.error(message, 400, details);
    }

    static unauthorized(message = "Unauthorized", details?: ApiErrorDetails) {
        return this.error(message, 401, details);
    }

    static forbidden(message = "Forbidden", details?: ApiErrorDetails) {
        return this.error(message, 403, details);
    }

    static notFound(message = "Not found", details?: ApiErrorDetails) {
        return this.error(message, 404, details);
    }

    static conflict(message = "Conflict", details?: ApiErrorDetails) {
        return this.error(message, 409, details);
    }

    static badGateway(message = "Bad gateway", details?: ApiErrorDetails) {
        return this.error(message, 502, details);
    }

    static internalServerError(message = "Internal server error", details?: ApiErrorDetails) {
        return this.error(message, 500, details);
    }

    private static error(message: string, status: number, details?: ApiErrorDetails) {
        return this.message(message, status, details);
    }

    private static message(message: string, status: number, details?: ApiErrorDetails) {
        return NextResponse.json(
            details
                ? { message, details }
                : { message },
            { status },
        );
    }
}