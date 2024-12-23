import { OrderCreatedEvent, Publisher, Subjects } from "@rcrcticket/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
