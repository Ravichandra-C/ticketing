import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { title } from "process";
import Ticket from "../../models/Ticket";
import natsWrapper from "../../nats-wrapper";
it("returns 404 if id not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
    .put("/api/tickets/" + id)
    .set("Cookie", signin())
    .send();

  expect(response.status).toEqual(404);
});

it("returns 401 if user is not authorized to update the ticket", async () => {
  //create a ticket

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
      title: "Ticket Title",
      price: 10,
    });

  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put("/api/tickets/" + response.body.id)
    .set("Cookie", signin())
    .send()
    .expect(401);
});

it("returns 401 if user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put("/api/tickets/" + id)
    .send()
    .expect(401);
});

it("returns a 400 if title or price is invalid", async () => {
  const cookie = signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "Ticket Title",
      price: 10,
    });

  const res = await request(app)
    .put("/api/tickets/" + response.body.id)
    .set("Cookie", cookie)
    .send({
      title: "",
    });

  const priceRes = await request(app)
    .put("/api/tickets/" + response.body.id)
    .set("Cookie", cookie)
    .send({
      price: -100,
    });

  expect(priceRes.status).toEqual(403);
  expect(res.status).toEqual(403);
});
it("updates the title or price if they are valid", async () => {
  const cookie = signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "Ticket Title",
      price: 10,
    });

  const res = await request(app)
    .put("/api/tickets/" + response.body.id)
    .set("Cookie", cookie)
    .send({
      title: "Changed Title",
    });

  const ticket = await Ticket.findById(response.body.id).lean();
  expect(ticket!.title).toEqual("Changed Title");
});

it("publishes an event when the ticket is updated", async () => {
  const cookie = signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "Ticket Title",
      price: 10,
    });

  const res = await request(app)
    .put("/api/tickets/" + response.body.id)
    .set("Cookie", cookie)
    .send({
      title: "Changed Title",
    });

  const ticket = await Ticket.findById(response.body.id).lean();
  expect(ticket!.title).toEqual("Changed Title");

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
});

it("Returns Bad Request if Ticket is locked", async () => {
  const cookie = signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "Ticket Title",
      price: 10,
    });
  const ticket = await Ticket.findById(response.body.id).lean();
  ticket!.orderId = new mongoose.Types.ObjectId().toString();
  const res = await request(app)
    .put("/api/tickets/" + response.body.id)
    .set("Cookie", cookie)
    .send({
      title: "Changed Title",
    })
    .expect(400);
});
