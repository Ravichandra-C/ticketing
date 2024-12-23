import {
  Listener,
  NotFoundError,
  Subjects,
  TicketUpdatedEvent,
} from "@rcrcticket/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(
    data: TicketUpdatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const { id, title, price, version } = data;

    const ticket = await Ticket.findByEvent(id, version);

    if (!ticket) {
      throw new NotFoundError();
    }
    // console.log({ ticket });

    ticket.title = title;
    ticket.price = Number(price);
    // ticket.version += 1;
    await ticket.save();

    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      {
        $inc: { version: 1 },
      },
      { new: true }
    );
    // console.log({ ticket });
    console.log({ updatedTicket });

    msg.ack();
  }
}
