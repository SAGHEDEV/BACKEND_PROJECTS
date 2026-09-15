import db from "../config/database.js";
import { authors, books } from "../data/index.js";
import { AppError } from "../middlewares/error.middleware.js";

export const checkAuthorExistence = async ({
    id,
    name
}: {
    id?: number;
    name?: string;
}) => {

    let query = "";
    let value: number | string;

    if (id !== undefined) {
        query = `SELECT id FROM Author WHERE id = ?`;
        value = id;
    } else if (name !== undefined) {
        query = `SELECT id FROM Author WHERE name = ?`;
        value = name;
    } else {
        return false;
    }

    const [rows] = await db.query(query, [value]);

    return (rows as unknown[]).length > 0;
};

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

const handleGetBookById = (id: number): BookWithAuthor => {
    const book = books.find((book) => book.id === id);
    if (!book) {
        throw new AppError(`Book with id ${id} not found`, 404);
    }
    const bookWithAuthor = {
        ...book,
        author: authors.find((author) => author.id === book.authorId)
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

const handleUpdateBook = (id: number, updatedBook: Partial<Omit<Book, 'id'>>) => {
    const index = books.findIndex(book => book.id === id);
    const authorExists = updatedBook.authorId ? authors.find(author => author.id === updatedBook.authorId) : true;
    const isbnExist = updatedBook.isbn ? books.find((existingBook) => updatedBook.isbn === existingBook.isbn && existingBook.id !== id) : false;
    if (index === -1) {
        throw new AppError(`Book with id ${id} not found`, 404);
    }
    if (isbnExist) {
        throw new AppError(`Book with isbn ${updatedBook.isbn} already exists`, 400);
    }
    if (!authorExists) {
        throw new AppError(`Author detail was not found!`, 404);
    }

    // Merges existing book with only the defined fields in updatedBook
    const updatedBookData: Book = {
        ...books[index],
        ...updatedBook,
    } as Book;

    books[index] = updatedBookData;

    return updatedBookData;

}

const handleDeleteBook = (id: number) => {
    const bookIndex = books.findIndex(book => book.id === id);
    if (bookIndex === -1) {
        throw new AppError(`Book with ID ${id} not found!`, 404);
    }
    const deletedBook = books.splice(bookIndex, 1)[0];
    return deletedBook;
}

export { handleGetAllBooks, handleGetBookById, handleUpdateBook, handleAddBook, handleDeleteBook };