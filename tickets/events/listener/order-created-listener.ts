import {
  Listener,
  NotFoundError,
  OrderCreatedEvent,
  orderStatus,
  Subjects,
} from "@rcrcticket/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import Ticket from "../../models/Ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import natsWrapper from "../../nats-wrapper";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;
  async onMessage(
    data: OrderCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const id = data.ticket.id;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new Error("Ticket Not found");
    }

    ticket.set("orderId", data.id);

    await ticket.save();

    await new TicketUpdatedPublisher(this.stan).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price + "",
      userId: ticket.userId.toString(),
      orderId: ticket.orderId.toString(),
    });
    msg.ack();
  }
}
