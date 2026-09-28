import db from "../config/database.js"
import { AppError } from "../middleware/error.middleware.js";
import type { User } from "../types/index.js";
import bcrypt from "bcrypt"


const handleGetAllUsers = async ({ limit, page, search }: { limit: number, page: number, search: string }) => {
    const conditions: string[] = ["role = ?"];
    const values: (string | number)[] = [];

    values.push("user");

    if (search) {
        conditions.push(
            `(name LIKE ? OR email LIKE ?)`
        );

        const searchValue = `%${search}%`;

        values.push(
            searchValue,
            searchValue,
        );
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const offSet = (page - 1) * limit;

    values.push(limit, offSet);

    const [rows] = await db.query(`SELECT id, name, email, status, createdAt, updatedAt FROM users ${whereClause} LIMIT ? OFFSET ?`, values);

    const userObjects = (rows as User[]);

     const countQuery = `
        SELECT COUNT(*) AS total
        FROM users
        ${whereClause}
    `;

    const [countRows] = await db.query(countQuery, values);
    const total = (countRows as { total: number }[])[0]?.total ?? 0;

    return {
        message: "All users retrieved successfully!",
        success: true,
        data: {
            users: userObjects,
            total: total,
            limit: limit,
            page: page
        }
    }
}
const handleGetAllAdmins = async ({ limit, page, search }: { limit: number, page: number, search: string }) => {
    const conditions: string[] = [];
    const values: (string | number)[] = [];

    if (search) {
        conditions.push(
            `(title LIKE ? OR isbn LIKE ? OR category LIKE ?)`
        );

        const searchValue = `%${search}%`;

        values.push(
            searchValue,
            searchValue,
            searchValue
        );
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const offSet = (page - 1) * limit;

    values.push(limit, offSet);

    const [rows] = await db.query(`SELECT id, name, email, status, createdAt, updatedAt FROM users ${whereClause} AND role = 'admin' LIMIT ? OFFSET ?`, values);

    const userObjects = (rows as User[]);
    return {
        message: "All users retrieved successfully!",
        success: true,
        data: {
            users: userObjects
        }
    }
}

const handleCreateNewUser = async ({ name, email, role, password }: { name: string; email: string; role: string; password: string; }) => {
    if (!name || !email || !password) {
        throw new AppError("Fields cannot be empty!", 422);
    }
    const currentDate = new Date()

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

    const values = [name, email, hashPassword, role, "active"];

    const [result] = await db.execute(`INSERT INTO users VALUES (name, email, password, role, status)`, values);

    const affectedRows = (result as unknown as { affectedRows: number, insertId: number }).affectedRows;
    const createdUserId = (result as unknown as { affectedRows: number, insertId: number }).insertId;

    if(!affectedRows){
        throw new AppError("Error occurred while creating user", 403)
    }

    const createdUser: Omit<User, "password"> = {
        id: createdUserId,
        name: name,
        email: email,
        role: role as User["role"],
        createdAt: currentDate,
        updatedAt: currentDate,
        status: "active"
    }

    return {
        message: "User created successfully!",
        success: true,
        data: {
            user: createdUser
        }
    }
}


export { handleGetAllUsers, handleGetAllAdmins, handleCreateNewUser }