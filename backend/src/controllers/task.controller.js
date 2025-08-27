import Task from "../models/Task.js";
import { errorResponse } from "../utils/errorResponse.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, deadline, status, assignedUsers, priority } =
      req.body;

    const deadlineDate = new Date(deadline);

    const task = await Task.create({
      title,
      description,
      deadline: deadlineDate,
      status,
      priority: priority ? priority : "MEDIUM",
      assignedUsers,
      createdBy: req.user._id,
    });

    res.status(201).json({ createdTask: task });
  } catch (err) {
    return errorResponse(res, 500, "CREATE_TASK_ERROR", err.message);
  }
};

export const getAllTasks = async (req, res) => {
  try {
    let tasks;

    if (req.user.role === "MANAGER") {
      // Manager sees all tasks
      tasks = await Task.find().populate("assignedUsers", "name email role");
    } else {
      // Intern sees only tasks where they are assigned
      tasks = await Task.find({ assignedUsers: req.user._id }).populate(
        "assignedUsers",
        "name email role"
      );
    }

    res.status(200).json({ tasks });
  } catch (err) {
    return errorResponse(res, 500, "GET_ALL_TASKS_ERROR", err.message);
  }
};

export const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;
    const user = req.user;

    const task = await Task.findById(taskId).populate(
      "assignedUsers",
      "name email role"
    );

    if (!task) {
      return errorResponse(res, 404, "TASK_NOT_FOUND", "Task not found");
    }

    // INTERN restriction: can only view their own assigned tasks
    if (user.role === "INTERN") {
      const isAssigned = task.assignedUsers.some(
        (assignedUser) => assignedUser._id.toString() === user._id.toString()
      );
      if (!isAssigned) {
        return errorResponse(
          res,
          403,
          "USER_HAS_NO_ACCESS",
          "You are not assigned to this task"
        );
      }
    }

    return res.status(200).json({ task });
  } catch (err) {
    return errorResponse(res, 500, "GET_TASK_ERROR", err.message);
  }
};

// Update Task (MANAGER: any, INTERN: only own status on assigned tasks)
export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const user = req.user;
    const updateData = req.body;

    // Intern restrictions
    if (user.role === "INTERN") {
      const task = await Task.findById(taskId);
      if (!task) {
        return errorResponse(res, 404, "TASK_NOT_FOUND", "Task not found");
      }

      // Ensure intern is assigned to this task
      const isAssigned = task.assignedUsers.some(
        (assignedUser) => assignedUser.toString() === user._id.toString()
      );

      if (!isAssigned) {
        return errorResponse(
          res,
          403,
          "USER_HAS_NO_ACCESS",
          "You are not assigned to this task"
        );
      }

      // Ensure they only update "status"
      const updateFields = Object.keys(updateData);
      if (updateFields.length !== 1 || updateFields[0] !== "status") {
        return errorResponse(
          res,
          403,
          "USER_HAS_NO_ACCESS",
          "Interns/employees can only update the task status"
        );
      }
    }

    // Safe update (only allowed fields are updated)
    const allowedFields = [
      "title",
      "description",
      "deadline",
      "status",
      "priority",
      "assignedUsers",
    ];
    const safeUpdate = {};
    for (const key of Object.keys(updateData)) {
      if (allowedFields.includes(key)) {
        safeUpdate[key] = updateData[key];
      }
    }

    if (safeUpdate.deadline) {
      const deadlineDate = new Date(safeUpdate.deadline);
      safeUpdate.deadline = deadlineDate;
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, safeUpdate, {
      new: true,
    });

    if (!updatedTask) {
      return errorResponse(res, 404, "TASK_NOT_FOUND", "Task not found");
    }

    return res.status(200).json({ updatedTask });
  } catch (err) {
    return errorResponse(res, 500, "UPDATE_TASK_ERROR", err.message);
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findByIdAndDelete(taskId);
    if (!task)
      return errorResponse(res, 404, "TASK_NOT_FOUND", "Task not found");

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    return errorResponse(res, 500, "DELETE_TASK_ERROR", err.message);
  }
};
