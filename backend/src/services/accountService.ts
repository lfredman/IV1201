import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { createPerson, getUserByUsername, getUserByEmail, getUserByPnr, changePassword, getUserById } from '../models/accountModel';
import { logger } from '../utils/logger';
import { sendEmail } from '../utils/email';

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
    logger.info('User registered successfully', { userId: newUser?.person_id });

    return await loginService({ loginField: username, password });

  }
  catch (error: unknown) {
    if (error instanceof Error) {
      logger.error('Error during registration', { error: error.message });
      throw new Error(error.message);
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

export const pwdResetService = async (id: string, data: { password: string }) => {
  const { password } = data;
    
  console.log("Login: ", id, " PWD: ", password)
  // If no user is found or password doesn't match, throw error
  if (!id || !password) {
    throw new Error('Missing parameters');
  }

  const user = await getUserById(id);

  if (!user) {
    throw new Error("User not found");
  }
  
  // Validate password strength
  if (!isValidPassword(password)) {
    console.log(password);
    throw new Error('Password must contain at least 8 characters, one uppercase letter, one number, and one special character');
  }

  console.log("CHANING PASSWORD FOR ", user)

  const hashedPassword = await bcrypt.hash(password, 10);

  
  return changePassword(user.person_id, hashedPassword);
};


export const pwdResetByEmailService = async (data: { email: string }) => {
  const { email } = data;

  console.log("Password reset request for:", email);

  if (!email) {
      throw new Error('Missing email parameter');
  }

  // Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Invalid email format');
  }

  // Find user by email
  const user = await getUserByEmail(email);
  if (!user) {
      throw new Error("User not found");
  }

  console.log("Generating password reset token for:", user.email);

  // Calculate expiration time (15 minutes from now)
  const expirationTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  const expirationTimeFormatted = expirationTime.toLocaleString(); // You can format this however you want

  // Generate a secure password reset token (valid for 15 min)
  const resetToken = jwt.sign({ userId: user.person_id }, JWT_SECRET, { expiresIn: '15m' });

  // Construct password reset link
  const resetLink = `http://localhost:5173/reset?token=${resetToken}`;

  // Send password reset email
  await sendEmail(
      user.email, 
      "🔒 Reset Your Password - Action Required", 
      `Hello ${user.name || "User"},\n\nWe received a request to reset your password. Click the link below to set a new one. This link will expire at ${expirationTimeFormatted}.\n\nIf you didn’t request this, you can ignore this email.\n\nBest,\nThe KTH Team`, 
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
          <h2 style="color: #333; text-align: center;">🔒 Password Reset Request</h2>
          <p style="color: #555;">Hello <strong>${user.name || "User"}</strong>,</p>
          <p style="color: #555;">We received a request to reset your password. Click the button below to set a new one:</p>
          <div style="text-align: center; margin: 20px 0;">
              <a href="${resetLink}" style="background-color: #007bff; color: #fff; text-decoration: none; padding: 12px 20px; border-radius: 5px; display: inline-block; font-size: 16px;">
                  Reset Your Password
              </a>
          </div>
          <p style="color: #555;">This link will expire at <strong>${expirationTimeFormatted}</strong>. If you didn’t request this, you can safely ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #eee;">
          <p style="color: #777; font-size: 12px; text-align: center;">Best,<br>The Recruitment Team</p>
      </div>
      `
  );

  console.log("Password reset email sent to:", user.email);

  return { message: "Password reset email sent successfully" };
};
