import type { Request, Response } from "express";
import { handleAddBook, handleDeleteBook, handleGetAllBooks, handleGetBookById, handleUpdateBook } from "../services/booksServices.js";

const getBooksController = (req: Request, res: Response) => {
    const { limit, page, availability, search, sort } = req.query as { limit: string; page: string; availability?: string; search?: string; sort?: "title" | "publishedYear" | "category" | "authorName" };

    const response = handleGetAllBooks({
        limit: limit ? parseInt(limit) : 10,
        page: page ? parseInt(page) : 1,
        ...(availability !== undefined ? {
            availability: availability ==
                "true" ? true : false
        } : {}),
        ...(search ? { search } : {}),
        ...(sort ? { sort } : {})
    });
    res.status(200).json(response);
};

const getBookByIdController = (req: Request, res: Response) => {
    const bookId = parseInt(req.params.id as string);
    const response = handleGetBookById(bookId);
    res.status(200).json(response);
}

const postBookController = (req: Request, res: Response) => {
    const payload = req.body;
    const response = handleAddBook(payload);
    res.status(201).json(response);
}

const updateBookController = (req: Request, res: Response) => {
    const bookId = parseInt(req.params.id as string);
    const payload = req.body;
    const response = handleUpdateBook(bookId, payload);
    res.status(200).json(response);
}

const deleteBookController = (req: Request, res: Response) => {
    const bookId = parseInt(req.params.id as string);
    const response = handleDeleteBook(bookId);
    res.status(200).json(response);
}

export { getBooksController, getBookByIdController, postBookController, updateBookController, deleteBookController }