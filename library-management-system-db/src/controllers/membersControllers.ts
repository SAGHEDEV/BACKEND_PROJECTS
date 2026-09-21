import type { Request, Response } from "express";
import { handleAddMember, handleDeleteMember, handleGetAllMemberBorrowings, handleGetAllMembers, handleGetMemberById, handleUpdateMember } from "../services/membersServices.js";

const getMembersController = async (req: Request, res: Response) => {
    const { limit, page } = req.query as { limit?: string; page?: string };
    const response = await handleGetAllMembers({
        limit: limit ? parseInt(limit) : 10,
        page: page ? parseInt(page) : 1,
    });
    res.status(200).json(response);
}

const getMemberByIdController = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const response = await handleGetMemberById(id);
    res.status(200).json(response);
}

const postMemberController = async (req: Request, res: Response) => {
    const payload = req.body;
    const response = await handleAddMember(payload);
    res.status(201).json(response);
}

const updateMemberController = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const payload = req.body;
    const response = await handleUpdateMember(id, payload);
    res.status(200).json(response);
}

const deleteMemberController = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const response = await handleDeleteMember(id);
    res.status(204).json(response);
}

const getMemberBorrowingsController = async (req: Request, res: Response) => {
    const { limit, page } = req.query as { limit?: string; page?: string };
    const memberId = parseInt(req.params.id as string);
    const response = await handleGetAllMemberBorrowings({
        id: memberId,
        limit: limit ? parseInt(limit) : 10,
        page: page ? parseInt(page) : 1,
    });
    res.status(200).json(response);
}

export { getMembersController, getMemberByIdController, getMemberBorrowingsController, postMemberController, updateMemberController, deleteMemberController }