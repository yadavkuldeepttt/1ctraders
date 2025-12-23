# Investment & Payment Testing Guide

This comprehensive guide covers testing the complete investment flow from plan selection to payment processing.

## ⚠️ CRITICAL: Test on Devnet/Testnet First!

**🚨 NEVER test payments on mainnet without proper configuration! You will lose real money!**

This guide focuses on **devnet/testnet testing** to ensure you can test all payment functionality safely without risking real funds.

### Quick Safety Checklist ⚡

Before testing ANY payment functionality, verify:

- [ ] `NOWPAYMENTS_USE_TESTNET=true` in `backend/.env`
- [ ] `NODE_ENV=development` in `backend/.env`
- [ ] Using **SANDBOX API key** (not production key)
- [ ] Backend console shows: `🧪 NOWPayments TESTNET/SANDBOX mode enabled`
- [ ] Backend console shows: `📝 API URL: https://api-sandbox.nowpayments.io/v1`
- [ ] **If you see mainnet mode, STOP and fix configuration!**

**✅ Only proceed with testing when ALL checks pass!**

## Table of Contents
1. [Devnet/Testnet Configuration](#devnettestnet-configuration) ⚠️ **READ THIS FIRST**
2. [Prerequisites](#prerequisites)
3. [Investment Flow Overview](#investment-flow-overview)
4. [Step-by-Step Testing](#step-by-step-testing)
5. [Payment Methods Testing](#payment-methods-testing)
6. [OTP Verification Testing](#otp-verification-testing)
7. [Common Issues & Solutions](#common-issues--solutions)

---

## Devnet/Testnet Configuration

### ⚠️ IMPORTANT: Configure for Testnet Before Testing

**Before you start testing, you MUST configure your environment to use devnet/testnet to avoid losing real money.**

### Step 1: Configure Environment Variables

Create or update your `.env` file in the `backend` directory with these settings:

```bash
# CRITICAL: Enable testnet mode (prevents real money transactions)
NOWPAYMENTS_USE_TESTNET=true

# Set to development mode (also enables testnet automatically)
NODE_ENV=development

# Use your NOWPayments SANDBOX/TESTNET API key (NOT mainnet key!)
# Get this from: https://account.nowpayments.io/settings/api-keys
# Make sure you're logged into the SANDBOX account, not production
NOWPAYMENTS_API_KEY=your_sandbox_api_key_here

# IPN secret key for webhook verification (get from sandbox dashboard)
NOWPAYMENTS_IPN_SECRET_KEY=your_sandbox_ipn_secret_here

# Backend and Frontend URLs
BACKEND_URL=http://localhost:3010
FRONTEND_URL=http://localhost:3000

# MongoDB connection
MONGODB_URI=your_mongodb_connection_string

# Optional: Email OTP configuration (for production)
# GMAIL_USER=your_email@gmail.com
# GMAIL_APP_PASSWORD=your_app_password
```

### Step 2: Verify Testnet Mode is Active

After starting your backend server, **check the console logs** to confirm testnet mode:

**✅ CORRECT (Testnet Mode):**
```
🧪 NOWPayments TESTNET/SANDBOX mode enabled
📝 API URL: https://api-sandbox.nowpayments.io/v1
```

**❌ WRONG (Mainnet Mode - STOP IMMEDIATELY!):**
```
💰 NOWPayments MAINNET mode
📝 API URL: https://api.nowpayments.io/v1
```

**If you see mainnet mode, STOP and fix your configuration before testing!**

### Step 3: Get NOWPayments Sandbox Account

1. **Sign up for NOWPayments Sandbox Account:**
   - Go to: https://account.nowpayments.io/
   - Create a **sandbox/testnet account** (separate from production)
   - Sandbox accounts are free and use fake/test cryptocurrencies

2. **Get Sandbox API Key:**
   - Login to your sandbox account
   - Navigate to Settings → API Keys
   - Generate a new API key
   - Copy it to your `.env` file as `NOWPAYMENTS_API_KEY`

3. **Get Sandbox IPN Secret:**
   - In sandbox dashboard, go to Settings → IPN Settings
   - Copy the IPN secret key
   - Add it to your `.env` file as `NOWPAYMENTS_IPN_SECRET_KEY`

### Step 4: Verify Testnet Configuration Checklist

Before testing, verify all of these:

- [ ] `NOWPAYMENTS_USE_TESTNET=true` in `.env` file
- [ ] `NODE_ENV=development` in `.env` file
- [ ] Using **sandbox API key** (not mainnet API key)
- [ ] Backend console shows: `🧪 NOWPayments TESTNET/SANDBOX mode enabled`
- [ ] Backend console shows: `📝 API URL: https://api-sandbox.nowpayments.io/v1`
- [ ] You're logged into NOWPayments **sandbox dashboard** (not production)

### Testnet vs Mainnet Differences

| Feature | Testnet/Sandbox | Mainnet (Production) |
|---------|----------------|----------------------|
| **API URL** | `https://api-sandbox.nowpayments.io/v1` | `https://api.nowpayments.io/v1` |
| **Money** | ❌ Fake/test cryptocurrencies | ✅ Real money |
| **Risk** | ✅ Safe to test | ⚠️ Real funds at risk |
| **Account** | Separate sandbox account | Production account |
| **API Key** | Sandbox API key | Production API key |
| **Purpose** | Testing & Development | Live transactions |

### How Testnet Mode Works

The system automatically uses testnet when:
- `NOWPAYMENTS_USE_TESTNET=true` is set, OR
- `NODE_ENV=development` is set

**Both conditions enable testnet mode for safety.**

---

## Prerequisites

### Backend Setup
1. **Start the backend server:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   Server should run on `http://localhost:3010` (or port specified in PORT env variable)

2. **Verify Testnet Mode:**
   - Check backend console for: `🧪 NOWPayments TESTNET/SANDBOX mode enabled`
   - If you see mainnet mode, **STOP** and fix your `.env` configuration

3. **Environment Variables:**
   - Ensure MongoDB is running and connected
   - **NOWPayments Configuration (CRITICAL for Safe Testing):**
     - `NOWPAYMENTS_USE_TESTNET=true` - **MUST be true for testing** (prevents real money)
     - `NODE_ENV=development` - Also enables testnet automatically
     - `NOWPAYMENTS_API_KEY` - **Use SANDBOX API key** (get from sandbox dashboard)
     - `NOWPAYMENTS_IPN_SECRET_KEY` - **Use SANDBOX IPN secret** (get from sandbox dashboard)
     - **Testnet URL**: `https://api-sandbox.nowpayments.io/v1` ✅ (no real money - safe for testing)
     - **Mainnet URL**: `https://api.nowpayments.io/v1` ⚠️ (real money - only for production!)
   - For email OTP (optional in dev):
     - `GMAIL_USER` - Your Gmail address
     - `GMAIL_APP_PASSWORD` - Gmail app password
   - **Note:** In development mode, OTP is logged to console if email is not configured

### Frontend Setup
1. **Start the frontend:**
   ```bash
   npm install
   npm run dev
   ```
   Frontend should run on `http://localhost:3000`

### Test User Account
1. Register a new account at `/auth/register`
2. Complete email verification (OTP will be shown in console in dev mode)
3. Login at `/auth/login`
4. Complete 2FA login (OTP will be shown in console in dev mode)

---

## Investment Flow Overview

The investment process follows these steps:

1. **Select Investment Plan** → Choose from 4 plans (Oil, Shares, Crypto, AI Trading)
2. **Enter Investment Amount** → Must be within plan's min/max limits
3. **Choose Payment Method** → Wallet balance or Crypto payment
4. **OTP Verification** (for crypto payments) → Email OTP required
5. **Payment Processing** → Create investment transaction
6. **Investment Created** → Investment starts earning daily ROI

---

## Step-by-Step Testing

### Test Case 1: Investment with Wallet Balance

**Objective:** Test investment using existing wallet balance

**Steps:**
1. **Navigate to Wallet Page** (`/dashboard/wallet`)
   - Check current balance
   - If balance is $0, you need to deposit first (see Test Case 2)

2. **Navigate to Investments Page** (`/dashboard/invest`)
   - You should see 4 investment plans:
     - Oil Investment (Min: $100, Max: $5,000)
     - Shares Trading (Min: $100, Max: $10,000)
     - Crypto Trading (Min: $100, Max: $25,000)
     - AI Trading Bot (Min: $100, Max: $50,000)

3. **Select a Plan**
   - Click on any plan card (e.g., "Oil Investment")
   - Modal should open showing plan details

4. **Enter Investment Amount**
   - Enter amount between min and max (e.g., $500)
   - Select payment method: **"Use Wallet Balance"**
   - Click "Invest Now"

5. **Verify Investment Created**
   - Success message should appear
   - Balance should decrease by investment amount
   - Investment should appear in your investments list
   - Notification should be created

**Expected Results:**
- ✅ Investment created successfully
- ✅ Balance deducted correctly
- ✅ Investment shows as "active"
- ✅ Notification received
- ✅ Daily ROI will start accruing

---

### Test Case 2: Crypto Deposit Flow (NOWPayments) - **DEVNET TESTING**

**⚠️ IMPORTANT: This test uses NOWPayments testnet. No real money is involved.**

**Objective:** Test depositing funds via NOWPayments crypto payment on testnet

**Pre-Test Verification:**
- ✅ Confirm backend console shows: `🧪 NOWPayments TESTNET/SANDBOX mode enabled`
- ✅ Confirm API URL is: `https://api-sandbox.nowpayments.io/v1`
- ✅ If you see mainnet mode, **STOP** and fix configuration

**Steps:**
1. **Navigate to Wallet Page** (`/dashboard/wallet`)
   - Click "Deposit" button
   - Deposit dialog opens

2. **Enter Deposit Details**
   - Enter amount in USD (e.g., $100)
   - **Select cryptocurrency** from dropdown (ETH, BTC, USDT, etc.)
   - Click "Continue"

3. **Backend Creates NOWPayments Payment (Testnet)**
   - Backend calls NOWPayments **SANDBOX** API
   - Creates payment with unique order ID
   - Receives payment address and crypto amount
   - **Note:** This is a testnet address - no real crypto needed!

4. **View Payment Details**
   - Dialog shows:
     - **Send Exactly:** [crypto amount] [coin] (e.g., 0.056 ETH)
     - **To Address:** [NOWPayments testnet wallet address]
     - **Network:** [Selected coin network]
   - Copy buttons available for address and amount
   - **⚠️ On testnet, you can simulate payment without sending real crypto**

5. **Simulate Payment (Testnet Mode)**
   - **Option A: Use NOWPayments Sandbox Simulator**
     - In NOWPayments sandbox dashboard, you can simulate payments
     - No real blockchain transaction needed
   - **Option B: Use Testnet Faucets (if available)**
     - Some testnets have faucets for free test tokens
     - Send test tokens to the provided address
   - **Option C: Manual Webhook Simulation**
     - Use NOWPayments sandbox to manually trigger webhook
     - Or use a tool like Postman to simulate webhook call

6. **NOWPayments Processes Payment (Testnet)**
   - NOWPayments sandbox watches testnet blockchain (if using real testnet)
   - Or processes simulated payment
   - Waits for confirmations
   - Validates amount

7. **Webhook Updates Wallet** 🚨
   - NOWPayments calls webhook: `/api/payments/nowpayments/ipn`
   - Backend receives payment confirmation
   - **Wallet is credited automatically** (no admin approval needed)
   - Transaction status changes to "completed"
   - Notification sent to user

8. **Verify Balance Update**
   - Refresh wallet page
   - Balance should show increased amount
   - Transaction shows as "completed"

**Expected Results:**
- ✅ Payment address generated (testnet address)
- ✅ Crypto amount calculated correctly
- ✅ User can copy address and amount
- ✅ Payment processed on testnet (no real money)
- ✅ Webhook receives confirmation
- ✅ Wallet credited automatically
- ✅ Balance increases
- ✅ Notification received

**⚠️ Safety Notes:**
- All transactions are on testnet - no real money involved
- Testnet addresses are different from mainnet addresses
- You can test as many times as needed without cost
- Testnet transactions don't affect real wallet balances

---

### Test Case 3: Investment with Crypto Payment

**Objective:** Test investment using crypto payment (requires OTP)

**Steps:**
1. **Navigate to Investments Page** (`/dashboard/invest`)
   - Select a plan (e.g., "Crypto Trading")
   - Enter investment amount (e.g., $500)
   - Select payment method: **"Pay with Crypto"**

2. **Send OTP**
   - Click "Send OTP" button
   - OTP will be sent to your email
   - **Check backend console for OTP in dev mode**

3. **Verify OTP**
   - Enter 6-digit OTP
   - Click "Verify OTP"
   - OTP should be verified

4. **Complete Investment**
   - After OTP verification, investment should be created
   - Payment transaction should be created

**Expected Results:**
- ✅ OTP sent and verified
- ✅ Investment created
- ✅ Payment transaction created
- ✅ Notification received

---

### Test Case 4: Withdrawal Flow

**Objective:** Test withdrawal request (manual approval required)

**Steps:**
1. **Navigate to Wallet Page** (`/dashboard/wallet`)
   - Ensure you have sufficient balance
   - Click "Withdraw" button

2. **Enter Withdrawal Details**
   - Enter withdrawal amount (must be ≤ balance)
   - Enter crypto wallet address for withdrawal

3. **Submit Withdrawal**
   - Click "Withdraw" button
   - Withdrawal request should be created

4. **Check Admin Panel**
   - Login as admin at `/admin/login`
   - Navigate to "Withdrawals" page
   - Pending withdrawal should be visible
   - Approve withdrawal

**Expected Results:**
- ✅ Withdrawal request created with "pending" status
- ✅ Message: "Your request is pending manual approval by admin"
- ✅ Admin can see pending withdrawal
- ✅ Admin can approve withdrawal
- ✅ Balance decreases after approval

---

## Payment Methods Testing

### Wallet Balance Payment (for Investments)
- **No OTP Required** ✅
- **Instant Processing** ✅
- **Balance Check:** System validates sufficient balance
- **Error Handling:** Shows error if balance insufficient

### NOWPayments Crypto Deposit
- **No OTP Required** ✅ (NOWPayments handles security)
- **Coin Selection:** User selects from supported cryptocurrencies
- **Payment Address:** Generated by NOWPayments
- **Automatic Credit:** Wallet credited via webhook when payment confirmed
- **Real-time Status:** Payment status updates automatically

---

## OTP Verification Testing

### Development Mode
1. **Check Backend Console:**
   - OTP is logged when sent
   - Format: `OTP for [email]: [6-digit-code]`

2. **Check Frontend:**
   - Success message may show OTP in dev mode
   - Format: `OTP sent! (Dev mode: 123456)`

### Production Mode
1. **Check Email:**
   - OTP sent to registered email
   - Subject: "Your OTP Code"
   - Contains 6-digit code

### OTP Testing Scenarios
- ✅ Valid OTP: Should verify successfully
- ❌ Invalid OTP: Should show error
- ❌ Expired OTP: Should show error (OTP expires after 10 minutes)
- ❌ Wrong OTP: Should show error

---

## Common Issues & Solutions

### Issue 1: OTP Not Received
**Solution:**
- Check backend console in dev mode
- Verify email configuration in `.env`
- Check spam folder in production
- OTP is logged to console in dev mode

### Issue 2: Insufficient Balance
**Solution:**
- Deposit funds first via Wallet page using NOWPayments
- Select coin and send payment to generated address
- Wait for blockchain confirmation (webhook will credit wallet)
- Check current balance in wallet

### Issue 3: Investment Not Created
**Solution:**
- Verify amount is within min/max limits
- Check OTP is verified (for crypto payments)
- Check backend console for errors
- Verify user is authenticated

### Issue 4: Payment Transaction Pending
**Solution:**
- NOWPayments deposits are automatic (no admin approval)
- Wait for blockchain confirmations (on testnet, this may be faster)
- Webhook will credit wallet when payment is confirmed
- Check payment status in transaction history
- If stuck, verify webhook URL is configured in NOWPayments **sandbox** dashboard
- On testnet, you can manually trigger webhook from sandbox dashboard

### Issue 5: Accidentally Using Mainnet
**⚠️ CRITICAL: If you see mainnet mode in console:**
1. **STOP testing immediately**
2. Check your `.env` file:
   - Ensure `NOWPAYMENTS_USE_TESTNET=true`
   - Ensure `NODE_ENV=development`
3. Restart backend server
4. Verify console shows testnet mode
5. **Never use production API keys for testing**

**How to verify you're on testnet:**
- Backend console must show: `🧪 NOWPayments TESTNET/SANDBOX mode enabled`
- API URL must be: `https://api-sandbox.nowpayments.io/v1`
- Payment addresses will be testnet addresses (different format)
- No real money will be involved

### Issue 6: OTP Verification Failed
**Solution:**
- Ensure OTP is 6 digits
- Check OTP hasn't expired (10 min limit)
- Request new OTP if needed
- Verify email matches registered email

---

## Admin Testing

### Approve Deposit
1. Login as admin: `/admin/login`
2. Navigate to "Withdrawals" page
3. Find pending deposit transaction
4. Click "Approve"
5. User balance should increase

### Approve Withdrawal
1. Login as admin: `/admin/login`
2. Navigate to "Withdrawals" page
3. Find pending withdrawal
4. Click "Approve"
5. User balance should decrease

---

## Testing Checklist

### Investment Flow
- [ ] Select investment plan
- [ ] Enter valid amount (within limits)
- [ ] Choose payment method
- [ ] Complete OTP verification (if crypto)
- [ ] Investment created successfully
- [ ] Balance updated correctly
- [ ] Notification received
- [ ] Investment appears in list

### Deposit Flow
- [ ] Enter deposit amount
- [ ] Select crypto payment
- [ ] Enter wallet address
- [ ] Send and verify OTP
- [ ] Deposit transaction created
- [ ] Admin can approve deposit
- [ ] Balance increases after approval

### Withdrawal Flow
- [ ] Enter withdrawal amount
- [ ] Enter withdrawal address
- [ ] Submit withdrawal request
- [ ] Request shows as pending
- [ ] Admin can approve withdrawal
- [ ] Balance decreases after approval

### OTP System
- [ ] OTP sent successfully
- [ ] OTP received (console/email)
- [ ] OTP verification works
- [ ] Invalid OTP rejected
- [ ] Expired OTP rejected

---

## Payment Testing Focus (Testnet)

### ⚠️ Always Test on Testnet First!

**Before testing any payment functionality:**
1. ✅ Verify testnet mode is active
2. ✅ Confirm sandbox API key is configured
3. ✅ Check backend console shows testnet URL
4. ✅ Never use production API keys for testing

### Critical Payment Tests (Testnet)

1. **Crypto Payment with OTP:**
   - Most complex flow
   - Requires OTP verification
   - Tests full payment security
   - **Safe on testnet - no real money**

2. **Wallet Balance Payment:**
   - Fastest flow
   - No OTP required
   - Tests balance validation
   - **Safe on testnet - uses test balance**

3. **Deposit → Investment Flow:**
   - Complete user journey
   - Deposit → Wait for webhook → Invest
   - Tests end-to-end functionality
   - **Safe on testnet - testnet deposits**

### How to Test Payment Properly on Testnet

1. **Verify Testnet Configuration:**
   - Check `.env` has `NOWPAYMENTS_USE_TESTNET=true`
   - Verify backend console shows testnet mode
   - Confirm using sandbox API key

2. **Start with Small Amounts:**
   - Test with $100 minimum
   - Verify each step works
   - Check balance updates
   - **No real money at risk on testnet**

3. **Test Both Payment Methods:**
   - Wallet balance payment (no OTP)
   - Crypto payment (with OTP)
   - Both work safely on testnet

4. **Test Error Cases:**
   - Insufficient balance
   - Invalid amount (below min/above max)
   - Invalid OTP
   - Missing required fields
   - **Safe to test errors on testnet**

5. **Verify Database:**
   - Check investment created in database
   - Check transaction created
   - Check balance updated
   - Check notification created

6. **Test Webhook Processing:**
   - Simulate webhook calls
   - Verify wallet auto-crediting
   - Test payment status updates
   - **Use NOWPayments sandbox to simulate**

### NOWPayments Sandbox Testing Methods

**Method 1: Sandbox Dashboard Simulation**
- NOWPayments sandbox dashboard allows payment simulation
- No real blockchain transaction needed
- Can manually trigger webhooks

**Method 2: Testnet Faucets**
- Some cryptocurrencies have testnet faucets
- Get free test tokens
- Send to testnet addresses
- Wait for confirmations

**Method 3: Manual Webhook Testing**
- Use Postman or curl to simulate webhook
- Send test webhook payload to your endpoint
- Verify wallet crediting logic

---

## Quick Test Script (Devnet/Testnet)

**⚠️ Before running: Verify testnet mode is active in backend console!**

```bash
# 1. Verify Testnet Configuration
# Check backend/.env file:
# - NOWPAYMENTS_USE_TESTNET=true
# - NODE_ENV=development
# - NOWPAYMENTS_API_KEY=your_sandbox_key

# 2. Start Backend
cd backend && npm run dev

# 3. VERIFY TESTNET MODE (CRITICAL!)
# Check backend console output:
# Should see: 🧪 NOWPayments TESTNET/SANDBOX mode enabled
# Should see: 📝 API URL: https://api-sandbox.nowpayments.io/v1
# If you see mainnet mode, STOP and fix .env file!

# 4. Start Frontend (new terminal)
npm run dev

# 5. Register Account
# Go to http://localhost:3000/auth/register
# Complete registration with OTP (check console)

# 6. Login
# Go to http://localhost:3000/auth/login
# Complete 2FA with OTP (check console)

# 7. Deposit Funds (NOWPayments TESTNET)
# Go to /dashboard/wallet
# Click Deposit → Enter $100 → Select ETH → Continue
# Copy payment address and amount (testnet address)
# Use NOWPayments sandbox to simulate payment OR
# Use testnet faucet to get test tokens and send to address
# Wait for webhook confirmation (wallet auto-credited)

# 8. Make Investment
# Go to /dashboard/invest
# Select plan → Enter $500 → Wallet Balance → Invest
# Verify investment created

# 9. Test Crypto Payment Investment
# Select plan → Enter $300 → Crypto Payment
# Send OTP → Verify OTP → Complete
```

**⚠️ Safety Reminders:**
- Always verify testnet mode before testing
- Use sandbox API keys, not production keys
- Testnet transactions don't use real money
- You can test unlimited times on testnet

---

## Notes

### Testnet/Devnet Testing
- **Testnet Mode:** Automatically enabled when `NOWPAYMENTS_USE_TESTNET=true` or `NODE_ENV=development`
- **Safe Testing:** Testnet uses fake/test cryptocurrencies - no real money at risk
- **Unlimited Testing:** Test as many times as needed without cost
- **Sandbox Account:** Use separate NOWPayments sandbox account for testing

### Payment Processing
- **Development Mode:** OTP is logged to console, no email needed
- **Production Mode:** OTP sent via email, requires Gmail configuration
- **All Withdrawals:** Require manual admin approval
- **Crypto Payments:** Require OTP verification
- **Wallet Payments:** No OTP required, instant processing
- **Daily ROI:** Starts accruing immediately after investment creation

### Moving to Production
**⚠️ Before going to production:**
1. Set `NOWPAYMENTS_USE_TESTNET=false` (or remove the variable)
2. Set `NODE_ENV=production`
3. Use **production API key** from NOWPayments production account
4. Use **production IPN secret** from NOWPayments production account
5. Verify webhook URL is accessible from internet (use ngrok or similar for local testing)
6. Test with small amounts first
7. Monitor transactions carefully

---

## Support

If you encounter issues:
1. Check backend console for errors
2. Check browser console for frontend errors
3. Verify MongoDB connection
4. Verify environment variables
5. Check network requests in browser DevTools

