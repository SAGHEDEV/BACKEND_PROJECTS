import { Router } from "express";
import { getBooksController, getBookByIdController, postBookController, updateBookController, deleteBookController } from "../controllers/booksControllers.js";


const bookRoutes = Router()

bookRoutes.get("/books", getBooksController)
bookRoutes.get("/books/:id", getBookByIdController)
bookRoutes.post("/books", postBookController)
bookRoutes.put("/books/:id", updateBookController)
bookRoutes.patch("/books/:id", updateBookController)
bookRoutes.delete("/books/:id", deleteBookController)

export default bookRoutes