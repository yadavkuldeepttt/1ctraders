# 1C Traders - Complete Testing Documentation

## Overview
This document provides step-by-step instructions to test all features of the 1C Traders investment platform.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Setup Instructions](#setup-instructions)
3. [Feature Testing Guide](#feature-testing-guide)
4. [Missing Features & Status](#missing-features--status)
5. [Known Issues](#known-issues)

---

## Prerequisites

### Required Software
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn
- Postman or similar API testing tool (optional)

### Environment Variables
Create a `.env` file in the `backend` directory with:
```
MONGODB_URI=mongodb://localhost:27017/1ctraders
JWT_SECRET=your-secret-key-change-in-production
PORT=5000
NODE_ENV=development
POINTS_CONVERSION_HOURS=24
```

---

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
npm run build
npm run dev
```

The backend should start on `http://localhost:5000`

### 2. Frontend Setup

```bash
# From project root
npm install
npm run dev
```

The frontend should start on `http://localhost:3000`

### 3. Database Setup

Ensure MongoDB is running:
```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
```

---

## Feature Testing Guide

### ✅ Feature 1: User Registration & Authentication

#### Test Registration
1. Navigate to `/auth/register`
2. Fill in:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
   - Optional: Referral code (if you have one)
3. Click "Register"
4. **Expected**: User created, JWT token returned, redirected to dashboard

#### Test Login
1. Navigate to `/auth/login`
2. Enter credentials
3. Click "Login"
4. **Expected**: JWT token returned, redirected to dashboard

#### Test Token Verification
1. Use the JWT token in Authorization header: `Bearer <token>`
2. Call `GET /api/auth/verify`
3. **Expected**: User data returned

---

### ✅ Feature 2: Investment System

#### Test Investment Plans
1. Login as a user
2. Navigate to `/dashboard/invest`
3. **Expected**: See 4 investment options:
   - Oil Investment ($100 - $5,000)
   - Shares Trading ($100 - $10,000)
   - Crypto Trading ($100 - $25,000)
   - AI Trading Bot ($100 - $50,000)

#### Test Creating Investment
1. Select an investment plan (e.g., Oil Investment)
2. Enter amount: `$100`
3. Select payment method: "Wallet Balance" or "Crypto"
4. Click "Invest Now"
5. **Expected**: 
   - Investment created
   - Balance deducted (if wallet payment)
   - Investment appears in dashboard

#### Test Investment Limits
1. Try investing below minimum ($99)
   - **Expected**: Error "Minimum investment is $100"
2. Try investing above maximum
   - **Expected**: Error showing max limit
3. Try investing more than balance (wallet)
   - **Expected**: "Insufficient balance" error

#### Test ROI Calculation
1. Create a $100 investment
2. Check investment details
3. **Expected**: 
   - Daily ROI: 1.5-2.5% (randomized)
   - Daily return: $1.50 - $2.50
   - ROI limit: 300% ($300 max)
   - Commission limit: 400% ($400 max if networking)

---

### ✅ Feature 3: Daily ROI Distribution (Automated)

#### Test Manual ROI Processing
1. Create an investment
2. Wait for scheduler or manually trigger (development mode)
3. Check user balance after 24 hours
4. **Expected**: 
   - Balance increased by daily ROI amount
   - Transaction created with type "roi"
   - Investment `totalRoiEarned` updated

#### Test ROI Limits
1. Create $100 investment
2. Wait until total ROI reaches $300 (300% limit)
3. **Expected**: Investment status changes to "completed"

#### Test Networking Limit (400%)
1. Create $100 investment
2. Have active referrals
3. Wait until total returns reach $400
4. **Expected**: Investment expires at $400 (not $300)

---

### ✅ Feature 4: Task System

#### Test Available Tasks
1. Navigate to `/dashboard/tasks`
2. **Expected**: See available tasks (up to 5)

#### Test Completing Task
1. Click on a task
2. Complete the task requirements
3. Click "Complete Task"
4. **Expected**: 
   - Points added to `pendingPoints`
   - Task status: "completed"
   - Points will convert to money after 24 hours

#### Test Points Conversion
1. Complete 5 tasks
2. Wait 24 hours (or adjust `POINTS_CONVERSION_HOURS` in .env)
3. **Expected**: 
   - Points converted to money (1 point = $0.01)
   - Balance increased
   - Transaction created
   - `pendingPoints` decreased

---

### ✅ Feature 5: Referral System

#### Test Referral Code Generation
1. Register a new user
2. Check profile
3. **Expected**: Unique referral code generated (format: `1CT-XXXXX-XXXX`)

#### Test Referral Registration
1. Use referral code during registration
2. **Expected**: 
   - Referral relationship created
   - Level 1 referral for referrer

#### Test Referral Commission
1. User A refers User B (Level 1: 8%)
2. User B refers User C (Level 2: 1%)
3. User C creates $100 investment
4. Daily ROI distributed
5. **Expected**: 
   - User B gets 8% commission from User C's ROI
   - User A gets 1% commission from User C's ROI
   - Commissions added to balance

#### Test 12-Level Referral Chain
1. Create 12-level referral chain
2. Bottom user creates investment
3. **Expected**: All 12 levels receive commissions (8% + 11×1% = 19%, capped at 20%)

#### Test Referral Stats
1. Navigate to `/dashboard/referrals`
2. **Expected**: 
   - Total referrals count
   - Earnings by level
   - Referral tree visualization

---

### ✅ Feature 6: Crypto Payments

#### Test Crypto Deposit
1. Navigate to `/dashboard/wallet`
2. Enter deposit amount
3. Select "Crypto" payment method
4. **Expected**: 
   - Deposit transaction created (status: pending)
   - Transaction hash generated

#### Test Crypto Withdrawal
1. Ensure sufficient balance
2. Enter withdrawal amount
3. Enter crypto wallet address
4. Click "Withdraw"
5. **Expected**: 
   - Withdrawal request created (status: pending)
   - Admin can approve

---

### ✅ Feature 7: Admin Features

#### Test Admin Dashboard
1. Login as admin (`admin@irma.com`)
2. Navigate to admin dashboard
3. **Expected**: 
   - Total users count
   - Active users count
   - Total investments
   - Pending withdrawals

#### Test User Management
1. View all users
2. Update user status (active/suspended)
3. **Expected**: User status updated

#### Test Withdrawal Approval
1. View pending withdrawals
2. Approve a withdrawal
3. **Expected**: 
   - Withdrawal status: completed
   - User balance updated

---

## Missing Features & Status

### ✅ Implemented Features

1. ✅ **Investment Options** - All 4 types available (Oil, Shares, Crypto, AI)
2. ✅ **Daily ROI** - 1.5-2.5% per $100, randomized
3. ✅ **Automated ROI Distribution** - Daily scheduler implemented
4. ✅ **ROI Limits** - 300% limit enforced
5. ✅ **Commission Limits** - 400% limit if networking active
6. ✅ **Package Expiration** - Automatic expiration at limits
7. ✅ **Referral System** - 12 levels, 8% direct, 1% others, 20% cap
8. ✅ **Task System** - 5 tasks available
9. ✅ **Points System** - Points earned from tasks
10. ✅ **Points Conversion** - Automatic conversion after 24 hours
11. ✅ **Crypto Payments** - Deposit and withdrawal support

### ⚠️ Partially Implemented

1. ⚠️ **Task Verification** - Tasks are auto-completed, needs manual verification system
2. ⚠️ **Crypto Gateway Integration** - Basic structure, needs actual crypto payment gateway
3. ⚠️ **Admin Monitoring** - Basic dashboard, needs advanced analytics

### ❌ Not Implemented

1. ❌ **Email Verification** - Email verification system not implemented
2. ❌ **2FA** - Two-factor authentication not implemented
3. ❌ **Advanced Analytics** - Detailed investment analytics dashboard
4. ❌ **Mobile App Backend Integration** - Mobile app exists but not connected to backend

---

## Testing Scenarios

### Scenario 1: Complete Investment Flow
1. Register new user
2. Complete 5 tasks to earn points
3. Wait for points conversion (or adjust hours)
4. Create $100 investment (Oil)
5. Wait for daily ROI distribution
6. Check balance increased
7. Verify investment expires at $300 ROI

### Scenario 2: Referral Network Flow
1. User A registers
2. User B registers with User A's referral code
3. User C registers with User B's referral code
4. User C creates $100 investment
5. Daily ROI distributed
6. Verify:
   - User B gets 8% commission
   - User A gets 1% commission
   - Commissions added to balances

### Scenario 3: Networking Limit Test
1. User with active referrals creates $100 investment
2. Wait until total returns reach $400
3. Verify investment expires at $400 (not $300)

### Scenario 4: Points System Flow
1. User completes 5 tasks
2. Verify points added to `pendingPoints`
3. Wait 24 hours (or adjust `POINTS_CONVERSION_HOURS`)
4. Verify points converted to money
5. Check balance increased
6. Verify transaction created

---

## API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `GET /api/auth/verify` - Verify JWT token

### Investments
- `GET /api/investments/plans` - Get investment plans
- `POST /api/investments` - Create investment
- `GET /api/investments` - Get user investments
- `GET /api/investments/:id` - Get investment by ID

### Tasks
- `GET /api/tasks/available` - Get available tasks
- `GET /api/tasks/user` - Get user tasks
- `POST /api/tasks/:taskId/complete` - Complete task

### Referrals
- `GET /api/referrals/stats` - Get referral statistics
- `GET /api/referrals` - Get user referrals
- `GET /api/referrals/tree` - Get referral tree

### Transactions
- `POST /api/transactions/deposit` - Create deposit
- `POST /api/transactions/withdrawal` - Create withdrawal
- `GET /api/transactions` - Get user transactions
- `GET /api/transactions/:id` - Get transaction by ID

### Admin
- `GET /api/admin/stats` - Get dashboard stats
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:userId/status` - Update user status
- `GET /api/admin/withdrawals/pending` - Get pending withdrawals
- `PUT /api/admin/withdrawals/:id/approve` - Approve withdrawal

---

## Environment Configuration

### Development
- ROI processes immediately on startup
- Points conversion runs every hour
- Detailed logging enabled

### Production
- ROI processes daily at midnight UTC
- Points conversion runs every hour
- Minimal logging

---

## Troubleshooting

### Issue: ROI not distributing
**Solution**: 
1. Check scheduler is running (check logs)
2. Verify investments are "active"
3. Check `lastPaidDate` to ensure not already paid today

### Issue: Points not converting
**Solution**:
1. Check `POINTS_CONVERSION_HOURS` in .env
2. Verify tasks completed more than X hours ago
3. Check `rewardClaimed` flag on tasks

### Issue: Referral commissions not working
**Solution**:
1. Verify referral relationships exist
2. Check referral levels are correct
3. Ensure investment is active

### Issue: Investment not expiring at limit
**Solution**:
1. Check `totalRoiEarned` vs `amount * 3`
2. Check if user has active referrals (for 400% limit)
3. Verify investment status

---

## Performance Testing

### Load Testing
1. Create 100 test users
2. Create 100 investments
3. Monitor ROI processing time
4. **Expected**: All ROI processed within 5 minutes

### Stress Testing
1. Create 1000 investments
2. Process daily ROI
3. Monitor database performance
4. **Expected**: System handles load gracefully

---

## Security Testing

### Test JWT Token
1. Try accessing protected routes without token
2. **Expected**: 401 Unauthorized

### Test Admin Routes
1. Try accessing admin routes as regular user
2. **Expected**: 403 Forbidden

### Test Input Validation
1. Try negative investment amounts
2. Try invalid email formats
3. **Expected**: Validation errors

---

## Database Schema

### Collections
- `users` - User accounts
- `investments` - Investment records
- `tasks` - Available tasks
- `usertasks` - User task completions
- `referrals` - Referral relationships
- `referralcommissions` - Commission records
- `transactions` - All transactions

---

## Next Steps for Production

1. **Implement Email Verification**
   - Send verification emails
   - Verify email before account activation

2. **Implement 2FA**
   - Add TOTP support
   - Backup codes

3. **Crypto Gateway Integration**
   - Integrate actual payment gateway
   - Support multiple cryptocurrencies

4. **Advanced Analytics**
   - Investment performance charts
   - Referral network visualization
   - Earnings reports

5. **Mobile App Integration**
   - Connect mobile app to backend
   - Push notifications

6. **Testing**
   - Unit tests
   - Integration tests
   - E2E tests

---

## Support

For issues or questions:
1. Check logs in backend console
2. Check MongoDB for data integrity
3. Verify environment variables
4. Review this documentation

---

**Last Updated**: December 2024
**Version**: 1.0.0

