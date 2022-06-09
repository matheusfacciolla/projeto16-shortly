import { Router } from "express";
import { getUserById, getRanking } from "../controllers/userController.js";
import { validateUser } from "../middlewares/userMiddleware.js";
import { validateToken } from "../middlewares/tokenMiddleware.js";

const userRouter = Router();
userRouter.get("/users/:id", validateToken, validateUser, getUserById);
userRouter.get("/ranking", getRanking);

export default userRouter;