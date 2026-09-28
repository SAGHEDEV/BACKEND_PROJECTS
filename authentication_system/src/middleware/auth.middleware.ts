import type { NextFunction, Request, Response } from "express";
import { handleVerifyUserToken } from "../services/auth.service.js";
import jwt from "jsonwebtoken";
import { AppError } from "./error.middleware.js";
import type { User } from "../types/index.js";

const rolePermissions: Record<User["role"], string[]> = {
    user: [
        "profile.read",
        "profile.update",
        "password.change"
    ],

    admin: [
        "profile.read",
        "profile.update",
        "users.create",
        "users.read",
        "users.update",
        "users.delete",
        "users.suspend",
        "users.change_role"
    ]
};

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        throw new AppError("Authentication required", 401);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        throw new AppError("Invalid authorization header", 401);
    }

    const decoded = handleVerifyUserToken({ token: token });
    const user_value = {
        id: Number((decoded as jwt.JwtPayload).sub),
        role: String((decoded as jwt.JwtPayload).role)
    };
    req.user = user_value as unknown as { id: number, role: User["role"] };
    next();
}

export const authorizeRoles = (...roles: User["role"][]) => {
    return (
        req: Request,
        _res: Response,
        next: NextFunction
    ) => {
        if (!req.user) {
            throw new AppError("Authentication required", 401);
        }

        if (!roles.includes(req.user.role)) {
            throw new AppError("User not authorized!", 403);
        }

        next();
    };
};

export const authorizePermission = (permission: string) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new AppError("Authentication required", 401);
        }
        if (!rolePermissions[req.user.role].includes(permission)) {
            throw new AppError("User not authorized!", 403);
        }
        next()
    }
}