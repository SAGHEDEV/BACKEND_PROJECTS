import { Router } from "express";
import { authenticate, authorizePermission, authorizeRoles } from "../middleware/auth.middleware.js";
import { createUserController, getAllUsersController } from "../controllers/users.controller.js";

const usersRoutes = Router();

usersRoutes.get("/users", authenticate, authorizeRoles("admin"), getAllUsersController)
usersRoutes.post("/users", authenticate, authorizePermission("users.create"), createUserController)


export default usersRoutes;