import { orderStatus } from "@rcrcticket/common";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import request from "supertest";
import natsWrapper from "../../nats-wrapper";
import mongoose from "mongoose";
it("Fetch the ticket", async () => {
  const ticket2 = await new Ticket({
    _id: new mongoose.Types.ObjectId(),
    title: "Ticket 2",
    price: "20",
  }).save();

  const userToken = global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", userToken)
    .send({
      ticketId: ticket2.id,
    });

  const res = await request(app)
    .delete("/api/orders/" + order.id)
    .set("Cookie", userToken);

  const { body } = await request(app)
    .get("/api/orders/" + order.id)
    .set("Cookie", userToken);

  expect(body.status).toEqual(orderStatus.Cancelled);
});

it("Publish an event when ticket is cancelled", async () => {
  const ticket2 = await new Ticket({
    _id: new mongoose.Types.ObjectId(),
    title: "Ticket 2",
    price: "20",
  }).save();

  const userToken = global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", userToken)
    .send({
      ticketId: ticket2.id,
    });

  const res = await request(app)
    .delete("/api/orders/" + order.id)
    .set("Cookie", userToken);

  const { body } = await request(app)
    .get("/api/orders/" + order.id)
    .set("Cookie", userToken);

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
});
