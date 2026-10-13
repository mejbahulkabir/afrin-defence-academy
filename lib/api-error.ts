import axios from "axios";

export interface ApiErrorResponse {
    message: string;
    details: Record<string, string>;
}

export class ApiError extends Error {
    readonly details: Record<string, string>;

    constructor(message: string, details: Record<string, string> = {}) {
        super(message);
        this.name = "ApiError";
        this.details = details;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export function toApiError(error: unknown): ApiError {
    if (error instanceof ApiError) {
        return error;
    }

    if (axios.isAxiosError<ApiErrorResponse>(error)) {
        return new ApiError(
            error.response?.data?.message ||
            "Something went wrong. Please try again.",
            error.response?.data?.details ?? {},
        );
    }

    if (error instanceof Error) {
        return new ApiError(error.message);
    }

    return new ApiError("An unexpected error occurred.");
}