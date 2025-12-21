# Task System - Implementation Details

## Overview
The task system allows users to complete up to **5 tasks** to earn points, which automatically convert to money after a set time period.

## Key Features

### 1. Task Completion Limit
- **Maximum Tasks**: Each user can complete **5 tasks total**
- **Enforcement**: Backend validates this limit before allowing task completion
- **Frontend Display**: Shows "Limit Reached" when 5 tasks are completed

### 2. Points System
- **Points Award**: Tasks award points (not direct money)
- **Conversion Rate**: 1 point = $0.01 (100 points = $1)
- **Example**: 
  - Task with 10 points reward = $0.10 when converted
  - Task with 50 points reward = $0.50 when converted

### 3. Points to Money Conversion
- **Conversion Delay**: Points convert to money after **24 hours** (configurable via `POINTS_CONVERSION_HOURS` env variable)
- **Automatic Processing**: 
  - Runs every hour to check for eligible conversions
  - Also runs daily at midnight
- **Process**:
  1. User completes task → Points added to `pendingPoints`
  2. After 24 hours → Points automatically convert to money
  3. Money added to user's `balance`
  4. Transaction record created

### 4. Task Status Flow
- **Available**: Task is ready to be completed
- **Completed**: Task is done, points awarded to `pendingPoints`
- **Auto-Complete**: Tasks are automatically marked as completed (no manual verification needed)

### 5. Backend Implementation

#### Task Completion Endpoint
- **Route**: `POST /api/tasks/:taskId/complete`
- **Validation**:
  - Checks if user has already completed 5 tasks
  - Prevents duplicate completions
- **Process**:
  1. Validates task exists
  2. Checks 5-task limit
  3. Marks task as "completed"
  4. Awards points to `pendingPoints`
  5. Returns success message

#### Points Conversion Service
- **File**: `backend/src/services/pointsConversionService.ts`
- **Function**: `convertPointsToMoney()`
- **Logic**:
  - Finds tasks completed more than 24 hours ago
  - Converts points to money at rate of 1 point = $0.01
  - Updates user balance and creates transaction
  - Marks tasks as `rewardClaimed: true`

### 6. Frontend Display

#### Task Page Features
- Shows available tasks (up to 5 can be completed)
- Displays task status (Available, Completed)
- Shows pending points that will convert to money
- Disables "Complete" button when 5 tasks are done
- Shows completion limit message

#### Stats Display
- **Total Earned**: Sum of rewards from completed tasks
- **Available Tasks**: Number of tasks user can still complete
- **Completed**: Number of tasks completed (max 5)
- **Pending Rewards**: Points waiting to convert to money (displayed as $)

### 7. Configuration

#### Environment Variables
- `POINTS_CONVERSION_HOURS`: Hours to wait before converting points (default: 24)

#### Points Conversion Rate
- Hardcoded in `pointsConversionService.ts`: `POINTS_TO_MONEY_RATE = 0.01`
- Can be changed if needed

### 8. Database Schema

#### User Model
```typescript
{
  points: number,           // Total points earned (converted)
  pendingPoints: number,    // Points waiting to convert to money
  balance: number,          // Money balance (includes converted points)
}
```

#### UserTask Model
```typescript
{
  userId: ObjectId,
  taskId: ObjectId,
  status: "available" | "completed" | "pending" | "expired",
  completedAt: Date,
  rewardClaimed: boolean,   // True when points converted to money
}
```

### 9. Example Flow

1. **User completes Task 1** (10 points):
   - Task status → "completed"
   - `pendingPoints` → +10
   - Message: "Task completed! Points will convert to money automatically."

2. **After 24 hours**:
   - Scheduler runs `convertPointsToMoney()`
   - 10 points → $0.10
   - `pendingPoints` → -10
   - `balance` → +$0.10
   - `totalEarnings` → +$0.10
   - Transaction created: "Points converted to money: 10 points = $0.10"

3. **User completes 5 tasks**:
   - After 5th task, all "Complete" buttons disabled
   - Message shown: "You've completed all 5 tasks!"
   - Points continue converting automatically

### 10. Admin Management

- Admins can create/edit/delete tasks via `/admin/tasks`
- Tasks can be marked as active/inactive
- Task rewards (points) can be set per task
- All tasks are available to all users (no user-specific tasks)

## Current Status

✅ **Fully Implemented**:
- 5-task limit per user
- Points system (1 point = $0.01)
- Automatic points to money conversion (24 hours)
- Auto-complete tasks (no manual verification)
- Hourly and daily scheduler for conversion
- Frontend display with limits
- Backend validation

## Testing

To test the task system:
1. Complete a task → Check `pendingPoints` increases
2. Wait 24 hours (or change `POINTS_CONVERSION_HOURS` to 1 for testing)
3. Check `balance` increases and `pendingPoints` decreases
4. Complete 5 tasks → Verify 6th task is blocked
5. Check transaction history for conversion records

