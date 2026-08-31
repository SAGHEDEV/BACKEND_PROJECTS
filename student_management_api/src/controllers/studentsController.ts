import { handleBultDelete, handleCreateStudent, handleDeleteStudent, handleGetStudents, handleGetSungleUser, handleUpdateStudent } from "../services/studentsService.js";
import type { Request, Response } from "express";
import logRequests from "../middleware/logger.ts";
import handleErrorRequests from "../middleware/errorHandler.ts";

const getUserController = (req: Request, res: Response) => {
    logRequests(req, res);
    try {

        const result = handleGetStudents({
            limit: req.query?.limit as unknown as string | number,
            page: req.query?.page as unknown as string | number,
        });
        res.status(200).json(result);
    }
    catch (err) {
        handleErrorRequests(err as Error, res);
    }
}

const getSingleUserController = (req: Request, res: Response) => {
    logRequests(req, res);
    try {
        const result = handleGetSungleUser(req.params.id as string);
        res.status(200).json(result);
    }
    catch (err) {
        handleErrorRequests(err as Error, res);
    }
}

const createUserController = (req: Request, res: Response) => {
    logRequests(req, res);
    try {
        const studentBody = req.body;
        const result = handleCreateStudent(studentBody);
        res.status(201).json(result);
    }
    catch (err) {
        handleErrorRequests(err as Error, res);
    }
}

const updateUserController = (req: Request, res: Response) => {
    logRequests(req, res);
    try {
        const studentBody = req.body;
        const result = handleUpdateStudent(req.params.id as string, studentBody);
        res.status(200).json(result);
    }
    catch (err) {
        handleErrorRequests(err as Error, res);
    }
}

const deleteUserController = (req: Request, res: Response) => {
    logRequests(req, res);
    try {
        const result = handleDeleteStudent(req.params.id as string);
        res.status(200).json(result);
    }
    catch (err) {
        handleErrorRequests(err as Error, res);
    }
}

const deleteMultipleUserController = (req: Request, res: Response) => {
    logRequests(req, res);
    try {
        const { ids } = req.body;
        const result = handleBultDelete(ids);
        res.status(200).json(result);
    }
    catch (err) {
        handleErrorRequests(err as Error, res);
    }
}

export { getUserController, getSingleUserController, createUserController, updateUserController, deleteUserController, deleteMultipleUserController }