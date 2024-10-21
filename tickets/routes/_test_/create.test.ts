import request from "supertest";
import { app } from "../../app";
it("Has route handler to create tickets", async () => {
  const response = await request(app).post("/api/tickets").send();

  expect(response.status).not.toEqual(404);
});

it("Can only be accessed if user is signed in", async () => {
  const response = await request(app).post("/api/tickets").send();

  expect(response.status).toEqual(401);
});

it("does not return 401 if user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send();

  expect(response.status).not.toEqual(401);
});

it("returns error if title is empty", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
      title: "",
      price: 10,
    });

  expect(response.status).toEqual(403);
});
it("returns error if price is empty", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
      title: "Title of Ticket",
    });

  expect(response.status).toEqual(403);
});

it("returns error if price is invalid", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
      title: "Ticket Title",
      price: -10,
    });

  expect(response.status).toEqual(403);
});

it("Ticket is created when all the valid values are inputed", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
      title: "Ticket Title",
      price: 10,
    });

  expect(response.status).toEqual(201);
});
