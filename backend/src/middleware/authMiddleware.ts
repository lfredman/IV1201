import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
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
    const decoded = jwt.verify(token, JWT_SECRET)  as JwtPayload;;
    req.user = decoded; // Attaching decoded token to the request object for later use
    //console.log("AUTHENTICATED: ", decoded)
    next(); // Continue to the next middleware/route handler
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
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
