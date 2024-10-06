import request from "supertest";
import { app } from "../../app";

it("should sign-out successfully", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "ravirc1992@gmail.com",
      password: "HelloPassword",
    })
    .expect(201);

  const response = await request(app)
    .get("/api/users/sign-out")
    .send()
    .expect(200);

  console.log(response.get("Set-Cookie"));

  expect(response.get("Set-Cookie")).toBeDefined();
});
