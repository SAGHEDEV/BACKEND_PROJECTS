import db from "../config/database.js";
import { authors, books } from "../data/index.js";
import { AppError } from "../middlewares/error.middleware.js";
import { checkAuthorExistence } from "./booksServices.js";

const handleGetAllAuthor = async ({
    limit,
    page
}: {
    limit: number;
    page: number;
}): Promise<GetAllAuthorResponse> => {

    const offset = (page - 1) * limit;

    const [rows] = await db.query(
        "SELECT * FROM Author LIMIT ? OFFSET ?",
        [limit, offset]
    );

    const [countRows] = await db.query(
        "SELECT COUNT(*) AS total FROM Author"
    );

    const data = rows as Author[];

    const total = (countRows as { total: number }[])[0]?.total ?? 0;

    return {
        message: "All authors fetched successfully!",
        success: true,
        data,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
    };
};

const handleGetSingleAuthor = (id: number): Author => {
    const authorExists = authors.find((author) => author.id === id);
    if (!authorExists) {
        throw new AppError(`Author with id ${id} not found`, 404);
    }
    return authorExists;
}

const handleCreateAuthor = async (authorName: string): Promise<Author> => {
    const normalizedName = authorName.trim();
    if (await checkAuthorExistence({ name: normalizedName })) {
        throw new AppError("This author already exist!", 401)
    }
    const query = `
    INSERT INTO Author (name)
    VALUES (?)
`;
    const [result] = await db.execute(query, [normalizedName])

    const innerResult = result as {
        insertId: number;
    }
    const newAuthor = {
        id: innerResult.insertId,
        name: authorName
    }
    return newAuthor as unknown as Author;
}

const handleUpdateAuthor = (id: number, updatedAuthor: Partial<Omit<Author, 'id'>>): Author => {
    const index = authors.findIndex(author => author.id === id);
    if (index === -1) {
        throw new AppError(`Author not found`, 404);
    }
    const authorExists = updatedAuthor.name ? authors.find(author => author.name === updatedAuthor.name && author.id !== id) : false;
    if (authorExists) {
        throw new AppError(`Author with name ${updatedAuthor.name} already exists`, 400);
    }

    // Merges existing author with only the defined fields in updatedAuthor
    const updatedAuthorData: Author = {
        ...authors[index],
        ...updatedAuthor,
    } as Author;

    authors[index] = updatedAuthorData;

    return updatedAuthorData;
}

const handleDeleteAuthor = (id: number) => {
    const authorIndex = authors.findIndex(author => author.id === id);
    if (authorIndex === -1) {
        throw new AppError(`Author not found in repository!`, 404);
    }
    const deletedAuthor = authors.splice(authorIndex, 1)[0];
    return deletedAuthor;
}

const handleGetAllAuthorBooks = ({ authorId, limit = 10, page = 1 }: { authorId: number, limit?: number, page?: number }): GetAllAuthorBooksResponse => {
    const authorExists = authors.find((author) => author.id === authorId);
    if (!authorExists) {
        throw new AppError(`Author not found in repository!`, 404);
    }
    const authorBooks = books.filter((book) => book.authorId === authorId);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBooks = authorBooks.slice(startIndex, endIndex);
    const totalPages = Math.ceil(authorBooks.length / limit);
    return {
        message: "All Author books gotten successfully!",
        success: true,
        data: paginatedBooks,
        page: page,
        limit: limit,
        total: authorBooks.length,
        totalPages: totalPages
    }
}

export { handleGetAllAuthor, handleGetSingleAuthor, handleCreateAuthor, handleUpdateAuthor, handleDeleteAuthor, handleGetAllAuthorBooks };   
