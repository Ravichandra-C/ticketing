import { NextFunction, Request, Response } from "express";
import { NotAuthorizedError } from "@rcrcticket/common";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }
  next();
}
