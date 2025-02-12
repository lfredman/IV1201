import { Router } from 'express';
import { register, login, refreshToken } from '../controllers/accountController';
const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/refresh', refreshToken);

export default router;