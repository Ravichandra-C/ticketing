import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

router.post(
  "/api/users/sign-out",
  [],
  async (req: Request, res: Response, next: NextFunction) => {}
);
export { router as signOutRouter };
