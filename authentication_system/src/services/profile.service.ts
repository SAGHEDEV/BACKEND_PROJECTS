import db from "../config/database.js";
import { AppError } from "../middleware/error.middleware.js";
import type { User } from "../types/index.js";

const handleFetchProfile = async ({ id }: { id?: number }) => {
    if (!id) {
        throw new AppError("Unauthorized to view users profile", 401);
    }
    const query = `SELECT * FROM users WHERE id = ?`;
    const [rows] = await db.query(query, [id]);

    if ((rows as User[]).length === 0) {
        throw new AppError("This profile or user was not found!", 404)
    }

    const user = (rows as User[])[0];
    const userDetails = {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        createdAt: user?.createdAt,
        updatedAt: user?.updatedAt,
        statu: user?.status,
        role: user?.role
    }

    return {
        message: "User profile fetched successfully!",
        success: true,
        data: {
            user: userDetails
        }
    }
}

const handleEditProfile = async (id: number, name: string) => {
    if (!id) {
        throw new AppError("User not found!", 404);
    }

    const query = `SELECT * FROM users WHERE id = ?`
    const [rows] = await db.query(query, [id]);

    if ((rows as User[]).length === 0) {
        throw new AppError("This profile or user was not found!", 404)
    }

    const [result] = await db.execute(`UPDATE user SET name = ?`, [name]);

    const updatedValue = result as unknown as { affectedRow: number };

    if (updatedValue.affectedRow === 0) {
        throw new AppError("User not found!", 404)
    }

    const latestValueQuery = `SELECT id, name, email, createdAt, updatedAt, role FROM users WHERE id = ?`
    const [latestValueRows] = await db.query(latestValueQuery, [id]);

    const userObject = (latestValueRows as Omit<User, "password">[])[0]

    return {
        message: "User details updated successfully!",
        success: true,
        data: {
            user: userObject
        }
    }

}

const handleDeleteAccount = async (id: number) => {
    if (!id) {
        throw new AppError("User not found!", 404);
    }

    const query = `SELECT * FROM users WHERE id = ?`
    const [rows] = await db.query(query, [id]);

    if ((rows as User[]).length === 0) {
        throw new AppError("This profile or user was not found!", 404)
    }

    const [result] = await db.execute(`DELETE FROM user WHERE id = ?`, [id]);

    const affectedRow = (result as unknown as { affectedRows: number }).affectedRows;

    if (!affectedRow) {
        throw new AppError("User not found!", 404);
    }

    return {
        message: "Account successfully deleted!",
        success: true
    }
}

export { handleFetchProfile, handleEditProfile, handleDeleteAccount }