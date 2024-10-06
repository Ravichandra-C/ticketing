import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

router.get(
  "/api/users/sign-out",
  async (req: Request, res: Response, next: NextFunction) => {
    req.session = null;

    res.json({});
  }
);
export { router as signOutRouter };
