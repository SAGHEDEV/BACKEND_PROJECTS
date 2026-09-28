import type { Request, Response } from "express";
import { handleGenerateNewToken, handleLoginUser, handleLogoutUser, handleRegisterUser, handleVerifyUserToken } from "../services/auth.service.js";

const registerUserController = async (req: Request, res: Response) => {
    const payload = req.body;
    const response = await handleRegisterUser({ user: payload });
    res.status(200).json(response);
}

const loginUserController = async (req: Request, res: Response) => {
    const payload = req.body;
    const response = await handleLoginUser({ ...payload });
    res.status(200).json(response);
}

const refreshUserTokenController = async (req: Request, res: Response) => {
    const payload = req.body;
    const response = await handleGenerateNewToken({ ...payload });
    res.status(200).json(response);
}

const verifyUsertokenController = async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];
    const response = await handleVerifyUserToken({ token: token! });
    res.status(200).json(response);
}

const logoutUserController = async (req: Request, res: Response) => {
    const payload = req.body;
    const response = await handleLogoutUser({ userId: req.user?.id!, refreshToken: payload.token });
    res.status(204).json(response);
}
export { registerUserController, loginUserController, refreshUserTokenController, verifyUsertokenController, logoutUserController }