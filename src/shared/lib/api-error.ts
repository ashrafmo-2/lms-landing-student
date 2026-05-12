import { AxiosError } from "axios";
import type { ApiResponse, ValidationErrors } from "@/entities/auth/model";

/**
 * Extracts a human-readable error message from an Axios error.
 * Handles both 422 validation errors and generic API errors.
 */
export function getApiErrorMessage(error: unknown): string {
    if (error instanceof AxiosError) {
        const response = error.response?.data as ApiResponse | undefined;

        if (response) {
            // 422 — validation errors: join all field messages
            if (
                response.errors &&
                !Array.isArray(response.errors) &&
                Object.keys(response.errors).length > 0
            ) {
                const errs = response.errors as ValidationErrors;
                return Object.values(errs).flat().join(" | ");
            }

            // Generic API message
            if (response.message) return response.message;
        }

        // Network / timeout
        if (error.code === "ERR_NETWORK") return "تعذر الاتصال بالخادم، تحقق من الإنترنت";
        if (error.code === "ECONNABORTED") return "انتهت مهلة الطلب، حاول مرة أخرى";
    }

    return "حدث خطأ غير متوقع، حاول مرة أخرى";
}

/**
 * Extracts per-field validation errors from a 422 response.
 */
export function getValidationErrors(error: unknown): ValidationErrors {
    if (error instanceof AxiosError) {
        const response = error.response?.data as ApiResponse | undefined;
        if (
            response?.errors &&
            !Array.isArray(response.errors) &&
            Object.keys(response.errors).length > 0
        ) {
            return response.errors as ValidationErrors;
        }
    }
    return {};
}
