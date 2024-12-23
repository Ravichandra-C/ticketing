import {
  Listener,
  OrderCancelledEvent,
  orderStatus,
  Subjects,
} from "@rcrcticket/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queueGroupName";
import { Order } from "../../models/orders";
import mongoose from "mongoose";
import { version } from "os";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName: string = queueGroupName;
  async onMessage(
    data: OrderCancelledEvent["data"],
    msg: Message
  ): Promise<void> {
    const order = await Order.findOne({
      _id: new mongoose.Types.ObjectId(data.id),
      version: data.version,
    });

    if (!order) {
      throw new Error("Order not found");
    }

    order.status = orderStatus.Cancelled;
    await order.save();
    msg.ack();
  }
}
