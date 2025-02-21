
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

export {isEmailValid, isPnrValid, isPasswordValid};