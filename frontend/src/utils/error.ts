/**
 * Type guard to check if an unknown error object is a custom error with a response structure.
 * 
 * This function verifies whether the given error object follows the expected format 
 * where it contains a `response` property, which may include a `data` object 
 * with a `message` field.
 * 
 * @function isCustomError
 * @param {unknown} error - The error object to be checked.
 * 
 * @returns {boolean} Returns `true` if the error object contains a `response` property, otherwise `false`.
 * 
 * */
export function isCustomError(error: unknown): error is { response?: { data?: { message?: string } } } {
    return typeof error === "object" && error !== null && "response" in error;
}