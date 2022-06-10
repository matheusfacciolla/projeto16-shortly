import connection from "../../db.js";

export async function getUserById(req, res) {
    const { id } = req.params;

    try {
        const userById = await connection.query(`
        SELECT users.id, users.name, COALESCE(SUM(urls.views), 0) AS "visitCount"
        FROM users
        LEFT JOIN urls ON urls."userId" = users.id
        WHERE users.id = $1
        GROUP BY users.id
        ;`, [id]);

        const user = userById.rows[0];

        const shortUrlById = await connection.query(`
        SELECT urls.id, urls."shortUrl", urls.url, urls.views AS "visitCount"
        FROM urls
        WHERE "userId" = $1
        ;`, [id]);

        const shortUrl = shortUrlById.rows;

        const resultList = { ...user, shortUrl };

        res.status(200).send(resultList);

    } catch (e) {
        console.log(e);
        res.status(422).send("Ocorreu um erro ao tentar buscar o usuário!");
        return;
    }
}

export async function getRanking(req, res) {
    try {
        const usersRanking = await connection.query(`
        SELECT  users.id, users.name, COUNT(urls.url) AS "linksCount", COALESCE(SUM(urls.views), 0) AS "visitCount"
        FROM users
        LEFT JOIN urls ON users.id = urls."userId"
        GROUP BY users.id
        ORDER BY "visitCount" DESC, "linksCount" DESC
        LIMIT 10 
        ;`);

        res.status(200).send(usersRanking.rows);

    } catch (e) {
        console.log(e);
        res.status(422).send("Ocorreu um erro ao tentar buscar o ranking!");
        return;
    }
}