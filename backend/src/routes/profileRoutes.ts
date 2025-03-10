import { Router } from 'express';
import { authenticateToken, authorizeRoleOrOwnership } from "../middleware/authMiddleware";
import { getCompetence, updateCompetence, getAvailability, updateAvailability, getApplication, upsertApplication } from '../controllers/profileController';

/**
 * This router handles endpoints related to a user's profile, including competence, availability, and application data.
 * It ensures that only authenticated users with the appropriate authorization can access or modify the profile data.
 * 
 * - **GET /competence/:id**: Retrieves the competence data for a specific person by their `id`. This route is protected and can only 
 *   be accessed by authenticated users with the appropriate role or ownership, controlled by `authenticateToken` and 
 *   `authorizeRoleOrOwnership` middleware.
 * 
 * - **GET /competence/**: Retrieves the competence data for the authenticated user. This route is accessible only by authenticated users
 *   via `authenticateToken` middleware.
 * 
 * - **POST /competence/**: Updates the competence data for the authenticated user. This route is protected and only accessible 
 *   by authenticated users via `authenticateToken` middleware.
 * 
 * - **GET /availability/**: Retrieves the availability data for the authenticated user. This route is also protected, accessible 
 *   only by authenticated users via `authenticateToken`.
 * 
 * - **POST /availability/**: Updates the availability data for the authenticated user. This route is protected and only accessible 
 *   by authenticated users via `authenticateToken`.
 * 
 * - **GET /application/**: Retrieves application data for the authenticated user. This route is protected and only accessible 
 *   by authenticated users via `authenticateToken`.
 * 
 * - **POST /application/**: Creates or updates an application for the authenticated user. This route is protected and only accessible 
 *   by authenticated users via `authenticateToken`.
 * 
 * This router enforces proper authentication and authorization to ensure that users can only access and modify their own profile data 
 * or data they have permission to access.
 */
const profileRouter = Router();

// Route to get competence data for a specific user by ID, with authorization checks
profileRouter.get('/competence/:id', authenticateToken, authorizeRoleOrOwnership, getCompetence);

// Route to get competence data for the authenticated user, with authentication check
profileRouter.get('/competence/', authenticateToken, getCompetence);

// Route to update the competence data for the authenticated user, with authentication check
profileRouter.post('/competence/', authenticateToken, updateCompetence);

// Route to get availability data for the authenticated user, with authentication check
profileRouter.get('/availability/', authenticateToken, getAvailability);

// Route to update availability data for the authenticated user, with authentication check
profileRouter.post('/availability/', authenticateToken, updateAvailability);

// Route to get application data for the authenticated user, with authentication check
profileRouter.get('/application/', authenticateToken, getApplication);

// Route to create or update application data for the authenticated user, with authentication check
profileRouter.post('/application/', authenticateToken, upsertApplication);

export default profileRouter;
