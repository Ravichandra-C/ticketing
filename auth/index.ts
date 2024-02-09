import express from "express";
import { signupRouter } from "./routes/signup";
import { signInRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";
import { currentUserRouter } from "./routes/currentuser";

const app = express();
app.use(signInRouter);
app.use(signupRouter);
app.use(signOutRouter);
app.use(currentUserRouter);
// app.get("/api/users", (req, res) => res.send("hello"));

app.listen("3000", () => console.log("Auth Server is running on port 3000"));
