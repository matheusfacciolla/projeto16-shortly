import { urlSchema } from "../schemas/urlSchema.js";

export async function validateUrl(req, res, next) {

    try {
        const { url } = req.body;
        const validation = urlSchema.validate(req.body, { abortEarly: false });

        if (validation.error) {
            res.status(422).send(validation.error.details.map((error) => error.message));
            return;
        }

        next();

    } catch (e) {
        console.log(e);
        res.status(422).send("Ocorreu um erro ao tentar encurtar a url!");
        return;
    }
}