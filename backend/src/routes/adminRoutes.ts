import { Router } from 'express';
import { authenticateToken, authorizeRoleOrOwnership } from "../middleware/authMiddleware";
import { getApplications, updateApplication } from '../controllers/adminController';

const adminRouter = Router();
adminRouter.get('/applications', authenticateToken, authorizeRoleOrOwnership, getApplications);
adminRouter.post('/applications', authenticateToken, authorizeRoleOrOwnership, updateApplication);

export default adminRouter;