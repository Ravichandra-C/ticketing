import { connect } from "mongoose";
import { DatabaseConnectionError } from "@rcrcticket/common";

export async function connectDb() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("Incorrect Mongo URI");
    }

    await connect(process.env.MONGO_URI);
    // await connect("mongodb://IN-XALT107895.local:27017/auth");
    console.log("successfully connected to mongo db");
  } catch (err) {
    console.log(err);
    console.error("Failed connecting to database");

    throw new DatabaseConnectionError();
  }
}
