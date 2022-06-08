import { Router } from "express";
import { getUserById, getRanking } from "../controllers/userController.js";
import { validateUser } from "../middlewares/userMiddleware.js";

const userRouter = Router();
userRouter.get("/users/ranking", getRanking);
userRouter.get("/users/:id", validateUser, getUserById);

export default userRouter;