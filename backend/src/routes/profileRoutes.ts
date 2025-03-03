import { Router } from 'express';
import { authenticateToken, authorizeRoleOrOwnership } from "../middleware/authMiddleware";
import { getCompetence, updateCompetence } from '../controllers/profileController';

const profileRouter = Router();

profileRouter.get('/competence/:id', authenticateToken, authorizeRoleOrOwnership, getCompetence);
profileRouter.get('/competence/', authenticateToken, getCompetence);
profileRouter.post('/competence/', authenticateToken, updateCompetence);

export default profileRouter; 