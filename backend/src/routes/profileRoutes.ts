import { Router } from 'express';
import { authenticateToken, authorizeRoleOrOwnership } from "../middleware/authMiddleware";
import { getCompetence, updateCompetence, getAvailability, updateAvailability, getApplication } from '../controllers/profileController';

const router = Router();

router.get('/competence/:id', authenticateToken, authorizeRoleOrOwnership, getCompetence);
router.get('/competence/', authenticateToken, getCompetence);
router.post('/competence/', authenticateToken, updateCompetence);
router.get('/availability/', authenticateToken, getAvailability);
router.post('/availability/', authenticateToken, updateAvailability);
router.get('/application/', authenticateToken, getApplication);
//router.post('/availability/', authenticateToken, updateAvailability);


export default router; 