import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

interface CustomJwtPayload extends JwtPayload {
  role_id: number;  // The role of the user (e.g., admin, user)
  userId: number;   // The ID of the user
}

/**
 * Interface that extends the Request object to include the user object 
 * after token verification is complete. This adds the `user` field 
 * to the `Request` object, which will contain the decoded JWT data.
 */
export interface AuthRequest extends Request {
  user?: CustomJwtPayload; // Optional user object after successful authentication
}

/**
 * Middleware function to authenticate the JWT token in the request.
 * It checks for the 'Authorization' header, extracts the token, verifies it,
 * and decodes it. If the token is valid, the decoded user information is added 
 * to the request object. If the token is missing or invalid, an error response 
 * is returned.
 * 
 * @param {AuthRequest} req - The request object, which may contain a JWT token in the 'Authorization' header.
 * @param {Response} res - The response object used to send error messages or proceed with the request.
 * @param {NextFunction} next - The next middleware or route handler to be called if authentication succeeds.
 * @returns {void} - The function either proceeds to the next middleware or returns an error response.
 */
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // Extract the token from the 'Authorization' header (e.g., "Bearer <token>")
  const token = req.header('Authorization')?.split(' ')[1];

  // If no token is found, return a 401 (Unauthorized) error
  if (!token) {
    res.status(401).json({ message: 'Access denied. No token provided' });
    return;
  }

  try {
    // Try to verify the token using the JWT_SECRET and decode it
    const decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;
    req.user = decoded; // Attach the decoded token to the request object (req.user)
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // Handle token expiration or invalid token errors
    if (error instanceof TokenExpiredError) {
      res.status(401).json({ message: 'Token has expired. Please log in again.' });
    } else {
      res.status(401).json({ message: 'Invalid token. Access denied.' });
    }
  }
};

/**
 * Middleware function to authorize access based on the user's role and ownership of the resource.
 * Admin users (role_id === 1) have full access to all resources. For non-admin users, the middleware checks 
 * whether the user is trying to access their own resource (identified by user ID in the URL params or request body).
 * If the user is unauthorized, a 403 (Forbidden) error is returned.
 * 
 * @param {AuthRequest} req - The request object containing user information (role_id, userId) and the resource to access.
 * @param {Response} res - The response object used to send error messages or proceed with the request.
 * @param {NextFunction} next - The next middleware or route handler to be called if authorization succeeds.
 * @returns {void} - The function either proceeds to the next middleware or returns an error response.
 */
export const authorizeRoleOrOwnership = (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
): void => {
  // Check if the user object is attached to the request (i.e., user is authenticated)
  if (!req.user) {
    res.status(401).json({ message: 'User not authenticated' });
    return;
  }

  const { role_id, userId } = req.user; // Extract the user's role and ID from the decoded token

  // Admins (role_id === 1) have full access to all resources
  if (role_id === 1) {
    return next(); // Allow access and move to the next middleware or route handler
  }

  // Get the resource user ID from the URL params or request body
  const resourceUserId = req.params.id || req.body.userId;

  if (!resourceUserId) {
    res.status(400).json({ message: "User ID is required" });
    return;
  }

  // Check if the authenticated user is trying to access their own resource
  if (userId !== resourceUserId) {
    res.status(403).json({ message: "Access denied. You can only access your own resources" });
    return;
  }

  // If the user is authorized, proceed to the next middleware or route handler
  next();
};
