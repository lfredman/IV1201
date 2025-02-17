import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { createPerson, getUserByUsername, getUserByEmail, getUserByPnr, getUserById, changePassword } from '../models/accountModel';
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

  console.log(data)

  // DOES FIELDS LOOK OK FOR SIGNUP?

  if (!name || !surname || !pnr || !username || !email || !password){
    throw new Error('Fields are missing');
  }

  if(!isPnrValid(pnr)){
    throw new Error('Invalid person number');
  }

  if(!isEmailValid(email)){
    throw new Error("Invalid email");
  }

  // BUSINESS LOGIC RELATED TO REGISTER

  // 1. Check if username already exists
  const existingUserByUsername = await getUserByUsername(username);
  if (existingUserByUsername) {
      throw new Error('Username is already taken');
  }

  // 2. Check if email already exists
  const existingUserByEmail = await getUserByEmail(email);
  if (existingUserByEmail) {
      throw new Error('Email is already registered');
  }

  const existingUserByPnr = await getUserByPnr(pnr);
  if (existingUserByPnr) {
      throw new Error('Personal number is already registered');
  }

  // 3. Validate password strength
  if (!isValidPassword(password)) {
      console.log(password);
      throw new Error('Password must contain at least 8 characters, one uppercase letter, one number, and one special character');
  }

  // 4. Hash password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  // 5. Default role (optional) can be added here if needed (e.g., role: "user")
  const newUser = await createPerson(data.name, data.surname, pnr, username, email, hashedPassword);



  return await loginService({ loginField: username, password });
};


// USER LOGIN

export const loginService = async (data: { loginField: string; password: string }) => {
    const { loginField, password } = data;
  
    console.log(loginField, password)
    // Try to determine if the loginField is an email, username, or personal number (PNR)
    let user: any;
  
    // Check if it's an email (simple regex for email validation)
    if (loginField.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      // It's an email
      user = await getUserByEmail(loginField);
      console.log("Using email");
    }
    // Check if it's a personal number (PNR) (you can define your own regex pattern for PNR)
    else if (loginField.match(/^\d{1,15}(-\d{1,15})*$/)) {  
        // This allows numbers with optional hyphens between groups of 1-3 digits.
        // Example valid formats: "123", "123-456", "123-456-789"
      
        // It's a PNR or a number with hyphens
        user = await getUserByPnr(loginField);
        console.log("Using PNR");
    }
    // Otherwise, treat it as a username
    else {
      // It's a username
      user = await getUserByUsername(loginField);
      console.log("Using username");
    }
  
    // If no user is found or password doesn't match, throw error
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    // Generate Access Token
    const accessToken = jwt.sign(
        { userId: user.person_id, role_id: user.role_id, username: user.username },
        JWT_SECRET,
        { expiresIn: '1h' } // short expiration for access token
    );

    // Generate Refresh Token
    const refreshToken = jwt.sign(
        { userId: user.person_id, role_id: user.role_id, username: user.username },
        JWT_SECRET,
        { expiresIn: '7d' } // longer expiration for refresh token
    );

    const { password: _password, ...userWithoutPassword } = user;

    return {
      accessToken,
      refreshToken,
      user: userWithoutPassword,
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