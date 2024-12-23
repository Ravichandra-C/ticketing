import { TicketUpdatedEvent, Subjects, Publisher } from "@rcrcticket/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
