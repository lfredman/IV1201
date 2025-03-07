import { Request, Response, NextFunction } from 'express';
import { isEmailValid, isPnrValid, isPasswordValid } from '../utils/validation';

/**
 * Middleware to validate the user registration data.
 * Checks if the required fields (username, email, password) are present and properly formatted.
 * - Username should be a string.
 * - Email should be a valid string and a valid email address.
 * - Password should be a string, at least 8 characters long, and contain uppercase, lowercase, a number, and a special character.
 * - If PNR is provided, it must be a valid string.
 * 
 * If any validation fails, a 400 response with the error details is sent.
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

  // Check required fields

  if (!name || typeof name !== 'string') {
    errors.push('Name is required and must be a string.');
  }

  if (!surname || typeof surname !== 'string') {
    errors.push('Surname is required and must be a string.');
  }

  if (!username || typeof username !== 'string') {
    errors.push('Username is required and must be a string.');
  }

  if (!email || typeof email !== 'string' || !isEmailValid(email)) {
    errors.push('A valid email is required.');
  }

  if (!password || typeof password !== 'string' || !isPasswordValid(password)) {
    errors.push('Password must be at least 8 characters long and include uppercase, lowercase, number, and a special character.');
  }

  if (pnr && (typeof pnr !== 'string' || !isPnrValid(pnr))) {
    errors.push('Provided Pnr is not valid.');
  }


  // If errors exist, send a response and exit the middleware
  if (errors.length > 0) {
    res.status(400).json({ errors });
    return; // ensure no further execution
  }

  next();
};

/**
 * Middleware to validate login data.
 * - Password is required and must be a string.
 * - You can add more checks for password complexity if needed.
 * 
 * If any validation fails, a 400 response with the error details is sent.
 * If the validation passes, the request proceeds to the next middleware or route handler.
 * 
 * @param {Request} req - The request object containing the login data.
 * @param {Response} res - The response object used to send error messages or proceed with the request.
 * @param {NextFunction} next - The next middleware or route handler to be called if validation succeeds.
 * @returns {void} - The function either proceeds to the next middleware or returns an error response.
 */
export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
    const { password } = req.body;
    const errors: string[] = [];

    // Validate password: must be provided and be a string (you may add more complexity checks if needed)
    if (!password || typeof password !== 'string' || !isPasswordValid(password)) {
      errors.push('Password is required.');
    }

    // If any errors exist, send a 400 response and return
    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    // Otherwise, pass control to the next middleware/controller
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
  
    if (!email || typeof email !== 'string' || !isEmailValid(email)) {
        errors.push('A valid email is required.');
    }

    // If any errors exist, send a 400 response and return
    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    // Otherwise, pass control to the next middleware/controller
    next();
};