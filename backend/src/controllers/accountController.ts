import { Request, Response } from "express";
import { registerService, loginService, pwdResetService, pwdResetByEmailService } from "../services/accountService";
import { AuthRequest } from "../middleware/authMiddleware";  // Import the AuthRequest type


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
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const reset = async (req: AuthRequest, res: Response): Promise<void> => {
  try {

    let id = req.user.userId; // Use the token userid by default

    const data = await pwdResetService(id, req.body); // Pass the extracted user_id with the request body
    res.json({ message: "Password reset successfully", data });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const resetByEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await pwdResetByEmailService(req.body);
    res.json({ message: "Reset link sent to your email!", data });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract refreshToken from query parameters
    const refreshToken = req.query.refreshToken as string;

    if (!refreshToken) {
      res.status(400).json({ message: "Refresh token is required" });
      return;
    }
    // Call the tokenRefreshService with the extracted token
    const data = await tokenRefreshService(refreshToken);

    res.json({ message: "Token refresh successful", data });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Server error", error });
    }
  }
};
