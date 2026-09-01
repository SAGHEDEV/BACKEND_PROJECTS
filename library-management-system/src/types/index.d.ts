interface Book {
    id: number;
    title: string;
    isbn: string;
    category: string;
    publishedYear: number;
    available: boolean;
    authorId: number;
}

interface Author {
    id: number;
    name: string;
}

interface Member {
    id: number;
    name: string;
    email: string;
}

interface Borrowing {
    id: number;
    bookId: number;
    borrowedAt: Date;
    borrowerId: number;
    dueDate: Date;
    returnedAt?: Date;
}