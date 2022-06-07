import { Router } from "express";
import { shortenUrl, getUrlById, getShortenUrl } from "../controllers/urlController.js";
import { validateToken } from "../middlewares/tokenMiddleware.js";
import { validateShortenUrl, validateUrl } from "../middlewares/urlMiddleware.js";

const urlRouter = Router();
urlRouter.post("/urls/shorten", validateToken, validateUrl, shortenUrl);
urlRouter.get("/urls/:id", validateShortenUrl, getUrlById);
urlRouter.get("/urls/open/:shortUrl", validateShortenUrl, getShortenUrl);

export default urlRouter;