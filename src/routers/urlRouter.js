import { Router } from "express";
import { shortenUrl, getUrlById, getShortenUrl, deleteUrl } from "../controllers/urlController.js";
import { validateToken } from "../middlewares/tokenMiddleware.js";
import { validateShortenUrl, validateUrl, validateDeleteUrl } from "../middlewares/urlMiddleware.js";

const urlRouter = Router();
urlRouter.post("/urls/shorten", validateToken, validateUrl, shortenUrl);
urlRouter.get("/urls/:id", validateShortenUrl, getUrlById);
urlRouter.get("/urls/open/:shortUrl", validateShortenUrl, getShortenUrl);
urlRouter.delete("/urls/:id", validateToken, validateDeleteUrl, deleteUrl);

export default urlRouter;