import { authors, books } from "../data/index.js";
import { AppError } from "../middlewares/error.middleware.js";

const handleGetAllAuthor = ({ limit = 10, page = 1 }: { limit?: number; page?: number }) : GetAllAuthorResponse => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedAuthors = authors.slice(startIndex, endIndex);
    const totalPages = Math.ceil(authors.length / limit);
    return {
        data: paginatedAuthors,
        page: page,
        limit: limit,
        total: authors.length,
        totalPages: totalPages
    }
}

const handleGetSingleAuthor = (id: number): Author => {
    const authorExists = authors.find((author) => author.id === id);
    if (!authorExists) {
        throw new AppError(`Author with id ${id} not found`, 404);
    }
    return authorExists;
}

const handleCreateAuthor = (authorName: string): Author => {
    const normalizedName = authorName.trim().toLowerCase();
    const authorExists = authors.find(
        author => author.name.toLowerCase() === normalizedName
    );
    if (authorExists) {
        throw new AppError(`Author with name ${authorName} already exists`, 400);
    }
    const newAuthor = {
        id: authors.length + 1,
        name: authorName,
    }
    authors.push(newAuthor);
    return newAuthor;
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

const handleGetAllAuthorBooks = ({ authorId, limit = 10, page = 1 }: { authorId: number, limit?: number, page?: number }) : GetAllAuthorBooksResponse => {
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
        data: paginatedBooks,
        page: page,
        limit: limit,
        total: authorBooks.length,
        totalPages: totalPages
    }
}

export { handleGetAllAuthor, handleGetSingleAuthor, handleCreateAuthor, handleUpdateAuthor, handleDeleteAuthor, handleGetAllAuthorBooks };   
