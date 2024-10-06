import express, { NextFunction, Request, Response } from "express";
import { signupRouter } from "./routes/signup";
import { signInRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";
import { currentUserRouter } from "./routes/currentuser";
import bodyParser from "body-parser";
import { CustomError } from "@rcrcticket/common";
import session from "cookie-session";
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
app.use(signInRouter);
app.use(signupRouter);
app.use(signOutRouter);
app.use(currentUserRouter);
app.get("/api/users", (req, res) => res.send("hello"));
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ messages: err.serializeError() });
    return;
  }

  res.status(400).send("Bad request error");
});

export { app };
