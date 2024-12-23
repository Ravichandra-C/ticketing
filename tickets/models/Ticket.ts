import mongoose, { Model, Schema, Types } from "mongoose";

export interface ITicket {
  title: string;
  price: number;
  userId: Types.ObjectId;
  orderId: string;
}

export interface ITicketDocument extends Document, ITicket {
  createdAt: string;
  updatedAt: string;
  version: number;
}

const ticketSchema = new Schema<
  ITicket,
  Model<ITicket>,
  {},
  {},
  {},
  {},
  {},
  ITicketDocument,
  {}
>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    orderId: {
      type: String,
    },
  },
  {
    toJSON: {
      versionKey: false,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    optimisticConcurrency: true,
    versionKey: "version",
    timestamps: true,
  }
);
const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
