"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeTask = exports.getUserTasks = exports.getAvailableTasks = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const TaskModel_1 = require("../db/models/TaskModel");
const UserModel_1 = require("../db/models/UserModel");
const TransactionModel_1 = require("../db/models/TransactionModel");
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
        if (existingUserTask) {
            existingUserTask.status = "pending";
            existingUserTask.completedAt = new Date();
            await existingUserTask.save();
            return res.json({
                message: "Task completion submitted for verification",
                userTask: existingUserTask.toJSON(),
            });
        }
        const userTask = await TaskModel_1.UserTaskModel.create({
            userId: new mongoose_1.default.Types.ObjectId(userId),
            taskId: new mongoose_1.default.Types.ObjectId(taskId),
            status: "pending",
            completedAt: new Date(),
            rewardClaimed: false,
        });
        // Award reward (in real app, this would be verified first)
        const user = await UserModel_1.UserModel.findById(userId);
        if (user) {
            user.balance += task.reward;
            user.totalEarnings += task.reward;
            await user.save();
            // Create transaction record
            await TransactionModel_1.TransactionModel.create({
                userId: new mongoose_1.default.Types.ObjectId(userId),
                type: "task",
                amount: task.reward,
                status: "completed",
                description: `Task reward: ${task.title}`,
                completedAt: new Date(),
            });
        }
        res.json({
            message: "Task completed and reward awarded",
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