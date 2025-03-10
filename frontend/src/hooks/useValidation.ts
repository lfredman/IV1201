import {Competence} from "../context/ProfileContext"

/**
 * Custom hook for validating user input data.
 *
 * This hook provides utility functions to validate common user input fields such as:
 * - Email addresses
 * - Passwords (with strength validation)
 * - Person numbers (PNR) commonly used in Swedish identification systems
 * - Competence objects (checking years of experience)
 *
 * The functions use regular expressions or simple validation checks to ensure that the data adheres to the expected formats.
 * The hook returns these validation functions, making it easy to apply them across the application.
 *
 * @returns {Object} An object containing validation functions:
 * - `validateEmail(input: string): boolean` - Validates an email format.
 * - `validatePassword(password: string): boolean` - Validates password strength.
 * - `validatePnr(input: string): boolean` - Validates Swedish person number (PNR) format.
 * - `validateCompetence(competence: Competence): boolean` - Validates a single competence object.
 * - `validateCompetences(competences: Competence[]): boolean` - Validates an array of competence objects.
 */
export const useValidation = () => {

    // Utility function to validate email
    const validateEmail = (input: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(input);
    }

    const validatePassword = (password: string) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
        return passwordRegex.test(password);
    };
    
    const validatePnr = (input: string) => {
        const pnrRegex = /^[0-9 -]+$/;
        const digitsOnly = input.replace(/\D/g, '');
        return pnrRegex.test(input) && (digitsOnly.length == 10 || digitsOnly.length == 12);
    }

    const validateCompetence = (competence: Competence) => {
        return typeof competence.years_of_experience === 'number' &&
               competence.years_of_experience >= 0;
    }

    const validateUsername = (input: string): boolean => {
        const safeRegex = /^[a-zA-Z0-9_\-@.åäöÅÄÖ]+$/;
        return safeRegex.test(input);
    };

    const validateCompetences = (competences: Competence[]) => {
        return competences.every(validateCompetence);
    }

    return { validateEmail, validatePassword, validatePnr, validateCompetence, validateCompetences, validateUsername };
};