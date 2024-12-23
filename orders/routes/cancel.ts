import {
  NotAuthorizedError,
  NotFoundError,
  orderStatus,
} from "@rcrcticket/common";
import express, { NextFunction, Request, Response } from "express";
import { Order } from "../models/order";
import { OrderCancelledPublisher } from "../events/order-cancelled-publisher";
import natsWrapper from "../nats-wrapper";
import { requireAuth } from "../middlewares/require-auth";

const deleteRouter = express.Router();

deleteRouter.delete(
  "/api/orders/:orderId",
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
    order.status = orderStatus.Cancelled;
    await order.save();
    new OrderCancelledPublisher(natsWrapper.client).publish({
      version: order.version,
      id: order.id,
      ticket: {
        id: order.ticket.id.toString(),
      },
    });
    res.send(order);
  }
);

export default deleteRouter;
