import connection from "../../db.js";

export async function validateToken(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer", "").trim();

    if (!token) {
        return res.sendStatus(401);
    }

    try {
        const session = await connection.query(`
        SELECT * FROM sessions
        WHERE token = $1
        `, [token]);

        if (!session.rows[0]) {
            return res.sendStatus(401);
        }

        res.locals.session = session;

        next();

    } catch (e) {
        console.log(e);
        res.status(422).send("Ocorreu um erro ao tentar validar o token");
        return;
    }
}
