import dotenv from "dotenv"
import { TaskModel } from "../db/models/TaskModel"
import connectDB from "../db/connection"

dotenv.config()

const defaultTasks = [
  {
    title: "Follow us on Twitter",
    description: "Follow our official Twitter account @1CTraders",
    type: "social",
    reward: 10,
    isActive: true,
  },
  {
    title: "Subscribe to YouTube",
    description: "Subscribe to our YouTube channel for updates and tutorials",
    type: "social",
    reward: 15,
    isActive: true,
  },
  {
    title: "Share on Social Media",
    description: "Share 1C Traders on your social media platforms",
    type: "social",
    reward: 20,
    isActive: true,
  },
  {
    title: "Join Telegram Community",
    description: "Join our Telegram community channel for discussions",
    type: "social",
    reward: 10,
    isActive: true,
  },
  {
    title: "Daily Check-in",
    description: "Complete your daily check-in to earn bonus rewards",
    type: "daily",
    reward: 5,
    isActive: true,
  },
  {
    title: "Invite 5 Friends",
    description: "Invite 5 friends to join 1C Traders using your referral code",
    type: "referral",
    reward: 50,
    isActive: true,
  },
]

async function seedTasks() {
  try {
    console.log("🌱 Starting task seeding...")

    await connectDB()

    // Clear existing tasks (optional - comment out if you want to keep existing)
    // await TaskModel.deleteMany({})

    // Check which tasks already exist
    const existingTasks = await TaskModel.find({})
    const existingTitles = existingTasks.map((t) => t.title)

    let createdCount = 0
    let skippedCount = 0

    for (const task of defaultTasks) {
      if (existingTitles.includes(task.title)) {
        console.log(`⏭️  Task "${task.title}" already exists, skipping...`)
        skippedCount++
        continue
      }

      await TaskModel.create(task)
      console.log(`✅ Created task: ${task.title}`)
      createdCount++
    }

    console.log(`\n✅ Seeding complete!`)
    console.log(`   Created: ${createdCount} tasks`)
    console.log(`   Skipped: ${skippedCount} tasks`)
    console.log(`   Total: ${existingTasks.length + createdCount} tasks in database`)

    process.exit(0)
  } catch (error) {
    console.error("❌ Error seeding tasks:", error)
    process.exit(1)
  }
}

seedTasks()

