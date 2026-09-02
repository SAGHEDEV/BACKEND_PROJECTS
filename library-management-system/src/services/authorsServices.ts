import { authors, books } from "../data/index.js";

const handleGetAllAuthor = ({ limit, page }: { limit: number; page: number }) => {
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

const handleGetSingleAuthor = (id: number) : Author => {
    const authorExists = authors.find((author) => author.id === id);
    if (!authorExists) {
        throw new Error(`Author with id ${id} not found`);
    }
    return authorExists;
}

const handleCreateAuthor = (authorName: string): Author => {
    const normalizedName = authorName.trim().toLowerCase();
    const authorExists = authors.find(
        author => author.name.toLowerCase() === normalizedName
    );
    if (authorExists) {
        throw new Error(`Author with name ${authorName} already exists`);
    }
    const newAuthor = {
        id: authors.length + 1,
        name: authorName,
    }
    authors.push(newAuthor);
    return newAuthor;
}

const handleUpdateAuthor = (id: number, updatedAuthor: Partial<Omit<Author, 'id'>>) : Author => {
    const index = authors.findIndex(author => author.id === id);
    if (index === -1) {
        throw new Error(`Author not found!`);
    }
    const authorExists = updatedAuthor.name ? authors.find(author => author.name === updatedAuthor.name && author.id !== id) : false;
    if (authorExists) {
        throw new Error(`Author with name ${updatedAuthor.name} already exists`);
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
        throw new Error(`Author with ID ${id} not found!`);
    }
    const deletedAuthor = authors.splice(authorIndex, 1)[0];
    return deletedAuthor;
}

const handleGetAllAuthorBooks = (authorId: number) => {
    const authorExists = authors.find((author) => author.id === authorId);
    if (!authorExists) {
        throw new Error(`Author with id ${authorId} not found`);
    }
    const authorBooks = books.filter((book) => book.authorId === authorId);
    return authorBooks;
}

export { handleGetAllAuthor, handleGetSingleAuthor, handleCreateAuthor, handleUpdateAuthor, handleDeleteAuthor, handleGetAllAuthorBooks };   
