import mongoose from "mongoose";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import request from "supertest";
it("Should get all the available tests for the user", async () => {
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

  // creating order 1
  await request(app).post("/api/orders").set("Cookie", global.signin()).send({
    ticketId: ticket1.id,
  });

  const userToken = global.signin();

  await request(app).post("/api/orders").set("Cookie", userToken).send({
    ticketId: ticket2.id,
  });

  const res = await request(app).get("/api/orders").set("Cookie", userToken);

  expect(res.status).toEqual(200);
  expect(res.body.length).toEqual(1);
  expect(res.body[0].ticket.title).toEqual("Ticket 2");
});
