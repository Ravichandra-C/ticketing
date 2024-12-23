import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@rcrcticket/common";
import express, { NextFunction, Request, Response } from "express";
import Ticket from "../models/Ticket";
import { body } from "express-validator";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import natsWrapper from "../nats-wrapper";

const updateRouter = express.Router();

updateRouter.use("/", requireAuth);
updateRouter.put(
  "/api/tickets/:id",
  [
    body("title")
      .optional()
      .notEmpty()
      .isString()
      .withMessage("title should be a string"),
    body("price")
      .optional()
      .isFloat({ gt: 0 })
      .withMessage("Price Must be a number"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { title, price } = req.body;
    const userId = req.currentUser.id;
    try {
      const ticket = await Ticket.findById(id);
      if (!ticket) {
        throw new NotFoundError();
      }

      if (userId !== String(ticket.userId)) {
        throw new NotAuthorizedError();
      }
      if (ticket.orderId) {
        throw new BadRequestError("Ticket is not editable");
      }
      if (title) {
        ticket.title = title;
      }
      if (price) {
        ticket.price = price;
      }
      await ticket.save();
      await new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        price: ticket.price.toString(),
        title: ticket.title,
        userId: ticket.userId.toString(),
        version: ticket.version,
        orderId: ticket.orderId.toString(),
      });
      res.send(ticket);
    } catch (err) {
      next(err);
    }
  }
);
export default updateRouter;
