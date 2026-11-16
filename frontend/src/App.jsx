import { useEffect, useState } from "react";

import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

import { fetchTasks, createTask, updateTask, deleteTask } from "./services/api";

function App() {
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");

  // Fetch tasks when component mounts
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setError("");

        const response = await fetchTasks();

        setTasks(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "Unable to load tasks"
        );
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  // Create task
  const handleCreate = async (task) => {
    try {
      setSubmitting(true);
      setError("");

      const response = await createTask(task);

      setTasks((prev) => [response.data, ...prev]);

      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");

      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle task completion
  const handleToggle = async (task) => {
    try {
      setError("");

      const response = await updateTask(task.task_id, {
        completed: !task.completed,
      });

      setTasks((prev) =>
        prev.map((item) =>
          item.task_id === task.task_id ? response.data : item
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task");
    }
  };

  // Edit task
  const handleEdit = async (id, updates) => {
    try {
      setError("");

      const response = await updateTask(id, updates);

      setTasks((prev) =>
        prev.map((task) => (task.task_id === id ? response.data : task))
      );

      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to edit task");
      return false;
    }
  };

  // Delete task
  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      setError("");

      await deleteTask(id);

      setTasks((prev) => prev.filter((task) => task.task_id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task");
    } finally {
      setDeletingId(null);
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6">
      <main className="max-w-2xl mx-auto">
        {/* Header Section */}
        <header className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Task Manager
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your daily tasks efficiently.
            </p>
          </div>

          {!loading && tasks.length > 0 && (
            <div className="text-xs font-medium text-slate-500 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-2xs self-start sm:self-auto">
              Completed:{" "}
              <span className="font-semibold text-indigo-600">
                {completedCount}
              </span>{" "}
              / {tasks.length}
            </div>
          )}
        </header>

        {/* Dismissible Error Alert */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 cursor-pointer shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Create Form */}
        <TaskForm onCreate={handleCreate} submitting={submitting} />

        {/* Loading State or Task List */}
        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent mb-2" />
            <p className="text-sm font-medium text-slate-500">
              Loading your tasks...
            </p>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleEdit}
            deletingId={deletingId}
          />
        )}
      </main>
    </div>
  );
}

export default App;