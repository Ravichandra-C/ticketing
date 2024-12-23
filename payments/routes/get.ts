import express from "express";
const getRouter = express.Router();
getRouter.get("/api/payments", async (req, res, next) => {
  res.send({ data: "ok" });
});

export default getRouter;
