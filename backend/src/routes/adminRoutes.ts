import { Router } from 'express';
import { authenticateToken, authorizeRoleOrOwnership } from "../middleware/authMiddleware";
import { getUsers, getApplications, updateApplication } from '../controllers/adminController';

const router = Router();

router.get('/users', getUsers);
router.get('/applications', authenticateToken, authorizeRoleOrOwnership, getApplications);
router.post('/applications', authenticateToken, authorizeRoleOrOwnership, updateApplication);

export default router;