import {
  BadRequestError,
  NotFoundError,
  orderStatus,
  validateRequest,
} from "@rcrcticket/common";
import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";
import { OrderCreatedPublisher } from "../events/order-created-publisher";
import natsWrapper from "../nats-wrapper";
import { requireAuth } from "../middlewares/require-auth";

const createRouter = express.Router();
const EXPIRATION_WINDOW_SECONDS = 15 * 60;
createRouter.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .notEmpty()
      .withMessage("Ticket Id is required")
      .bail()
      .isMongoId()
      .withMessage("Ticket Id should be a mongoId"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { ticketId } = req.body;
    const { id } = req.currentUser;
    try {
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) {
        throw new NotFoundError();
      }

      const isReserved = await ticket.isReserved();

      if (isReserved) {
        throw new BadRequestError("Ticket is already reserved.");
      }

      const expiration = new Date();

      expiration.setSeconds(
        expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS
      );

      const order = new Order({
        ticket,
        expiresAt: expiration,
        status: orderStatus.Created,
        userId: id,
      });

      await order.save();

      new OrderCreatedPublisher(natsWrapper.client).publish({
        version: order.version,
        id: order._id.toString(),
        userId: id,
        status: order.status,
        expiresAt: order.expiresAt.toISOString(),
        ticket: {
          id: ticket.id,
          price: ticket.price,
        },
      });
      res.status(201).send(order);
    } catch (err) {
      next(err);
    }
  }
);

export default createRouter;
