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
const isPasswordValid = (password: string) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    return passwordRegex.test(password);
};

/**
 * Validates the format of a given personal number (PNR).
 * The PNR must only contain digits and spaces, and its length must be 10 or 12 digits after removing non-digit characters.
 *
 * @param {string} input - The PNR to validate.
 * @returns {boolean} - Returns true if the PNR is valid, otherwise false.
 */
const isPnrValid = (input: string) => {
    const pnrRegex = /^[0-9 -]+$/;
    const digitsOnly = input.replace(/\D/g, '');
    return pnrRegex.test(input) && (digitsOnly.length == 10 || digitsOnly.length == 12);
}

/**
 * Validates the format of a given email address.
 * The email must follow the standard email format: username@domain.com.
 *
 * @param {string} input - The email to validate.
 * @returns {boolean} - Returns true if the email is valid, otherwise false.
 */
const isEmailValid = (input: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
}

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
        return false; // Return false if the object is empty
    }

    return Array.isArray(competences.competences) &&
        competences.competences.every(
            (competence) =>
                typeof competence.years_of_experience === "number" &&
                competence.years_of_experience >= 0
        );
}

/**
 * Validates that a given input contains only safe characters (letters, digits, hyphens, underscores, and common symbols).
 * This ensures that the input is not malicious or harmful for processing.
 *
 * @param {string} input - The input string to validate.
 * @returns {boolean} - Returns true if the input is safe, otherwise false.
 */
const isInputSafe = (input: string): boolean => {
    const safeRegex = /^[a-zA-Z0-9_\-@.åäöÅÄÖ]+$/;
    return safeRegex.test(input);
};

const isActionValid = (input: string): boolean => {
    
    return ["unhandled", "accepted", "rejected"].includes(input);
};

const isDateValid = (dateString: string): boolean => {
    const date = new Date(dateString);
    return !isNaN(date.getTime()); // Checks if the date is valid
};

export {isEmailValid, isPnrValid, isPasswordValid, isInputSafe, isCompetencesValid, isActionValid, isDateValid};