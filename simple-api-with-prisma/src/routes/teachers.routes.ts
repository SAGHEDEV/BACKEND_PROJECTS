import { Router } from "express";
import { getAllTeacherCoursesController, getAllTeachersController, getTeacherByIdController, postTeacherController, } from "../controllers/teachers.controllers.js";

const teachersRoutes = Router();

teachersRoutes.get("/", getAllTeachersController);
teachersRoutes.get("/:id", getTeacherByIdController);
teachersRoutes.get("/:id/courses", getAllTeacherCoursesController);
teachersRoutes.post("/", postTeacherController);

export default teachersRoutes;