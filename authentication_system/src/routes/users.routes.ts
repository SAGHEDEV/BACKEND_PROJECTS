import { Router } from "express";
import { authenticate, authorizeRoles } from "../middleware/auth.middleware.js";
import { getAllUsersController } from "../controllers/users.controller.js";

const usersRoutes = Router();

usersRoutes.get("/users", authenticate, authorizeRoles("admin"), getAllUsersController)


export default usersRoutes;