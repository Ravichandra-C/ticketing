import {
  Listener,
  OrderCreatedEvent,
  orderStatus,
  Subjects,
} from "@rcrcticket/common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;
  async onMessage(
    data: OrderCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const order = new Order({
      _id: data.id,
      status: data.status,
      ticket: data.ticket.id,
      userId: data.userId,
      version: data.version,
      price: data.ticket.price,
    });
    await order.save();
    console.log({ order });

    msg.ack();
  }
}
