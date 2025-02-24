import { Competences } from '../models/competenceModel';
// Utility function to validate password strength
const isPasswordValid = (password: string) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    return passwordRegex.test(password);
};

// Utility function to validate Pnr
const isPnrValid = (input: string) => {
    const pnrRegex = /^[0-9 -]+$/;
    const digitsOnly = input.replace(/\D/g, '');
    return pnrRegex.test(input) && (digitsOnly.length == 10 || digitsOnly.length == 12);
}

// Utility function to validate email
const isEmailValid = (input: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
}

const isCompetencesValid = (competences: Competences) => {
    return competences.competences.every(
      (competence) =>
        typeof competence.years_of_experience === "number" &&
        competence.years_of_experience >= 0
    );
}
  
const isInputSafe = (input: string): boolean => {
    const safeRegex = /^[a-zA-Z0-9_\-@.]+$/;
    return safeRegex.test(input);
};

export {isEmailValid, isPnrValid, isPasswordValid, isInputSafe, isCompetencesValid};