import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { connections } from "mongoose";
let mongo: MongoMemoryServer;
process.env.JWT_KEY = "hvcshdvchgdvchgdvsh";
beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    mongoose.disconnect();
    await mongo.stop();
  }
});
