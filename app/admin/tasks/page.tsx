"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AdminLayout } from "@/components/admin-layout"
import { AdminRoute } from "@/components/admin-route"
import { CheckSquare, Plus, Edit, Trash2, X } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<any>(null)
  const [filter, setFilter] = useState<{ isActive?: string; type?: string }>({})
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "social",
    reward: "",
    requirements: "",
    expiresAt: "",
    isActive: true,
  })

  useEffect(() => {
    loadTasks()
  }, [filter])

  const loadTasks = async () => {
    const token = localStorage.getItem("admin-traders-token")
    if (!token) {
      router.push("/admin/login")
      return
    }

    try {
      setLoading(true)
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3010/api"
      const queryParams = new URLSearchParams()
      if (filter.isActive !== undefined) queryParams.append("isActive", filter.isActive)
      if (filter.type) queryParams.append("type", filter.type)
      queryParams.append("limit", "100")

      const response = await fetch(`${API_BASE_URL}/admin/tasks?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("admin-traders-token")
          localStorage.removeItem("admin-user")
          router.push("/admin/login")
          return
        }
        throw new Error("Failed to load tasks")
      }

      const data = await response.json()
      setTasks(data.tasks || [])
    } catch (error) {
      console.error("Failed to load tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingTask(null)
    setFormData({
      title: "",
      description: "",
      type: "social",
      reward: "",
      requirements: "",
      expiresAt: "",
      isActive: true,
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (task: any) => {
    setEditingTask(task)
    setFormData({
      title: task.title || "",
      description: task.description || "",
      type: task.type || "social",
      reward: task.reward?.toString() || "",
      requirements: task.requirements ? JSON.stringify(task.requirements, null, 2) : "",
      expiresAt: task.expiresAt ? new Date(task.expiresAt).toISOString().split("T")[0] : "",
      isActive: task.isActive !== undefined ? task.isActive : true,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem("admin-traders-token")
    if (!token) return

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3010/api"
      const payload: any = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        reward: Number(formData.reward),
        isActive: formData.isActive,
      }

      if (formData.requirements) {
        try {
          payload.requirements = JSON.parse(formData.requirements)
        } catch {
          // If not valid JSON, store as string
          payload.requirements = { note: formData.requirements }
        }
      }

      if (formData.expiresAt) {
        payload.expiresAt = new Date(formData.expiresAt).toISOString()
      }

      const url = editingTask
        ? `${API_BASE_URL}/admin/tasks/${editingTask.id || editingTask._id}`
        : `${API_BASE_URL}/admin/tasks`
      const method = editingTask ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        alert(error.error || "Failed to save task")
        return
      }

      setIsDialogOpen(false)
      loadTasks()
    } catch (error) {
      console.error("Failed to save task:", error)
      alert("Failed to save task")
    }
  }

  const handleDelete = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return

    const token = localStorage.getItem("admin-traders-token")
    if (!token) return

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3010/api"
      const response = await fetch(`${API_BASE_URL}/admin/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        loadTasks()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to delete task")
      }
    } catch (error) {
      console.error("Failed to delete task:", error)
      alert("Failed to delete task")
    }
  }

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 font-[family-name:var(--font-orbitron)] glow-cyan">
                Task Management
              </h1>
              <p className="text-foreground/70">Create and manage platform tasks</p>
            </div>
            <Button onClick={handleCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </Button>
          </div>

          {/* Filters */}
          <Card className="p-6 bg-card border-primary/30 card-glow">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label>Status</Label>
                <Select
                  value={filter.isActive !== undefined ? filter.isActive : "all"}
                  onValueChange={(value) =>
                    setFilter({ ...filter, isActive: value === "all" ? undefined : value })
                  }
                >
                  <SelectTrigger className="bg-input border-primary/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label>Type</Label>
                <Select
                  value={filter.type || "all"}
                  onValueChange={(value) => setFilter({ ...filter, type: value === "all" ? undefined : value })}
                >
                  <SelectTrigger className="bg-input border-primary/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="special">Special</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Tasks List */}
          <Card className="p-6 bg-card border-primary/30 card-glow">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-foreground/70">Loading tasks...</p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-12">
                <CheckSquare className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
                <p className="text-foreground/70">No tasks found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id || task._id}
                    className="p-6 bg-background/50 rounded-lg border border-primary/20"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold">{task.title}</h3>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              task.isActive
                                ? "bg-green-500/20 text-green-500"
                                : "bg-gray-500/20 text-gray-500"
                            }`}
                          >
                            {task.isActive ? "Active" : "Inactive"}
                          </span>
                          <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                            {task.type}
                          </span>
                        </div>
                        <p className="text-foreground/70 mb-2">{task.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-foreground/60">
                            Reward: <span className="font-bold text-primary">{task.reward} points</span>
                          </span>
                          {task.expiresAt && (
                            <span className="text-foreground/60">
                              Expires: {new Date(task.expiresAt).toLocaleDateString()}
                            </span>
                          )}
                          <span className="text-foreground/60">
                            Created: {new Date(task.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-primary/50 bg-transparent"
                          onClick={() => handleEdit(task)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                          onClick={() => handleDelete(task.id || task._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Create/Edit Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingTask ? "Edit Task" : "Create New Task"}</DialogTitle>
                <DialogDescription>Fill in the task details below</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-input border-primary/30"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-input border-primary/30"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger className="bg-input border-primary/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="social">Social</SelectItem>
                        <SelectItem value="referral">Referral</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="special">Special</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reward">Reward (Points) *</Label>
                    <Input
                      id="reward"
                      type="number"
                      min="0"
                      value={formData.reward}
                      onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
                      className="bg-input border-primary/30"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiresAt">Expiration Date (Optional)</Label>
                  <Input
                    id="expiresAt"
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    className="bg-input border-primary/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Requirements (JSON, Optional)</Label>
                  <Textarea
                    id="requirements"
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    className="bg-input border-primary/30 font-mono text-sm"
                    rows={3}
                    placeholder='{"url": "https://example.com", "action": "follow"}'
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="isActive">Task is active</Label>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="border-primary/50 bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    {editingTask ? "Update Task" : "Create Task"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </AdminLayout>
    </AdminRoute>
  )
}

