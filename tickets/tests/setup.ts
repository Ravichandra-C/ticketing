import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { connections } from "mongoose";
import jwt from "jsonwebtoken";
let mongo: MongoMemoryServer;
process.env.JWT_KEY = "hvcshdvchgdvchgdvsh";

// types/global.d.ts
declare global {
  var signin: () => string[];
}

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db?.collections();
  if (collections) {
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  if (mongo) {
    mongoose.disconnect();
    await mongo.stop();
  }
});

globalThis.signin = () => {
  //create a payload
  const id = new mongoose.Types.ObjectId().toHexString();
  const payload = {
    id,
    email: "ravi@gmail.com",
  };

  //sign the payload
  const userJwt = jwt.sign(payload, process.env.JWT_KEY || "");

  //base64 encode the string

  const encodedJwt = Buffer.from(JSON.stringify({ jwt: userJwt })).toString(
    "base64"
  );

  return [`session=${encodedJwt}`];
};
