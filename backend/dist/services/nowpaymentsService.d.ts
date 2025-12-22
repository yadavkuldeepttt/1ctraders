/**
 * Supported cryptocurrencies
 */
export declare const SUPPORTED_CRYPTOS: {
    code: string;
    name: string;
    icon: string;
}[];
/**
 * Create a payment invoice
 */
export declare function createPayment(amount: number, currency: string, // USD
paymentCurrency: string, // BTC, ETH, etc.
orderId: string, customerEmail?: string): Promise<{
    success: boolean;
    data?: any;
    error?: string;
}>;
/**c
 * Get payment status
 */
export declare function getPaymentStatus(paymentId: string): Promise<{
    success: boolean;
    data?: any;
    error?: string;
}>;
/**
 * Verify IPN signature
 */
export declare function verifyIPNSignature(rawBody: Buffer | string, signature: string): boolean;
/**
 * Get available currencies
 */
export declare function getAvailableCurrencies(): Promise<{
    success: boolean;
    data?: any;
    error?: string;
}>;
//# sourceMappingURL=nowpaymentsService.d.ts.map