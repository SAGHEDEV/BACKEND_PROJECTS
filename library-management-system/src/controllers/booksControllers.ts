import type { Request, Response } from "express";
import { handleAddBook, handleDeleteBook, handleGetAllBooks, handleGetBookById, handleUpdateBook } from "../services/booksServices.js";

const getBooksController = (req: Request, res: Response) => {
    const { limit, page, availability, search, sort } = req.query as { limit: string; page: string; availability?: string; search?: string; sort?: "title" | "publishedYear" | "category" | "authorName" };

        const response = handleGetAllBooks({
            limit: parseInt(limit),
            page: parseInt(page),
            ...(availability !== undefined ? { availability: Boolean(availability) } : {}),
            ...(search ? { search } : {}),
            ...(sort ? { sort } : {})
        });
        res.json(response).status(200);
};

const getBookByIdController = (req: Request, res: Response) => {
    const bookId = parseInt(req.params.id as string);
    const response = handleGetBookById(bookId);
    res.json(response).status(200);
}

const postBookController = (req: Request, res:Response) => {
    const payload = req.body;
    const response = handleAddBook(payload);
    res.json(response).status(201);
}

const updateBookController = (req: Request, res: Response) => {
    const bookId = parseInt(req.params.id as string);
    const payload = req.body;
    const response = handleUpdateBook(bookId, payload);
    res.json(response).status(200);
}

const deleteBookController = (req: Request, res: Response) => {
    const bookId = parseInt(req.params.id as string);
    const response = handleDeleteBook(bookId);
    res.json(response).status(200);
}

export {getBooksController, getBookByIdController, postBookController, updateBookController, deleteBookController}