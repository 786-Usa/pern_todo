import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 10000
});

// GET all tasks
export const fetchTasks = async () => {
    const response = await api.get("/tasks");
    return response.data;
};

// POST create task
export const createTask = async (task) => {
    const response = await api.post("/tasks", task);
    return response.data;
};

// PATCH update task
export const updateTask = async (id, updates) => {
    const response = await api.patch(`/tasks/${id}`, updates);
    return response.data;
};

// DELETE task
export const deleteTask = async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
};