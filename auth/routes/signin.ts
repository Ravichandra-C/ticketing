import express, { NextFunction, Request, Response } from "express";
import { validateRequest } from "@rcrcticket/common";
import { body } from "express-validator";
import User from "../models/User";
import { BadRequestError } from "@rcrcticket/common";
import { Password } from "../util/common/Password";
import jwt from "jsonwebtoken";
const router = express.Router();

router.post(
  "/api/users/sign-in",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .notEmpty()
      .withMessage("Please provide the password")
      .bail()
      .isLength({ min: 4, max: 25 })
      .withMessage(
        "Password should be of minimum length 4 and maximum length 25"
      ),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        throw new BadRequestError("Invalid Credentials");
      }

      if (!(await Password.validatePassword(password, existingUser.password))) {
        throw new BadRequestError("Invalid Credentials");
      }

      //Generate JSON web token
      const userJwt = jwt.sign(
        {
          id: existingUser._id,
          email: existingUser.email,
        },
        process.env.JWT_KEY!
      );

      req.session = {
        jwt: userJwt,
      };

      res.json(existingUser);
    } catch (err) {
      next(err);
    }
  }
);
export { router as signInRouter };
