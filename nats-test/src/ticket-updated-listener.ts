import { TicketUpdatedEvent, Subjects, Listener } from "@rcrcticket/common";
import { Message } from "node-nats-streaming";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName: string = "payments-service";
  onMessage(
    data: { id: string; title: string; price: string; userId: string },
    msg: Message
  ): void {
    console.log("Ticket Updated " + msg.getSequence());
    msg.ack();
  }
}
