import { Request, Response, NextFunction } from 'express';
import { isEmailValid, isPnrValid, isPasswordValid } from '../utils/validation';

export const validateRegister = (req: Request, res: Response, next: NextFunction): void => {
  const { username, email, password, pnr } = req.body;
  const errors: string[] = [];

  // Check required fields
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

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
    const { password } = req.body;
    const errors: string[] = [];
  
    // Validate password: must be provided and be a string (you may add more complexity checks if needed)
    if (!password || typeof password !== 'string' || isPasswordValid(password)) {
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