import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { deleteProfileController, getProfileController, updateProfileController } from "../controllers/profile.controller.js";

const profileRoute = Router();

profileRoute.get("/users/me", authenticate, getProfileController)
profileRoute.patch("/users/me", authenticate, updateProfileController)
profileRoute.delete("/users/me", authenticate, deleteProfileController)

export default profileRoute;