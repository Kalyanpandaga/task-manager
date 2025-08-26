import { errorResponse } from "../utils/errorResponse.js";

export const hasRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return errorResponse(res, 403, "FORBIDDEN", "Insufficient permissions");
    }
    next();
  };
};
