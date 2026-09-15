import type { Request, Response } from "express";
import { handleAddMember, handleDeleteMember, handleGetAllMemberBorrowings, handleGetAllMembers, handleGetMemberById, handleUpdateMember } from "../services/membersServices.js";

const getMembersController = (req: Request, res: Response) => {
    const { limit, page } = req.query as { limit?: string; page?: string };
    const response = handleGetAllMembers({
        limit: limit ? parseInt(limit) : 10,
        page: page ? parseInt(page) : 1,
    });
    res.status(200).json(response);
}

const getMemberByIdController = (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const response = handleGetMemberById(id);
    res.status(200).json(response);
}

const postMemberController = (req: Request, res: Response) => {
    const payload = req.body;
    const response = handleAddMember(payload);
    res.status(201).json(response);
}

const updateMemberController = (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const payload = req.body;
    const response = handleUpdateMember(id, payload);
    res.status(200).json(response);
}

const deleteMemberController = (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const response = handleDeleteMember(id);
    res.status(200).json(response);
}

const getMemberBorrowingsController = (req: Request, res: Response) => {
    const { limit, page } = req.query as { limit?: string; page?: string };
    const memberId = parseInt(req.params.id as string);
    const response = handleGetAllMemberBorrowings({
        id: memberId,
        limit: limit ? parseInt(limit) : 10,
        page: page ? parseInt(page) : 1,
    });
    res.status(200).json(response);
}

export { getMembersController, getMemberByIdController, getMemberBorrowingsController, postMemberController, updateMemberController, deleteMemberController }