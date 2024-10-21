import express, { NextFunction, Request, Response } from "express";

import bodyParser from "body-parser";
import { currentUser, CustomError } from "@rcrcticket/common";
import session from "cookie-session";
import createRouter from "./routes/create";
import getRouter from "./routes/get";
import updateRouter from "./routes/update";
// console.debug(process.env);

if (!process.env.JWT_KEY) {
  console.log("JWT key not set");
  throw new Error("JWT_KEY is not set in env variables");
}
const app = express();
app.use(bodyParser.json());
app.use(
  session({
    signed: false,
    secure: false,
  })
);
app.use(currentUser);
app.use(createRouter);
app.use(getRouter);
app.use(updateRouter);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ messages: err.serializeError() });
    return;
  }

  res.status(400).send("Bad request error");
});

export { app };
