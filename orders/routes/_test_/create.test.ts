import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";
import { orderStatus } from "@rcrcticket/common";
import natsWrapper from "../../nats-wrapper";
it("returns an error if ticket doesn't exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticketId.toString() })
    .expect(404);
});

it("returns an error if the ticket is reserved", async () => {
  const ticket = await new Ticket({
    _id: new mongoose.Types.ObjectId(),
    title: "Hello",
    price: 10,
    version: 0,
  });
  await ticket.save();

  const order = new Order({
    ticket,
    status: orderStatus.AwaitingPayment,
    expiresAt: new Date(),
    userId: new mongoose.Types.ObjectId(),
  });

  await order.save();

  const res = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId: ticket.id,
    });

  expect(res.status).toEqual(400);
});

it("create a ticket if the ticket is not reserved", async () => {
  const ticket = await new Ticket({
    title: "Hello",
    _id: new mongoose.Types.ObjectId(),
    price: 10,
  });
  await ticket.save();

  const res = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId: ticket.id,
    });

  expect(res.status).toEqual(201);
});

it("Emit a Order created event", async () => {
  const ticket = await new Ticket({
    title: "Hello",
    _id: new mongoose.Types.ObjectId(),
    price: 10,
  });
  await ticket.save();

  const res = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId: ticket.id,
    });

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
