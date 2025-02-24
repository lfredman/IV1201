import {Competence} from "../context/ProfileContext"

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

    const validateCompetences = (competences: Competence[]) => {
        return competences.every(validateCompetence);
    }

    return { validateEmail, validatePassword, validatePnr, validateCompetence, validateCompetences };
};