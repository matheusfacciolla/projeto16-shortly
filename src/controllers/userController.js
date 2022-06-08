import connection from "../../db.js";

export async function getUserById(req, res) {
    const { id } = req.params;

    try {
        /*
        const userById = await connection.query(`
        SELECT users.*, SUM(urls.views) AS "visitCount1", urls.views AS "visitCount2", urls.id, urls."shortUrl", urls.url
        FROM users
        JOIN urls ON urls."userId" = users.id
        WHERE users.id = $1
        GROUP BY "visitCount2", urls.id, urls."shortUrl", urls.url, users.id
        ;`, [id]);
        */

        let users = userById.rows;
        const usersList = [];

        for (let user of users) {
            let viewCount = user.visitCount1;

            user = {
                ...user,
                id: user.id,
                name: user.name,
                visitCount: viewCount,
                shortenedUrls:[
                    {
                        id: user.id,
                        shortUrl: user.shortUrl,
                        url: user.url,
                        visitCount: user.visitCount2
                    }
                ]
            }

            delete user.email;
            delete user.password;
            delete user.confirmPassword;
            delete user.createdAt;
            delete user.shortUrl;
            delete user.url
            delete user.visitCount1
            delete user.visitCount2

            usersList.push(user);
        }

        res.status(200).send(usersList);

    } catch (e) {
        console.log(e);
        res.status(422).send("Ocorreu um erro ao tentar buscar o usuário!");
        return;
    }
}

export async function getRanking(req, res) {
    try {
        const allUsers = await connection.query(`
        SELECT  users.id, users.name, COUNT(urls.url) AS "linksCount", SUM(urls.views) AS "visitCount"
        FROM users, urls
        GROUP BY users.id
        ORDER BY "linksCount" DESC LIMIT 10 
        ;`);

        let users = allUsers.rows;
        const usersList = [];

        for (let user of users) {
            user = {
                ...user,
                id: user.id,
                name: user.name,
                linksCount: user.linksCount,
                visitCount: user.visitCount
            }

            usersList.push(user);
        }

        res.status(200).send(usersList);

    } catch (e) {
        console.log(e);
        res.status(422).send("Ocorreu um erro ao tentar buscar o ranking!");
        return;
    }
}