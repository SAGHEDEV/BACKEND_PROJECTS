import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { taskController } from './task.controller';

const router = Router();

router.use(authenticate);

router.post('/', taskController.create);
router.get('/', taskController.list);
router.get('/:id', taskController.get);
router.put('/:id', taskController.update);
router.patch('/:id/status', taskController.updateStatus);
router.delete('/:id', taskController.remove);

export default router;
