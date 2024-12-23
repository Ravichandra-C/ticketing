import mongoose, {
  Document,
  HydratedDocument,
  Model,
  Schema,
  Types,
} from "mongoose";
import { Order } from "./order";
import { orderStatus } from "@rcrcticket/common";

export interface ITicket {
  _id: mongoose.Schema.Types.ObjectId;
  title: string;
  price: number;
  id: Types.ObjectId;
  isReserved(): Promise<boolean>;
  version: number;
}

interface TicketModel extends Model<ITicket> {
  findByEvent(
    id: string,
    version: number
  ): Promise<HydratedDocument<ITicket, {}> | null>;
}

const ticketSchema = new Schema<ITicket, TicketModel>(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    statics: {
      findByEvent: async function (id: string, version: number) {
        return this.findOne({
          _id: new mongoose.Types.ObjectId(id),
          version: version - 1,
        });
      },
    },
    versionKey: "version",
    optimisticConcurrency: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    timestamps: true,
    _id: false,
  }
);

// ticketSchema.statics.findByEvent = async function (
//   id: string,
//   version: number
// ) {
//   return this.findOne({
//     _id: new mongoose.Types.ObjectId(id),
//     version: version - 1,
//   });
// };

ticketSchema.method("isReserved", async function () {
  const orderExists = await Order.findOne({
    ticket: this._id,
    status: {
      $ne: orderStatus.Cancelled,
    },
  });
  return !!orderExists;
});

export const Ticket = mongoose.model<ITicket, TicketModel>(
  "Ticket",
  ticketSchema
);
