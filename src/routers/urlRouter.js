import { Router } from "express";
import { shortUrl } from "../controllers/urlController.js";
import { validateToken } from "../middlewares/tokenMiddleware.js";
import { validateUrl } from "../middlewares/urlMiddleware.js";

const urlRouter = Router();
urlRouter.post("/urls/shorten", validateToken, validateUrl, shortUrl);

export default urlRouter;