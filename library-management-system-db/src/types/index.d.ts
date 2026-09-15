interface Book {
    id: number;
    title: string;
    isbn: string;
    category: string;
    publishedYear: number;
    available: boolean;
    authorId: number;
}

interface BookWithAuthor extends Book {
    author?: Author | undefined;
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

interface Pagination {
    totalPages: number;
    page: number;
    limit: number;
    total: number;
}

interface ResponseBody {
    message: string;
    success: boolean;
}

interface GetAllBookResponse extends Pagination, ResponseBody {
    data: BookWithAuthor[];
}

interface GetAllAuthorResponse extends Pagination, ResponseBody {
    data: Author[];
}

interface GetAllAuthorBooksResponse extends Pagination, ResponseBody {
    data: Book[];
}

interface GetAllMemberResponse extends Pagination, ResponseBody {
    data: Member[];
}

interface GetAllBorrowingResponse extends Pagination, ResponseBody {
    data: (Borrowing & { book?: Book | undefined; borrower?: Member | undefined })[];
}
