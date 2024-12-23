import { orderStatus } from "@rcrcticket/common";
import mongoose, { Schema, Types } from "mongoose";

interface IOrder {
  userId: string;
  status: orderStatus;
  ticket: Types.ObjectId;
  version: number;
  price: number;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: orderStatus,
      required: true,
    },
    ticket: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    price: Number,
  },
  {
    optimisticConcurrency: true,
    versionKey: "version",
    toJSON: {
      versionKey: false,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

export const Order = mongoose.model("Order", orderSchema);
