import { handleCreateAuthor, handleDeleteAuthor, handleGetAllAuthor, handleGetAllAuthorBooks, handleGetSingleAuthor, handleUpdateAuthor } from "../services/authorsServices.js";
import type { Request, Response } from "express";

const getAllAuthorsController = (req: Request, res: Response) => {
    const { limit, page } = req.query as { limit?: string; page?: string };
    const response = handleGetAllAuthor({
        limit: parseInt(limit as string),
        page: parseInt(page as string),
    });
    res.json(response).status(200);
}

const getAuthorByIdController = (req: Request, res: Response) => {
    const authorId = parseInt(req.params.id as string);
    const response = handleGetSingleAuthor(authorId);
    res.json(response).status(200);
}

const createAuthorController = (req: Request, res: Response) => {
    const { name } = req.body;
    const response = handleCreateAuthor(name);
    res.json(response).status(201);
}

const updateAuthorController = (req: Request, res: Response) => {
    const authorId = parseInt(req.params.id as string);
    const payload = req.body;
    const response = handleUpdateAuthor(authorId, payload);
    res.json(response).status(200);
}

const deleteAuthorController = (req: Request, res: Response) => {
    const authorId = parseInt(req.params.id as string);
    const response = handleDeleteAuthor(authorId);
    res.json(response).status(200);
}

const getAllAuthorBooksController = (req: Request, res: Response) => {
    const { limit, page } = req.query as { limit?: string; page?: string };
    const authorId = parseInt(req.params.id as string);
    const response = handleGetAllAuthorBooks({
        authorId: authorId,
        limit: parseInt(limit as string),
        page: parseInt(page as string),
    });
    res.json(response).status(200);
}

export { getAllAuthorsController, getAuthorByIdController, createAuthorController, updateAuthorController, deleteAuthorController, getAllAuthorBooksController }