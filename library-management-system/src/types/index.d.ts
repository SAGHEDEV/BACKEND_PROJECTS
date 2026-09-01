interface Book {
    id: number;
    title: string;
    isbn: string;
    category: string;
    publishedYear: number;
    available: boolean;
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
    bookId: string;
    borrowedAt: Date;
    borrowedBy: string;
    dueDate: Date;
    returnedAt?: Date;
}