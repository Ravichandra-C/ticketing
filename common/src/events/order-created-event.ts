import { orderStatus } from "../types/order-status";
import { Subjects } from "./subjects";
export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated;
  data: {
    version: number;
    id: string;
    userId: string;
    status: orderStatus;
    expiresAt: string;
    ticket: {
      id: string;
      price: number;
    };
  };
}
