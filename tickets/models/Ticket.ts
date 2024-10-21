import mongoose, { Schema, Types } from "mongoose";

export interface ITicket {
  title: string;
  price: number;
  userId: Types.ObjectId;
}

export interface ITicketDocument extends Document, ITicket {
  createdAt: string;
  updatedAt: string;
}

const ticketSchema = new Schema<ITicket>(
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
  },
  {
    toJSON: {
      versionKey: false,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    timestamps: true,
  }
);
const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
