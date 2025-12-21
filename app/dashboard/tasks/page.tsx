"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/AuthContext"
import { apiClient } from "@/lib/api-client"
import { CheckCircle2, Clock, Gift, Twitter, Youtube, Share2, MessageSquare } from "lucide-react"

export default function TasksPage() {
  const { user, refreshUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  
  const [initialTasks] = useState([
    {
      id: 1,
      title: "Follow us on Twitter",
      reward: 10,
      icon: Twitter,
      status: "available",
      description: "Follow our official Twitter account",
      action: "Follow",
    },
    {
      id: 2,
      title: "Subscribe to YouTube",
      reward: 15,
      icon: Youtube,
      status: "completed",
      description: "Subscribe to our YouTube channel",
      action: "Subscribe",
    },
    {
      id: 3,
      title: "Share on Social Media",
      reward: 20,
      icon: Share2,
      status: "available",
      description: "Share 1C Traders on your social media",
      action: "Share",
    },
    {
      id: 4,
      title: "Join Telegram Community",
      reward: 10,
      icon: MessageSquare,
      status: "pending",
      description: "Join our Telegram community channel",
      action: "Join",
    },
    {
      id: 5,
      title: "Daily Check-in",
      reward: 5,
      icon: CheckCircle2,
      status: "completed",
      description: "Complete your daily check-in",
      action: "Check-in",
    },
    {
      id: 6,
      title: "Invite 5 Friends",
      reward: 50,
      icon: Gift,
      status: "available",
      description: "Invite 5 friends to join 1C Traders",
      action: "Invite",
      progress: 2,
      progressMax: 5,
    },
  ])

  const stats = {
    totalEarned: tasks.filter((t: any) => t.status === "completed" || t.userStatus === "completed").reduce((acc: number, t: any) => acc + (t.reward || 0), 0),
    availableTasks: tasks.filter((t: any) => (t.status === "available" || t.userStatus === "available" || (!t.status && !t.userStatus))).length,
    completedTasks: tasks.filter((t: any) => t.status === "completed" || t.userStatus === "completed").length,
    pendingRewards: user?.pendingPoints || 0, // Show pending points that will convert to money
  }

  useEffect(() => {
    const loadTasks = async () => {
      if (!user) {
        setLoading(false)
        // Use initial tasks if no user
        setTasks(initialTasks)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const response = await apiClient.getAvailableTasks()
        
        if (response.error) {
          console.warn("Tasks API error:", response.error)
          // Always fallback to initial tasks on error
          setTasks(initialTasks)
        } else if (response.data) {
          const fetchedTasks = response.data.tasks || []
          // If no tasks from API, use initial tasks
          if (fetchedTasks.length === 0) {
            console.log("No tasks from API, using initial tasks")
            setTasks(initialTasks)
          } else {
            // Map API tasks to include icons
            const tasksWithIcons = fetchedTasks.map((task: any) => {
              const iconMap: Record<string, any> = {
                social: Share2,
                referral: Gift,
                daily: CheckCircle2,
                special: Gift,
              }
              return {
                ...task,
                icon: iconMap[task.type] || Gift,
                status: task.userStatus || task.status || "available",
              }
            })
            setTasks(tasksWithIcons)
          }
        } else {
          // Fallback to initial tasks if API returns nothing
          console.log("No data from API, using initial tasks")
          setTasks(initialTasks)
        }
      } catch (err) {
        console.error("Failed to load tasks:", err)
        setError("Failed to load tasks. Showing default tasks.")
        // Always use initial tasks as fallback
        setTasks(initialTasks)
      } finally {
        setLoading(false)
      }
    }

    loadTasks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleCompleteTask = async (taskId: string) => {
    try {
      // Check if user has already completed 5 tasks
      const completedCount = tasks.filter((t: any) => t.status === "completed" || t.userStatus === "completed").length
      if (completedCount >= 5) {
        alert("You have already completed the maximum of 5 tasks. Complete your investments to earn more!")
        return
      }

      const response = await apiClient.completeTask(taskId)
      if (response.data) {
        // Show success message
        if (response.message) {
          alert(response.message)
        }
        
        // Reload tasks to show updated status
        const tasksResponse = await apiClient.getAvailableTasks()
        if (tasksResponse.data) {
          const fetchedTasks = tasksResponse.data.tasks || []
          const tasksWithIcons = fetchedTasks.map((task: any) => {
            const iconMap: Record<string, any> = {
              social: Share2,
              referral: Gift,
              daily: CheckCircle2,
              special: Gift,
            }
            return {
              ...task,
              icon: iconMap[task.type] || Gift,
              status: task.userStatus || task.status || "available",
            }
          })
          setTasks(tasksWithIcons.length > 0 ? tasksWithIcons : initialTasks)
        }
        
        // Refresh user data to show updated points
        await refreshUser()
      } else if (response.error) {
        alert(response.error)
      }
    } catch (error) {
      console.error("Failed to complete task:", error)
      alert("Failed to complete task. Please try again.")
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/50 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold font-[family-name:var(--font-orbitron)] text-primary-foreground">1C</span>
                </div>
                <div className="absolute inset-0 bg-primary/30 rounded-lg animate-ping"></div>
              </div>
              <p className="text-foreground/70 animate-pulse">Loading tasks...</p>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 font-[family-name:var(--font-orbitron)] glow-cyan">
            Tasks & Rewards
          </h1>
          <p className="text-foreground/70">
            Complete up to 5 tasks to earn points. Points automatically convert to money after 24 hours.
          </p>
          {stats.completedTasks >= 5 && (
            <div className="mt-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="text-sm text-amber-500">
                ✅ You've completed all 5 tasks! Your points will convert to money automatically.
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-card border-primary/30 card-glow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary/20 rounded-lg">
                <Gift className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">${stats.totalEarned}</div>
            <div className="text-sm text-foreground/60">Total Earned</div>
          </Card>

          <Card className="p-6 bg-card border-primary/30 card-glow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.availableTasks}</div>
            <div className="text-sm text-foreground/60">Available Tasks</div>
          </Card>

          <Card className="p-6 bg-card border-primary/30 card-glow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.completedTasks}</div>
            <div className="text-sm text-foreground/60">Completed</div>
          </Card>

          <Card className="p-6 bg-card border-primary/30 card-glow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-amber-500" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">${((stats.pendingRewards || 0) / 100).toFixed(2)}</div>
            <div className="text-sm text-foreground/60">Pending Points (Auto-converting)</div>
          </Card>
        </div>

        {/* Tasks List */}
        <div className="grid md:grid-cols-2 gap-6">
          {tasks.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <p className="text-foreground/70">No tasks available at the moment</p>
            </div>
          ) : (
            tasks.map((task: any) => {
              const Icon = task.icon || Gift
            return (
              <Card
                key={task.id || task._id || `task-${task.title}`}
                className={`p-6 bg-card border-primary/30 card-glow ${task.status === "completed" ? "opacity-60" : ""}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-lg ${
                        task.status === "completed"
                          ? "bg-green-500/20"
                          : task.status === "pending"
                            ? "bg-amber-500/20"
                            : "bg-primary/20"
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          task.status === "completed"
                            ? "text-green-500"
                            : task.status === "pending"
                              ? "text-amber-500"
                              : "text-primary"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-1 font-[family-name:var(--font-orbitron)]">{task.title}</h3>
                      <p className="text-sm text-foreground/70">{task.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">+${task.reward}</div>
                  </div>
                </div>

                {task.progress !== undefined && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-foreground/70">Progress</span>
                      <span className="font-medium">
                        {task.progress}/{task.progressMax}
                      </span>
                    </div>
                    <Progress value={(task.progress / (task.progressMax || 1)) * 100} className="h-2" />
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-primary/20">
                  <div className="text-sm">
                    {(task.status === "completed" || task.userStatus === "completed") && (
                      <span className="text-green-500 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Completed - Points awarded!
                      </span>
                    )}
                    {(task.status === "pending" || task.userStatus === "pending") && (
                      <span className="text-amber-500 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Processing...
                      </span>
                    )}
                    {(task.status === "available" || task.userStatus === "available" || (!task.status && !task.userStatus)) && (
                      <span className="text-foreground/60">Ready to complete</span>
                    )}
                  </div>
                  {(task.status === "available" || task.userStatus === "available" || (!task.status && !task.userStatus)) && (
                    <Button
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => handleCompleteTask(task.id || task._id)}
                      disabled={stats.completedTasks >= 5}
                    >
                      {stats.completedTasks >= 5 ? "Limit Reached" : (task.action || "Complete")}
                    </Button>
                  )}
                </div>
              </Card>
            )
          })
          )}
        </div>

        {/* Daily Bonus Card */}
        <Card className="p-8 bg-gradient-to-br from-primary/20 to-primary/10 border-primary/50 card-glow text-center">
          <div className="max-w-2xl mx-auto">
            <Gift className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-3 font-[family-name:var(--font-orbitron)]">Daily Bonus Available!</h2>
            <p className="text-foreground/70 mb-6">
              Complete your daily check-in to earn bonus rewards. Don't miss out on free earnings!
            </p>
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 border-glow px-12">
              Claim Daily Bonus
            </Button>
          </div>
        </Card>
      </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
