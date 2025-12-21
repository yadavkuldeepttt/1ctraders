# 1C Traders Backend API

Backend API for the 1C Traders investment platform built with Node.js, Express, TypeScript, and MongoDB.

## Features

- User authentication and authorization
- Investment management
- Transaction processing
- Referral system (12 levels)
- Task system
- Admin dashboard

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the `backend` directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/1ctraders
JWT_SECRET=your-secret-key-change-in-production
```

3. Start MongoDB (if running locally):
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo

# Or using MongoDB service
mongod
```

## Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `GET /api/auth/verify` - Verify token (protected)

### Investments
- `GET /api/investments/plans` - Get investment plans
- `POST /api/investments` - Create investment (protected)
- `GET /api/investments` - Get user investments (protected)
- `GET /api/investments/:id` - Get investment by ID (protected)

### Transactions
- `POST /api/transactions/deposit` - Create deposit (protected)
- `POST /api/transactions/withdrawal` - Create withdrawal (protected)
- `GET /api/transactions` - Get user transactions (protected)
- `GET /api/transactions/:id` - Get transaction by ID (protected)

### Referrals
- `GET /api/referrals/stats` - Get referral statistics (protected)
- `GET /api/referrals` - Get user referrals (protected)
- `GET /api/referrals/tree` - Get referral tree (protected)

### Tasks
- `GET /api/tasks/available` - Get available tasks (protected)
- `GET /api/tasks` - Get user tasks (protected)
- `POST /api/tasks/:id/complete` - Complete task (protected)

### Admin
- `GET /api/admin/stats` - Get dashboard stats (admin)
- `GET /api/admin/users` - Get all users (admin)
- `PUT /api/admin/users/:userId/status` - Update user status (admin)
- `GET /api/admin/withdrawals/pending` - Get pending withdrawals (admin)
- `POST /api/admin/withdrawals/:transactionId/approve` - Approve withdrawal (admin)

## Database Schema

### User
- username, email, password
- referralCode, referredBy
- balance, totalInvested, totalEarnings, totalWithdrawn
- status, emailVerified, twoFactorEnabled

### Investment
- userId, type, amount
- roiPercentage, dailyReturn
- totalReturns, totalRoiEarned, totalCommissionEarned
- startDate, endDate, status

### Transaction
- userId, type, amount, status
- description, txHash, withdrawalAddress
- completedAt

### Referral
- referrerId, referredUserId, level
- totalEarnings, status

### Task
- title, description, type, reward
- requirements, expiresAt, isActive

## Environment Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens

## License

MIT
