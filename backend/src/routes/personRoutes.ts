import { Router } from 'express';
import * as personController from '../controllers/personController';
import { register, login } from '../controllers/authController';
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.get('/persons', personController.getPersons);
router.get('/persons/:id', authenticateToken, personController.getPerson);
router.post('/persons', personController.createPerson);
router.put('/persons/:id', personController.updatePerson);
router.delete('/persons/:id', personController.deletePerson);


router.post('/register', register);
router.post('/login', login);


export default router;