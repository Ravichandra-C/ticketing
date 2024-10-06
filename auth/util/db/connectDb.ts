import { connect } from "mongoose";
import { DatabaseConnectionError } from "../../../common/src/errors/database-connection-error";

export async function connectDb() {
  try {
    await connect("mongodb://auth-mongo-srv:27017/auth");
    // await connect("mongodb://IN-XALT107895.local:27017/auth");
    console.log("successfully connected to mongo db");
  } catch (err) {
    console.log(err);
    console.error("Failed connecting to database");

    throw new DatabaseConnectionError();
  }
}
