import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { createPerson, getUserByUsername, getUserByEmail, getUserByPnr } from '../models/accountModel';
import { logger } from '../utils/logger';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;

// Utility function to validate password strength
const isValidPassword = (password: string) => {
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

export const registerService = async (data: { 
  name: string; 
  surname: string; 
  pnr: string; 
  username: string; 
  email: string; 
  password: string; 
}) => {
  const { name, surname, pnr, username, email, password } = data;

  logger.info('Registration attempt', { username, email, pnr });

  // DOES FIELDS LOOK OK FOR SIGNUP?
  if (!name || !surname || !pnr || !username || !email || !password) {
    logger.error('Fields are missing during registration');
    throw new Error('Fields are missing');
  }

  if(!isPnrValid(pnr)) {
    logger.error('Invalid person number', { pnr });
    throw new Error('Invalid person number');
  }

  if(!isEmailValid(email)) {
    logger.error('Invalid email format', { email });
    throw new Error("Invalid email");
  }

  // BUSINESS LOGIC RELATED TO REGISTER
  try {
    // 1. Check if username already exists
    const existingUserByUsername = await getUserByUsername(username);
    if (existingUserByUsername) {
      logger.warn('Username already taken', { username });
      throw new Error('Username is already taken');
    }

    // 2. Check if email already exists
    const existingUserByEmail = await getUserByEmail(email);
    if (existingUserByEmail) {
      logger.warn('Email already registered', { email });
      throw new Error('Email is already registered');
    }

    const existingUserByPnr = await getUserByPnr(pnr);
    if (existingUserByPnr) {
      logger.warn('Personal number already registered', { pnr });
      throw new Error('Personal number is already registered');
    }

    // 3. Validate password strength
    if (!isValidPassword(password)) {
      throw new Error('Password must contain at least 8 characters, one uppercase letter, one number, and one special character');
    }

    // 4. Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    logger.info('Password hashed successfully');

    // 5. Create new user
    const newUser = await createPerson(data.name, data.surname, pnr, username, email, hashedPassword);
    logger.info('User registered successfully', { userId: newUser?.id });

    return await loginService({ loginField: username, password });

  }
  catch (error: unknown) {
    if (error instanceof Error) {
      logger.error('Error during registration', { error: error.message });
      throw new Error('Invalid or expired refresh token');
    } else {
      logger.error('Error during registration', { error: error });
      throw new Error('An unknown error occurred');
    }
  }
};

// USER LOGIN
export const loginService = async (data: { loginField: string; password: string }) => {
  const { loginField, password } = data;

  logger.info('Login attempt', { loginField });

  let user: any;

  // Check if it's an email
  if (loginField.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    user = await getUserByEmail(loginField);
    logger.info('Login attempt using email', { loginField });
  }
  // Check if it's a personal number (PNR)
  else if (loginField.match(/^\d{1,15}(-\d{1,15})*$/)) {
    user = await getUserByPnr(loginField);
    logger.info('Login attempt using PNR', { loginField });
  }
  // Otherwise, treat it as a username
  else {
    user = await getUserByUsername(loginField);
    logger.info('Login attempt using username', { loginField });
  }

  // If no user is found or password doesn't match, throw error
  if (!user || !(await bcrypt.compare(password, user.password))) {
    logger.warn('Invalid credentials', { loginField });
    throw new Error('Invalid credentials');
  }

  // Generate JWT token
  const accessToken = jwt.sign(
    { userId: user.person_id, role_id: user.role_id, username: user.username },
    JWT_SECRET,
    { expiresIn: '5m' }
  );

  const refreshToken = jwt.sign(
    { userId: user.person_id, role_id: user.role_id, username: user.username },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  const { password: _password, ...userWithoutPassword } = user;

  logger.info('User logged in successfully', { userId: user.person_id });

  return {
    accessToken,
    refreshToken,
    user: userWithoutPassword,
  };
};

// TOKEN REFRESH
export const tokenRefreshService = async (refreshToken: string) => {
  let accessToken = {};

  try {
    const user = jwt.verify(refreshToken, JWT_SECRET) as JwtPayload;
    accessToken = jwt.sign(
      { userId: user.userId, role_id: user.role_id, username: user.username },
      JWT_SECRET,
      { expiresIn: '5m' }
    );
    logger.info('Access token refreshed', { userId: user.userId });
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error('Invalid or expired refresh token', { error: error.message });
      throw new Error('Invalid or expired refresh token');
    } else {
      logger.error('An unknown error occurred during token refresh', { error });
      throw new Error('An unknown error occurred');
    }
  }

  return {
    accessToken
  };
};
