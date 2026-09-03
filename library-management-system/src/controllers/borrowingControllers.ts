import type { Request, Response } from "express";
import { handleBorrowBook, handleGetAllBorrowings, handleReturnBook } from "../services/borrowingServices.js";

const getAllBorrowingsController = (req: Request, res: Response) => {
    const { limit, page } = req.query as { limit?: string; page?: string };
    const response = handleGetAllBorrowings({
        limit: parseInt(limit as string),
        page: parseInt(page as string),
    });
    res.json(response).status(200);
}

const postBorrowingController = (req: Request, res: Response) => {
    const payload = req.body;
    const response = handleBorrowBook({
        bookId: payload.bookId,
        borrowerId: payload.borrowerId,
        dueDate: payload.dueDate,
    });
    res.json(response).status(201);
} 

const returnBookController = (req: Request, res: Response) => {
    const payload = req.body;
    const response = handleReturnBook({
        bookId: payload.bookId,
        borrowerId: payload.borrowerId,
    });
    res.json(response).status(200);
}

export { getAllBorrowingsController, postBorrowingController, returnBookController }