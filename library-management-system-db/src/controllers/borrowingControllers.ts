import type { Request, Response } from "express";
import { handleBorrowBook, handleGetAllBorrowings, handleReturnBook } from "../services/borrowingServices.js";

const getAllBorrowingsController = async (req: Request, res: Response) => {
    const { limit, page } = req.query as { limit?: string; page?: string };
    const response = await handleGetAllBorrowings({
        limit: limit ? parseInt(limit) : 10,
        page: page ? parseInt(page) : 1,
    });
    res.status(200).json(response);
}

const postBorrowingController = async (req: Request, res: Response) => {
    const payload = req.body;
    const response = await handleBorrowBook({
        bookId: payload.bookId,
        borrowerId: payload.borrowerId,
        dueDate: payload.dueDate,
    });
    res.status(201).json(response);
} 

const returnBookController = async (req: Request, res: Response) => {
    const payload = req.body;
    const response = await handleReturnBook({
        bookId: payload.bookId,
        borrowerId: payload.borrowerId,
    });
    res.status(200).json(response);
}

export { getAllBorrowingsController, postBorrowingController, returnBookController }