import { Router } from 'express';
import { register, login, reset, resetByEmail, refreshToken } from '../controllers/accountController';
import { authenticateToken, authorizeRoleOrOwnership } from "../middleware/authMiddleware";
import { validateRegister, validateLogin, validateEmail } from '../middleware/serverSideValidation';

const accountRouter = Router();

accountRouter.post('/register', validateRegister, register);
accountRouter.post('/login', validateLogin, login);
accountRouter.get('/refresh', refreshToken);
accountRouter.post('/reset', authenticateToken, reset);
accountRouter.post('/resetbyemail', validateEmail, resetByEmail);

export default accountRouter;