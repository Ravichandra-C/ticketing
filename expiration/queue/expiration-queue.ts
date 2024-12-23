import { Queue, Worker } from "bullmq";
import { ExpirationCompletedPublisher } from "../events/publishers/expiration-completed-event";
import natsWrapper from "../nats-wrapper";
interface Payload {
  orderId: string;
}

export const expirationQueue = new Queue<Payload>("order-expiration", {
  connection: {
    host: process.env.REDIS_HOST,
  },
});

const worker = new Worker<Payload>(
  "order-expiration",
  async (job) => {
    console.log("Completed the processing of expiration:completed event");
    new ExpirationCompletedPublisher(natsWrapper.client).publish({
      orderId: job.data.orderId,
    });
  },
  {
    connection: {
      host: process.env.REDIS_HOST,
    },
  }
);
