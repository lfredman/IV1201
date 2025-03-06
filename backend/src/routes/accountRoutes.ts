import { Router } from 'express';
import { register, login, reset, resetByEmail, refreshToken } from '../controllers/accountController';
import { authenticateToken, authorizeRoleOrOwnership } from "../middleware/authMiddleware";
import { validateRegister, validateLogin, validateEmail } from '../middleware/serverSideValidation';

/**
 * This router handles the authentication and user management endpoints.
 * - **POST /register**: Registers a new user, with input validation via `validateRegister`.
 * - **POST /login**: Logs in an existing user, with input validation via `validateLogin`.
 * - **GET /refresh**: Refreshes the access token using a valid refresh token.
 * - **POST /reset**: Resets the user's password, protected by the `authenticateToken` middleware to ensure the user is authenticated.
 * - **POST /resetbyemail**: Initiates a password reset process by email, with email validation via `validateEmail`.
 * 
 * The router organizes all authentication-related routes into a single API endpoint for easier management and routing.
 */
const accountRouter = Router();

accountRouter.post('/register', validateRegister, register);
accountRouter.post('/login', validateLogin, login);
accountRouter.get('/refresh', refreshToken);
accountRouter.post('/reset', authenticateToken, reset);
accountRouter.post('/resetbyemail', validateEmail, resetByEmail);

export default accountRouter;