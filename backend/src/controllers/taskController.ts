import type { Request, Response } from "express"

type ControllerResponse = Response | void
import mongoose from "mongoose"
import { TaskModel, UserTaskModel } from "../db/models/TaskModel"
import { UserModel } from "../db/models/UserModel"

export const getAvailableTasks = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const userId = (req as any).userId

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" })
    }

    // Get all active tasks
    const tasks = await TaskModel.find({ isActive: true })

    // Get user task statuses for all tasks
    const userTasks = await UserTaskModel.find({
      userId: new mongoose.Types.ObjectId(userId),
      taskId: { $in: tasks.map((t) => t._id) },
    })

    // Return all tasks with their completion status (don't filter out completed ones)
    const tasksWithStatus = tasks.map((task) => {
      const userTask = userTasks.find((ut) => ut.taskId.toString() === task._id.toString())
      return {
        ...task.toJSON(),
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

export const getUserTasks = async (req: Request, res: Response): Promise<ControllerResponse> => {
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

export const completeTask = async (req: Request, res: Response): Promise<ControllerResponse> => {
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

    // Check if user has already completed 5 tasks (limit per user)
    const completedTasksCount = await UserTaskModel.countDocuments({
      userId: new mongoose.Types.ObjectId(userId),
      status: "completed",
    })

    if (completedTasksCount >= 5) {
      return res.status(400).json({ 
        error: "You have already completed the maximum of 5 tasks. Complete your investments to earn more!" 
      })
    }

    // Auto-complete task immediately (automated system, no manual verification needed)
    let userTask
    if (existingUserTask) {
      existingUserTask.status = "completed"
      existingUserTask.completedAt = new Date()
      existingUserTask.rewardClaimed = true
      await existingUserTask.save()
      userTask = existingUserTask
    } else {
      userTask = await UserTaskModel.create({
        userId: new mongoose.Types.ObjectId(userId),
        taskId: new mongoose.Types.ObjectId(taskId),
        status: "completed",
        completedAt: new Date(),
        rewardClaimed: true,
      })
    }

    // Award points immediately (will be converted to money after delay)
    const user = await UserModel.findById(userId)
    if (user) {
      // Add points to pending (will convert to money after hours)
      user.pendingPoints = (user.pendingPoints || 0) + task.reward
      await user.save()

      // Create notification for task completion
      try {
        const { createNotification } = await import("../services/notificationService")
        await createNotification({
          userId: userId,
          title: "Task Completed!",
          message: `You completed "${task.title}" and earned ${task.reward} points. Points will convert to money automatically.`,
          type: "task",
          relatedId: taskId,
          relatedType: "task",
        })
      } catch (notifError) {
        console.error("Error creating task completion notification:", notifError)
        // Don't fail the request if notification creation fails
      }

      // Note: Points will be converted to money automatically by the scheduler
    }

    res.json({
      message: "Task completed successfully! Points will be converted to money automatically.",
      userTask: userTask.toJSON(),
    })
  } catch (error) {
    console.error("Complete task error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
