import { Router } from 'express';
import { register, login, reset, resetByEmail } from '../controllers/accountController';
import { authenticateToken, authorizeRoleOrOwnership } from "../middleware/authMiddleware";
const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/reset', authenticateToken, reset);
router.post('/resetbyemail', resetByEmail);

export default router;