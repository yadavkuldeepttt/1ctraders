"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTask = exports.getAllTasks = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const TaskModel_1 = require("../db/models/TaskModel");
/**
 * Get all tasks (admin)
 * GET /api/admin/tasks
 */
const getAllTasks = async (req, res) => {
    try {
        const { isActive, type, limit = 100, offset = 0 } = req.query;
        const query = {};
        if (isActive !== undefined) {
            query.isActive = isActive === "true";
        }
        if (type) {
            query.type = type;
        }
        const total = await TaskModel_1.TaskModel.countDocuments(query);
        const tasks = await TaskModel_1.TaskModel.find(query)
            .skip(Number(offset))
            .limit(Number(limit))
            .sort({ createdAt: -1 });
        res.json({
            tasks: tasks.map((task) => task.toJSON()),
            total,
            limit: Number(limit),
            offset: Number(offset),
        });
    }
    catch (error) {
        console.error("Get all tasks error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getAllTasks = getAllTasks;
/**
 * Get single task (admin)
 * GET /api/admin/tasks/:taskId
 */
const getTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({ error: "Invalid task ID" });
        }
        const task = await TaskModel_1.TaskModel.findById(taskId);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json(task.toJSON());
    }
    catch (error) {
        console.error("Get task error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getTask = getTask;
/**
 * Create task (admin)
 * POST /api/admin/tasks
 */
const createTask = async (req, res) => {
    try {
        const { title, description, type, reward, requirements, expiresAt, isActive } = req.body;
        if (!title || !description || !type || reward === undefined) {
            return res.status(400).json({ error: "Title, description, type, and reward are required" });
        }
        if (!["social", "referral", "daily", "special"].includes(type)) {
            return res.status(400).json({ error: "Invalid task type" });
        }
        if (reward < 0) {
            return res.status(400).json({ error: "Reward must be non-negative" });
        }
        const task = await TaskModel_1.TaskModel.create({
            title,
            description,
            type,
            reward: Number(reward),
            requirements: requirements || {},
            expiresAt: expiresAt ? new Date(expiresAt) : undefined,
            isActive: isActive !== undefined ? Boolean(isActive) : true,
        });
        res.status(201).json({
            message: "Task created successfully",
            task: task.toJSON(),
        });
    }
    catch (error) {
        console.error("Create task error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.createTask = createTask;
/**
 * Update task (admin)
 * PATCH /api/admin/tasks/:taskId
 */
const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { title, description, type, reward, requirements, expiresAt, isActive } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({ error: "Invalid task ID" });
        }
        const task = await TaskModel_1.TaskModel.findById(taskId);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        // Update fields
        if (title !== undefined)
            task.title = title;
        if (description !== undefined)
            task.description = description;
        if (type !== undefined) {
            if (!["social", "referral", "daily", "special"].includes(type)) {
                return res.status(400).json({ error: "Invalid task type" });
            }
            task.type = type;
        }
        if (reward !== undefined) {
            if (reward < 0) {
                return res.status(400).json({ error: "Reward must be non-negative" });
            }
            task.reward = Number(reward);
        }
        if (requirements !== undefined)
            task.requirements = requirements;
        if (expiresAt !== undefined)
            task.expiresAt = expiresAt ? new Date(expiresAt) : undefined;
        if (isActive !== undefined)
            task.isActive = Boolean(isActive);
        await task.save();
        res.json({
            message: "Task updated successfully",
            task: task.toJSON(),
        });
    }
    catch (error) {
        console.error("Update task error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.updateTask = updateTask;
/**
 * Delete task (admin)
 * DELETE /api/admin/tasks/:taskId
 */
const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({ error: "Invalid task ID" });
        }
        const task = await TaskModel_1.TaskModel.findByIdAndDelete(taskId);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json({
            message: "Task deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete task error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.deleteTask = deleteTask;
//# sourceMappingURL=adminTaskController.js.map