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

  async function onDragEnd(result) {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const moved = columns[source.droppableId][source.index];

    // permission check
    if (
      user?.role === "INTERN" &&
      !moved.assignedUsers.some((u) => u._id === user.id)
    ) {
      console.warn("Intern cannot move unassigned tasks");
      return;
    }

    // update state locally (optimistic)
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
      await fetchTasks(); // rollback
    }
  }

  async function handleDeleteTask(taskId) {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await apiClient.deleteTask(taskId);
        // Refresh the tasks list to reflect the deletion
        await fetchTasks();
      } catch (err) {
        console.error("Error deleting task:", err);
        alert("Failed to delete the task. Please try again.");
      }
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Task Board</h2>
          <p className="text-gray-600 mt-1">
            Drag and drop tasks to change their status.
          </p>
        </div>
        {user?.role === "MANAGER" && (
          <button
            className="btn-primary flex items-center gap-2 justify-center sm:justify-end w-auto ml-auto"
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
          >
            <Plus size={16} /> New Task
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading tasks...</div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columnsOrder.map((colId) => (
              <div key={colId} className="bg-gray-100 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-4 flex gap-2 items-center">
                  {columnLabels[colId]}
                  <span className="text-sm bg-gray-200 text-gray-600 font-medium px-2 py-1 rounded-full">
                    {columns[colId].length}
                  </span>
                </h3>
                <Droppable droppableId={colId}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-4 min-h-[400px] transition-colors rounded-md ${
                        snapshot.isDraggingOver ? "bg-gray-200" : ""
                      }`}
                    >
                      {columns[colId].map((task, idx) => (
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
