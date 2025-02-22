import { Router } from 'express';
import { register, login, reset, resetByEmail, refreshToken } from '../controllers/accountController';
import { authenticateToken, authorizeRoleOrOwnership } from "../middleware/authMiddleware";
import { validateRegister, validateLogin, validateEmail } from '../middleware/serverSideValidation';

const router = Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/refresh', refreshToken);
router.post('/reset', authenticateToken, reset);
router.post('/resetbyemail', validateEmail, resetByEmail);

export default router;