import User from "../models/User.js";
import { errorResponse } from "../utils/errorResponse.js";

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 400, "EMAIL_EXISTS", "Email already exists");
    }

    const user = await User.create({ name, email, password, role });

    return res.status(201).json({
      message: "user created successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (err) {
    return errorResponse(res, 500, "CREATE_USER_ERROR", err.message);
  }
};
