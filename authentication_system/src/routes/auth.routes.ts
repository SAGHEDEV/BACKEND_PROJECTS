import { Router } from "express";
import { loginUserController, logoutUserController, refreshUserTokenController, registerUserController } from "../controllers/auth.controllers.js";
import { authenticate } from "../middleware/auth.middleware.js";

const authRoute = Router();

authRoute.post("/auth/register", registerUserController);
authRoute.post("/auth/login", loginUserController);
authRoute.post("/auth/refresh", refreshUserTokenController);
authRoute.post("/auth/logout", authenticate, logoutUserController)

export default authRoute;