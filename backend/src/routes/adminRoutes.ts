import { Router } from 'express';
import { authenticateToken, authorizeRoleOrOwnership } from "../middleware/authMiddleware";
import { getApplications, updateApplication } from '../controllers/adminController';

/**
 * This router handles application-related endpoints.
 * - **GET /applications**: Retrieves the list of applications, accessible only to authenticated users with the appropriate role or ownership via `authenticateToken` and `authorizeRoleOrOwnership` middleware.
 * - **POST /applications**: Updates an existing application, accessible only to authenticated users with the appropriate role or ownership via `authenticateToken` and `authorizeRoleOrOwnership` middleware.
 * 
 * The router ensures that only authorized users can access and modify application-related data, enforcing proper authentication and authorization checks.
 */
const adminRouter = Router();
adminRouter.get('/applications', authenticateToken, authorizeRoleOrOwnership, getApplications);
adminRouter.post('/applications', authenticateToken, authorizeRoleOrOwnership, updateApplication);

export default adminRouter;