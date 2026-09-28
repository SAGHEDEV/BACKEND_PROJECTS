import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { getProfileController } from "../controllers/profile.controller.js";

const profileRoute = Router();

profileRoute.get("/users/me", authenticate, getProfileController)

export default profileRoute;