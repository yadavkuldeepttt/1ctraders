"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUPPORTED_CRYPTOS = void 0;
exports.createPayment = createPayment;
exports.getPaymentStatus = getPaymentStatus;
exports.verifyIPNSignature = verifyIPNSignature;
exports.getAvailableCurrencies = getAvailableCurrencies;
const axios_1 = __importDefault(require("axios"));
const crypto = __importStar(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Use sandbox/testnet for testing, mainnet for production
const USE_TESTNET = process.env.NOWPAYMENTS_USE_TESTNET === "true" || process.env.NODE_ENV === "development";
const NOWPAYMENTS_API_URL = USE_TESTNET
    ? "https://api-sandbox.nowpayments.io/v1" // Sandbox/testnet URL
    : "https://api.nowpayments.io/v1"; // Production/mainnet URL
const API_KEY = process.env.NOWPAYMENTS_API_KEY || "";
const IPN_SECRET_KEY = process.env.NOWPAYMENTS_IPN_SECRET_KEY || "";
/**
 * Supported cryptocurrencies
 */
exports.SUPPORTED_CRYPTOS = [
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
];
/**
 * Create a payment invoice
 */
async function createPayment(amount, currency, // USD
paymentCurrency, // BTC, ETH, etc.
orderId, customerEmail) {
    try {
        const paymentData = {
            price_amount: amount,
            price_currency: currency,
            pay_currency: paymentCurrency,
            order_id: orderId,
            order_description: `1C Traders Wallet Deposit - Order ${orderId}`,
            ipn_callback_url: `${process.env.BACKEND_URL || "http://localhost:5000"}/api/payments/nowpayments/ipn`,
            success_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard/wallet?status=success`,
            cancel_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard/wallet?status=cancelled`,
        };
        // Add customer email if provided
        if (customerEmail) {
            paymentData.customer_email = customerEmail;
        }
        // Log environment info (helpful for debugging)
        if (USE_TESTNET) {
            console.log("🧪 NOWPayments TESTNET/SANDBOX mode enabled");
            console.log("📝 API URL:", NOWPAYMENTS_API_URL);
        }
        else {
            console.log("💰 NOWPayments MAINNET mode");
            console.log("📝 API URL:", NOWPAYMENTS_API_URL);
        }
        const response = await axios_1.default.post(`${NOWPAYMENTS_API_URL}/payment`, paymentData, {
            headers: {
                "x-api-key": API_KEY || "E612Y7V-B354HZS-GCF5T47-KHGDN18",
                "Content-Type": "application/json",
            },
        });
        return { success: true, data: response.data };
    }
    catch (error) {
        console.error("NowPayments create payment error:", error.response?.data || error.message);
        return { success: false, error: error.response?.data?.message || error.message || "Failed to create payment" };
    }
}
/**c
 * Get payment status
 */
async function getPaymentStatus(paymentId) {
    try {
        const response = await axios_1.default.get(`${NOWPAYMENTS_API_URL}/payment/${paymentId}`, {
            headers: {
                "x-api-key": API_KEY || "E612Y7V-B354HZS-GCF5T47-KHGDN18",
            },
        });
        return { success: true, data: response.data };
    }
    catch (error) {
        console.error("NowPayments get payment status error:", error.response?.data || error.message);
        return { success: false, error: error.response?.data?.message || error.message || "Failed to get payment status" };
    }
}
/**
 * Verify IPN signature
 */
function verifyIPNSignature(rawBody, signature) {
    try {
        if (!IPN_SECRET_KEY) {
            console.warn("IPN_SECRET_KEY not configured, skipping signature verification");
            return true; // Allow in development if not configured
        }
        const hmac = crypto.createHmac("sha512", IPN_SECRET_KEY);
        const bodyString = typeof rawBody === "string" ? rawBody : rawBody.toString();
        const calculatedSignature = hmac.update(bodyString).digest("hex");
        return calculatedSignature === signature;
    }
    catch (error) {
        console.error("IPN signature verification error:", error);
        return false;
    }
}
/**
 * Get available currencies
 */
async function getAvailableCurrencies() {
    try {
        const response = await axios_1.default.get(`${NOWPAYMENTS_API_URL}/currencies`, {
            headers: {
                "x-api-key": API_KEY || "E612Y7V-B354HZS-GCF5T47-KHGDN18",
            },
        });
        return { success: true, data: response.data };
    }
    catch (error) {
        console.error("NowPayments get currencies error:", error.response?.data || error.message);
        return { success: false, error: error.response?.data?.message || error.message || "Failed to get currencies" };
    }
}
//# sourceMappingURL=nowpaymentsService.js.map