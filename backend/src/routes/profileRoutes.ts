import { Router } from 'express';
import { authenticateToken, authorizeRoleOrOwnership } from "../middleware/authMiddleware";
import { getCompetence, updateCompetence } from '../controllers/profileController';

const router = Router();

router.get('/competence/:id', authenticateToken, authorizeRoleOrOwnership, getCompetence);
router.get('/competence/', authenticateToken, getCompetence);
router.post('/competence/', authenticateToken, updateCompetence);

export default router; 