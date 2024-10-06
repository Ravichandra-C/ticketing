import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  reason = "Error connecting to database";
  statusCode: number = 500;
  constructor() {
    super();
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeError(): { message: string; field?: string | undefined }[] {
    return [
      {
        message: this.reason,
      },
    ];
  }
}
