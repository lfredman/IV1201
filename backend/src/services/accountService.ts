import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { createPerson, getUserByUsername, getUserByEmail, getUserByPnr } from '../models/accountModel';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;

// Utility function to validate password strength
const isValidPassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    return passwordRegex.test(password);
  };
  
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

if (!name || !surname || !pnr || !username || !email || !password){
    throw new Error('Fields are missing');
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
        { userId: user.id, role_id: user.role_id, username: user.username },
        JWT_SECRET,
        { expiresIn: '1h' } // short expiration for access token
    );

    // Generate Refresh Token
    const refreshToken = jwt.sign(
        { userId: user.id, role_id: user.role_id, username: user.username },
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