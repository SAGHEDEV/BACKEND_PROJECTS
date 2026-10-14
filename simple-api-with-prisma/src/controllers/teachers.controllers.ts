import type { Request, Response } from "express"
import { handleCreateTeacher, handleGetAllTeacherCourses, handleGetAllTeachers, handleGetTeacherById } from "../services/teachers.services.js"

const getAllTeachersController = async (req: Request, res: Response) => {
    const { limit, page, search } = req.query as { limit: string, page: string, search: string }
    const response = await handleGetAllTeachers({ limit: limit ? parseInt(limit) : 10, page: page ? parseInt(page) : 1, search: search ? search : "" })
    res.status(200).json(response)
}

const getTeacherByIdController = async (req: Request, res: Response) => {
    const { id } = req.params
    const response = await handleGetTeacherById(parseInt(id as string))
    res.status(200).json(response)
}

const getAllTeacherCoursesController = async (req: Request, res: Response) => {
    const { id } = req.params
    const { limit, page } = req.query as { limit: string, page: string }
    const response = await handleGetAllTeacherCourses(parseInt(id as string), { limit: parseInt(limit), page: parseInt(page) })
    res.status(200).json(response)
}

const postTeacherController = async (req: Request, res: Response) => {
    const { name, email } = req.body;
    const response = await handleCreateTeacher({ name, email });
    res.status(201).json(response)
}

export { getAllTeachersController, getTeacherByIdController, getAllTeacherCoursesController, postTeacherController }