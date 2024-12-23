import mongoose, { Schema } from "mongoose";

interface IPayment {
  stripeId: string;
  orderId: string;
  version: number;
}

const paymentSchema = new Schema<IPayment>(
  {
    stripeId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      versionKey: false,
      transform: (doc, ret) => {
        (ret.id = ret._id), delete ret._id;
      },
    },
    optimisticConcurrency: true,
    versionKey: "version",
  }
);

export const Payment = mongoose.model("Payments", paymentSchema);
