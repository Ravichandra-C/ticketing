import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
  reason: string = "Validation Failed";
  statusCode = 403;
  constructor(public errors: ValidationError[]) {
    super();
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeError(): { message: string; field?: string }[] {
    const formattedErrors = this.errors.map((error: ValidationError) => {
      if (error.type === "field") {
        return { message: error.msg as string, field: error.path as string };
      } else {
        return {
          message: error.msg,
        };
      }
    });
    return formattedErrors;
  }
}
