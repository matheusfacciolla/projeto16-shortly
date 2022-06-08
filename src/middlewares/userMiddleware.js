import connection from "../../db.js";

export async function validateUser(req, res, next) {
    const { id } = req.params;

    try {
        const user = await connection.query(`
        SELECT * FROM users 
        WHERE id = $1;
        `, [id]);

        if (user.length == 0) {
            res.sendStatus(404);
            return;
        }

        next();

    } catch (e) {
        console.log(e);
        res.status(422).send(`Ocorreu um erro ao tentar mostrar o usuário de id = ${id}!aaaa`);
        return;
    }
}