import { requireAuth } from "@rcrcticket/common";
import express, { NextFunction, Request, Response } from "express";
import { Order } from "../models/order";

const getAllRouter = express.Router();

getAllRouter.get(
  "/api/orders",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.currentUser;
    const orders = await Order.find({
      userId: id,
    }).populate("ticket");

    res.send(orders);
  }
);

export default getAllRouter;
