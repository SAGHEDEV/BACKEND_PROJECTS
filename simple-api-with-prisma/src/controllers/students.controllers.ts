import type { Request, Response } from "express"
import { handleCreateStudent, handleDeleteStudent, handleGetAllStudentEnrollments, handleGetAllStudents, handleGetStudentById, handleUpdateStudent } from "../services/students.services.js"

const getAllStudentsController = async (req: Request, res: Response) => {
    const { limit, page, search } = req.query as { limit: string, page: string, search: string }
    const response = await handleGetAllStudents({ limit: limit ? parseInt(limit) : 10, page: page ? parseInt(page) : 1, search: search ? search : "" })
    res.status(200).json(response)
}

const getStudentByIdController = async (req: Request, res: Response) => {
    const { id } = req.params
    const response = await handleGetStudentById(parseInt(id as string))
    res.status(200).json(response)
}

const getAllStudentEnrollmentsController = async (req: Request, res: Response) => {
    const { id } = req.params
    const { status } = req.query as { status?: string }
    const response = await handleGetAllStudentEnrollments(parseInt(id as string), status)
    res.status(200).json(response)
}

const postStudentController = async (req: Request, res: Response) => {
    const { name, email } = req.body;
    const response = await handleCreateStudent({ name, email });
    res.status(201).json(response)
}

const patchStudentController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;
    const response = await handleUpdateStudent(parseInt(id as string), { name });
    res.status(200).json(response)
}

const deleteStudentController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const response = await handleDeleteStudent(parseInt(id as string));
    res.status(200).json(response)
}

export { getAllStudentsController, getStudentByIdController, getAllStudentEnrollmentsController, postStudentController, patchStudentController, deleteStudentController }