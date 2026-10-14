import { Router } from "express";
import { getAllCoursesController, getAllcoursesEnrollmentsController, getCourseByIdController, postCourseController } from "../controllers/courses.controllers.js";

const courseRoutes = Router();

courseRoutes.get("/courses", getAllCoursesController);
courseRoutes.get("/courses/:id", getCourseByIdController);
courseRoutes.get("/courses/:id/enrollments", getAllcoursesEnrollmentsController);
courseRoutes.post("/courses", postCourseController);

export default courseRoutes;