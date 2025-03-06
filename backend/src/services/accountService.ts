import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { createPerson, getUserByUsername, getUserByEmail, getUserByPnr, changePassword, getUserById } from '../models/accountModel';
import { logger } from '../utils/logger';
import { sendEmail } from '../utils/email';
import { isEmailValid, isPasswordValid, isPnrValid } from '../utils/validation';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;

/**
 * Handles user registration by validating the input fields and checking for existing usernames, emails, 
 * and personal numbers. Hashes the password before storing and returns the login tokens after successful registration.
 * In case of any errors, sends an appropriate error message and status.
 *
 * @param {Object} data - The data object containing user details for registration.
 * @param {string} data.name - The user's first name.
 * @param {string} data.surname - The user's surname.
 * @param {string} data.pnr - The user's personal number.
 * @param {string} data.username - The desired username.
 * @param {string} data.email - The user's email address.
 * @param {string} data.password - The user's chosen password.
 * @returns {Promise<Object>} - A promise that resolves with the login tokens and user details after successful registration.
 */
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
    if (!isPasswordValid(password)) {
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

/**
 * Handles user login by validating the provided credentials. Checks if the loginField matches a username, 
 * email, or personal number, and if the password is correct. Generates access and refresh tokens if login is successful.
 * Sends an error message if credentials are invalid.
 *
 * @param {Object} data - The data object containing login credentials.
 * @param {string} data.loginField - The username, email, or personal number used for login.
 * @param {string} data.password - The password entered by the user.
 * @returns {Promise<Object>} - A promise that resolves with the login tokens and user details after successful login.
 */
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
    { expiresIn: '1m' }
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

/**
 * Handles token refresh requests by verifying the provided refresh token and generating a new access token.
 * Sends an error message if the refresh token is invalid or expired.
 *
 * @param {string} refreshToken - The refresh token used to generate a new access token.
 * @returns {Promise<Object>} - A promise that resolves with the new access token.
 */
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

/**
 * Handles password reset requests by updating the password of a user identified by the given ID.
 * The new password is validated for strength and hashed before being stored.
 * Sends an error message if the parameters are missing or invalid.
 *
 * @param {string} id - The user ID for the account whose password needs to be reset.
 * @param {Object} data - The data object containing the new password.
 * @param {string} data.password - The new password to be set.
 * @returns {Promise<Object>} - A promise that resolves with the result of the password change operation.
 */
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
  if (!isPasswordValid(password)) {
    console.log(password);
    throw new Error('Password must contain at least 8 characters, one uppercase letter, one number, and one special character');
  }

  console.log("CHANING PASSWORD FOR ", user)

  const hashedPassword = await bcrypt.hash(password, 10);

  
  return changePassword(user.person_id, hashedPassword);
};

/**
 * Handles password reset requests by email. Validates the email format, generates a password reset token, 
 * and sends a password reset email to the user with a link to reset their password.
 * Sends an error message if the email is missing or invalid, or if no user is found.
 *
 * @param {Object} data - The data object containing the user's email address.
 * @param {string} data.email - The email address of the user requesting the password reset.
 * @returns {Promise<Object>} - A promise that resolves with a success message after sending the password reset email.
 */
export const pwdResetByEmailService = async (data: { email: string }) => {
  const { email } = data;

  console.log("Password reset request for:", email);

  if (!email) {
      throw new Error('Missing email parameter');
  }

  // Validate email format
  if (!isEmailValid(email)) {
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
