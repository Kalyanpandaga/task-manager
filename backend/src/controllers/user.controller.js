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

export const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({ user });
  } catch (err) {
    return errorResponse(res, 500, "GET_USER_ERROR", err.message);
  }
};

export const getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    if (role && !["INTERN", "EMPLOYEE", "MANAGER"].includes(role)) {
      return errorResponse(
        res,
        400,
        "INVALID_ROLE",
        "Invalid role filter, role must be one of INTERN, EMPLOYEE, MANAGER"
      );
    }
    const filter = role ? { role } : {};
    const users = await User.find(filter).select("-password");
    res.status(200).json({ users });
  } catch (err) {
    return errorResponse(res, 500, "GET_USERS_ERROR", err.message);
  }
};
