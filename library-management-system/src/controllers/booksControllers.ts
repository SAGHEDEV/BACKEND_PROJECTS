import type { Request, Response } from "express";
import { handleGetAllBooks } from "../services/booksServices.js";

const getBooksController = (req: Request, res: Response) => {
    const { limit, page } = req.query as { limit: string; page: string };
    const books = handleGetAllBooks({
        limit: parseInt(limit),
        page: parseInt(page),
    });
    res.json(books);
};