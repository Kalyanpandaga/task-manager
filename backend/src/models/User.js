import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  JWT_SECRET_KEY,
  JWT_SECRET_EXPIRES_IN,
  BCRYPT_ROUNDS,
} from "../config/constants.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minLength: 5,
      maxLength: 100,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid email address, invalid email: " + value);
        }
      },
    },
    password: {
      type: String,
      minLength: 8,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "Password must be strong (min 8 chars, with letters, numbers & symbols)"
          );
        }
      },
    },
    role: {
      type: String,
      required: true,
      enum: ["INTERN", "MANAGER"],
    },
  },
  { timestamps: true }
);

userSchema.methods.getJwt = async function () {
  const user = this;
  const token = await jwt.sign({ userId: user._id }, JWT_SECRET_KEY, {
    expiresIn: JWT_SECRET_EXPIRES_IN,
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const hashedPassword = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    hashedPassword
  );
  return isPasswordValid;
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, BCRYPT_ROUNDS);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
