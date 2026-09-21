import db from "../config/database.js";
import { AppError } from "../middlewares/error.middleware.js";

export const checkAuthorExistence = async ({
    id,
    name
}: {
    id?: number;
    name?: string;
}): Promise<Boolean> => {

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

export const checkNameExistence = async (name: string): Promise<Boolean> => {
    const query = "SELECT * FROM Author WHERE name = ?";

    const [rows] = await db.query(query, [name]);

    return (rows as unknown[]).length > 0;
}

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

const handleGetSingleAuthor = async (id: number): Promise<Author> => {
    const query = "SELECT * FROM Author WHERE id ? ="

    const [row] = await db.query(query, [id]);
    const singleValue = row as Author[];

    return singleValue[0] as Author;
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

const handleUpdateAuthor = async (id: number, updatedAuthor: Partial<Omit<Author, 'id'>>): Promise<Author> => {
    const fields: string[] = [];
    const values: unknown[] = [];

    const authorExistence = await checkAuthorExistence({ id })

    if (!authorExistence) {
        throw new AppError(`Author not found`, 404);
    }
    if (updatedAuthor.name) {
        const authorExists = await checkNameExistence(updatedAuthor.name)
        if (authorExists) {
            throw new AppError(`Author with name ${updatedAuthor.name} already exists`, 400);
        }
        fields.push("name = ?");
        values.push(updatedAuthor.name)
    }

    values.push(id);

    const query = ` UPDATE Author SET ${fields.join(", ")} WHERE id = ?`;

    const [result] = await db.execute(query, values as any);



    return (result as Author[])[0] as Author;
}

const handleDeleteAuthor = async (id: number): Promise<Author> => {
    const authorExist = checkAuthorExistence({ id: id });
    if (!authorExist) {
        throw new AppError("Author was not found!", 404);
    }

    const query = "SELECT FROM Author WHERE id = ?"
    const [rows] = await db.query(query, [id]);

    const deletedRow = rows as Author[]

    return deletedRow[0] as Author;
}

const handleGetAllAuthorBooks = async ({ authorId, limit = 10, page = 1 }: { authorId: number, limit?: number, page?: number }): Promise<GetAllAuthorBooksResponse> => {
    const startIndex = (page - 1) * limit;
    const query = `SELECT * FROM Books WHERE authorId = ? LIMIT ? OFFSET ?`
    const [rows] = await db.query(query, [authorId, limit, startIndex])

    const countQuery = `SELECT COUNT(*) FROM Books WHERE authorId = ?`
    const [countRows] = await db.query(countQuery, [authorId, limit, startIndex])

    const total = (countRows as { total: number }[])[0]?.total ?? 0;

    return {
        message: "All Author books gotten successfully!",
        success: true,
        data: rows as unknown[] as Book[],
        page: page,
        limit: limit,
        total: total,
        totalPages: Math.ceil(total / limit)
    }
}

export { handleGetAllAuthor, handleGetSingleAuthor, handleCreateAuthor, handleUpdateAuthor, handleDeleteAuthor, handleGetAllAuthorBooks };   
