import express from "express"

import {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask
} from "../controllers/taskController.js";

import {asyncHandler} from "../middleware/asyncHandler.js";

const router = express.Router();

router.post("/", asyncHandler(createTask));
router.get("/", asyncHandler(getAllTasks));
router.get("/:id", asyncHandler(getTaskById));
router.patch("/:id", asyncHandler(updateTask));
router.delete("/:id", asyncHandler(deleteTask));

export default router;