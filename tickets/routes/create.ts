import { errorHandler, requireAuth, validateRequest } from "@rcrcticket/common";
import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { title } from "process";
import Ticket from "../models/Ticket";
import natsWrapper from "../nats-wrapper";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
const createRouter = express.Router();

createRouter.use(requireAuth);
createRouter.post(
  "/api/tickets",
  [
    body("title")
      .isString()
      .exists()
      .notEmpty()
      .withMessage("Title of Ticket is required"),
    body("price")
      .exists()
      .withMessage("price should be present for a ticket")
      .bail()
      .notEmpty()
      .withMessage("price should be present for a ticket")
      .bail()
      .isFloat({ gt: 0 })
      .withMessage("Price should be greater than zero"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, price } = req.body;
    const userId = req.currentUser.id;
    const ticket = new Ticket({
      title,
      price,
      userId,
    });
    await ticket.save();
    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId.toString(),
      version: ticket.version,
    });
    res.status(201).send(ticket);
  }
);

export default createRouter;
