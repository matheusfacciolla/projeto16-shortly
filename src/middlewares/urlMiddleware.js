import connection from "../../db.js";

import { urlSchema } from "../schemas/urlSchema.js";

export async function validatePostUrl(req, res, next) {
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

export async function validateGetUrl(req, res, next) {
    const { id } = req.params;

    try {
        const urlExist = await connection.query(`
        SELECT * 
        FROM urls 
        WHERE id = $1;
        `, [id]);

        if (!urlExist.rows[0]) {
            res.sendStatus(404);
            return;
        }

        next();

    } catch (e) {
        console.log(e);
        res.status(422).send(`Ocorreu um erro ao tentar buscar a url!`);
        return;
    }
}

export async function validateRedirectShortenUrl(req, res, next) {
    const { shortUrl } = req.params;

    try {
        const shortenUrlExist = await connection.query(`
        SELECT * 
        FROM urls 
        WHERE "shortUrl" = $1;
        `, [shortUrl]);

        if (!shortenUrlExist.rows[0]) {
            res.sendStatus(404);
            return;
        }

        next();

    } catch (e) {
        console.log(e);
        res.status(422).send(`Ocorreu um erro ao tentar redirecionar a url = ${shortUrl}!`);
        return;
    }
}

export async function validateDeleteUrl(req, res, next) {
    const { id } = req.params;
    const { session } = res.locals;

    try {
        const shortenUrlExist = await connection.query(`
        SELECT * 
        FROM urls 
        WHERE id = $1;
        `, [id]);

        if (!shortenUrlExist.rows[0]) {
            res.sendStatus(404)
            return;
        }

        if (shortenUrlExist.rows[0].userId != session.rows[0].userId) {
            res.sendStatus(401);
            return;
        }

        next();

    } catch (e) {
        console.log(e);
        res.status(422).send(`Ocorreu um erro ao tentar deletar a url!`);
        return;
    }
}