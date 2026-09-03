import { handleCreateAuthor, handleDeleteAuthor, handleGetAllAuthor, handleGetAllAuthorBooks, handleGetSingleAuthor, handleUpdateAuthor } from "../services/authorsServices.js";
import type { Request, Response } from "express";

const getAllAuthorsController = (req: Request, res: Response) => {
    const { limit, page } = req.query as { limit?: string; page?: string };
    const response = handleGetAllAuthor({
        limit: limit ? parseInt(limit) : 10,
        page: page ? parseInt(page) : 1,
    });
    res.status(200).json(response);
}

const getAuthorByIdController = (req: Request, res: Response) => {
    const authorId = parseInt(req.params.id as string);
    const response = handleGetSingleAuthor(authorId);
    res.status(200).json(response);
}

const createAuthorController = (req: Request, res: Response) => {
    const { name } = req.body;
    const response = handleCreateAuthor(name);
    res.status(201).json(response);
}

const updateAuthorController = (req: Request, res: Response) => {
    const authorId = parseInt(req.params.id as string);
    const payload = req.body;
    const response = handleUpdateAuthor(authorId, payload);
    res.status(200).json(response);
}

const deleteAuthorController = (req: Request, res: Response) => {
    const authorId = parseInt(req.params.id as string);
    const response = handleDeleteAuthor(authorId);
    res.status(200).json(response);
}

const getAllAuthorBooksController = (req: Request, res: Response) => {
    const { limit, page } = req.query as { limit?: string; page?: string };
    const authorId = parseInt(req.params.id as string);
    const response = handleGetAllAuthorBooks({
        authorId: authorId,
        limit: limit ? parseInt(limit) : 10,
        page: page ? parseInt(page) : 1,
    });
    res.status(200).json(response);
}

export { getAllAuthorsController, getAuthorByIdController, createAuthorController, updateAuthorController, deleteAuthorController, getAllAuthorBooksController }