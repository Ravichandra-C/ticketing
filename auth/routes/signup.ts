import express, { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email should be a valid email"),
    body("password")
      .isLength({ min: 4, max: 20 })
      .withMessage("Password should be of length between 4 and 20 characters"),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (errors.array().length) {
      res.status(400).json(errors.array());
      return;
    }

    res.json({ data: "OK" });
  }
);

router.get(
  "/api/users/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    res.json({ data: "OK" });
  }
);
export { router as signupRouter };
