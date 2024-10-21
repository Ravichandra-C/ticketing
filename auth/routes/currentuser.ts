import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { currentUser, requireAuth } from "@rcrcticket/common";
const router = express.Router();

router.get(
  "/api/users/current-user",
  currentUser,
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    res.json({ currentUser: req.currentUser || null });
  }
);
export { router as currentUserRouter };
