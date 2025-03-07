import { Router } from 'express';
import { authenticateToken, authorizeRoleOrOwnership } from "../middleware/authMiddleware";
import { getCompetence, updateCompetence, getAvailability, updateAvailability, getApplication, upsertApplication} from '../controllers/profileController';

/**
 * This router handles competence-related endpoints.
 * - **GET /competence/:id**: Retrieves the competence data for a specific person by `id`, accessible only to authenticated users with the appropriate role or ownership via `authenticateToken` and `authorizeRoleOrOwnership` middleware.
 * - **GET /competence/**: Retrieves the competence data for the authenticated user, accessible only to authenticated users via `authenticateToken` middleware.
 * - **POST /competence/**: Updates the competence data for the authenticated user, accessible only to authenticated users via `authenticateToken` middleware.
 * 
 * The router ensures that only authorized users can access and modify competence-related data, enforcing proper authentication and authorization checks.
 */
const profileRouter = Router();

profileRouter.get('/competence/:id', authenticateToken, authorizeRoleOrOwnership, getCompetence);
profileRouter.get('/competence/', authenticateToken, getCompetence);
profileRouter.post('/competence/', authenticateToken, updateCompetence);
profileRouter.get('/availability/', authenticateToken, getAvailability);
profileRouter.post('/availability/', authenticateToken, updateAvailability);
profileRouter.get('/application/', authenticateToken, getApplication);
profileRouter.post('/application/', authenticateToken, upsertApplication);


export default profileRouter; 