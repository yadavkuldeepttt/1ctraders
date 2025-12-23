import axios from "axios"
import * as crypto from "crypto"
import dotenv from "dotenv";

dotenv.config();



// Use sandbox/testnet for testing, mainnet for production
const USE_TESTNET = process.env.NOWPAYMENTS_USE_TESTNET === "true" || process.env.NODE_ENV === "development"
const NOWPAYMENTS_API_URL = USE_TESTNET 
  ? "https://api-sandbox.nowpayments.io/v1" // Sandbox/testnet URL
  : "https://api.nowpayments.io/v1" // Production/mainnet URL
const API_KEY = process.env.NOWPAYMENTS_API_KEY || ""
const IPN_SECRET_KEY = process.env.NOWPAYMENTS_IPN_SECRET_KEY || ""

/**
 * Supported cryptocurrencies
 */
export const SUPPORTED_CRYPTOS = [
  { code: "BTC", name: "Bitcoin", icon: "₿" },
  { code: "ETH", name: "Ethereum", icon: "Ξ" },
  { code: "USDT", name: "Tether", icon: "₮" },
  { code: "USDC", name: "USD Coin", icon: "💵" },
  { code: "BNB", name: "Binance Coin", icon: "BNB" },
  { code: "LTC", name: "Litecoin", icon: "Ł" },
  { code: "XRP", name: "Ripple", icon: "XRP" },
  { code: "DOGE", name: "Dogecoin", icon: "Ð" },
  { code: "TRX", name: "Tron", icon: "TRX" },
  { code: "ADA", name: "Cardano", icon: "ADA" },
]

/**
 * Create a payment invoice
 */
export async function createPayment(
  amount: number,
  currency: string, // USD
  paymentCurrency: string, // BTC, ETH, etc.
  orderId: string,
  customerEmail?: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const paymentData: any = {
      price_amount: amount,
      price_currency: currency,
      pay_currency: paymentCurrency,
      order_id: orderId,
      order_description: `1C Traders Wallet Deposit - Order ${orderId}`,
      ipn_callback_url: `${process.env.BACKEND_URL || "http://localhost:5000"}/api/payments/nowpayments/ipn`,
      success_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard/wallet?status=success`,
      cancel_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard/wallet?status=cancelled`,
    }

    // Add customer email if provided
    if (customerEmail) {
      paymentData.customer_email = customerEmail
    }

    // Log environment info (helpful for debugging)
    if (USE_TESTNET) {
      console.log("🧪 NOWPayments TESTNET/SANDBOX mode enabled")
      console.log("📝 API URL:", NOWPAYMENTS_API_URL)
    } else {
      console.log("💰 NOWPayments MAINNET mode")
      console.log("📝 API URL:", NOWPAYMENTS_API_URL)
    }

    const response = await axios.post(
      `${NOWPAYMENTS_API_URL}/payment`,
      paymentData,
      {
        headers: {
          "x-api-key": API_KEY || "E612Y7V-B354HZS-GCF5T47-KHGDN18",
          "Content-Type": "application/json",
        },
      }
    )

    return { success: true, data: response.data }
  } catch (error: any) {
    console.error("NowPayments create payment error:", error.response?.data || error.message)
    return { success: false, error: error.response?.data?.message || error.message || "Failed to create payment" }
  }
}

/**c
 * Get payment status
 */
export async function getPaymentStatus(paymentId: string): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const response = await axios.get(`${NOWPAYMENTS_API_URL}/payment/${paymentId}`, {
      headers: {
        "x-api-key": API_KEY || "E612Y7V-B354HZS-GCF5T47-KHGDN18",
      },
    })

    return { success: true, data: response.data }
  } catch (error: any) {
    console.error("NowPayments get payment status error:", error.response?.data || error.message)
    return { success: false, error: error.response?.data?.message || error.message || "Failed to get payment status" }
  }
}

/**
 * Verify IPN signature
 */
export function verifyIPNSignature(rawBody: Buffer | string, signature: string): boolean {
  try {
    if (!IPN_SECRET_KEY) {
      console.warn("IPN_SECRET_KEY not configured, skipping signature verification")
      return true // Allow in development if not configured
    }
    const hmac = crypto.createHmac("sha512", IPN_SECRET_KEY)
    const bodyString = typeof rawBody === "string" ? rawBody : rawBody.toString()
    const calculatedSignature = hmac.update(bodyString).digest("hex")
    return calculatedSignature === signature
  } catch (error) {
    console.error("IPN signature verification error:", error)
    return false
  }
}

/**
 * Get available currencies
 */
export async function getAvailableCurrencies(): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const response = await axios.get(`${NOWPAYMENTS_API_URL}/currencies`, {
      headers: {
        "x-api-key": API_KEY || "E612Y7V-B354HZS-GCF5T47-KHGDN18",
      },
    })

    return { success: true, data: response.data }
  } catch (error: any) {
    console.error("NowPayments get currencies error:", error.response?.data || error.message)
    return { success: false, error: error.response?.data?.message || error.message || "Failed to get currencies" }
  }
}


