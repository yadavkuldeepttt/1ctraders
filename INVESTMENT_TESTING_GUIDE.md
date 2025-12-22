# Investment & Payment Testing Guide

This comprehensive guide covers testing the complete investment flow from plan selection to payment processing.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Investment Flow Overview](#investment-flow-overview)
3. [Step-by-Step Testing](#step-by-step-testing)
4. [Payment Methods Testing](#payment-methods-testing)
5. [OTP Verification Testing](#otp-verification-testing)
6. [Common Issues & Solutions](#common-issues--solutions)

---

## Prerequisites

### Backend Setup
1. **Start the backend server:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   Server should run on `http://localhost:5000`

2. **Environment Variables:**
   - Ensure MongoDB is running and connected
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

### Test Case 2: Crypto Deposit Flow (NOWPayments)

**Objective:** Test depositing funds via NOWPayments crypto payment

**Steps:**
1. **Navigate to Wallet Page** (`/dashboard/wallet`)
   - Click "Deposit" button
   - Deposit dialog opens

2. **Enter Deposit Details**
   - Enter amount in USD (e.g., $100)
   - **Select cryptocurrency** from dropdown (ETH, BTC, USDT, etc.)
   - Click "Continue"

3. **Backend Creates NOWPayments Payment**
   - Backend calls NOWPayments API
   - Creates payment with unique order ID
   - Receives payment address and crypto amount

4. **View Payment Details**
   - Dialog shows:
     - **Send Exactly:** [crypto amount] [coin] (e.g., 0.056 ETH)
     - **To Address:** [NOWPayments wallet address]
     - **Network:** [Selected coin network]
   - Copy buttons available for address and amount

5. **User Pays from MetaMask/Wallet**
   - User opens MetaMask or crypto wallet
   - Sends exact crypto amount to the provided address
   - Real crypto goes to NOWPayments wallet

6. **NOWPayments Processes Payment**
   - NOWPayments watches blockchain
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
- ✅ Payment address generated
- ✅ Crypto amount calculated correctly
- ✅ User can copy address and amount
- ✅ Payment sent to NOWPayments
- ✅ Webhook receives confirmation
- ✅ Wallet credited automatically
- ✅ Balance increases
- ✅ Notification received

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
- Wait for blockchain confirmations
- Webhook will credit wallet when payment is confirmed
- Check payment status in transaction history
- If stuck, verify webhook URL is configured in NOWPayments dashboard

### Issue 5: OTP Verification Failed
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

## Payment Testing Focus

### Critical Payment Tests

1. **Crypto Payment with OTP:**
   - Most complex flow
   - Requires OTP verification
   - Tests full payment security

2. **Wallet Balance Payment:**
   - Fastest flow
   - No OTP required
   - Tests balance validation

3. **Deposit → Investment Flow:**
   - Complete user journey
   - Deposit → Wait for approval → Invest
   - Tests end-to-end functionality

### How to Test Payment Properly

1. **Start with Small Amounts:**
   - Test with $100 minimum
   - Verify each step works
   - Check balance updates

2. **Test Both Payment Methods:**
   - Wallet balance payment (no OTP)
   - Crypto payment (with OTP)

3. **Test Error Cases:**
   - Insufficient balance
   - Invalid amount (below min/above max)
   - Invalid OTP
   - Missing required fields

4. **Verify Database:**
   - Check investment created in database
   - Check transaction created
   - Check balance updated
   - Check notification created

5. **Test Admin Approval:**
   - Deposit approval
   - Withdrawal approval
   - Verify balance changes

---

## Quick Test Script

```bash
# 1. Start Backend
cd backend && npm run dev

# 2. Start Frontend (new terminal)
npm run dev

# 3. Register Account
# Go to http://localhost:3000/auth/register
# Complete registration with OTP (check console)

# 4. Login
# Go to http://localhost:3000/auth/login
# Complete 2FA with OTP (check console)

# 5. Deposit Funds (NOWPayments)
# Go to /dashboard/wallet
# Click Deposit → Enter $100 → Select ETH → Continue
# Copy payment address and amount
# Send crypto from MetaMask to address
# Wait for webhook confirmation (wallet auto-credited)

# 7. Make Investment
# Go to /dashboard/invest
# Select plan → Enter $500 → Wallet Balance → Invest
# Verify investment created

# 8. Test Crypto Payment Investment
# Select plan → Enter $300 → Crypto Payment
# Send OTP → Verify OTP → Complete
```

---

## Notes

- **Development Mode:** OTP is logged to console, no email needed
- **Production Mode:** OTP sent via email, requires Gmail configuration
- **All Withdrawals:** Require manual admin approval
- **Crypto Payments:** Require OTP verification
- **Wallet Payments:** No OTP required, instant processing
- **Daily ROI:** Starts accruing immediately after investment creation

---

## Support

If you encounter issues:
1. Check backend console for errors
2. Check browser console for frontend errors
3. Verify MongoDB connection
4. Verify environment variables
5. Check network requests in browser DevTools

