import { Request, Response } from "express";
import {
  registerService,
  loginService,
  pwdResetService,
  pwdResetByEmailService,
  tokenRefreshService,
} from "../services/accountService";
import { AuthRequest } from "../middleware/authMiddleware"; // Import the AuthRequest type

/**
 * Registers a new user by invoking the registerService with the request body data.
 * If successful, returns a 201 status with a success message and user data.
 * In case of an error, it sends a 400 status with the error message or a 500 status
 * for an unknown error.
 *
 * @param {Request} req - The request object containing the user registration details in the body.
 * @param {Response} res - The response object used to send back the status and data to the client.
 * @returns {Promise<void>} - A promise that resolves when the response is sent to the client.
 */
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

/**
 * Handles user login by invoking the loginService with the provided login credentials from the request body.
 * If successful, returns a success message along with the user data.
 * In case of an error, sends a 400 status with the error message or a 500 status for an unknown error.
 *
 * @param {Request} req - The request object containing the login credentials (username/email and password) in the body.
 * @param {Response} res - The response object used to send back the status and data to the client.
 * @returns {Promise<void>} - A promise that resolves when the response is sent to the client.
 */
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

/**
 * Handles the password reset request by extracting the user ID from the token in the request and passing it
 * along with the request body to the password reset service.
 * If successful, returns a success message along with the reset data.
 * In case of an error, sends a 400 status with the error message or a 500 status for an unknown error.
 *
 * @param {AuthRequest} req - The request object containing the authenticated user information (user ID from token)
 *                             and the request body with new password details.
 * @param {Response} res - The response object used to send back the status and data to the client.
 * @returns {Promise<void>} - A promise that resolves when the response is sent to the client.
 */
export const reset = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.userId) {
      res.status(400).json({ message: 'User ID not found in the token' });
      return;
    }

    // Ensure userId is passed as a string
    const id = req.user.userId.toString(); // Convert the userId to string

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


/**
 * Handles password reset request by sending a reset link to the user's registered email address.
 * If successful, sends a success message along with any related data.
 * In case of an error, sends a 400 status with the error message or a 500 status for an unknown error.
 *
 * @param {Request} req - The request object containing the email and necessary data to trigger the password reset.
 * @param {Response} res - The response object used to send back the status and data to the client.
 * @returns {Promise<void>} - A promise that resolves when the response is sent to the client.
 */
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

/**
 * Handles refresh token request to generate a new access token using the provided refresh token.
 * If successful, returns a new token along with a success message.
 * In case of an error, sends a 400 status if the refresh token is missing or invalid,
 * or a 500 status for server-related errors.
 *
 * @param {Request} req - The request object containing the refresh token in the query parameters.
 * @param {Response} res - The response object used to send back the refreshed token or error message.
 * @returns {Promise<void>} - A promise that resolves when the response is sent to the client.
 */
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract refreshToken from query parameters
    const refreshToken = req.query.refreshToken as string;

    if (!refreshToken) {
      res.status(400).json({ message: "Refresh token is required" });
      return
    }

    // Call the tokenRefreshService with the extracted token
    const data = await tokenRefreshService(refreshToken);

    res.json({ message: "Token refreshed successfully", data });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Server error", error });
    }
  }
};
