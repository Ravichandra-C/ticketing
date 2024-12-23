import {
  ExpirationCompletedEvent,
  Listener,
  NotFoundError,
  orderStatus,
  Subjects,
} from "@rcrcticket/common";
import { queueGroupName } from "./listeners/queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../models/order";
import { OrderCancelledPublisher } from "./order-cancelled-publisher";
import natsWrapper from "../nats-wrapper";

export class ExpirationCompleteListener extends Listener<ExpirationCompletedEvent> {
  subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
  queueGroupName: string = queueGroupName;
  async onMessage(data: { orderId: string }, msg: Message): Promise<void> {
    const order = await Order.findById(data.orderId).populate("ticket");
    if (!order) {
      throw new NotFoundError();
    }
    if (order.status == orderStatus.Completed) {
      msg.ack();
      return;
    }
    order.status = orderStatus.Cancelled;
    await order.save();
    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id.toString(),
      ticket: {
        id: order.ticket.id.toString(),
      },
      version: order.version,
    });
    msg.ack();
  }
}
