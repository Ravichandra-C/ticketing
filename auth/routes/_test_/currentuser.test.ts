import request from "supertest";
import { app } from "../../app";

it("should return current user details for valid user", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "ravirc1992@gmail.com",
      password: "HelloPassword",
    })
    .expect(201);

  const cookie = response.get("Set-Cookie");

  if (cookie) {
    const response_current = await request(app)
      .get("/api/users/current-user")
      .set("Cookie", cookie)
      .expect(200);

    expect(response_current.body).toMatchObject({
      currentUser: {
        email: "ravirc1992@gmail.com",
      },
    });
  }
});

it("responds with null if not authenticated", async () => {
  const response_current = await request(app)
    .get("/api/users/current-user")
    .expect(400);

  expect(response_current.body).toMatchObject({});
});
