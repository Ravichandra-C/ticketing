import { Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T["subject"];
  protected stan: Stan;
  constructor(stan: Stan) {
    this.stan = stan;
  }
  publish(data: T["data"]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.stan.publish(this.subject, JSON.stringify(data), (err, guid) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        console.log("Published the data with guid " + guid);
        resolve();
      });
    });
  }
}
