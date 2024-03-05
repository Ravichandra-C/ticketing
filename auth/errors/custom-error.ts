export abstract class CustomError extends Error {
  abstract reason: string;
  abstract statusCode: number;
  abstract serializeError(): { message: string; field?: string }[];
}
