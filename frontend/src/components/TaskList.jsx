import { useState } from "react";

function TaskItem({ task, onToggle, onDelete, onEdit, deletingId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    setSaving(true);

    const success = await onEdit(task.task_id, {
      title: title.trim(),
      description: description.trim() || null,
    });

    if (success) {
      setIsEditing(false);
    }

    setSaving(false);
  };

  const handleCancel = () => {
    setTitle(task.title);
    setDescription(task.description || "");
    setIsEditing(false);
  };

  return (
    <div
      className={`rounded-xl border p-5 transition ${
        task.completed
          ? "bg-slate-50/80 border-slate-200"
          : "bg-white border-slate-200 shadow-sm hover:border-slate-300"
      }`}
    >
      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
              Editing Task
            </h3>
            <span className="text-xs text-slate-400">{title.length}/150</span>
          </div>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={150}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />

          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task description"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
          />

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || !title.trim()}
              className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition cursor-pointer"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3
                className={`text-base font-semibold break-words ${
                  task.completed
                    ? "line-through text-slate-400"
                    : "text-slate-900"
                }`}
              >
                {task.title}
              </h3>

              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  task.completed
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                    : "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20"
                }`}
              >
                {task.completed ? "Completed" : "Pending"}
              </span>
            </div>

            <p
              className={`text-sm break-words ${
                task.completed
                  ? "text-slate-400"
                  : task.description
                  ? "text-slate-600"
                  : "text-slate-400 italic"
              }`}
            >
              {task.description || "No description provided"}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
            <button
              type="button"
              onClick={() => onToggle(task)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                task.completed
                  ? "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`}
            >
              {task.completed ? "Undo" : "Complete"}
            </button>

            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() => onDelete(task.task_id)}
              disabled={deletingId === task.task_id}
              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-100 disabled:opacity-50 transition cursor-pointer"
            >
              {deletingId === task.task_id ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskList({ tasks, onToggle, onDelete, onEdit, deletingId }) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-10 text-center">
        <p className="text-sm font-medium text-slate-600">No tasks available</p>
        <p className="text-xs text-slate-400 mt-1">
          Create your first task using the form above.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Your Tasks</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskItem
            key={task.task_id}
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
            deletingId={deletingId}
          />
        ))}
      </div>
    </div>
  );
}

export default TaskList;