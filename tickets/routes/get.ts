import express, { NextFunction, Request, Response } from "express";
import Ticket from "../models/Ticket";
import { CustomError, NotFoundError } from "@rcrcticket/common";
const getRouter = express.Router();

getRouter.get(
  "/api/tickets/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const ticket = await Ticket.findById(id);
      if (!ticket) {
        throw new NotFoundError();
      }
      res.send(ticket);
    } catch (err) {
      next(err);
    }
  }
);

getRouter.get("/api/tickets", async (req: Request, res: Response) => {
  const tickets = await Ticket.find({}).lean();
  res.send(tickets);
});

export default getRouter;
