import "express-async-errors";
import express, { Application } from "express";
import "dotenv/config";
import router from "./routers/routes.router";
import { errorHandler } from "./errors/handle.error";

const app: Application = express();

app.use(express.json());

app.use(router)

app.use(errorHandler);

export default app;
