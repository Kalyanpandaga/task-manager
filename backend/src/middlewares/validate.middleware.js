import { errorResponse } from "../utils/errorResponse.js";

const validateRequest = (validateFn) => {
  return (req, res, next) => {
    try {
      validateFn(req.body);
      next();
    } catch (error) {
      errorResponse(res, 400, "INVALID_INPUT_DATA", error.message);
    }
  };
};

export default validateRequest;
