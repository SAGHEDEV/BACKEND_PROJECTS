import { Router } from "express";
import { getMembersController, getMemberByIdController, getMemberBorrowingsController, postMemberController, updateMemberController, deleteMemberController } from "../controllers/membersControllers.js";

const membersRoutes = Router()

membersRoutes.get("/members", getMembersController)
membersRoutes.get("/members/:id", getMemberByIdController)
membersRoutes.post("/members", postMemberController)
membersRoutes.put("/members/:id", updateMemberController)
membersRoutes.patch("/members/:id", updateMemberController)
membersRoutes.delete("/members/:id", deleteMemberController)
membersRoutes.get("/members/:id/borrowings", getMemberBorrowingsController)

export default membersRoutes;