import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

export interface AuthRequest extends Request {
  user?: any;
}

// Middleware to authenticate token
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.split(' ')[1];
  
  if (!token) {
    res.status(401).json({ message: 'Access denied. No token provided' });
    return;
  }

  try {
    // Try to verify the token and decode it
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded; // Attach the decoded token to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // Handle the specific error types:
    if (error instanceof TokenExpiredError) {
      // Token expired error
      res.status(401).json({ message: 'Token has expired. Please log in again.' });
    } else {
      // Invalid token or other errors
      res.status(401).json({ message: 'Invalid token. Access denied.' });
    }
  }
};

// Middleware to authorize based on user role and ownership
export const authorizeRoleOrOwnership = (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
): void => {
  const { role_id, userId } = req.user;  // Extract role and userId from the token

  console.log("Role ID:", role_id, "User ID:", userId);

  // Admins have full access
  if (role_id === 1) {
    return next();
  }

  // Get the user ID from either URL params or request body
  const resourceUserId = req.params.id || req.body.userId;

  console.log("Resource id", resourceUserId)

  if (!resourceUserId) {
    res.status(400).json({ message: "User ID is required" });
    return;
  }

  // Check if the authenticated user is trying to access their own resource
  if (userId != resourceUserId) {
    res.status(403).json({ message: "Access denied. You can only access your own resources" });
    return;
  }

  next();
};
