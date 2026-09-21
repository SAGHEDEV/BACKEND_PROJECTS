import db from "../config/database.js";
import { AppError } from "../middlewares/error.middleware.js";

const handleGetAllMembers = async ({ limit, page }: { limit: number; page: number }): Promise<GetAllMemberResponse> => {
    const offset = (page - 1) * limit;
    const [rows] = await db.query("SELECT * FROM Members LIMIT ? OFFSET ?", [limit, offset]);
    const [countRows] = await db.query("SELECT COUNT(*) AS total FROM Members");
    const data = rows as Member[];
    const total = (countRows as { total: number }[])[0]?.total ?? 0;

    return {
        message: "All members fetched successfully!",
        success: true,
        data,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
    }
}

const handleGetMemberById = async (id: number): Promise<Member> => {
    const [rows] = await db.query("SELECT * FROM Members WHERE id = ?", [id]);
    const member = (rows as Member[])[0];
    if (!member) {
        throw new AppError(`Member not found`, 404);
    }
    return member;
}

const handleAddMember = async (member: { name: string; email: string }): Promise<Member> => {
    const [existingRows] = await db.query("SELECT id FROM Members WHERE email = ?", [member.email]);
    if ((existingRows as unknown[]).length > 0) {
        throw new AppError(`Member with email ${member.email} already exists`, 400);
    }

    const [result] = await db.execute(
        "INSERT INTO Members (name, email) VALUES (?, ?)",
        [member.name, member.email]
    );

    return {
        id: (result as { insertId: number }).insertId,
        ...member
    };
}

const handleUpdateMember = async (id: number, updatedMember: Partial<Omit<Member, 'id'>>): Promise<Member> => {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (updatedMember.name !== undefined) {
        fields.push("name = ?");
        values.push(updatedMember.name);
    }
    if (updatedMember.email !== undefined) {
        const [existingRows] = await db.query(
            "SELECT id FROM Members WHERE email = ? AND id <> ?",
            [updatedMember.email, id]
        );
        if ((existingRows as unknown[]).length > 0) {
            throw new AppError(`Member with email ${updatedMember.email} already exists`, 400);
        }
        fields.push("email = ?");
        values.push(updatedMember.email);
    }
    if (fields.length === 0) {
        throw new AppError("No fields provided for update", 400);
    }

    values.push(id);
    const [result] = await db.execute(
        `UPDATE Members SET ${fields.join(", ")} WHERE id = ?`,
        values as any
    );
    if ((result as { affectedRows: number }).affectedRows === 0) {
        const [rows] = await db.query("SELECT id FROM Members WHERE id = ?", [id]);
        if ((rows as unknown[]).length === 0) {
            throw new AppError(`Member not found!`, 404);
        }
    }

    return handleGetMemberById(id);
}

const handleDeleteMember = async (id: number): Promise<Member> => {
    const member = await handleGetMemberById(id);
    const [result] = await db.execute("DELETE FROM Members WHERE id = ?", [id]);
    if ((result as { affectedRows: number }).affectedRows === 0) {
        throw new AppError(`Member with ID ${id} not found!`, 404);
    }
    return member;
}

const handleGetAllMemberBorrowings = async ({ id, limit, page }: { id: number; limit: number; page: number }): Promise<GetAllBorrowingResponse> => {
    const [memberRows] = await db.query("SELECT id FROM Members WHERE id = ?", [id]);
    if ((memberRows as unknown[]).length === 0) {
        throw new AppError(`Member not found`, 404);
    }

    const offset = (page - 1) * limit;
    const [rows] = await db.query(
        "SELECT * FROM Borrowings WHERE borrowerId = ? ORDER BY borrowedAt DESC LIMIT ? OFFSET ?",
        [id, limit, offset]
    );
    const [countRows] = await db.query(
        "SELECT COUNT(*) AS total FROM Borrowings WHERE borrowerId = ?",
        [id]
    );
    const total = (countRows as { total: number }[])[0]?.total ?? 0;

    return {
        message: "All members borrowings gotten!",
        success: true,
        data: rows as Borrowing[],
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
    };
}

export { handleGetAllMembers, handleGetMemberById, handleAddMember, handleUpdateMember, handleDeleteMember, handleGetAllMemberBorrowings };