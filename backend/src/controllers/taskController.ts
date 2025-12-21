import type { Request, Response } from "express"
import mongoose from "mongoose"
import { TaskModel, UserTaskModel } from "../db/models/TaskModel"
import { UserModel } from "../db/models/UserModel"
import { TransactionModel } from "../db/models/TransactionModel"

export const getAvailableTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" })
    }

    const completedUserTasks = await UserTaskModel.find({
      userId: new mongoose.Types.ObjectId(userId),
      status: "completed",
    })
    const completedTaskIds = completedUserTasks.map((ut) => ut.taskId)

    const tasks = await TaskModel.find({ isActive: true })
    const availableTasks = tasks
      .filter((task) => !completedTaskIds.some((id) => id.equals(task._id)))
      .map((task) => task.toJSON())

    // Get user task statuses
    const userTasks = await UserTaskModel.find({
      userId: new mongoose.Types.ObjectId(userId),
      taskId: { $in: tasks.map((t) => t._id) },
    })

    const tasksWithStatus = availableTasks.map((task) => {
      const userTask = userTasks.find((ut) => ut.taskId.toString() === task.id)
      return {
        ...task,
        userStatus: userTask?.status || "available",
        progress: userTask?.progress,
      }
    })

    res.json({
      tasks: tasksWithStatus,
    })
  } catch (error) {
    console.error("Get available tasks error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const getUserTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" })
    }

    const userTasksList = await UserTaskModel.find({
      userId: new mongoose.Types.ObjectId(userId),
    })

    const taskIds = userTasksList.map((ut) => ut.taskId)
    const tasks = await TaskModel.find({ _id: { $in: taskIds } })

    const tasksWithDetails = userTasksList.map((ut) => {
      const task = tasks.find((t) => t._id.equals(ut.taskId))
      return {
        ...ut.toJSON(),
        task: task?.toJSON(),
      }
    })

    res.json({
      tasks: tasksWithDetails,
    })
  } catch (error) {
    console.error("Get user tasks error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const completeTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { taskId } = req.params

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ error: "Invalid ID" })
    }

    const task = await TaskModel.findById(taskId)
    if (!task) {
      return res.status(404).json({ error: "Task not found" })
    }

    const existingUserTask = await UserTaskModel.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      taskId: new mongoose.Types.ObjectId(taskId),
    })

    if (existingUserTask && existingUserTask.status === "completed") {
      return res.status(400).json({ error: "Task already completed" })
    }

    if (existingUserTask) {
      existingUserTask.status = "pending"
      existingUserTask.completedAt = new Date()
      await existingUserTask.save()
      return res.json({
        message: "Task completion submitted for verification",
        userTask: existingUserTask.toJSON(),
      })
    }

    const userTask = await UserTaskModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      taskId: new mongoose.Types.ObjectId(taskId),
      status: "pending",
      completedAt: new Date(),
      rewardClaimed: false,
    })

    // Award reward (in real app, this would be verified first)
    const user = await UserModel.findById(userId)
    if (user) {
      user.balance += task.reward
      user.totalEarnings += task.reward
      await user.save()

      // Create transaction record
      await TransactionModel.create({
        userId: new mongoose.Types.ObjectId(userId),
        type: "task",
        amount: task.reward,
        status: "completed",
        description: `Task reward: ${task.title}`,
        completedAt: new Date(),
      })
    }

    res.json({
      message: "Task completed and reward awarded",
      userTask: userTask.toJSON(),
    })
  } catch (error) {
    console.error("Complete task error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
