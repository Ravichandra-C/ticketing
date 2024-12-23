import { PaymentCreatedEvent, Publisher, Subjects } from "@rcrcticket/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCompleted = Subjects.PaymentCompleted;
}
