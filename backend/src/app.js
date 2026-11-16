import express from "express";
import cors from "cors";
import taskRoutes from "./routes/taskRoute.js";
import {errorHandler} from "./middleware/errorHandler.js";
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic health endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "PERN backend is running!"
    });
});

// Routes
app.use("/api/tasks", taskRoutes);

// Error Handling for unknown sites

app.use((req,res) =>{

    res.status(404).json({
        success: false,
        message: "API Route not found"
    });
});


// Error handling middleware

app.use(errorHandler);


export default app;