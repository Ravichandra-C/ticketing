import mongoose, { Document, Schema, model } from "mongoose";
import { Password } from "../util/common/Password";

interface IUser {
  email: string;
  password: string;
}

export interface UserDocument extends Document, IUser {
  createdAt: string;
  updatedAt: string;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      versionKey: false,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret.password;
        delete ret._id;
      },
    },
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.set("password", await Password.toHash(this.get("password")));
  }

  next();
});

const User = model("User", userSchema);

export default User;
