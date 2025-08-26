import User from "../models/User.js";
import { errorResponse } from "../utils/errorResponse.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return errorResponse(
        res,
        401,
        "INVALID_CREDENTIALS",
        "Invalid email or password"
      );

    const isValid = await user.validatePassword(password);
    if (!isValid)
      return errorResponse(
        res,
        401,
        "INVALID_CREDENTIALS",
        "Invalid email or password"
      );

    const token = await user.getJwt();
    res.status(200).json({
      user: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (err) {
    return errorResponse(res, 500, "LOGIN_ERROR", err.message);
  }
};
