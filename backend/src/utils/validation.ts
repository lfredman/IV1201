import { Competences } from '../models/competenceModel';

/**
 * Validates the strength of a given password.
 * The password must be at least 8 characters long and include:
 * - One uppercase letter
 * - One lowercase letter
 * - One digit
 * - One special character (e.g., !@#$%^&*)
 *
 * @param {string} password - The password to validate.
 * @returns {boolean} - Returns true if the password meets the criteria, otherwise false.
 */
const isPasswordValid = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    return passwordRegex.test(password); // Returns true if the password matches the regex pattern
};

/**
 * Validates the format of a given personal number (PNR).
 * The PNR must only contain digits and spaces, and its length must be 10 or 12 digits after removing non-digit characters.
 *
 * @param {string} input - The PNR to validate.
 * @returns {boolean} - Returns true if the PNR is valid, otherwise false.
 */
const isPnrValid = (input: string): boolean => {
    const pnrRegex = /^[0-9 -]+$/; // Allows digits and spaces
    const digitsOnly = input.replace(/\D/g, ''); // Removes non-digit characters
    return pnrRegex.test(input) && (digitsOnly.length === 10 || digitsOnly.length === 12); // Validates format and digit count
};

/**
 * Validates the format of a given email address.
 * The email must follow the standard email format: username@domain.com.
 *
 * @param {string} input - The email to validate.
 * @returns {boolean} - Returns true if the email is valid, otherwise false.
 */
const isEmailValid = (input: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regular expression for a valid email format
    return emailRegex.test(input); // Returns true if the email matches the regex pattern
};

/**
 * Validates the competence data by ensuring:
 * 1. The object is not empty.
 * 2. The 'years_of_experience' field exists, is a number, and is non-negative for each competence.
 *
 * @param {Competences} competences - The competence object to validate.
 * @returns {boolean} - Returns true if the object is not empty and all competences are valid, otherwise false.
 */
const isCompetencesValid = (competences: Competences): boolean => {
    if (!competences) {
        return false; // Return false if the competences object is empty or undefined
    }

    return Array.isArray(competences.competences) && // Checks if competences is an array
        competences.competences.every(
            (competence) =>
                typeof competence.years_of_experience === "number" && // Validates if years_of_experience is a number
                competence.years_of_experience >= 0 // Ensures the experience is non-negative
        );
};

/**
 * Validates that a given input contains only safe characters (letters, digits, hyphens, underscores, and common symbols).
 * This ensures that the input is not malicious or harmful for processing.
 *
 * @param {string} input - The input string to validate.
 * @returns {boolean} - Returns true if the input is safe, otherwise false.
 */
const isInputSafe = (input: string): boolean => {
    const safeRegex = /^[a-zA-Z0-9_\-@.åäöÅÄÖ]+$/; // Regular expression to allow letters, digits, and certain special characters
    return safeRegex.test(input); // Returns true if input matches the safe character pattern
};

/**
 * Validates that the action input is one of the accepted values.
 * This function checks if the action is either "unhandled", "accepted", or "rejected".
 *
 * @param {string} input - The action input to validate.
 * @returns {boolean} - Returns true if the action is valid, otherwise false.
 */
const isActionValid = (input: string): boolean => {
    return ["unhandled", "accepted", "rejected"].includes(input); // Checks if the input is one of the predefined valid actions
};

/**
 * Validates that a given date string is a valid date.
 * This function checks if the input date string can be parsed into a valid Date object.
 *
 * @param {string} dateString - The date string to validate.
 * @returns {boolean} - Returns true if the date is valid, otherwise false.
 */
const isDateValid = (dateString: string): boolean => {
    const date = new Date(dateString); // Converts the string into a Date object
    return !isNaN(date.getTime()); // Returns true if the date is valid (i.e., not NaN)
};

export { isEmailValid, isPnrValid, isPasswordValid, isInputSafe, isCompetencesValid, isActionValid, isDateValid };
