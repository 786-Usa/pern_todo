import * as taskService from "../services/taskService.js";

const createTask = async (req, res) => {
  const result = await taskService.addTask(req.body);
  res.status(201).json({
    success: true,
    data: result,
    message: "Task created successfully",
  });
};

const getAllTasks = async (req, res) => {
  const result = await taskService.getAllTasks();
  res.status(200).json({
    success: true,
    data: result,
  });
};

const getTaskById = async (req, res) => {
  const result = await taskService.getTaskById(req.params.id);
  res.status(200).json({
    success: true,
    data: result,
    message: "Task found successfully",
  });
};

const updateTask = async (req, res) => {
  const result = await taskService.updateTask(req.params.id, req.body);
  res.status(200).json({
    success: true,
    data: result,
    message: "Task updated successfully",
  });
};

const deleteTask = async (req, res) => {
  const result = await taskService.deleteTask(req.params.id);
  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
    data: result,
  });
};

export {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};