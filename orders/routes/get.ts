import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@rcrcticket/common";
import express, { NextFunction, Request, Response } from "express";
import { Order } from "../models/order";
import mongoose from "mongoose";
import { param } from "express-validator";

const getRouter = express.Router();

getRouter.get(
  "/api/orders/:orderId",
  [
    param("orderId")
      .isMongoId()
      .withMessage("Order Id should be a valid MongoId"),
  ],
  validateRequest,
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;
    const { id } = req.currentUser;
    const order = await Order.findById(orderId).populate("ticket");
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId.toString() !== id) {
      throw new NotAuthorizedError();
    }
    res.send(order);
  }
);

export default getRouter;
