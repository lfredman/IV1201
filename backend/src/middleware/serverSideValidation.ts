import { Request, Response, NextFunction } from 'express';
import { isEmailValid, isPnrValid, isPasswordValid } from '../utils/validation';

/**
 * Middleware to validate the user registration data.
 * Checks if the required fields (name, surname, username, email, password) are present and properly formatted.
 * - Name, surname, and username should be strings.
 * - Email should be a valid string and a valid email address.
 * - Password should be a string, at least 8 characters long, and contain uppercase, lowercase, a number, and a special character.
 * - If PNR (Personal Number) is provided, it must be a valid string.
 * 
 * If any validation fails, a 400 response with the specific error details is sent.
 * If all checks pass, the request proceeds to the next middleware or route handler.
 * 
 * @param {Request} req - The request object containing the registration data.
 * @param {Response} res - The response object used to send error messages or proceed with the request.
 * @param {NextFunction} next - The next middleware or route handler to be called if validation succeeds.
 * @returns {void} - The function either proceeds to the next middleware or returns an error response.
 */
export const validateRegister = (req: Request, res: Response, next: NextFunction): void => {
  const { name, surname, username, email, password, pnr } = req.body;
  const errors: string[] = [];

  // Check if name is present and is a string
  if (!name || typeof name !== 'string') {
    errors.push('Name is required and must be a string.');
  }

  // Check if surname is present and is a string
  if (!surname || typeof surname !== 'string') {
    errors.push('Surname is required and must be a string.');
  }

  // Check if username is present and is a string
  if (!username || typeof username !== 'string') {
    errors.push('Username is required and must be a string.');
  }

  // Check if email is present, is a string, and is a valid email address
  if (!email || typeof email !== 'string' || !isEmailValid(email)) {
    errors.push('A valid email is required.');
  }

  // Check if password is present, is a string, and meets the specified criteria
  if (!password || typeof password !== 'string' || !isPasswordValid(password)) {
    errors.push('Password must be at least 8 characters long and include uppercase, lowercase, number, and a special character.');
  }

  // If PNR is provided, validate it (it must be a string and valid)
  if (pnr && (typeof pnr !== 'string' || !isPnrValid(pnr))) {
    errors.push('Provided Pnr is not valid.');
  }

  // If errors exist, send a response with a 400 status and the error details
  if (errors.length > 0) {
    res.status(400).json({ errors });
    return; // Ensure no further execution if there are validation errors
  }

  // If validation passes, proceed to the next middleware or route handler
  next();
};

/**
 * Middleware to validate login data.
 * - Password is required and must be a string.
 * 
 * You can add more checks for password complexity if needed in the future.
 * 
 * If any validation fails, a 400 response with the error details is sent.
 * If validation passes, the request proceeds to the next middleware or route handler.
 * 
 * @param {Request} req - The request object containing the login data.
 * @param {Response} res - The response object used to send error messages or proceed with the request.
 * @param {NextFunction} next - The next middleware or route handler to be called if validation succeeds.
 * @returns {void} - The function either proceeds to the next middleware or returns an error response.
 */
export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
    const { password } = req.body;
    const errors: string[] = [];

    // Validate password: must be provided and be a string
    // Note: We can't enforce password complexity as old users must still be able to log in
    if (!password || typeof password !== 'string') {
      errors.push('Password is required.');
    }

    // If any errors exist, send a 400 response and return
    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    // If validation passes, proceed to the next middleware/controller
    next();
};

/**
 * Middleware to validate email data.
 * - Email is required, must be a string, and should be in a valid email format.
 * 
 * If validation fails, a 400 response with the error details is sent.
 * If validation passes, the request proceeds to the next middleware or route handler.
 * 
 * @param {Request} req - The request object containing the email to validate.
 * @param {Response} res - The response object used to send error messages or proceed with the request.
 * @param {NextFunction} next - The next middleware or route handler to be called if validation succeeds.
 * @returns {void} - The function either proceeds to the next middleware or returns an error response.
 */
export const validateEmail = (req: Request, res: Response, next: NextFunction): void => {
    const { email } = req.body;
    const errors: string[] = [];
  
    // Validate that email is provided, is a string, and is a valid email format
    if (!email || typeof email !== 'string' || !isEmailValid(email)) {
        errors.push('A valid email is required.');
    }

    // If any errors exist, send a 400 response with the error details
    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    // If validation passes, proceed to the next middleware or route handler
    next();
};