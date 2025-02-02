import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { createPerson, getUserByUsername } from "../models/personModel";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// **Register a new user**
export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, surname, pnr, username, email, password } = req.body;

  if (!name || !surname || !pnr || !username || !email || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  try {
    // Check if email or username already exists
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await createPerson(name, surname, pnr, username, email, hashedPassword);

    if (!newUser) {
      res.status(500).json({ message: "User registration failed" });
      return;
    }

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// **Login and generate JWT token**
export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  try {
    const user = await getUserByUsername(username);
    console.log(user);
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    //const passwordMatch = await bcrypt.compare(password, user.password);
    const passwordMatch = (password == user.password);;
    if (!passwordMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    console.log("APA", user.password)
    const { password: _, ...userData } = user;  // Destructure and omit password

    const token = jwt.sign({ userId: user.id, role_id: user.role_id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token , userData });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
