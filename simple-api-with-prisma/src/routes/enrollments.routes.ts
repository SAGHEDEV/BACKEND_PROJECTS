import { Router } from "express";
import { getAllEnrollmentsController, postEnrollmentController } from "../controllers/enrollments.controllers.js";

const enrollmentRoutes = Router();

enrollmentRoutes.post("/enrollments", postEnrollmentController);
enrollmentRoutes.get("/enrollments", getAllEnrollmentsController);

export default enrollmentRoutes;