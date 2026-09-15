import { Router } from "express";
import { getAllAuthorsController, getAuthorByIdController, createAuthorController, updateAuthorController, deleteAuthorController, getAllAuthorBooksController } from "../controllers/authorsControllers.js"

const authorsRoutes = Router();

authorsRoutes.get("/authors", getAllAuthorsController)
authorsRoutes.get("/authors/:id", getAuthorByIdController)
authorsRoutes.post("/authors", createAuthorController)
authorsRoutes.put("/authors/:id", updateAuthorController)
authorsRoutes.patch("/authors/:id", updateAuthorController)
authorsRoutes.delete("/authors/:id", deleteAuthorController)
authorsRoutes.get("/authors/:id/books", getAllAuthorBooksController)

export default authorsRoutes;