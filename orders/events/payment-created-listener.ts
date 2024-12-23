import {
  Listener,
  NotFoundError,
  orderStatus,
  PaymentCreatedEvent,
  Subjects,
} from "@rcrcticket/common";
import { queueGroupName } from "./listeners/queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCompleted = Subjects.PaymentCompleted;
  queueGroupName: string = queueGroupName;
  async onMessage(
    data: { orderId: string; stripeId: string },
    msg: Message
  ): Promise<void> {
    const order = await Order.findById(data.orderId);
    if (!order) {
      throw new NotFoundError();
    }
    order.status = orderStatus.Completed;

    await order.save();
    msg.ack();
  }
}
