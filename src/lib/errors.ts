import axios from "axios";
import type { HTTPValidationError } from "./interface";

export function handleApiError(err: unknown): Error {
    if (axios.isAxiosError(err)) {
        const data = err.response?.data;

        if (
            data &&
            typeof data === "object" &&
            "detail" in data &&
            Array.isArray(data.detail)
        ) {
            const validationError = data as HTTPValidationError;
            const message = validationError.detail[0]?.msg || "Validation failed";
            return new Error(message);
        };

        return new Error(err.message || "API error");
    }
    return new Error("Unexpected error occurred");
};