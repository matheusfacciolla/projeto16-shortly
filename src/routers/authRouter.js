import { Router } from "express";
import { signUp, signIn } from "../controllers/authController.js";
import { validateSignUp, validateSignIn } from "../middlewares/authmiddleware.js";

const authRouter = Router();
authRouter.post("/signup", validateSignUp, signUp);
authRouter.post("/signin", validateSignIn, signIn);

export default authRouter;