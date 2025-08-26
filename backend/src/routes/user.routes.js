import express from "express";
import { createUser } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { hasRole } from "../middlewares/role.middleware.js";
import validateRequest from "../middlewares/validate.middleware.js";
import { validateRegisterData } from "../utils/validations/validateUserData.js";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  hasRole(["MANAGER"]),
  validateRequest(validateRegisterData),
  createUser
);

export default router;
