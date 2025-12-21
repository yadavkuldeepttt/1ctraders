import { processDailyROI } from "./dailyRoiService"
import { convertPointsToMoney } from "./pointsConversionService"

/**
 * Schedule daily ROI processing
 * Runs every day at a specified time (default: 00:00 UTC)
 */
export function startScheduler(): void {
  console.log("⏰ Starting scheduler...")

  // Process immediately on startup (for testing)
  if (process.env.NODE_ENV === "development") {
    console.log("🔧 Development mode: Processing ROI immediately")
    processDailyROI().catch(console.error)
    convertPointsToMoney().catch(console.error)
  }

  // Calculate milliseconds until next midnight UTC
  const now = new Date()
  const nextMidnight = new Date(now)
  nextMidnight.setUTCHours(24, 0, 0, 0)

  const msUntilMidnight = nextMidnight.getTime() - now.getTime()

  // Schedule first run at midnight
  setTimeout(() => {
    processDailyROI().catch(console.error)
    convertPointsToMoney().catch(console.error)

    // Then run every 24 hours
    setInterval(() => {
      processDailyROI().catch(console.error)
      convertPointsToMoney().catch(console.error)
    }, 24 * 60 * 60 * 1000) // 24 hours in milliseconds
  }, msUntilMidnight)

  // Also run points conversion every hour (to check for eligible conversions)
  setInterval(() => {
    convertPointsToMoney().catch(console.error)
  }, 60 * 60 * 1000) // 1 hour in milliseconds

  console.log(`⏰ Scheduler started. Next run at: ${nextMidnight.toISOString()}`)
}

