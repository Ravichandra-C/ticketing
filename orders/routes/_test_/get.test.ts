import mongoose from "mongoose";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import request from "supertest";
it.only("Fetch the ticket", async () => {
  const ticket1 = await new Ticket({
    _id: new mongoose.Types.ObjectId(),
    title: "ticket 1",
    price: "10",
  }).save();

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
    .get("/api/orders/" + order.id)
    .set("Cookie", userToken);

  expect(res.status).toEqual(200);
  expect(res.body.ticket.title).toEqual("Ticket 2");
});
