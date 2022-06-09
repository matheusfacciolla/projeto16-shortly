import bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import dayjs from "dayjs";

import connection from "../../db.js";

export async function signUp(req, res) {
    const { name, email, password, confirmPassword } = req.body;
    const passwordHash = bcrypt.hashSync(password, 10);
    const createdAt = dayjs(Date.now()).format("DD-MM-YYYY");

    try {
        await connection.query(`
        INSERT INTO users (name, email, password, "confirmPassword", "createdAt") 
        VALUES ($1, $2, $3, $4, $5);
        `, [name, email, passwordHash, passwordHash, createdAt]);
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
        const createdAt = dayjs(Date.now()).format("DD-MM-YYYY");

        const user =  await connection.query(`
        SELECT * FROM users
        WHERE email = $1
        ;`, [email]);

        await connection.query(`
        INSERT INTO sessions (token, "userId", "createdAt") 
        VALUES ($1, $2, $3);
        `, [token, user.rows[0].id, createdAt]);

        const session =  await connection.query(`
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