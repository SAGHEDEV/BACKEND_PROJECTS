import type { Request, Response } from "express";
import { handleAddBook, handleDeleteBook, handleGetAllBooks, handleGetBookById, handleUpdateBook } from "../services/booksServices.js";

const getBooksController = async (req: Request, res: Response) => {
    const { limit, page, availability, search, sort } = req.query as { limit: string; page: string; availability?: string; search?: string; sort?: "asc" | "dsc" };
    const response = await handleGetAllBooks({
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

const getBookByIdController = async (req: Request, res: Response) => {
    const bookId = parseInt(req.params.id as string);
    const response = await handleGetBookById(bookId);
    res.status(200).json(response);
}

const postBookController = async (req: Request, res: Response) => {
    const payload = req.body;
    const response = await handleAddBook(payload);
    res.status(201).json(response);
}

const updateBookController = async (req: Request, res: Response) => {
    const bookId = parseInt(req.params.id as string);
    const payload = req.body;
    const response = await handleUpdateBook(bookId, payload);
    res.status(200).json(response);
}

const deleteBookController = async (req: Request, res: Response) => {
    const bookId = parseInt(req.params.id as string);
    const response = await handleDeleteBook(bookId);
    res.status(204).json(response);
}

export { getBooksController, getBookByIdController, postBookController, updateBookController, deleteBookController }