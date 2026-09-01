import { books, borrowings, members } from "../data/index.js";

const handleBorrowBook = ({ bookId, borrowerId, dueDate }: { bookId: number; borrowerId: number; dueDate: Date }) => {
    const book = books.find((book) => book.id === bookId);
    const borrower = members.find((member) => member.id === borrowerId);
    if (!book) {
        throw new Error(`Book not found`);
    }
    if (!book.available) {
        throw new Error(`This book is not available for borrowing`);
    }
    if (!borrower) {
        throw new Error(`Borrower not found`);
    }
    const borrowingExists = borrowings.find((borrowing) => borrowing.bookId === bookId && !borrowing.returnedAt && borrowing.borrowerId === borrowerId);
    if (borrowingExists) {
        throw new Error(`Duplicate borrowing entry found for this book and borrower. Please return the book before borrowing again.`);
    }
    const newBooking = {
        id: borrowings.length + 1,
        bookId: bookId,
        borrowerId: borrowerId,
        dueDate: dueDate,
        borrowedAt: new Date(),
    }
    borrowings.push(newBooking);
    book.available = false;
    return newBooking;
}

const handleReturnBook = ({ bookId, borrowerId }: { bookId: number; borrowerId: number }) => {
    const book = books.find((book) => book.id === bookId);
    if (!book) {
        throw new Error(`Book not found`);
    }
    if (book.available) {
        throw new Error(`This book is already available in the library. It cannot be returned.`);
    }
    const borrowing = borrowings.find((borrowing) => borrowing.bookId === bookId && !borrowing.returnedAt && borrowing.borrowerId === borrowerId);
    if (!borrowing) {
        throw new Error(`No active borrowing record found for this book and borrower.`);
    }
    borrowing.returnedAt = new Date();
    book.available = true;
    return borrowing;
}

const handleGetAllBorrowings = ({ limit, page }: { limit: number; page: number }) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBorrowings = borrowings.slice(startIndex, endIndex);
    const totalPages = Math.ceil(borrowings.length / limit);
    return {
        data: paginatedBorrowings,
        page: page,
        limit: limit,
        total: borrowings.length,
        totalPages: totalPages
    }
}

export { handleBorrowBook, handleReturnBook, handleGetAllBorrowings };