import express, { json } from "express";
import dotenv from "dotenv";
import chalk from "chalk";
import cors from "cors";

import authRouter from "./src/routers/authRouter.js";
import urlRouter from "./src/routers/urlRouter.js";
import userRouter from "./src/routers/userRouter.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(json());
app.use(authRouter);
app.use(urlRouter);
app.use(userRouter)


app.listen(process.env.PORT, () => {
    console.log(chalk.bold.green(`Server is running at http://localhost:${process.env.PORT}`))
});