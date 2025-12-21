import type { Request, Response } from "express"
import mongoose from "mongoose"
import { TaskModel } from "../db/models/TaskModel"

type ControllerResponse = Response | void

/**
 * Get all tasks (admin)
 * GET /api/admin/tasks
 */
export const getAllTasks = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const { isActive, type, limit = 100, offset = 0 } = req.query

    const query: any = {}
    if (isActive !== undefined) {
      query.isActive = isActive === "true"
    }
    if (type) {
      query.type = type
    }

    const total = await TaskModel.countDocuments(query)
    const tasks = await TaskModel.find(query)
      .skip(Number(offset))
      .limit(Number(limit))
      .sort({ createdAt: -1 })

    res.json({
      tasks: tasks.map((task) => task.toJSON()),
      total,
      limit: Number(limit),
      offset: Number(offset),
    })
  } catch (error) {
    console.error("Get all tasks error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

/**
 * Get single task (admin)
 * GET /api/admin/tasks/:taskId
 */
export const getTask = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const { taskId } = req.params

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ error: "Invalid task ID" })
    }

    const task = await TaskModel.findById(taskId)

    if (!task) {
      return res.status(404).json({ error: "Task not found" })
    }

    res.json(task.toJSON())
  } catch (error) {
    console.error("Get task error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

/**
 * Create task (admin)
 * POST /api/admin/tasks
 */
export const createTask = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const { title, description, type, reward, requirements, expiresAt, isActive } = req.body

    if (!title || !description || !type || reward === undefined) {
      return res.status(400).json({ error: "Title, description, type, and reward are required" })
    }

    if (!["social", "referral", "daily", "special"].includes(type)) {
      return res.status(400).json({ error: "Invalid task type" })
    }

    if (reward < 0) {
      return res.status(400).json({ error: "Reward must be non-negative" })
    }

    const task = await TaskModel.create({
      title,
      description,
      type,
      reward: Number(reward),
      requirements: requirements || {},
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    })

    res.status(201).json({
      message: "Task created successfully",
      task: task.toJSON(),
    })
  } catch (error) {
    console.error("Create task error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

/**
 * Update task (admin)
 * PATCH /api/admin/tasks/:taskId
 */
export const updateTask = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const { taskId } = req.params
    const { title, description, type, reward, requirements, expiresAt, isActive } = req.body

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ error: "Invalid task ID" })
    }

    const task = await TaskModel.findById(taskId)

    if (!task) {
      return res.status(404).json({ error: "Task not found" })
    }

    // Update fields
    if (title !== undefined) task.title = title
    if (description !== undefined) task.description = description
    if (type !== undefined) {
      if (!["social", "referral", "daily", "special"].includes(type)) {
        return res.status(400).json({ error: "Invalid task type" })
      }
      task.type = type
    }
    if (reward !== undefined) {
      if (reward < 0) {
        return res.status(400).json({ error: "Reward must be non-negative" })
      }
      task.reward = Number(reward)
    }
    if (requirements !== undefined) task.requirements = requirements
    if (expiresAt !== undefined) task.expiresAt = expiresAt ? new Date(expiresAt) : undefined
    if (isActive !== undefined) task.isActive = Boolean(isActive)

    await task.save()

    res.json({
      message: "Task updated successfully",
      task: task.toJSON(),
    })
  } catch (error) {
    console.error("Update task error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

/**
 * Delete task (admin)
 * DELETE /api/admin/tasks/:taskId
 */
export const deleteTask = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const { taskId } = req.params

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ error: "Invalid task ID" })
    }

    const task = await TaskModel.findByIdAndDelete(taskId)

    if (!task) {
      return res.status(404).json({ error: "Task not found" })
    }

    res.json({
      message: "Task deleted successfully",
    })
  } catch (error) {
    console.error("Delete task error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

