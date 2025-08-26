import express from "express";
import { login } from "../controllers/auth.controller.js";
import validateRequest from "../middlewares/validate.middleware.js";
import { validateLoginData } from "../utils/validations/validateUserData.js";

const router = express.Router();

router.post("/login", validateRequest(validateLoginData), login);

export default router;
