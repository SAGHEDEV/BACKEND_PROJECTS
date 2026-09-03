import { books, borrowings, members } from "../data/index.js";
import { AppError } from "../middlewares/error.middleware.js";

const handleBorrowBook = ({ bookId, borrowerId, dueDate }: { bookId: number; borrowerId: number; dueDate: Date }): Borrowing => {
    const book = books.find((book) => book.id === bookId);
    const borrower = members.find((member) => member.id === borrowerId);
    if (!book) {
        throw new AppError(`Book not found`, 404);
    }
    if (!book.available) {
        throw new AppError(`This book is not available for borrowing`, 400);
    }
    if (!borrower) {
        throw new AppError(`Borrower not found`, 404);
    }
    if (dueDate <= new Date()) {
        throw new AppError(`Due date must be a future date`, 400);
    }

    const newBorrowing = {
        id: borrowings.length + 1,
        bookId: bookId,
        borrowerId: borrowerId,
        dueDate: dueDate,
        borrowedAt: new Date(),
    }
    borrowings.push(newBorrowing);
    book.available = false;
    return newBorrowing;
}

const handleReturnBook = ({ bookId, borrowerId }: { bookId: number; borrowerId: number }): Borrowing => {
    const book = books.find((book) => book.id === bookId);
    if (!book) {
        throw new AppError(`Book not found`, 404);
    }
    if (book.available) {
        throw new AppError(`This book is already available in the library. It cannot be returned.`, 400);
    }
    const borrowing = borrowings.find((borrowing) => borrowing.bookId === bookId && !borrowing.returnedAt && borrowing.borrowerId === borrowerId);
    if (!borrowing) {
        throw new AppError(`No active borrowing record found for this book and borrower.`, 404);
    }
    borrowing.returnedAt = new Date();
    book.available = true;
    return borrowing;
}

const handleGetAllBorrowings = ({ limit = 10, page = 1 }: { limit?: number; page?: number }) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBorrowings = borrowings.slice(startIndex, endIndex);
    const totalPages = Math.ceil(borrowings.length / limit);
    return {
        data: paginatedBorrowings.map(borrowing => ({
            ...borrowing,
            book: books.find(book => book.id === borrowing.bookId),
            borrower: members.find(
                member => member.id === borrowing.borrowerId
            ),
        })),
        page: page,
        limit: limit,
        total: borrowings.length,
        totalPages: totalPages
    }
}

export { handleBorrowBook, handleReturnBook, handleGetAllBorrowings };