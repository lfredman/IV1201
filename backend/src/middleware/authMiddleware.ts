import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

interface AuthRequest extends Request {
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
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attaching decoded token to the request object for later use
    next(); // Continue to the next middleware/route handler
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to authorize based on user role and ownership
export const authorizeRoleOrOwnership = (req: AuthRequest, res: Response, next: NextFunction): void => {
  console.log(req)
  const { role_id, userId } = req.user;  // Extract role and userId from the decoded token
  console.log(role_id, userId)
  // Case 1: Admin role (role_id = 1) - Admins have access to all resources
  if (role_id === 1) {
    return next(); // Admin can access everything, proceed to the next middleware/route handler
  }

  // Case 2: Non-admin user - Must check if the user is trying to access their own resource
  const resourceUserId = req.params.userId;  // Assuming userId is passed as part of the URL parameter

  if (userId !== resourceUserId) {
    res.status(403).json({ message: 'Access denied. You can only access your own resources' });
    return;
  }

  // If the userId matches the resource's userId, proceed to the next middleware/route handler
  next();
};
