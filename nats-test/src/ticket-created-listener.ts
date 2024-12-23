import { Message } from "node-nats-streaming";
import { Listener, Subjects, TicketCreatedEvent } from "@rcrcticket/common";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = "payments-service";
  onMessage = function (data: TicketCreatedEvent["data"], msg: Message) {
    console.log(data);

    msg.ack();
  };
}
