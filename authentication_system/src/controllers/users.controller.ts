import type { Request, Response } from "express";
import { handleCreateNewUser, handleGetAllUsers } from "../services/users.services.js";

const getAllUsersController = async (req: Request, res: Response) => {
    const { limit, page, search } = req.query as { limit: string, page: string, search: string };
    const response = await handleGetAllUsers({
        limit: limit ? parseInt(limit) : 10,
        page: page ? parseInt(page) : 1,
        search: search,
    })
    res.status(200).json(response)
}

const createUserController = async (req: Request, res: Response) => {
    const payload = req.body;
    const response = await handleCreateNewUser({ ...payload });
    res.status(201).json(response)
}

export { getAllUsersController, createUserController }