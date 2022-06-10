import { nanoid } from 'nanoid';

import connection from "../../db.js";

export async function shortenUrl(req, res) {
    const { url } = req.body;
    const { session } = res.locals;
    const shortUrl = nanoid();

    try {
        const sessionUserId = await connection.query(`
        SELECT * FROM sessions
        WHERE "userId" = $1
        ;`, [session.rows[0].userId]);

        await connection.query(`
        INSERT INTO urls (url, "shortUrl", "userId") 
        VALUES ($1, $2, $3);
        `, [url, shortUrl, sessionUserId.rows[0].userId]);

        res.status(201).send(shortUrl);

    } catch (e) {
        console.log(e);
        res.status(422).send("Ocorreu um erro ao tentar encurtar a url!");
        return;
    }
}

export async function getUrlById(req, res) {
    const { id } = req.params;

    try {
        const urlById = await connection.query(`                
        SELECT urls.id, urls."shortUrl", urls.url FROM urls
        WHERE id = $1;
        `, [id]);

        res.status(200).send(urlById.rows[0]);

    } catch (e) {
        console.log(e);
        res.status(422).send(`Ocorreu um erro ao tentar buscar a url de id = ${id}!`);
        return;
    }
}

export async function getShortenUrl(req, res, next) {
    const { shortUrl } = req.params;

    try {
        const redirect = await connection.query(`
        SELECT * FROM urls 
        WHERE "shortUrl" = $1
        ;`, [shortUrl]);

        let countViews = redirect.rows[0].views + (1);

        await connection.query(`
        UPDATE urls 
        SET views = $1
        WHERE "shortUrl" = $2
        ;`, [countViews, shortUrl]);

        return res.redirect(200, `http://${redirect.rows[0].shortUrl}`);

    } catch (e) {
        console.log(e);
        res.status(422).send(`Ocorreu um erro ao tentar redirecionar para a url encurtada!`);
        return;
    }
}

export async function deleteUrl(req, res) {
    const { id } = req.params;

    try {
        await connection.query(`DELETE FROM urls WHERE id = $1;`, [id]);
        res.sendStatus(204);

    } catch (e) {
        console.log(e);
        res.status(404).send("Ocorreu um erro ao deletar a url!");
        return;
    }
}