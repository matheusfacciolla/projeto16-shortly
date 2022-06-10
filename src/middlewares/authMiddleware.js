import bcrypt from "bcrypt";
import connection from "../../db.js";

import { signUpSchema } from "../schemas/signUpSchema.js";
import { signInSchema } from "../schemas/signInSchema.js";

export async function validateSignUp(req, res, next) {
    const { name, email, password, confirmPassword } = req.body;
    const validation = signUpSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        res.status(422).send(validation.error.details.map((error) => error.message));
        return;
    }

    if (password != confirmPassword) {
        res.status(422).send("Senhas diferentes!");
        return;
    }

    try {
        const isEmailExist = await connection.query(`
        SELECT * 
        FROM users 
        WHERE email = $1;
        `, [email]);

        if (isEmailExist.rows[0] != undefined) {
            res.status(409).send("Esse email ja existe!");
            return;
        }

        next();

    } catch (e) {
        console.log(e);
        res.status(422).send("Ocorreu um erro ao tentar se cadastrar!");
        return;
    }
}

export async function validateSignIn(req, res, next) {
    const { email, password } = req.body
    const validation = signInSchema.validate(req.body, { abortEarly: false })

    if (validation.error) {
        res.status(422).send(validation.error.details.map((error) => error.message));
        return;
    }

    try {
        const user = await connection.query(`
        SELECT * 
        FROM users 
        WHERE email = $1;
        `, [email]);

        if (!user.rows[0]) {
            res.sendStatus(401);
            return;
        }

        const isCorrectPassword = bcrypt.compareSync(password, user.rows[0].password);

        if (!isCorrectPassword) {
            res.sendStatus(401);
            return;
        }

        res.locals.user = user;

        next();

    } catch (e) {
        console.log(e);
        res.status(422).send("Ocorreu um erro ao tentar se logar!");
        return;
    }
}