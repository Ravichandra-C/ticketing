import nats, { Stan, StanOptions } from "node-nats-streaming";

class NatsWrapper {
  private _client?: nats.Stan;

  get client() {
    if (!this._client) {
      throw new Error("Cannot fetch client before connecting");
    }
    return this._client;
  }
  connect(clusterId: string, clientID: string, opts: StanOptions) {
    this._client = nats.connect(clusterId, clientID, opts);
    return new Promise<void>((resolve, reject) => {
      this.client.on("connect", () => {
        console.log("Connected to The NATS server");
        resolve();
      });

      this.client.on("err", () => {
        console.log("Failed to connect to the NATS server");
        reject();
      });
    });
  }
}

export default new NatsWrapper();
