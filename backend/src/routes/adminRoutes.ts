import { Router } from 'express';
import { authenticateToken, authorizeRoleOrOwnership } from "../middleware/authMiddleware";
import { getApplications, updateApplication } from '../controllers/adminController';

/**
 * This router handles the application-related endpoints for admin users.
 * It provides routes to retrieve and update applications with proper authentication and authorization.
 *
 * - **GET /applications**: Retrieves the list of applications. This route is protected and can only be accessed by authenticated users 
 *   who have the appropriate role or ownership of the applications. The access is controlled through `authenticateToken` and 
 *   `authorizeRoleOrOwnership` middleware.
 * 
 * - **POST /applications**: Updates an existing application. This route is also protected, ensuring that only authenticated users with 
 *   the appropriate role or ownership can update application data. The access is controlled through `authenticateToken` and 
 *   `authorizeRoleOrOwnership` middleware.
 * 
 * The router enforces authentication and authorization for accessing and modifying application data to ensure that only 
 * authorized users can interact with this data.
 */
const adminRouter = Router();

// Route to get applications, with authentication and role/ownership-based authorization
adminRouter.get('/applications', authenticateToken, authorizeRoleOrOwnership, getApplications);

// Route to update an application, with authentication and role/ownership-based authorization
adminRouter.post('/applications', authenticateToken, authorizeRoleOrOwnership, updateApplication);

export default adminRouter;
