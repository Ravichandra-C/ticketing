import { connectDb } from "./util/db/connectDb";
import natsWrapper from "./nats-wrapper";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { app } from "./app";
connectDb()
  .then(() => {
    if (!process.env.NATS_URL) {
      console.log("NATS_URL not set");
      throw new Error("NATS_URL is not set in env variables");
    }
    if (!process.env.NATS_CLUSTERID) {
      console.log("NATS_CLUSTERID not set");
      throw new Error("NATS_CLUSTERID is not set in env variables");
    }
    if (!process.env.NATS_CLIENTID) {
      console.log("NATS_CLIENTID not set");
      throw new Error("NATS_CLIENTID is not set in env variables");
    }
    return natsWrapper.connect(
      process.env.NATS_CLUSTERID,
      process.env.NATS_CLIENTID,
      {
        url: process.env.NATS_URL,
        name: "publish",
      }
    );
  })
  .then(() => {
    natsWrapper.client.on("close", () => {
      console.log("Nats router has been closed");
      process.exit();
    });
    new OrderCancelledListener(natsWrapper.client).onListen();
    new OrderCreatedListener(natsWrapper.client).onListen();
    app.listen("3000", () =>
      console.log("Tickets Server is running on port 3000")
    );
  })
  .catch((err) => console.log(err));
