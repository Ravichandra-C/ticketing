import {
  ExpirationCompletedEvent,
  Listener,
  orderStatus,
  Subjects,
} from "@rcrcticket/common";
import { queueGroupName } from "../queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";
import { OrderCancelledPublisher } from "../../order-cancelled-publisher";

export class ExpirationCompletedListener extends Listener<ExpirationCompletedEvent> {
  subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
  queueGroupName: string = queueGroupName;
  async onMessage(data: { orderId: string }, msg: Message): Promise<void> {
    const order = await Order.findById(data.orderId).populate("ticket");
    if (!order) {
      throw new Error("Order Not Found in Expiration:Completed Listener");
    }
    order.status = orderStatus.Cancelled;

    await order.save();

    await new OrderCancelledPublisher(this.stan).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id.toString(),
      },
    });
    msg.ack();
  }
}
