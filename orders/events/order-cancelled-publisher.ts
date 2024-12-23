import { OrderCancelledEvent, Publisher, Subjects } from "@rcrcticket/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
