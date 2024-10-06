import { CustomError } from "./custom-error";

export class NotAuthorizedError extends CustomError {
  statusCode: number = 401;
  reason: string = "User is not authorized";

  constructor() {
    super();
    Object.setPrototypeOf(this, NotAuthorizedError);
  }
  serializeError(): { message: string; field?: string | undefined }[] {
    return [
      {
        message: this.reason,
      },
    ];
  }
}
