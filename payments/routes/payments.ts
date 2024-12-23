import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  orderStatus,
  validateRequest,
} from "@rcrcticket/common";
import { NextFunction, Router, Request, Response } from "express";
import { body } from "express-validator";
import { Order } from "../models/orders";
import { Payment } from "../models/payments";
import mongoose, { Types } from "mongoose";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import natsWrapper from "../nats-wrapper";

const createRouter = Router();

createRouter.post(
  "/api/payments",
  [
    body("orderId")
      .exists()
      .isMongoId()
      .withMessage("OrderId Must be a Valid Mongoid"),
    body("stripeId").exists().withMessage("Stripe CHarge Id i s needed"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId, stripeId } = req.body;
    console.log({ orderId, stripeId });

    const order = await Order.findById(orderId);
    console.log({ order });

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === orderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for Cancelled Orders");
    }
    const payment = new Payment({
      orderId: orderId,
      stripeId: stripeId,
    });

    //should send the payment to stripe but not doing it as it requires additional time setup
    await payment.save();
    new PaymentCreatedPublisher(natsWrapper.client).publish({
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });
    res.send({ success: "ok" });
  }
);

export default createRouter;
