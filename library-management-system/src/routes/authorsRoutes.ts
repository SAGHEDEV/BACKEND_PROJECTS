import { Router } from "express";
import { getAllAuthorsController, getAuthorByIdController, createAuthorController, updateAuthorController, deleteAuthorController, getAllAuthorBooksController } from "../controllers/authorsControllers.js"

const authorsRoutes = Router();

authorsRoutes.get("/authors", getAllAuthorsController)
authorsRoutes.get("/authors/:id", getAuthorByIdController)
authorsRoutes.post("/authors", getAllAuthorsController)
authorsRoutes.put("/authors/:id", getAllAuthorsController)
authorsRoutes.patch("/authors/:id", getAllAuthorsController)
authorsRoutes.delete("/authors/:id", getAllAuthorsController)
authorsRoutes.get("/authors/:id/books", getAllAuthorBooksController)

export default authorsRoutes;