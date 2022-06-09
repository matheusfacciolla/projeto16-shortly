import { Router } from "express";
import { shortenUrl, getUrlById, getShortenUrl, deleteUrl } from "../controllers/urlController.js";
import { validateToken } from "../middlewares/tokenMiddleware.js";
import { validatePostUrl, validateGetUrl, validateRedirectShortenUrl, validateDeleteUrl } from "../middlewares/urlMiddleware.js";

const urlRouter = Router();
urlRouter.post("/urls/shorten", validateToken, validatePostUrl, shortenUrl);
urlRouter.get("/urls/:id", validateGetUrl, getUrlById);
urlRouter.get("/urls/open/:shortUrl", validateRedirectShortenUrl, getShortenUrl);
urlRouter.delete("/urls/:id", validateToken, validateDeleteUrl, deleteUrl);

export default urlRouter;