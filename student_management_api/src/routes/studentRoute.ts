import { Router } from "express";
import { createUserController, deleteMultipleUserController, deleteUserController, getSingleUserController, getUserController, updateUserController } from "../controllers/studentsController.ts";

const router = Router();

router.get('/students', getUserController);
router.get('/students/:id', getSingleUserController);
router.post('/students', createUserController);
router.put('/students/:id', updateUserController);
router.delete('/students/:id', deleteUserController);
router.post('/students/bulk-delete', deleteMultipleUserController);

export default router;