import { useState } from "react";

function TaskForm({ onCreate, submitting }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    const success = await onCreate({
      title: title.trim(),
      description: description.trim() || null,
      completed: false,
    });

    if (!success) return;

    setTitle("");
    setDescription("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Create New Task
        </h2>
        <span className="text-xs font-medium text-slate-400">
          {title.length}/150
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="task-title"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Title <span className="text-rose-500">*</span>
          </label>
          <input
            id="task-title"
            type="text"
            placeholder="e.g., Review PostgreSQL indexing"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={150}
            required
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
          />
        </div>

        <div>
          <label
            htmlFor="task-desc"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Description <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="task-desc"
            rows={3}
            placeholder="Add extra notes or steps..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition resize-none"
          />
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={submitting || !title.trim()}
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
          >
            {submitting ? "Creating..." : "+ Add Task"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default TaskForm;