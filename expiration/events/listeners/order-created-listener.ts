import {
  Listener,
  OrderCreatedEvent,
  orderStatus,
  Subjects,
} from "@rcrcticket/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queue/expiration-queue";

export class OrderCreatedEventListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;
  async onMessage(
    data: OrderCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const expireDelay: number =
      new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log({ expiresAt: new Date(data.expiresAt), expireDelay });
    await expirationQueue.add(
      "order-expiration",
      {
        orderId: data.id,
      },
      {
        delay: 120000,
      }
    );
    msg.ack();
  }
}
