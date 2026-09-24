import db from "../config/database.js";
import { AppError } from "../middleware/error.middleware.js";
import type { GenericResponse, LoginResponse, RefreshToken, RegisterUserResponse, User } from "../types/index.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET_TOKEN;
const REFRESH_SECRET_TOKEN = process.env.REFRESH_SECRET_TOKEN;

if (!JWT_SECRET || !REFRESH_SECRET_TOKEN) {
    throw new Error("JWT_SECRET_TOKEN is not configured");
}

function getFutureDate(daysAhead: number = 7) {
    const date = new Date();
    date.setDate(date.getDate() + daysAhead);
    return date;
}

const handleGenerateJWTToken = ({ id, role }: { id: number, role: string }): string => {
    const token = jwt.sign(
        {
            sub: id,
            role: role
        },
        JWT_SECRET,
        {
            expiresIn: "15m"
        }
    );
    return token
}

const handleGenerateRefreshToken = ({ id, role }: { id: number, role: string }): string => {
    const token = jwt.sign({ sub: id, role: role }, REFRESH_SECRET_TOKEN, { expiresIn: "7d" });
    return token
}

const handleCheckUserExistence = async ({ id, email }: { id?: number, email?: string }): Promise<Boolean> => {
    let query: string = "";
    let value: string | number = "";

    if (email !== undefined) {
        query = `SELECT id FROM users WHERE email = ?`;
        value = email;
    } else if (id !== undefined) {
        query = `SELECT id FROM users WHERE id = ?`;
        value = id;
    } else {
        return false;
    }
    const [rows] = await db.query(query, value);
    console.log(rows)
    return (rows as User[]).length > 0
}

const handleVerifyUserToken = ({ token }: { token?: string }) => {
    if (!token) {
        throw new AppError("User is unauthorized!", 401);
    }
    const decoded = jwt.verify(token, String(process.env.JWT_SECRET_TOKEN));

    if (!decoded) {
        throw new AppError("Unauthorized request!", 401);
    }

    return decoded
}

const handleVerifyRefreshToken = ({ token }: { token?: string }) => {
    if (!token) {
        throw new AppError("User is unauthorized!", 401);
    }
    const decoded = jwt.verify(token, String(process.env.REFRESH_SECRET_TOKEN));

    if (!decoded) {
        throw new AppError("Unauthorized request!", 401);
    }

    return decoded
}

const handleRegisterUser = async ({ user }: { user: Omit<User, 'id' | 'createdAt' | 'role'> }): Promise<RegisterUserResponse> => {
    const checkUserExistence = await handleCheckUserExistence({ email: user?.email! })

    if (checkUserExistence) {
        throw new AppError(`A user with the email ${user.email} already exist!`, 403)
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(user.password, salt);
    const query = "INSERT INTO user (name, email, password, role) VALUES (?, ?, ?, ?)";

    const values = [user.name, user.email, hashPassword, "user"];

    const [result] = await db.execute(query, values as any);

    const insertResult = result as { insertId: number };
    const createdUser: Omit<User, 'password'> = {
        id: insertResult.insertId,
        name: user.name,
        email: user.email,
        role: "user",
        createdAt: new Date()
    };
    return {
        message: "Registration successful! User account created!",
        success: true,
        data: { user: createdUser }
    }
}

const handleLoginUser = async ({ email, password }: { email: string; password: string }): Promise<LoginResponse> => {
    const query = "SELECT * FROM users WHERE email = ?";

    const checkUserExistence = await handleCheckUserExistence({ email: email! })
    console.log(email, password, checkUserExistence)
    if (!checkUserExistence) {
        throw new AppError(`User not found!`, 404)
    }

    const [rows] = await db.query(query, [email]);
    const userRetrieved = (rows as User[])[0] as User;

    const correctPassword = await bcrypt.compare(password, userRetrieved.password)

    if (!correctPassword) {
        throw new AppError("Invalid email or password!", 401)
    }

    const token = handleGenerateJWTToken({ id: userRetrieved.id, role: userRetrieved.role });
    const refresh_token = handleGenerateRefreshToken({ id: userRetrieved.id, role: userRetrieved.role })

    await db.execute(
        `
    INSERT INTO refresh_tokens
    (user_id, token, expires_at)
    VALUES (?, ?, ?)
    `,
        [userRetrieved.id, refresh_token, getFutureDate(7)]
    );

    const safeUser = {
        id: userRetrieved.id,
        name: userRetrieved.name,
        email: userRetrieved.email,
        role: userRetrieved.role,
        createdAt: userRetrieved.createdAt
    };

    return {
        message: "Login successful!",
        success: true,
        data: {
            user: safeUser,
            token: token,
            refresh_token: refresh_token,
        }
    }
}

const handleLogoutUser = async ({ userId, refreshToken }: { userId: number; refreshToken: string }): Promise<GenericResponse> => {
    const query = `UPDATE refresh_tokens SET revoked_at = NOW() WHERE token = ? AND user_id = ? AND revoked_at is NULL`;
    const values = [refreshToken, userId];

    const [result] = await db.execute(query, values);

    const updatedResult = result as { affectedRows: number };

    if (updatedResult.affectedRows === 0) {
        throw new AppError("Refresh token not found or already revoked!", 404)
    }

    return {
        message: "Logout successful!",
        success: true
    }
}

const handleGenerateNewToken = async ({ token }: { token: string }): Promise<GenericResponse & { token: string, refresh_token: string }> => {
    const decodedValue = handleVerifyRefreshToken({ token: token });
    const user_value = {
        id: Number((decodedValue as jwt.JwtPayload).sub),
        role: String((decodedValue as jwt.JwtPayload).role)
    }

    const userExistence = handleCheckUserExistence({ id: user_value.id });

    if (!userExistence) {
        throw new AppError("User not found!", 404)
    }

    const query = `SELECT * FROM refresh_tokens where token = ? AND revoked_at is NULL`;

    const [rows] = await db.query(query, [token]);

    if ((rows as RefreshToken[]).length === 0) {
        throw new AppError("Invalid or revoked refresh token", 401);
    }

    const new_token = handleGenerateJWTToken(user_value)
    const new_refresh_token = handleGenerateRefreshToken(user_value);

    const revoke_query = `UPDATE refresh_tokens SET revoked_at = NOW() WHERE token = ? AND user_id = ? AND revoked_at is NULL`;
    const revoke_values = [token, user_value.id];

    const [result] = await db.execute(revoke_query, revoke_values);

    const updatedResult = result as { affectedRows: number };

    if (updatedResult.affectedRows === 0) {
        throw new AppError("Refresh token not found or already revoked!", 404)
    }

    return {
        message: "Token refreshed successfully!",
        success: true,
        token: new_token,
        refresh_token: new_refresh_token,
    }
}

export { handleCheckUserExistence, handleGenerateNewToken, handleLoginUser, handleRegisterUser, handleVerifyUserToken, handleLogoutUser }