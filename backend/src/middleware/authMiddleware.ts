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
export const authorizeRoleOrOwnership = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const { role_id, userId } = req.user;  // Extract role and userId from the decoded token
  // Case 1: Admin role (role_id = 1) - Admins have access to all resources
  if (role_id === 1) {
    return next(); // Admin can access everything, proceed to the next middleware/route handler
  }

  // Case 2: Non-admin user - Must check if the user is trying to access their own resource
  const resourceUserId = req.params.id;  // Assuming userId is passed as part of the URL parameter

  if (userId !== resourceUserId) {
    res.status(403).json({ message: 'Access denied. You can only access your own resources' });
    return;
  }

  // If the userId matches the resource's userId, proceed to the next middleware/route handler
  next();
};
