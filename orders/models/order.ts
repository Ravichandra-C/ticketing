import { orderStatus } from "@rcrcticket/common";
import mongoose, { Model, Schema, Types } from "mongoose";

export interface IOrder {
  userId: Types.ObjectId;
  status: orderStatus;
  expiresAt: Date;
  ticket: Types.ObjectId;
  version: number;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    expiresAt: {
      type: Schema.Types.Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    ticket: {
      ref: "Ticket",
      type: Schema.Types.ObjectId,
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
    versionKey: "version",
    optimisticConcurrency: true,
    timestamps: true,
  }
);

export const Order = mongoose.model("Order", orderSchema);
