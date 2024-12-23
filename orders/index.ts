import { app } from "./app";
import { connectDb } from "./util/db/connectDb";
import natsWrapper from "./nats-wrapper";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";
import { ExpirationCompletedListener } from "./events/listeners/__test__/expiration-completed-listener";
import { PaymentCreatedListener } from "./events/payment-created-listener";
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

    new TicketCreatedListener(natsWrapper.client).onListen();
    new TicketUpdatedListener(natsWrapper.client).onListen();
    new ExpirationCompletedListener(natsWrapper.client).onListen();
    new PaymentCreatedListener(natsWrapper.client).onListen();
    app.listen("3000", () =>
      console.log("Tickets Server is running on port 3000")
    );
  })
  .catch((err) => console.log(err));
