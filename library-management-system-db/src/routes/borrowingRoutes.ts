import { Router } from "express";
import { getAllBorrowingsController, postBorrowingController, returnBookController } from "../controllers/borrowingControllers.js"

const borrowingRoutes = Router()

borrowingRoutes.get("/borrowings", getAllBorrowingsController)
borrowingRoutes.post("/borrowings", postBorrowingController)
borrowingRoutes.patch("/borrowings/:id", returnBookController)

export default borrowingRoutes;