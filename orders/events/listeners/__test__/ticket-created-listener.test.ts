import { TicketCreatedEvent } from "@rcrcticket/common";
import { TicketCreatedListener } from "../ticket-created-listener";
import mongoose from "mongoose";
import natsWrapper from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { Message } from "node-nats-streaming";

function setup() {
  const ticketCreatedListener = new TicketCreatedListener(natsWrapper.client);
  // create the data Object

  const data: TicketCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toString(),
    price: 10,
    title: "Test ticket",
    userId: new mongoose.Types.ObjectId().toString(),
    version: 1,
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { ticketCreatedListener, data, msg };
}
it("creates and saves a ticket when a ticket OnMessage Is called", async () => {
  const { ticketCreatedListener, data, msg } = setup();

  await ticketCreatedListener.onMessage(data, msg);
  // check if ticket is created

  const ticket = await Ticket.findById(data.id);

  expect(ticket).not.toBeNull();
  expect(ticket!.title).toEqual(data.title);
});

it("checks if msg is ack called when a event is listened ", async () => {
  const { ticketCreatedListener, data, msg } = setup();

  await ticketCreatedListener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
