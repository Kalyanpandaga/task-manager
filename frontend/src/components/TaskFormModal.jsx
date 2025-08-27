import React, { useEffect, useState } from "react";
import Select from "react-select";
import { apiClient } from "../lib/api";
import {
  getTodayLocal,
  toUTCDateString,
  toLocalInputValue,
} from "../utils/date";

export default function TaskFormModal({ initial, onClose }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [deadline, setDeadline] = useState(initial?.deadline || "");
  const [status, setStatus] = useState(initial?.status || "TODO");
  const [assignedUsers, setAssignedUsers] = useState(
    initial?.assignedUsers?.map((u) => ({
      value: u._id,
      label: `${u.name} (${u.email})`,
    })) || []
  );
  const [interns, setInterns] = useState([]);
  const [error, setError] = useState(null);

  const today = getTodayLocal();

  useEffect(() => {
    fetchInterns();
  }, []);

  async function fetchInterns() {
    try {
      const res = await apiClient.getUsers({ role: "INTERN" });
      setInterns(
        res.users.map((u) => ({
          value: u._id,
          label: `${u.name} (${u.email})`,
        }))
      );
    } catch (err) {
      console.error("Error fetching interns:", err);
    }
  }

  const handleDateChange = (e) => {
    const localDate = e.target.value;
    setDeadline(localDate ? toUTCDateString(localDate) : "");
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const payload = {
      title,
      description,
      status,
      deadline,
      assignedUsers: assignedUsers.map((u) => u.value),
    };

    try {
      if (initial) {
        await apiClient.updateTask(initial._id, payload);
      } else {
        await apiClient.createTask(payload);
      }
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.errorMessage || "Something went wrong");
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          {initial ? "Edit Task" : "Create New Task"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            className="input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Due Date</label>
              <input
                type="date"
                className="input"
                value={toLocalInputValue(deadline)}
                onChange={handleDateChange}
                min={today}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Status</label>
              <select
                className="input"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Assign to Intern(s)
            </label>
            <Select
              isMulti
              options={interns}
              value={assignedUsers}
              onChange={setAssignedUsers}
              placeholder="Search interns..."
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {initial ? "Update Task" : "Create Task"}
            </button>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
        </form>
      </div>
    </div>
  );
}
