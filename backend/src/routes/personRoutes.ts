import { Router } from 'express';
import * as personController from '../controllers/personController';

const router = Router();

router.get('/persons', personController.getPersons);
router.get('/persons/:id', personController.getPerson);
router.post('/persons', personController.createPerson);
router.put('/persons/:id', personController.updatePerson);
router.delete('/persons/:id', personController.deletePerson);

export default router;