import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";

import bodyParser from "body-parser";
import { CustomError } from "@rcrcticket/common";
import session from "cookie-session";
import createRouter from "./routes/create";
import { currentUser } from "./middlewares/current-user";
import getRouter from "./routes/get";
import getAllRouter from "./routes/get-all";
import deleteRouter from "./routes/cancel";
import natsWrapper from "./nats-wrapper";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";
// console.debug(process.env);

if (!process.env.JWT_KEY) {
  console.log("JWT key not set");
  throw new Error("JWT_KEY is not set in env variables");
}

// natsWrapper.client.on("close", () => {
//   console.log("Nats router has been closed");
//   process.exit();
// });

// new TicketCreatedListener(natsWrapper.client).onListen();
// new TicketUpdatedListener(natsWrapper.client).onListen();
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
app.use(getAllRouter);
app.use(deleteRouter);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ messages: err.serializeError() });
    return;
  }

  res.status(400).send("Bad request error");
});

process.on("SIGINT", () => natsWrapper.client.close());
process.on("SIGTERM", () =>
  process.on("SIGTERM", () => natsWrapper.client.close())
);

export { app };
