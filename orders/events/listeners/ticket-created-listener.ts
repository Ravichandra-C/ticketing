import { Listener, Subjects, TicketCreatedEvent } from "@rcrcticket/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;
  async onMessage(
    data: TicketCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const { title, price, id } = data;

    await new Ticket({
      _id: new mongoose.Types.ObjectId(id),
      title,
      price,
    }).save();

    msg.ack();
  }
}
