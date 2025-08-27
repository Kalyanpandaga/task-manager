import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { apiClient } from "../lib/api";
import TaskCard from "./TaskCard.jsx";
import TaskFormModal from "./TaskFormModal.jsx";
import { useAuth } from "../contexts/AuthContext";
import { Plus } from "lucide-react";

const columnsOrder = ["todo", "inprogress", "done"];
const columnLabels = { todo: "To Do", inprogress: "In Progress", done: "Done" };

const statusMap = {
  todo: "TODO",
  inprogress: "IN_PROGRESS",
  done: "DONE",
};

export default function KanbanBoard() {
  const { user } = useAuth();
  const [columns, setColumns] = useState({
    todo: [],
    inprogress: [],
    done: [],
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filterUser, setFilterUser] = useState("");
  const [filterDeadline, setFilterDeadline] = useState("");
  const [filterPriority, setFilterPriority] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    try {
      const tasksData = await apiClient.getTasks();
      const tasks = tasksData.tasks;
      const grouped = { todo: [], inprogress: [], done: [] };

      tasks.forEach((t) => {
        const statusKey = (t.status || "TODO").toLowerCase().replace("_", "");
        grouped[statusKey]?.push(t);
      });

      setColumns(grouped);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredColumns = Object.fromEntries(
    Object.entries(columns).map(([col, tasks]) => [
      col,
      tasks.filter((t) => {
        let ok = true;
        if (filterUser)
          ok = ok && t.assignedUsers.some((u) => u._id === filterUser);
        if (filterDeadline)
          ok = ok && new Date(t.deadline) <= new Date(filterDeadline);
        if (filterPriority) ok = ok && t.priority === filterPriority;
        return ok;
      }),
    ])
  );

  async function onDragEnd(result) {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const moved = columns[source.droppableId][source.index];

    // Permission check: interns can only move their own tasks
    if (
      user?.role === "INTERN" &&
      !moved.assignedUsers.some((u) => u._id === user._id)
    ) {
      console.warn("Intern cannot move unassigned tasks");
      return;
    }

    // Optimistic update
    const sourceCol = Array.from(columns[source.droppableId]);
    sourceCol.splice(source.index, 1);
    const destCol = Array.from(columns[destination.droppableId]);
    destCol.splice(destination.index, 0, moved);

    setColumns((prev) => ({
      ...prev,
      [source.droppableId]: sourceCol,
      [destination.droppableId]: destCol,
    }));

    try {
      await apiClient.updateTask(draggableId, {
        status: statusMap[destination.droppableId],
      });
    } catch (err) {
      console.error(err);
      await fetchTasks(); // rollback if API fails
    }
  }

  async function handleDeleteTask(taskId) {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await apiClient.deleteTask(taskId);
        await fetchTasks();
      } catch (err) {
        console.error("Error deleting task:", err);
        alert("Failed to delete the task. Please try again.");
      }
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Task Board</h2>
          <p className="text-gray-600 mt-1">
            Drag and drop tasks to update their status.
          </p>
        </div>
        {user?.role === "MANAGER" && (
          <button
            className="btn-primary flex items-center gap-2"
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
          >
            <Plus size={16} /> New Task
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-around gap-4 mb-6 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
        {/* User filter */}
        <select
          className="input flex-1 min-w-[160px] max-w-[300px]"
          value={filterUser}
          onChange={(e) => setFilterUser(e.target.value)}
        >
          <option value="">All Users</option>
          {Object.values(columns)
            .flat()
            .flatMap((task) => task.assignedUsers)
            .filter((u, i, arr) => arr.findIndex((x) => x._id === u._id) === i) // unique
            .map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
        </select>

        {/* Deadline filter */}
        <input
          type="date"
          className="input flex-1 min-w-[160px] max-w-[300px]"
          value={filterDeadline}
          onChange={(e) => setFilterDeadline(e.target.value)}
        />

        {/* Priority filter */}
        <select
          className="input flex-1 min-w-[160px] max-w-[300px]"
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>

      {/* Board */}
      {loading ? (
        <div className="text-center text-gray-500">Loading tasks...</div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columnsOrder.map((colId) => (
              <div
                key={colId}
                className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col"
              >
                <h3 className="font-semibold text-gray-700 mb-4 flex items-center justify-between">
                  {columnLabels[colId]}
                  <span className="text-sm bg-gray-100 text-gray-700 font-medium px-2 py-0.5 rounded-full">
                    {filteredColumns[colId].length}
                  </span>
                </h3>
                <Droppable droppableId={colId}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-4 flex-1 rounded-md p-2 transition-colors ${
                        snapshot.isDraggingOver ? "bg-gray-50" : "bg-gray-50/30"
                      }`}
                      style={{ minHeight: "400px" }}
                    >
                      {filteredColumns[colId].map((task, idx) => (
                        <Draggable
                          draggableId={String(task._id)}
                          index={idx}
                          key={task._id}
                        >
                          {(draggableProvided) => (
                            <div
                              ref={draggableProvided.innerRef}
                              {...draggableProvided.draggableProps}
                              {...draggableProvided.dragHandleProps}
                            >
                              <TaskCard
                                task={task}
                                onEdit={() => {
                                  setEditing(task);
                                  setShowForm(true);
                                }}
                                onDelete={() => handleDeleteTask(task._id)}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}

      {/* Modal */}
      {showForm && (
        <TaskFormModal
          initial={editing}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
            fetchTasks();
          }}
        />
      )}
    </div>
  );
}
