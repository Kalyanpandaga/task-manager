export const validateCreateTaskData = (taskData) => {
  const { title, description, deadline, assignedUsers, status, priority } =
    taskData;

  if (!title || title.length < 3 || title.length > 100) {
    throw new Error("Task title must be between 3 and 100 characters");
  }

  if (!description || description.length < 5 || description.length > 500) {
    throw new Error("Task description must be between 5 and 500 characters");
  }

  if (!deadline || isNaN(Date.parse(deadline))) {
    throw new Error("A valid deadline date is required");
  }

  const deadlineDate = new Date(deadline);
  const today = new Date();

  if (deadlineDate < today) {
    throw new Error("Deadline cannot be in the past");
  }

  if (!Array.isArray(assignedUsers) || assignedUsers.length === 0) {
    throw new Error("At least one assigned user (intern/employee) is required");
  }

  if (status && !["TODO", "IN_PROGRESS", "DONE"].includes(status)) {
    throw new Error("Status must be one of 'TODO', 'IN_PROGRESS', 'DONE'");
  }

  if (priority && !["LOW", "MEDIUM", "HIGH"].includes(priority)) {
    throw new Error("Priority must be one of 'LOW', 'MEDIUM', 'HIGH'");
  }
};

export const validateUpdateTaskData = (taskData) => {
  const allowedFields = [
    "title",
    "description",
    "deadline",
    "assignedUsers",
    "status",
  ];
  const updateFields = Object.keys(taskData);

  if (updateFields.length === 0) {
    throw new Error("No data provided to update");
  }

  for (const field of updateFields) {
    const value = taskData[field];

    if (!allowedFields.includes(field)) {
      throw new Error(`Invalid field: ${field}`);
    }

    if (field === "title") {
      if (!value || value.length < 3 || value.length > 100) {
        throw new Error("Task title must be between 3 and 100 characters");
      }
    }

    if (field === "description") {
      if (!value || value.length < 5 || value.length > 500) {
        throw new Error(
          "Task description must be between 5 and 500 characters"
        );
      }
    }

    if (field === "deadline") {
      if (!value || isNaN(Date.parse(value))) {
        throw new Error("A valid deadline date is required");
      }

      const deadlineDate = new Date(value);
      const today = new Date();

      if (deadlineDate < today) {
        throw new Error("Deadline cannot be in the past");
      }
    }

    if (field === "assignedUsers") {
      if (!Array.isArray(value) || value.length === 0) {
        throw new Error(
          "At least one assigned user (intern/employee) is required"
        );
      }
    }

    if (field === "status") {
      if (!["TODO", "IN_PROGRESS", "DONE"].includes(value)) {
        throw new Error("Status must be one of 'TODO', 'IN_PROGRESS', 'DONE'");
      }
    }

    if (field === "priority") {
      if (!["LOW", "MEDIUM", "HIGH"].includes(value)) {
        throw new Error("Priority must be one of 'LOW', 'MEDIUM', 'HIGH'");
      }
    }
  }
};
