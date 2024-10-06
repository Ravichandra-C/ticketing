import express, { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import User from "../models/User";
import { BadRequestError } from "@rcrcticket/common";
import jwt from "jsonwebtoken";
import { validateRequest } from "@rcrcticket/common";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email should be a valid email"),
    body("password")
      .isLength({ min: 4, max: 20 })
      .withMessage("Password should be of length between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).lean();

      if (user) {
        throw new BadRequestError("User with same email already exists");
      }

      const newUser = new User({ email, password });
      await newUser.save();

      //Generate JSON web token
      const userJwt = jwt.sign(
        {
          id: newUser._id,
          email: newUser.email,
        },
        process.env.JWT_KEY!
      );

      //Store in the session

      req.session = {
        jwt: userJwt,
      };
      res.status(201).send(newUser);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/api/users/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    res.json({ data: "OK" });
  }
);
export { router as signupRouter };
