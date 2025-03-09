export function isCustomError(error: unknown): error is { response?: { data?: { message?: string } } } {
    return typeof error === "object" && error !== null && "response" in error;
}