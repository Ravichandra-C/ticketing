import { Subjects } from "./subjects";

export interface PaymentCreatedEvent {
  subject: Subjects.PaymentCompleted;
  data: {
    orderId: string;
    stripeId: string;
  };
}
