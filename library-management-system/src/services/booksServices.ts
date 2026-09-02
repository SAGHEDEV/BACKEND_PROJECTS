import { authors, books } from "../data/index.js";


const handleGetAllBooks = ({ limit, page, availability, search, sort }: {
    limit: number;
    page: number;
    availability?: boolean;
    search?: string;
    sort?: "title" | "publishedYear" | "category" | "authorName";
}) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const filteredBooks = books.filter((book) => {
        if (availability !== undefined) {
            return book.available === availability;
        }
        return true;
    }).filter((book) => {
        if (search) {
            const lowerCaseSearch = search.toLowerCase();
            const author = authors.find(
                author => author.id === book.authorId
            );
            return (
                book.title.toLowerCase().includes(lowerCaseSearch) ||
                book.isbn.toLowerCase().includes(lowerCaseSearch) ||
                book.category.toLowerCase().includes(lowerCaseSearch) ||
                author?.name.toLowerCase().includes(lowerCaseSearch)
            );
        }
        return true;
    });
    const sortedBooks = [...filteredBooks].sort((a, b) => {
        if (sort === "title") {
            return a.title.localeCompare(b.title);
        } else if (sort === "publishedYear") {
            return a.publishedYear - b.publishedYear;
        } else if (sort === "category") {
            return a.category.localeCompare(b.category);
        } else if (sort === "authorName") {
            const authorA = authors.find((author) => author.id === a.authorId);
            const authorB = authors.find((author) => author.id === b.authorId);
            if (authorA && authorB) {
                return authorA.name.localeCompare(authorB.name);
            }
            return 0;
        }
        return 0;
    });
    const paginatedBooks = sortedBooks.slice(startIndex, endIndex);
    const paginatedBooksWithAuthors = paginatedBooks.map((book) => ({
        ...book,
        author: authors.find((author) => author.id === book.authorId)
    }));
    const totalPages = Math.ceil(filteredBooks.length / limit);
    return {
        data: paginatedBooksWithAuthors as BookWithAuthor[],
        page: page,
        limit: limit,
        total: filteredBooks.length,
        totalPages: totalPages
    }
}

const handleGetBookById = (id: number): BookWithAuthor => {
    const book = books.find((book) => book.id === id);
    if (!book) {
        throw new Error(`Book with id ${id} not found`);
    }
    const bookWithAuthor = {
        ...book,
        author: authors.find((author) => author.id === book.authorId)
    };
    return bookWithAuthor;
}

const handleAddBook = (book: { title: string; isbn: string; category: string; publishedYear: number; authorId: number }): Book => {
    const authorExists = authors.find((author) => author.id === book.authorId);
    const isbnExist = books.find((existingBook) => book.isbn === existingBook.isbn);
    if (!authorExists) {
        throw new Error(`Author detail was not found!`);
    }
    if (isbnExist) {
        throw new Error(`Book with isbn ${book.isbn} already exists`);
    }
    const newBook = {
        ...book,
        id: books.length + 1,
        available: true,
        authorId: authorExists.id,
    }
    books.push(newBook);
    return newBook;
}

const handleUpdateBook = (id: number, updatedBook: Partial<Omit<Book, 'id'>>) => {
    const index = books.findIndex(book => book.id === id);
    const authorExists = updatedBook.authorId ? authors.find(author => author.id === updatedBook.authorId) : true;
    const isbnExist = updatedBook.isbn ? books.find((existingBook) => updatedBook.isbn === existingBook.isbn && existingBook.id !== id) : false;
    if (index === -1) {
        throw new Error(`Book not found!`);
    }
    if (isbnExist) {
        throw new Error(`Book with isbn ${updatedBook.isbn} already exists`);
    }
    if (!authorExists) {
        throw new Error(`Author detail was not found!`);
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
        throw new Error(`Book with ID ${id} not found!`);
    }
    const deletedBook = books.splice(bookIndex, 1)[0];
    return deletedBook;
}

export { handleGetAllBooks, handleGetBookById, handleUpdateBook, handleAddBook, handleDeleteBook };