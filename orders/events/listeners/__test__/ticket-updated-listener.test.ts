import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import natsWrapper from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { TicketUpdatedEvent } from "@rcrcticket/common";
import { Message } from "node-nats-streaming";

async function setup() {
  //create a listener
  const ticketUpdatedListener = new TicketUpdatedListener(natsWrapper.client);
  //create a Ticket

  const ticket = new Ticket({
    _id: new mongoose.Types.ObjectId().toString(),
    price: 10,
    title: "Test ticket",
    version: 0,
  });

  await ticket.save();
  //create update Object

  const data: TicketUpdatedEvent["data"] = {
    id: ticket._id.toString(),
    price: "10",
    title: "Test ticket",
    version: 1,
    userId: new mongoose.Types.ObjectId().toString(),
    orderId: new mongoose.Types.ObjectId().toHexString(),
  };
  //create Msg Object

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  //return things

  return { ticketUpdatedListener, data, msg };
}

it("updates the ticket correctly", async () => {
  const { ticketUpdatedListener, data, msg } = await setup();
  await ticketUpdatedListener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.id);

  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.version).toEqual(data.version);
});

it("acks the message after update", async () => {
  const { ticketUpdatedListener, data, msg } = await setup();

  await ticketUpdatedListener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("ack does not gets called if version skipper", async () => {
  const { ticketUpdatedListener, data, msg } = await setup();

  data.version = 2;
  try {
    await ticketUpdatedListener.onMessage(data, msg);
  } catch (err) {
    console.log({ err });
  }

  expect(msg.ack).not.toHaveBeenCalled();
});
