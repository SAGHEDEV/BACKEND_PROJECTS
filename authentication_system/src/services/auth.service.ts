import db from "../config/database.js";
import { AppError } from "../middleware/error.middleware.js";
import type { LoginResponse, User } from "../types/index.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET_TOKEN;
const REFRESH_SECRET_TOKEN = process.env.REFRESH_SECRET_TOKEN;

if (!JWT_SECRET || !REFRESH_SECRET_TOKEN) {
    throw new Error("JWT_SECRET_TOKEN is not configured");
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
    const token = jwt.sign({ sub: id, role: role }, REFRESH_SECRET_TOKEN);
    return token
}

const handleCheckUserExistence = async ({ id, email }: { id?: number, email?: string }): Promise<Boolean> => {
    let query: string = "";
    let value: string | number = "";

    if (email !== undefined) {
        query = `SELECT id FROM user WHERE id = ?`;
        value = email;
    } else if (id !== undefined) {
        query = `SELECT id FROM user WHERE name = ?`;
        value = id;
    } else {
        return false;
    }
    const [rows] = await db.query(query, value);

    return (rows as User[]).length > 0
}

const handleRegisterUser = async ({ user }: { user: Omit<User, 'id' | 'createdAt'> }) => {
    const checkUserExistence = await handleCheckUserExistence({ email: user?.email! })

    if (checkUserExistence) {
        throw new AppError(`A user with the email ${user.email} already exist!`, 403)
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(user.password, salt);
    const query = "INSERT INTO user (name, email, password, role) VALUES (?, ?, ?, ?)";

    const values = [user.name, user.email, hashPassword, user.role];

    const [result] = await db.execute(query, values as any);

    const insertResult = result as { insertId: number };
    const createdUser: Omit<User, 'password'> = {
        id: insertResult.insertId,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: new Date()
    };
    return {
        message: "Registration successful! User account created!",
        success: true,
        data: createdUser
    }
}

const handleLoginUser = async ({ email, password }: { email: string; password: string }): Promise<LoginResponse> => {
    const query = "SELECT * FROM user WHERE email = ?";

    const checkUserExistence = await handleCheckUserExistence({ email: email! })
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
        user: safeUser,
        token: token
    }
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



const handleGenerateNewToken = ({ token }: { token: string }) => {
    const decodedValue = handleVerifyRefreshToken({ token: token });

    const new_token = handleGenerateRefreshToken({
        id: Number((decodedValue as jwt.JwtPayload).sub),
        role: String((decodedValue as jwt.JwtPayload).role)
    });

    return {
        message: "Toekn refreshed successfully!",
        success: true,
        token: new_token,
    }
}

export { handleCheckUserExistence, handleGenerateNewToken, handleLoginUser, handleRegisterUser, handleVerifyUserToken }