import { Queue, Worker } from "bullmq";
import natsWrapper from "./nats-wrapper";
import { OrderCreatedEventListener } from "./events/listeners/order-created-listener";

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
if (!process.env.REDIS_HOST) {
  console.log("REDIS_HOST not set");
  throw new Error("REDIS_HOST is not set in env variables");
}
natsWrapper
  .connect(process.env.NATS_CLUSTERID, process.env.NATS_CLIENTID, {
    url: process.env.NATS_URL,
    name: "publish",
  })
  .then(() => {
    natsWrapper.client.on("close", () => {
      console.log("Nats router has been closed");
      process.exit();
    });
    new OrderCreatedEventListener(natsWrapper.client).onListen();
  })
  .catch((err: any) => console.log(err));
