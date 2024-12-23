import { Listener, OrderCancelledEvent, Subjects } from "@rcrcticket/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import Ticket from "../../models/Ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName: string = queueGroupName;
  async onMessage(
    data: { id: string; version: number; ticket: { id: string } },
    msg: Message
  ): Promise<void> {
    const id = data.ticket.id;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new Error("Ticket Not found");
    }

    ticket.set("orderId", undefined);

    await ticket.save();

    await new TicketUpdatedPublisher(this.stan).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price + "",
      userId: ticket.userId.toString(),
      orderId: ticket.orderId,
    });
    msg.ack();
  }
}
