import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";
interface Event {
  subject: string;
  data: any;
}
export abstract class Listener<T extends Event> {
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  abstract onMessage(data: T["data"], msg: Message): void;
  private stan: Stan;
  protected ackWait: number = 5 * 1000;
  constructor(stan: Stan) {
    this.stan = stan;
  }
  subscriptionOptions() {
    return this.stan
      .subscriptionOptions()
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName)
      .setManualAckMode(true)
      .setDeliverAllAvailable();
  }
  onListen() {
    const sub = this.stan.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );
    sub.on("message", (msg: Message) => {
      console.log(
        "Received Message " + msg.getSequence() + " data " + msg.getData()
      );
      this.onMessage(this.parseMessage(msg), msg);
    });
  }

  parseMessage(msg: Message): any {
    const data = msg.getData();

    if (typeof data === "string") {
      return JSON.parse(data);
    } else {
      return JSON.parse(data.toString());
    }
  }
}
