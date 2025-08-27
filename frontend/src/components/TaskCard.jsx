import React, { useState, useEffect } from "react";
import { formatDeadline } from "../utils/date";
import { useAuth } from "../contexts/AuthContext";
import { MoreVertical, Edit, Trash2, Calendar } from "lucide-react";

export default function TaskCard({ task, onEdit, onDelete }) {
  const { user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => setDropdownOpen(false);
    if (dropdownOpen) {
      window.addEventListener("click", handleClickOutside);
    }
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownOpen]);

  const hasAssignees = task.assignedUsers && task.assignedUsers.length > 0;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <h4 className="font-semibold text-gray-800 pr-2">{task.title}</h4>
        {user?.role === "MANAGER" && (
          <div className="relative flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen((prev) => !prev);
              }}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <MoreVertical size={18} />
            </button>
            {dropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-10">
                <button
                  onClick={onEdit}
                  className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 text-gray-700 hover:bg-gray-100"
                >
                  <Edit size={14} /> Edit
                </button>
                <button
                  onClick={onDelete}
                  className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 text-red-600 hover:bg-gray-100"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>

      <div>
        <h5 className="text-xs font-medium text-gray-500 mb-2">Assigned To:</h5>
        <div className="flex flex-wrap gap-2">
          {hasAssignees ? (
            task.assignedUsers.map((user) => (
              <span
                key={user._id}
                className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full"
              >
                {user.name}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400">Unassigned</span>
          )}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-3">
        <h5 className="text-xs font-medium text-gray-500 mb-1">Due Date:</h5>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={14} />
          <span>{formatDeadline(task.deadline)}</span>
        </div>
      </div>
    </div>
  );
}
