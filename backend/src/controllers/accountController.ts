import { Request, Response } from "express";
import { registerService, loginService } from "../services/accountService";

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await registerService(req.body);
      res.status(201).json({ message: "User registered successfully", data });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  };

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await loginService(req.body);
    res.json({ message: "Login successful", data });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};