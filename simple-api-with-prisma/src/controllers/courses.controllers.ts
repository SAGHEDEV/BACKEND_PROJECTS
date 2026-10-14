import type { Request, Response } from "express"
import { handleCreateCourse, handleGetAllCourseEnrollment, handleGetAllCourses, handleGetCourseById } from "../services/courses.services.js"

const getAllCoursesController = async (req: Request, res: Response) => {
    const { limit, page, search } = req.query as { limit: string, page: string, search: string }
    const response = await handleGetAllCourses({ limit: limit ? parseInt(limit) : 10, page: page ? parseInt(page) : 1, search: search ? search : "" })
    res.status(200).json(response)
}

const getCourseByIdController = async (req: Request, res: Response) => {
    const { id } = req.params
    const response = await handleGetCourseById(parseInt(id as string))
    res.status(200).json(response)
}

const postCourseController = async (req: Request, res: Response) => {
    const { name, code, teacherId } = req.body;
    const response = await handleCreateCourse({ name, code, teacherId });
    res.status(201).json(response)
}

const getAllcoursesEnrollmentsController = async (req: Request, res: Response) => {
    const { id } = req.params
    const { limit, page } = req.query as { limit: string, page: string }
    const response = await handleGetAllCourseEnrollment({ courseId: parseInt(id as string), limit: parseInt(limit), page: parseInt(page) })
    res.status(200).json(response)
}

export { getAllCoursesController, getCourseByIdController, postCourseController, getAllcoursesEnrollmentsController }