import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { JWT_SECRET_KEY } from "../config/constants.js";
import { errorResponse } from "../utils/errorResponse.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return errorResponse(res, 401, "AUTH_REQUIRED", "Authentication required");
    }

    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return errorResponse(res, 401, "USER_NOT_FOUND", "User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 401, "INVALID_TOKEN", error.message);
  }
};

export default authMiddleware;
