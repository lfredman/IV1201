import { Router } from 'express';
import { authenticateToken, authorizeRoleOrOwnership } from "../middleware/authMiddleware";
import { getCompetence, updateCompetence } from '../controllers/profileController';

/**
 * This router handles competence-related endpoints.
 * - **GET /competence/:id**: Retrieves the competence data for a specific person by `id`, accessible only to authenticated users with the appropriate role or ownership via `authenticateToken` and `authorizeRoleOrOwnership` middleware.
 * - **GET /competence/**: Retrieves the competence data for the authenticated user, accessible only to authenticated users via `authenticateToken` middleware.
 * - **POST /competence/**: Updates the competence data for the authenticated user, accessible only to authenticated users via `authenticateToken` middleware.
 * 
 * The router ensures that only authorized users can access and modify competence-related data, enforcing proper authentication and authorization checks.
 */
const router = Router();

router.get('/competence/:id', authenticateToken, authorizeRoleOrOwnership, getCompetence);
router.get('/competence/', authenticateToken, getCompetence);
router.post('/competence/', authenticateToken, updateCompetence);

export default router; 