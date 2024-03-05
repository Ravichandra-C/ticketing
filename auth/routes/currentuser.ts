import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

router.post(
  "/api/users/current-user",
  [],
  async (req: Request, res: Response, next: NextFunction) => {
    res.send("ok");
  }
);
export { router as currentUserRouter };
