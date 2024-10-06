import request from "supertest";
import { app } from "../../app";
it("Signup is successfull for valid credentials", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "ravichandra@gmail.com",
      password: "helowestin",
    })
    .set("Accept", "application/json")
    .expect(201);
});

it("should return a 400 status code", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "ravichandrainvalidemail",
      password: "helowestin",
    })
    .set("Accept", "application/json")
    .expect(403);
});

it("should return a Email in-valid email error", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "sdbcvhjsd",
      password: "jhbdvchj",
    })
    .expect(403)
    .then((response) => {
      expect(response.body.messages).toContainEqual({
        message: "Email should be a valid email",
        field: "email",
      });
    });
});

it("should return a password in-valid email error", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "ravi@gmail.com",
      password: "f",
    })
    .expect(403)
    .then((response) => {
      expect(response.body.messages).toContainEqual({
        message: "Password should be of length between 4 and 20 characters",
        field: "password",
      });
    });
});
