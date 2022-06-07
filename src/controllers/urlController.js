import { nanoid } from 'nanoid';
import dayjs from "dayjs";

import connection from "../../db.js";

export async function shortUrl(req, res) {
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

        const shortedUrl = await connection.query(`
        SELECT * FROM urls
        ;`);
        res.status(201).send(shortedUrl.rows[0].shortUrl);

    } catch (e) {
        console.log(e);
        res.status(422).send("Ocorreu um erro ao tentar encurtar a url!");
        return;
    }
}
