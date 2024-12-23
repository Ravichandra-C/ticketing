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
import { OrderCancelledListener } from "../order-cancelled-listener";

async function setup() {
  //create a listener
  const listener = new OrderCancelledListener(natsWrapper.client);
  const ticket = new Ticket({
    userId: new mongoose.Types.ObjectId(),
    title: "New Title",
    price: 10,
    orderId: new mongoose.Types.ObjectId(),
  });
  await ticket.save();
  //create the data object to be called with
  const data: OrderCancelledEvent["data"] = {
    id: new mongoose.Types.ObjectId().toString(),
    version: 1,
    ticket: {
      id: ticket.id,
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

  expect(ticketUpdated?.orderId).not.toBeDefined();
});

it("ticket is published when the order is created", async () => {
  const { ticket, msg, data, listener } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
  const ticketUpdated = await Ticket.findById(ticket.id);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
