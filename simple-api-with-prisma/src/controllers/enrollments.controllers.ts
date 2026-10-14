import type { Request, Response } from "express";
import { handleGetAllEnrollments, handleStudentEnrollment } from "../services/enrollments.services.js";

const postEnrollmentController = async (req: Request, res: Response) => {
    const { studentId, courseId } = req.body;
    const response = await handleStudentEnrollment(studentId, courseId);
    res.status(201).json(response)
}

const getAllEnrollmentsController = async (req: Request, res: Response) => {
    const { limit, page } = req.query as { limit: string, page: string }
    const response = await handleGetAllEnrollments({ limit: limit ? parseInt(limit) : 10, page: page ? parseInt(page) : 1 })
    res.status(200).json(response)
}

export { postEnrollmentController, getAllEnrollmentsController }