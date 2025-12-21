"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeTask = exports.getUserTasks = exports.getAvailableTasks = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const TaskModel_1 = require("../db/models/TaskModel");
const UserModel_1 = require("../db/models/UserModel");
const getAvailableTasks = async (req, res) => {
    try {
        const userId = req.userId;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const completedUserTasks = await TaskModel_1.UserTaskModel.find({
            userId: new mongoose_1.default.Types.ObjectId(userId),
            status: "completed",
        });
        const completedTaskIds = completedUserTasks.map((ut) => ut.taskId);
        const tasks = await TaskModel_1.TaskModel.find({ isActive: true });
        const availableTasks = tasks
            .filter((task) => !completedTaskIds.some((id) => id.toString() === task._id.toString()))
            .map((task) => task.toJSON());
        // Get user task statuses
        const userTasks = await TaskModel_1.UserTaskModel.find({
            userId: new mongoose_1.default.Types.ObjectId(userId),
            taskId: { $in: tasks.map((t) => t._id) },
        });
        const tasksWithStatus = availableTasks.map((task) => {
            const userTask = userTasks.find((ut) => ut.taskId.toString() === task.id);
            return {
                ...task,
                userStatus: userTask?.status || "available",
                progress: userTask?.progress,
            };
        });
        res.json({
            tasks: tasksWithStatus,
        });
    }
    catch (error) {
        console.error("Get available tasks error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getAvailableTasks = getAvailableTasks;
const getUserTasks = async (req, res) => {
    try {
        const userId = req.userId;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const userTasksList = await TaskModel_1.UserTaskModel.find({
            userId: new mongoose_1.default.Types.ObjectId(userId),
        });
        const taskIds = userTasksList.map((ut) => ut.taskId);
        const tasks = await TaskModel_1.TaskModel.find({ _id: { $in: taskIds } });
        const tasksWithDetails = userTasksList.map((ut) => {
            const task = tasks.find((t) => t._id.equals(ut.taskId));
            return {
                ...ut.toJSON(),
                task: task?.toJSON(),
            };
        });
        res.json({
            tasks: tasksWithDetails,
        });
    }
    catch (error) {
        console.error("Get user tasks error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getUserTasks = getUserTasks;
const completeTask = async (req, res) => {
    try {
        const userId = req.userId;
        const { taskId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId) || !mongoose_1.default.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({ error: "Invalid ID" });
        }
        const task = await TaskModel_1.TaskModel.findById(taskId);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        const existingUserTask = await TaskModel_1.UserTaskModel.findOne({
            userId: new mongoose_1.default.Types.ObjectId(userId),
            taskId: new mongoose_1.default.Types.ObjectId(taskId),
        });
        if (existingUserTask && existingUserTask.status === "completed") {
            return res.status(400).json({ error: "Task already completed" });
        }
        // Check if user has already completed 5 tasks (limit per user)
        const completedTasksCount = await TaskModel_1.UserTaskModel.countDocuments({
            userId: new mongoose_1.default.Types.ObjectId(userId),
            status: "completed",
        });
        if (completedTasksCount >= 5) {
            return res.status(400).json({
                error: "You have already completed the maximum of 5 tasks. Complete your investments to earn more!"
            });
        }
        // Auto-complete task immediately (automated system, no manual verification needed)
        let userTask;
        if (existingUserTask) {
            existingUserTask.status = "completed";
            existingUserTask.completedAt = new Date();
            existingUserTask.rewardClaimed = true;
            await existingUserTask.save();
            userTask = existingUserTask;
        }
        else {
            userTask = await TaskModel_1.UserTaskModel.create({
                userId: new mongoose_1.default.Types.ObjectId(userId),
                taskId: new mongoose_1.default.Types.ObjectId(taskId),
                status: "completed",
                completedAt: new Date(),
                rewardClaimed: true,
            });
        }
        // Award points immediately (will be converted to money after delay)
        const user = await UserModel_1.UserModel.findById(userId);
        if (user) {
            // Add points to pending (will convert to money after hours)
            user.pendingPoints = (user.pendingPoints || 0) + task.reward;
            await user.save();
            // Note: Points will be converted to money automatically by the scheduler
        }
        res.json({
            message: "Task completed successfully! Points will be converted to money automatically.",
            userTask: userTask.toJSON(),
        });
    }
    catch (error) {
        console.error("Complete task error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.completeTask = completeTask;
//# sourceMappingURL=taskController.js.map