import request from "supertest";
import { app } from "../../app";

it("Sign-in should be successful with valid email and password ", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "ravirc1992@gmail.com",
      password: "HelloPassword",
    })
    .expect(201);

  await request(app)
    .post("/api/users/sign-in")
    .send({
      email: "ravirc1992@gmail.com",
      password: "HelloPassword",
    })
    .expect(200);
});
it("should return an error when we try to sign - in with invalid email ", async () => {
  await request(app)
    .post("/api/users/sign-in")
    .send({
      email: "ravirc1992.com",
      password: "HelloPassword",
    })
    .expect(403)
    .then((response) => {
      expect(response.body.messages).toContainEqual({
        message: "Please provide a valid email",
        field: "email",
      });
    });
});

it("should return an error when we try to sign-in with invalid password ", async () => {
  await request(app)
    .post("/api/users/sign-in")
    .send({
      email: "ravirc1992@gmail.com",
      password: "Hel",
    })
    .expect(403)
    .then((response) => {
      expect(response.body.messages).toContainEqual({
        message: "Password should be of minimum length 4 and maximum length 25",
        field: "password",
      });
    });
});
