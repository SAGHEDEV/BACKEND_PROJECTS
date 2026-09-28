import type { Request, Response } from "express";
import { handleGetAllUsers } from "../services/users.services.js";

const getAllUsersController = async (req: Request, res: Response) => {
    const { limit, page, search } = req.query as { limit: string, page: string, search: string };
    const response = await handleGetAllUsers({
        limit: limit ? parseInt(limit) : 10,
        page: page ? parseInt(page) : 1,
        search: search,
    })
    res.status(200).json(response)
}

// const deleteAnyUserController = async (req: Request, res: Response)=>{
//     const idToDelete = req.params.id;
//     const response = handleDe
// }

export { getAllUsersController }