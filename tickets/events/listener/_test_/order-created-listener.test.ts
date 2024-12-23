import {
  OrderCancelledEvent,
  OrderCreatedEvent,
  orderStatus,
} from "@rcrcticket/common";
import natsWrapper from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import Ticket from "../../../models/Ticket";
import { Message } from "node-nats-streaming";

async function setup() {
  //create a listener
  const listener = new OrderCreatedListener(natsWrapper.client);
  const ticket = new Ticket({
    userId: new mongoose.Types.ObjectId(),
    title: "New Title",
    price: 10,
  });
  await ticket.save();
  //create the data object to be called with
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toString(),
    userId: new mongoose.Types.ObjectId().toString(),
    version: 1,
    status: orderStatus.Completed,
    expiresAt: "",
    ticket: {
      id: ticket.id,
      price: 10,
    },
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { ticket, msg, data, listener };
}

//if Order Id is updated and Msg is called

it("Sets OrderId of ticket and Msg Acks", async () => {
  const { ticket, msg, data, listener } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
  const ticketUpdated = await Ticket.findById(ticket.id);

  expect(ticketUpdated?.orderId).toEqual(data.id);
});

it("ticket is published when the order is created", async () => {
  const { ticket, msg, data, listener } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
  const ticketUpdated = await Ticket.findById(ticket.id);

  expect(ticketUpdated?.orderId).toEqual(data.id);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
