import { Router } from 'express';
import { register, login, reset, resetByEmail, refreshToken } from '../controllers/accountController';
import { authenticateToken, authorizeRoleOrOwnership } from "../middleware/authMiddleware";
const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/refresh', refreshToken);
router.post('/reset', authenticateToken, reset);
router.post('/resetbyemail', resetByEmail);

export default router;