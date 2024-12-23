import mongoose from "mongoose";
import Ticket, { ITicket, ITicketDocument } from "../Ticket";

it("Implement OCC to mongoose", async () => {
  const ticket = await new Ticket({
    userId: new mongoose.Types.ObjectId(),
    title: "Ticket title",
    price: 10,
  }).save();

  const ticket1 = await Ticket.findById(ticket.id);
  const ticket2 = await Ticket.findById(ticket._id);
  console.log({ ticket2 });

  ticket1!.title = "Hello";
  await ticket1!.save();

  ticket2!.title = "red";
  try {
    await ticket2!.save();
  } catch (err) {
    console.log({ err });
  }
});

it("Version number gets incremented when a save is happended", async () => {
  const ticket = await new Ticket({
    userId: new mongoose.Types.ObjectId(),
    title: "Ticket title",
    price: 10,
  }).save();
  expect(ticket.version).toEqual(0);
  ticket.title = "Hello";
  await ticket.save();
  console.log({ ticket });

  expect(ticket.version).toEqual(1);
  ticket.title = "red";
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
