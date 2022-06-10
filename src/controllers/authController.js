import bcrypt from 'bcrypt';
import { v4 } from 'uuid';

import connection from "../../db.js";

export async function signUp(req, res) {
    const { name, email, password, confirmPassword } = req.body;
    const passwordHash = bcrypt.hashSync(password, 10);

    try {
        await connection.query(`
        INSERT INTO users (name, email, password, "confirmPassword") 
        VALUES ($1, $2, $3, $4);
        `, [name, email, passwordHash, passwordHash]);
        res.sendStatus(201);

    } catch (e) {
        console.log(e);
        res.status(422).send("Ocorreu um erro ao tentar se cadastrar!");
        return;
    }
}

export async function signIn(req, res) {
    const { email } = req.body;

    try {
        const token = v4();

        const user = await connection.query(`
        SELECT * FROM users
        WHERE email = $1
        ;`, [email]);

        await connection.query(`
        INSERT INTO sessions (token, "userId") 
        VALUES ($1, $2);
        `, [token, user.rows[0].id]);

        const session = await connection.query(`
        SELECT * FROM sessions
        WHERE "userId" = $1
        ;`, [user.rows[0].id]);

        res.send(session.rows[0].token).status(200);

    } catch (e) {
        console.log(e);
        res.status(422).send("Ocorreu um erro ao tentar se logar!");
        return;
    }
}