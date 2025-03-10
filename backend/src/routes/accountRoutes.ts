import { Router } from 'express';
import { register, login, reset, resetByEmail, refreshToken } from '../controllers/accountController';
import { authenticateToken } from "../middleware/authMiddleware";
import { validateRegister, validateLogin, validateEmail } from '../middleware/serverSideValidation';

/**
 * This router handles the authentication and user management endpoints.
 * It includes routes for user registration, login, token refresh, and password reset operations.
 *
 * - **POST /register**: Registers a new user. It uses the `validateRegister` middleware for input validation.
 * - **POST /login**: Authenticates an existing user. It uses the `validateLogin` middleware for input validation.
 * - **GET /refresh**: Refreshes the access token using a valid refresh token. This route is for maintaining session integrity.
 * - **POST /reset**: Allows the user to reset their password. The route is protected by `authenticateToken` middleware to ensure the user is authenticated before proceeding.
 * - **POST /resetbyemail**: Initiates a password reset process via email. The email is validated using `validateEmail` middleware before triggering the reset process.
 * 
 * The router consolidates all authentication and user management routes, making it easier to manage authentication-related actions within a single API endpoint.
 */
const accountRouter = Router();

// Route for user registration with input validation through `validateRegister` middleware
accountRouter.post('/register', validateRegister, register);

// Route for user login with input validation through `validateLogin` middleware
accountRouter.post('/login', validateLogin, login);

// Route for refreshing the access token using a valid refresh token
accountRouter.get('/refresh', refreshToken);

// Route for password reset, protected by `authenticateToken` middleware to ensure only authenticated users can reset their password
accountRouter.post('/reset', authenticateToken, reset);

// Route to initiate password reset by email, with email validation through `validateEmail` middleware
accountRouter.post('/resetbyemail', validateEmail, resetByEmail);

export default accountRouter;
