import { nanoid } from 'nanoid';
import dayjs from "dayjs";

import connection from "../../db.js";

export async function shortenUrl(req, res) {
    const { url } = req.body;
    const { user } = res.locals;
    const shortUrl = nanoid();
    const createdAt = dayjs(Date.now()).format("DD-MM-YYYY");

    try {
        const sessionUserId = await connection.query(`
        SELECT * FROM session
        WHERE "userId" = $1
        ;`, [user.id]);

        await connection.query(`
        INSERT INTO urls (url, "shortUrl", "userId", "createdAt") 
        VALUES ($1, $2, $3, $4);
        `, [url, shortUrl, sessionUserId.rows[0].userId, createdAt]);

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

export async function getShortenUrl(req, res) {
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

        res.redirect(301, `${redirect.rows[0].shortUrl}`)

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