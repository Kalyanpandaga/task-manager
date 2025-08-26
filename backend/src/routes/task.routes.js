import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { hasRole } from "../middlewares/role.middleware.js";
import validateRequest from "../middlewares/validate.middleware.js";
import {
  validateCreateTaskData,
  validateUpdateTaskData,
} from "../utils/validations/validateTaskData.js";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";

const router = express.Router();

// Manager can create
router.post(
  "/create",
  authMiddleware,
  hasRole(["MANAGER"]),
  validateRequest(validateCreateTaskData),
  createTask
);

// Both roles can view (manager: all, intern: own)
router.get("/", authMiddleware, getAllTasks);
router.get("/:taskId", authMiddleware, getTaskById);

// Update (manager: any field, intern: only their own task’s status)
router.put(
  "/update/:taskId",
  authMiddleware,
  validateRequest(validateUpdateTaskData),
  updateTask
);

// Delete (manager only)
router.delete(
  "/delete/:taskId",
  authMiddleware,
  hasRole(["MANAGER"]),
  deleteTask
);

export default router;
