import { randomBytes } from "crypto";
import nats, { Message } from "node-nats-streaming";
import { TicketCreatedListener } from "./ticket-created-listener";

console.clear();
const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
  name: "listen",
});

stan.on("connect", () => {
  console.log("Listener Connected to NATS");

  const ticketCreatedListener: TicketCreatedListener =
    new TicketCreatedListener(stan);
  ticketCreatedListener.onListen();
  // const opts = stan.subscriptionOptions().setManualAckMode(true);

  // const sub = stan.subscribe("ticket:created", "listen:queue", opts);
  // sub.on("message", (msg: Message) => {
  //   console.log("Received message " + msg.getSequence());
  //   console.log("Message data : " + msg.getData());
  //   msg.ack();
  // });
});

process.on("SIGINT", () => {
  stan.close();
});

process.on("SIGTERM", () => {
  stan.close();
});
