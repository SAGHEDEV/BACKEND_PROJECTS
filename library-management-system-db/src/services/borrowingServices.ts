import db from "../config/database.js";
import { AppError } from "../middlewares/error.middleware.js";

const handleBorrowBook = async ({ bookId, borrowerId, dueDate }: { bookId: number; borrowerId: number; dueDate: Date }): Promise<Borrowing> => {
    const due = new Date(dueDate);
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();
        const [bookRows] = await connection.query("SELECT id, available FROM Books WHERE id = ? FOR UPDATE", [bookId]);
        const book = (bookRows as { id: number; available: boolean }[])[0];
        if (!book) {
            throw new AppError("Book not found", 404);
        }
        if (!book.available) {
            throw new AppError("This book is not available for borrowing", 400);
        }

        const [memberRows] = await connection.query("SELECT id FROM Members WHERE id = ?", [borrowerId]);
        if ((memberRows as unknown[]).length === 0) {
            throw new AppError("Borrower not found", 404);
        }
        if (Number.isNaN(due.getTime()) || due <= new Date()) {
            throw new AppError("Due date must be a future date", 400);
        }

        const borrowedAt = new Date();
        const [result] = await connection.execute(
            "INSERT INTO Borrowings (bookId, borrowerId, dueDate, borrowedAt) VALUES (?, ?, ?, ?)",
            [bookId, borrowerId, due, borrowedAt]
        );
        await connection.execute("UPDATE Books SET available = ? WHERE id = ?", [false, bookId]);
        await connection.commit();

        return {
            id: (result as { insertId: number }).insertId,
            bookId,
            borrowerId,
            dueDate: due,
            borrowedAt
        };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

const handleReturnBook = async ({ bookId, borrowerId }: { bookId: number; borrowerId: number }): Promise<Borrowing> => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();
        const [bookRows] = await connection.query("SELECT id, available FROM Books WHERE id = ? FOR UPDATE", [bookId]);
        const book = (bookRows as { id: number; available: boolean }[])[0];
        if (!book) {
            throw new AppError("Book not found", 404);
        }
        if (book.available) {
            throw new AppError("This book has already been returned to the library!", 400);
        }

        const [rows] = await connection.query(
            "SELECT * FROM Borrowings WHERE bookId = ? AND borrowerId = ? AND returnedAt IS NULL FOR UPDATE",
            [bookId, borrowerId]
        );
        const borrowing = (rows as Borrowing[])[0];
        if (!borrowing) {
            throw new AppError("No active borrowing record found for this book and borrower.", 404);
        }

        const returnedAt = new Date();
        await connection.execute("UPDATE Borrowings SET returnedAt = ? WHERE id = ?", [returnedAt, borrowing.id]);
        await connection.execute("UPDATE Books SET available = ? WHERE id = ?", [true, bookId]);
        await connection.commit();

        return { ...borrowing, returnedAt };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

const handleGetAllBorrowings = async ({ limit, page }: { limit: number; page: number }): Promise<GetAllBorrowingResponse> => {
    const offset = (page - 1) * limit;
    const [rows] = await db.query(
        "SELECT * FROM Borrowings ORDER BY borrowedAt DESC LIMIT ? OFFSET ?",
        [limit, offset]
    );
    const [countRows] = await db.query("SELECT COUNT(*) AS total FROM Borrowings");
    const total = (countRows as { total: number }[])[0]?.total ?? 0;

    return {
        message: "All Borrowings returned successfully!",
        success: true,
        data: rows as Borrowing[],
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
    }
}

export { handleBorrowBook, handleReturnBook, handleGetAllBorrowings };