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
    if (availability !== undefined) {
        const filteredBooks = books.filter((book) => book.available === availability).filter((book) => {
            if (search) {
                const lowerCaseSearch = search.toLowerCase();
                return book.title.toLowerCase().includes(lowerCaseSearch) ||
                       book.isbn.toLowerCase().includes(lowerCaseSearch) ||
                       book.category.toLowerCase().includes(lowerCaseSearch);
            }
            return true;
        });
        const paginatedBooks = filteredBooks.slice(startIndex, endIndex);
        const sortedBooks = paginatedBooks.sort((a, b) => {
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
        const paginatedBooksWithAuthors = sortedBooks.map((book) => ({
            ...book,
            author: authors.find((author) => author.id === book.authorId)
        }));
        const totalPages = Math.ceil(filteredBooks.length / limit);
        return {
            message: "",
            success: false,
            data: paginatedBooksWithAuthors,
            page: page,
            limit: limit,
            total: filteredBooks.length,
            totalPages: totalPages
        }
    }
}

const handleGetBookById = (id: number) : Book => {
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

const handleAddBook = (book: { title: string; isbn: string; category: string; publishedYear: number; authorId: number }, authorId: number) : Book => {
    const authorExists = authors.find((author) => author.id === authorId);
    const isbnExist = books.find((book) => book.isbn === book.isbn);
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
    const bookExists = books.find(book => book.id === id);
    if (!bookExists) {
        throw new Error(`Book not found!`);
    }
    const index = books.findIndex(book => book.id === id);
    if (index === -1) {
        throw new Error(`Book with ID ${id} not found!`);
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