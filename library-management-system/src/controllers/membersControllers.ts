import type { Request, Response } from "express";
import { handleAddMember, handleDeleteMember, handleGetAllMemberBorrowings, handleGetAllMembers, handleGetMemberById, handleUpdateMember } from "../services/membersServices.js";

const getMembersController = (req: Request, res: Response) => {
    const { limit, page } = req.query as { limit?: string; page?: string };
    const response = handleGetAllMembers({
        limit: parseInt(limit as string),
        page: parseInt(page as string),
    });
    res.json(response).status(200);
}

const getMemberByIdController = (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const response = handleGetMemberById(id);
    res.json(response).status(200);
}

const postMemberController = (req: Request, res: Response) => {
    const payload = req.body;
    const response = handleAddMember(payload);
    res.json(response).status(201);
}

const updateMemberController = (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const payload = req.body;
    const response = handleUpdateMember(id, payload);
    res.json(response).status(200);
}

const deleteMemberController = (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const response = handleDeleteMember(id);
    res.json(response).status(200);
}

const getMemberBorrowingsController = (req: Request, res: Response) => {
    const { limit, page } = req.query as { limit?: string; page?: string };
    const memberId = parseInt(req.params.id as string);
    const response = handleGetAllMemberBorrowings({
        id: memberId,
        limit: parseInt(limit as string),
        page: parseInt(page as string),
    });
    res.json(response).status(200);
}

export { getMembersController, getMemberByIdController, getMemberBorrowingsController, postMemberController, updateMemberController, deleteMemberController }