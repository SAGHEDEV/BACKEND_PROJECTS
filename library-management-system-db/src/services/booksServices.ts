import db from "../config/database.js";
import { AppError } from "../middlewares/error.middleware.js";
import { checkAuthorExistence } from "./authorsServices.js";

export const checkISBNExistence = async ({ isbn }: { isbn: string }): Promise<Boolean> => {
    const query = `SELECT isbn FROM Books WHERE isbn = ?`
    const value = [isbn];

    const [rows] = await db.query(query, value);

    return (rows as unknown[]).length > 0;
}

export const checkBookExistence = async (id: number): Promise<Boolean> => {
    const query = `SELECT * FROM Books WHERE id = ?`
    const value = [id];

    const [rows] = await db.query(query, value);

    return (rows as unknown[]).length > 0;
}

export const checkBookAvailability = async (id: number): Promise<Boolean> => {
    const query = `SELECT * FROM Books WHERE id = ?`

    const [rows] = await db.query(query, [id]);

    const rowResult = rows as Book[];

    const available = (rowResult[0] as Book).available;

    return available
}

const handleGetAllBooks = async ({
    limit,
    page,
    availability,
    search,
    sort
}: {
    limit: number;
    page: number;
    availability?: boolean;
    search?: string;
    sort?: "asc" | "dsc";
}): Promise<GetAllBookResponse> => {

    const conditions: string[] = [];
    const values: unknown[] = [];

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

    if (availability !== undefined) {
        conditions.push(`available = ?`);
        values.push(availability);
    }

    const whereClause =
        conditions.length > 0
            ? `WHERE ${conditions.join(" AND ")}`
            : "";

    const offset = (page - 1) * limit;

    const dataQuery = `
        SELECT *
        FROM Books
        ${whereClause}
        ORDER BY title ${sort === "dsc" ? "DESC" : "ASC"}
        LIMIT ? OFFSET ?
    `;

    const dataValues = [...values, limit, offset];

    const [rows] = await db.query(dataQuery, dataValues);

    const countQuery = `
        SELECT COUNT(*) AS total
        FROM Books
        ${whereClause}
    `;

    const [countRows] = await db.query(countQuery, values);

    const data = rows as Book[];

    const total = (countRows as { total: number }[])[0]?.total ?? 0;

    return {
        message: "All books fetched successfully!",
        success: true,
        data,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
    };
};

const handleGetBookById = async (id: number): Promise<BookWithAuthor> => {
    const bookQuery = `SELECT * FROM Books WHERE id = ?`;
    const [rows] = await db.query(bookQuery, [id])
    const bookResponse = rows as Book[]
    if (bookResponse.length <= 0) {
        throw new AppError(`Book with id ${id} not found`, 404);
    }
    const authorQuery = `SELECT * FROM Author WHERE id = ?`
    const [authorRow] = await db.query(authorQuery, [bookResponse[0]?.id]);

    const authorResponse = authorRow as Author[]
    const bookWithAuthor = {
        ...(bookResponse[0]!),
        author: authorResponse[0]
    };
    return bookWithAuthor;
}

const handleAddBook = async (
    book: Omit<Book, "id">
): Promise<Book> => {

    const authorExists = await checkAuthorExistence({
        id: book.authorId
    });

    if (!authorExists) {
        throw new AppError("Author not found!", 404);
    }

    const isbnExist = await checkISBNExistence({
        isbn: book.isbn
    })
    if (isbnExist) {
        throw new AppError("Duplicate ISBN cannnot exist for different books!", 403);
    }

    const query = `
        INSERT INTO Books
        (title, isbn, category, publishedYear, available, authorId)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
        book.title,
        book.isbn,
        book.category,
        book.publishedYear,
        true,
        book.authorId
    ];

    const [result] = await db.execute(query, values);

    const insertResult = result as {
        insertId: number;
    };

    const newBook: Book = {
        id: insertResult.insertId,
        title: book.title,
        isbn: book.isbn,
        category: book.category,
        publishedYear: book.publishedYear,
        available: true,
        authorId: book.authorId
    };

    return newBook;
};

const handleUpdateBook = async (
    id: number,
    updatedBook: Partial<Omit<Book, "id">>
): Promise<Book> => {

    const bookExistence = checkBookExistence(id);
    if (!bookExistence) {
        throw new AppError("This book was not found!", 404)
    }

    const fields: string[] = [];
    const values: unknown[] = [];

    if (updatedBook.title !== undefined) {
        fields.push("title = ?");
        values.push(updatedBook.title);
    }

    if (updatedBook.isbn !== undefined) {
        fields.push("isbn = ?");
        values.push(updatedBook.isbn);
    }

    if (updatedBook.category !== undefined) {
        fields.push("category = ?");
        values.push(updatedBook.category);
    }

    if (updatedBook.publishedYear !== undefined) {
        fields.push("publishedYear = ?");
        values.push(updatedBook.publishedYear);
    }

    if (updatedBook.available !== undefined) {
        fields.push("available = ?");
        values.push(updatedBook.available);
    }

    if (updatedBook.authorId !== undefined) {
        fields.push("authorId = ?");
        values.push(updatedBook.authorId);
    }

    if (fields.length === 0) {
        throw new AppError("No fields provided for update", 400);
    }

    if (updatedBook.authorId !== undefined) {
        const authorExists = await checkAuthorExistence({
            id: updatedBook.authorId
        });

        if (!authorExists) {
            throw new AppError("Author not found", 404);
        }
    }

    const isbnExist = await checkISBNExistence({
        isbn: updatedBook.isbn!
    })

    if (isbnExist) {
        throw new AppError("Duplicate ISBN cannnot exist for different books!", 403);
    }

    const query = `
        UPDATE Books
        SET ${fields.join(", ")}
        WHERE id = ?
    `;

    values.push(id);

    const [result] = await db.execute(query, values as any);

    const updateResult = result as {
        affectedRows: number;
    };

    if (updateResult.affectedRows === 0) {
        throw new AppError(`Book with id ${id} not found`, 404);
    }

    // Fetch the updated record
    const [rows] = await db.query(
        "SELECT * FROM Books WHERE id = ?",
        [id]
    );

    const updated = rows as Book[];

    return updated[0] as Book;
};
const handleDeleteBook = async (id: number): Promise<Book> => {
    const bookExistence = checkBookExistence(id);
    if (!bookExistence) {
        throw new AppError("This book was not found!", 404)
    }
    const query = `DELETE FROM Books WHERE id = ?`;

    const [result] = await db.execute(query, [id]);
    console.log(result)
    const deleted = result as Book[];
    return deleted[0] as Book;
}

export { handleGetAllBooks, handleGetBookById, handleUpdateBook, handleAddBook, handleDeleteBook };