import { Router } from "express";
import { deleteStudentController, getAllStudentEnrollmentsController, postStudentController, getStudentByIdController, patchStudentController } from "../controllers/students.controllers.js";
import { getAllStudentsController } from "../controllers/students.controllers.js";

const studentRoutes = Router();

studentRoutes.get("/students", getAllStudentsController);
studentRoutes.get("/students/:id", getStudentByIdController);
studentRoutes.get("/students/:id/enrollments", getAllStudentEnrollmentsController);
studentRoutes.post("/students", postStudentController);
studentRoutes.patch("/students/:id", patchStudentController);
studentRoutes.delete("/students/:id", deleteStudentController);

export default studentRoutes;