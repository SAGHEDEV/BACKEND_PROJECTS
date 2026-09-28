import type { Request, Response } from "express";
import { handleDeleteAccount, handleEditProfile, handleFetchProfile } from "../services/profile.service.js";
import { AppError } from "../middleware/error.middleware.js";

const getProfileController = async (req: Request, res: Response) => {
    const userId = req.user?.id!;
    const response = await handleFetchProfile({ id: userId })
    res.status(200).json(response)
}

const updateProfileController = async (req: Request, res: Response) => {
    const userId = req.user?.id!;
    const payload = req.body;
    const response = await handleEditProfile(userId, payload.name);
    res.status(200).json(response)
}

const deleteProfileController = async (req: Request, res: Response) => {
    const userId = req.user?.id!;
    const response = await handleDeleteAccount(userId);
    res.status(200).json(response)
}

export { getProfileController, updateProfileController, deleteProfileController }