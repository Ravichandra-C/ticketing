import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";

it("Should get all the existing Tickets", async () => {
  await request(app).post("/api/tickets").set("Cookie", signin()).send({
    title: "Ticket Title",
    price: 10,
  });
  await request(app).post("/api/tickets").set("Cookie", signin()).send({
    title: "Ticket Title",
    price: 10,
  });
  await request(app).post("/api/tickets").set("Cookie", signin()).send({
    title: "Ticket Title",
    price: 10,
  });
  await request(app).post("/api/tickets").set("Cookie", signin()).send({
    title: "Ticket Title",
    price: 10,
  });

  const response_1 = await request(app)
    .get("/api/tickets/")
    .set("Cookie", signin())
    .send();
  console.log({ body: response_1.body });

  expect(response_1.status).toEqual(200);
  expect(response_1.body.length).toEqual(4);
});

it("Should return 404 if ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
    .get("/api/tickets/" + id)
    .set("Cookie", signin())
    .send();

  expect(response.status).toEqual(404);
}, 10000);

it("Should return 200 if ticket is found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
      title: "Ticket Title",
      price: 10,
    });

  const response_1 = await request(app)
    .get("/api/tickets/" + response.body.id)
    .set("Cookie", signin())
    .send();

  expect(response_1.status).toEqual(200);
}, 1000);
