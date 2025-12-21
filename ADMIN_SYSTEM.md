# Admin System Documentation

## Overview
The admin system provides secure access to platform management features. Only users with the `admin` role can access the admin dashboard and perform administrative actions.

## Features

### 1. Admin Authentication
- Separate admin login endpoint
- JWT token-based authentication
- Role-based access control
- Protected admin routes

### 2. Admin Dashboard
- Real-time platform statistics
- User management
- Investment monitoring
- Withdrawal approval system
- Recent users overview

### 3. Admin Pages
- **Dashboard** (`/admin`) - Overview of platform statistics
- **Users** (`/admin/users`) - Manage all users (view, suspend, activate)
- **Investments** (`/admin/investments`) - View all investments
- **Withdrawals** (`/admin/withdrawals`) - Approve pending withdrawals
- **Settings** (`/admin/settings`) - Platform settings (coming soon)

## Creating an Admin Account via Postman

### Step 1: Create Admin Endpoint
**Endpoint:** `POST http://localhost:5000/api/admin/auth/create`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "your-secure-password"
}
```

**Response:**
```json
{
  "message": "Admin created successfully",
  "user": {
    "id": "...",
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin",
    "status": "active",
    ...
  }
}
```

### Step 2: Login as Admin
**Endpoint:** `POST http://localhost:5000/api/admin/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "admin@example.com",
  "password": "your-secure-password"
}
```

**Response:**
```json
{
  "message": "Admin login successful",
  "user": {
    "id": "...",
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin",
    ...
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Important:** Save the `token` from the response. The token is stored in localStorage with key `admin-traders-token` for authenticated admin requests.

## Admin API Endpoints

### Authentication
- `POST /api/admin/auth/create` - Create admin account (public)
- `POST /api/admin/auth/login` - Admin login (public)
- `GET /api/admin/auth/profile` - Get admin profile (protected)

### Dashboard
- `GET /api/admin/stats` - Get dashboard statistics (protected)

### User Management
- `GET /api/admin/users` - Get all users (protected)
  - Query params: `status`, `limit`, `offset`
- `PATCH /api/admin/users/:userId/status` - Update user status (protected)
  - Body: `{ "status": "active" | "suspended" | "pending" }`

### Withdrawals
- `GET /api/admin/withdrawals/pending` - Get pending withdrawals (protected)
- `POST /api/admin/withdrawals/:transactionId/approve` - Approve withdrawal (protected)

## Using Admin Endpoints in Postman

### Example: Get Dashboard Stats

1. **Method:** GET
2. **URL:** `http://localhost:5000/api/admin/stats`
3. **Headers:**
   ```
   Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
   ```
4. **Send Request**

### Example: Get All Users

1. **Method:** GET
2. **URL:** `http://localhost:5000/api/admin/users?limit=50&status=active`
3. **Headers:**
   ```
   Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
   ```
4. **Send Request**

### Example: Update User Status

1. **Method:** PATCH
2. **URL:** `http://localhost:5000/api/admin/users/USER_ID/status`
3. **Headers:**
   ```
   Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
   Content-Type: application/json
   ```
4. **Body (JSON):**
   ```json
   {
     "status": "suspended"
   }
   ```
5. **Send Request**

### Example: Approve Withdrawal

1. **Method:** POST
2. **URL:** `http://localhost:5000/api/admin/withdrawals/TRANSACTION_ID/approve`
3. **Headers:**
   ```
   Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
   ```
4. **Send Request**

## Frontend Admin Access

### Login Page
Navigate to: `http://localhost:3000/admin/login`

Enter your admin credentials to access the admin dashboard.

### Protected Routes
All admin routes are protected by the `AdminRoute` component, which:
- Checks for admin token in localStorage
- Verifies token with backend
- Redirects to login if unauthorized
- Only allows access to users with `role: "admin"`

## Security Notes

1. **Admin Creation Endpoint:** The `/api/admin/auth/create` endpoint is currently public for initial setup. In production, you should:
   - Remove this endpoint, or
   - Protect it with a master admin key, or
   - Only allow it in development environment

2. **Token Storage:** Admin tokens are stored in `localStorage` with key `admin-traders-token`. This is separate from regular user tokens (which use `traders-token`).

3. **Token Expiration:** Admin tokens expire after 7 days. Users will need to log in again after expiration.

4. **Role Verification:** The admin middleware checks the user's role from the database on every request to ensure security.

5. **API URL Configuration:** All admin pages use the `NEXT_PUBLIC_API_URL` environment variable for API endpoints. If not set, it defaults to `http://localhost:5000/api`. Make sure to set this in your `.env.local` file for production.

## Database Schema

### User Model - Role Field
```typescript
{
  role: "user" | "admin",  // Default: "user"
  // ... other fields
}
```

## Troubleshooting

### "Access denied. Admin privileges required."
- Ensure the user has `role: "admin"` in the database
- Verify the token is valid and not expired
- Check that you're using the admin token, not a regular user token

### "Invalid or expired token"
- Token may have expired (7 days)
- Token may be invalid
- Try logging in again to get a new token

### Cannot access admin routes
- Ensure you're logged in via `/admin/login`
- Check that `admin-token` exists in localStorage
- Verify the backend is running on port 5000

## Next Steps

1. Create your first admin account using Postman
2. Log in via the admin login page
3. Explore the admin dashboard
4. Test user management features
5. Test withdrawal approval workflow

