import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./ticket-created-publisher";

const stan = nats.connect("ticketing", "abs", {
  url: "http://localhost:4222",
  name: "publish",
});

stan.on("connect", () => {
  console.log("Publisher connected to the NATS");

  const ticketCreatedPublisher = new TicketCreatedPublisher(stan);

  ticketCreatedPublisher.publish({
    id: "1",
    title: "Coldplay",
    price: 100,
    userId: "123",
  });
});
