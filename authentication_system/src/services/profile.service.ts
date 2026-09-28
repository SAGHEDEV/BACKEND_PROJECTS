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

const handleEditProfile = async ()=>{
    
}

export { handleFetchProfile }