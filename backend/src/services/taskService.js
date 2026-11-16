import * as taskRepository from "../repositories/taskRepository.js";

const createError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const validateId = (id) => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    throw createError(400, "Invalid task ID format");
  }
};

const validateTaskData = (data, isUpdate = false) => {
  // ✅ 1. Guard against empty or non-object request bodies
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw createError(400, "Request body must be a valid JSON object");
  }

  // ✅ 2. Use '||' so title is required on create, or validated if present on update
  if (!isUpdate || Object.hasOwn(data, "title")) {
    if (
      typeof data.title !== "string" ||
      data.title.trim().length === 0 ||
      data.title.trim().length > 150
    ) {
      throw createError(
        400,
        "Title must be a non-empty string with a maximum length of 150 characters"
      );
    }
  } // ✅ Closed title block properly here

  // ✅ 3. Description check now runs independently on both create and update
  if (Object.hasOwn(data, "description")) {
    if (typeof data.description !== "string" && data.description !== null) {
      throw createError(400, "Description must be a string or null");
    }
  }

  // ✅ 4. Completed check now runs independently and rejects null
  if (Object.hasOwn(data, "completed")) {
    if (typeof data.completed !== "boolean") {
      throw createError(400, "Completed must be a boolean");
    }
  }
};

const updateTask = async (id, task) => {
  validateId(id);
  const columnMap = {
    title: "title",
    description: "description",
    completed: "completed",
  };
  const entries = Object.entries(task).filter(
    ([key, values]) => key in columnMap && values !== undefined,
  );
  if (entries.length === 0) {
    throw createError(400, "No valid fields provided for update");
  }
  const updates = Object.fromEntries(entries);

  validateTaskData(updates, true);

  if(updates.title !== undefined){
    updates.title = updates.title.trim();
  }

  if(typeof updates.description === "string"){
    updates.description = updates.description.trim();
  }

  const result = await taskRepository.updateTask(id, updates);

  if(!result){
    throw createError(404, "Task not found");
  }

  return result;
};

const getAllTasks =async () =>{
  return await taskRepository.getAllTasks();
}

const getTaskById = async (id) =>{
  validateId(id);
  const task = await taskRepository.getTaskById(id);
  if(!task){
    throw createError(404, "Task not found");
  }
  return task;
}

const addTask = async (task) =>{
  validateTaskData(task);

  const taskData = {
    title: task.title.trim(),
    description: task.description ? task.description.trim() : null,
    completed: task.completed !== undefined ? task.completed : false,
  }
  return await taskRepository.createTask(taskData);

};

const deleteTask = async (id) =>{

  validateId(id);
  const result = await taskRepository.deleteTask(id);
  if(!result){
    throw createError(404, "Task not found");
  }
  return result;
};

export {
  updateTask,
  getAllTasks,
  getTaskById,
  addTask,
  deleteTask,
}