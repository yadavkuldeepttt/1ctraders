"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/AuthContext"
import { apiClient } from "@/lib/api-client"
import { Wallet, ArrowDownRight, ArrowUpRight, Clock, CheckCircle2, XCircle, Copy, QrCode } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { QRCodeSVG } from "qrcode.react"

const SUPPORTED_COINS = [
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

export default function WalletPage() {
  const { user, refreshUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [depositAmount, setDepositAmount] = useState("")
  const [selectedCoin, setSelectedCoin] = useState("ETH")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [withdrawAddress, setWithdrawAddress] = useState("")
  const [depositLoading, setDepositLoading] = useState(false)
  const [withdrawLoading, setWithdrawLoading] = useState(false)
  const [transactions, setTransactions] = useState<any[]>([])
  const [depositDialogOpen, setDepositDialogOpen] = useState(false)
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false)
  const [depositError, setDepositError] = useState<string | null>(null)
  const [depositSuccess, setDepositSuccess] = useState<string | null>(null)
  const [paymentDetails, setPaymentDetails] = useState<{
    paymentId: string
    payAddress: string
    payAmount: string
    coin: string
    amountUSD: number
  } | null>(null)

  const wallet = {
    balance: user?.balance || 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    pendingWithdrawals: 0,
  }

  useEffect(() => {
    const loadWalletData = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const response = await apiClient.getUserTransactions()
        if (response.data) {
          setTransactions(response.data.transactions || [])
          
          // Calculate totals
          const deposits = response.data.transactions.filter((tx: any) => tx.type === "deposit" && tx.status === "completed")
          const withdrawals = response.data.transactions.filter((tx: any) => tx.type === "withdrawal")
          const pending = withdrawals.filter((tx: any) => tx.status === "pending")
          
          wallet.totalDeposits = deposits.reduce((sum: number, tx: any) => sum + tx.amount, 0)
          wallet.totalWithdrawals = withdrawals.filter((tx: any) => tx.status === "completed").reduce((sum: number, tx: any) => sum + tx.amount, 0)
          wallet.pendingWithdrawals = pending.reduce((sum: number, tx: any) => sum + tx.amount, 0)
        }
      } catch (error) {
        console.error("Failed to load wallet data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadWalletData()
  }, [user])

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      setDepositError("Please enter a valid amount")
      return
    }

    if (!selectedCoin) {
      setDepositError("Please select a cryptocurrency")
      return
    }

    setDepositLoading(true)
    setDepositError(null)
    setDepositSuccess(null)
    setPaymentDetails(null)

    try {
      const response = await apiClient.createDeposit({
        amountUSD: parseFloat(depositAmount),
        coin: selectedCoin,
      })

      if (response.error) {
        setDepositError(response.error)
      } else if (response.data) {
        // Show payment details
        setPaymentDetails(response.data.payment)
        setDepositSuccess("Payment address generated! Please send the exact amount to the address below.")
        // Reload transactions
        const txResponse = await apiClient.getUserTransactions()
        if (txResponse.data) {
          setTransactions(txResponse.data.transactions || [])
        }
        // Refresh user to update balance when payment completes
        await refreshUser()
      }
    } catch (error) {
      setDepositError("Failed to create deposit")
    } finally {
      setDepositLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0 || !withdrawAddress) {
      return
    }

    setWithdrawLoading(true)
    try {
      const response = await apiClient.createWithdrawal({
        amount: parseFloat(withdrawAmount),
        withdrawalAddress: withdrawAddress,
      })

      if (response.error) {
        alert(response.error)
      } else {
        alert(`Withdrawal request of $${withdrawAmount} submitted successfully! Your request is pending manual approval by admin.`)
        setWithdrawAmount("")
        setWithdrawAddress("")
        setWithdrawDialogOpen(false)
        // Reload transactions
        const txResponse = await apiClient.getUserTransactions()
        if (txResponse.data) {
          setTransactions(txResponse.data.transactions || [])
        }
      }
    } catch (error) {
      alert("Failed to create withdrawal")
    } finally {
      setWithdrawLoading(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/50 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold font-[family-name:var(--font-orbitron)] text-primary-foreground">1C</span>
                </div>
                <div className="absolute inset-0 bg-primary/30 rounded-lg animate-ping"></div>
              </div>
              <p className="text-foreground/70 animate-pulse">Loading wallet...</p>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 font-[family-name:var(--font-orbitron)] glow-cyan">
            Wallet
          </h1>
          <p className="text-foreground/70">Manage your deposits and withdrawals</p>
        </div>

        {/* Wallet Balance Card */}
        <Card className="p-8 bg-gradient-to-br from-primary/20 to-primary/10 border-primary/50 card-glow">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 rounded-full mb-4">
              <Wallet className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-lg text-foreground/70 mb-2">Available Balance</h2>
            <div className="text-5xl font-bold mb-6 font-[family-name:var(--font-orbitron)] glow-cyan">
              ${wallet.balance.toLocaleString()}
            </div>
            <div className="flex gap-4 justify-center">
              <Dialog
                open={depositDialogOpen}
                  onOpenChange={(open) => {
                    setDepositDialogOpen(open)
                    if (!open) {
                      // Reset all states when dialog closes
                      setDepositAmount("")
                      setSelectedCoin("ETH")
                      setPaymentDetails(null)
                      setDepositError(null)
                      setDepositSuccess(null)
                    }
                  }}
              >
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
                    <ArrowDownRight className="w-5 h-5 mr-2" />
                    Deposit
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-primary/30 max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="font-[family-name:var(--font-orbitron)] text-2xl">
                      Deposit Funds
                    </DialogTitle>
                    <DialogDescription>Add funds to your wallet using cryptocurrency</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    {depositError && (
                      <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive">
                        {depositError}
                      </div>
                    )}

                    {depositSuccess && (
                      <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-500">
                        {depositSuccess}
                      </div>
                    )}

                    {!paymentDetails ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="depositAmount">Amount (USD)</Label>
                          <Input
                            id="depositAmount"
                            type="number"
                            placeholder="Enter amount in USD"
                            className="bg-input border-primary/30"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            min="10"
                            step="0.01"
                          />
                          <p className="text-xs text-foreground/60">Minimum deposit: $10</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="coin">Select Cryptocurrency</Label>
                          <Select value={selectedCoin} onValueChange={setSelectedCoin}>
                            <SelectTrigger className="bg-input border-primary/30">
                              <SelectValue placeholder="Select a coin" />
                            </SelectTrigger>
                            <SelectContent>
                              {SUPPORTED_COINS.map((coin) => (
                                <SelectItem key={coin.code} value={coin.code}>
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">{coin.icon}</span>
                                    <span>{coin.name} ({coin.code})</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <Button
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                          onClick={handleDeposit}
                          disabled={depositLoading || !depositAmount || parseFloat(depositAmount) < 10 || !selectedCoin}
                        >
                          {depositLoading ? "Creating Payment..." : "Continue"}
                        </Button>
                      </>
                    ) : (
                      <div className="space-y-6">
                        <div className="p-6 bg-primary/10 border border-primary/30 rounded-lg">
                          <h3 className="text-lg font-bold mb-4 font-[family-name:var(--font-orbitron)]">
                            Send Payment
                          </h3>
                          <div className="space-y-4">
                            {/* QR Code Section */}
                            <div className="flex flex-col items-center gap-4 p-4 bg-background/50 rounded-lg border border-primary/20">
                              <div className="p-4 bg-white rounded-lg">
                                <QRCodeSVG
                                  value={
                                    paymentDetails.coin === "ETH" || paymentDetails.coin === "BNB"
                                      ? `ethereum:${paymentDetails.payAddress}?value=${paymentDetails.payAmount}`
                                      : paymentDetails.coin === "BTC"
                                      ? `bitcoin:${paymentDetails.payAddress}?amount=${paymentDetails.payAmount}`
                                      : paymentDetails.coin === "USDT" || paymentDetails.coin === "USDC"
                                      ? `ethereum:${paymentDetails.payAddress}?value=${paymentDetails.payAmount}`
                                      : paymentDetails.payAddress
                                  }
                                  size={200}
                                  level="H"
                                  includeMargin={true}
                                />
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-foreground/70 mb-1">Scan QR Code</p>
                                <p className="text-xs text-foreground/60">Use your crypto wallet to scan and send payment</p>
                                <p className="text-xs text-primary mt-1 font-semibold">
                                  Address & amount will auto-fill in MetaMask
                                </p>
                              </div>
                            </div>

                            <div>
                              <Label className="text-sm text-foreground/70">Send Exactly</Label>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-2xl font-bold text-primary">
                                  {paymentDetails.payAmount} {paymentDetails.coin}
                                </p>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => copyToClipboard(paymentDetails.payAmount)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                              <p className="text-sm text-foreground/60 mt-1">
                                ≈ ${paymentDetails.amountUSD} USD
                              </p>
                            </div>

                            <div>
                              <Label className="text-sm text-foreground/70">To Address</Label>
                              <div className="flex items-center gap-2 mt-1 p-3 bg-background/50 rounded-lg border border-primary/20">
                                <code className="text-sm flex-1 break-all font-mono">
                                  {paymentDetails.payAddress}
                                </code>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => copyToClipboard(paymentDetails.payAddress)}
                                  className="h-8 w-8 p-0 flex-shrink-0"
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            <div>
                              <Label className="text-sm text-foreground/70">Network</Label>
                              <p className="text-lg font-semibold mt-1">
                                {paymentDetails.coin === "BTC" 
                                  ? "Bitcoin" 
                                  : paymentDetails.coin === "ETH" 
                                  ? "Ethereum" 
                                  : paymentDetails.coin === "BNB"
                                  ? "Binance Smart Chain (BSC)"
                                  : paymentDetails.coin === "USDT" 
                                  ? "Ethereum (ERC20) - Check NOWPayments for actual network" 
                                  : paymentDetails.coin === "USDC" 
                                  ? "Ethereum (ERC20) - Check NOWPayments for actual network"
                                  : paymentDetails.coin === "LTC"
                                  ? "Litecoin"
                                  : paymentDetails.coin === "XRP"
                                  ? "Ripple"
                                  : paymentDetails.coin === "DOGE"
                                  ? "Dogecoin"
                                  : paymentDetails.coin === "ADA"
                                  ? "Cardano"
                                  : paymentDetails.coin}
                              </p>
                              <p className="text-xs text-foreground/60 mt-1">
                                {paymentDetails.coin === "USDT" || paymentDetails.coin === "USDC"
                                  ? "⚠️ USDT/USDC may use ERC20, TRC20, or BSC. NOWPayments will determine the network."
                                  : "Make sure you're using the correct network when sending."}
                              </p>
                            </div>

                            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                              <p className="text-sm text-amber-500 font-semibold mb-2">⚠️ Important</p>
                              <ul className="text-xs text-foreground/70 space-y-1 list-disc list-inside">
                                <li>Send the exact amount shown above</li>
                                <li>Use the correct network ({paymentDetails.coin})</li>
                                <li>Do not send from an exchange directly</li>
                                <li>Your wallet will be credited automatically after payment confirmation</li>
                              </ul>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                  setPaymentDetails(null)
                                  setDepositAmount("")
                                  setDepositError(null)
                                  setDepositSuccess(null)
                                }}
                              >
                                New Deposit
                              </Button>
                              <Button
                                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                                onClick={() => {
                                  setDepositDialogOpen(false)
                                  setPaymentDetails(null)
                                  setDepositAmount("")
                                  setDepositError(null)
                                  setDepositSuccess(null)
                                }}
                              >
                                Done
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                          <p className="text-sm text-blue-500">
                            💡 <strong>Payment Status:</strong> Waiting for payment. Your wallet will be credited automatically once the payment is confirmed on the blockchain.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" variant="outline" className="border-primary/50 px-8 bg-transparent">
                    <ArrowUpRight className="w-5 h-5 mr-2" />
                    Withdraw
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-primary/30">
                  <DialogHeader>
                    <DialogTitle className="font-[family-name:var(--font-orbitron)] text-2xl">
                      Withdraw Funds
                    </DialogTitle>
                    <DialogDescription>Withdraw your earnings instantly</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="withdrawAmount">Amount ($)</Label>
                      <Input
                        id="withdrawAmount"
                        type="number"
                        placeholder="Enter amount"
                        className="bg-input border-primary/30"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        max={wallet.balance}
                      />
                      <p className="text-sm text-foreground/60">Available: ${wallet.balance.toLocaleString()}</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="withdrawAddress">Crypto Wallet Address</Label>
                      <Input
                        id="withdrawAddress"
                        placeholder="Enter your crypto wallet address (BTC, ETH, USDT)"
                        className="bg-input border-primary/30"
                        value={withdrawAddress}
                        onChange={(e) => setWithdrawAddress(e.target.value)}
                      />
                      <p className="text-xs text-foreground/60">
                        All withdrawals are processed via cryptocurrency. Enter your wallet address above.
                      </p>
                    </div>
                    <Button
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={handleWithdraw}
                      disabled={withdrawLoading || !withdrawAmount || !withdrawAddress || parseFloat(withdrawAmount) <= 0}
                    >
                      {withdrawLoading ? "Processing..." : "Confirm Withdrawal"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-primary/30">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground mb-1">${wallet.totalDeposits.toLocaleString()}</div>
              <div className="text-sm text-foreground/60">Total Deposits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground mb-1">${wallet.totalWithdrawals.toLocaleString()}</div>
              <div className="text-sm text-foreground/60">Total Withdrawals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground mb-1">${wallet.pendingWithdrawals}</div>
              <div className="text-sm text-foreground/60">Pending</div>
            </div>
          </div>
        </Card>

        {/* Transaction History */}
        <Card className="p-6 bg-card border-primary/30 card-glow">
          <h2 className="text-2xl font-bold mb-6 font-[family-name:var(--font-orbitron)]">Transaction History</h2>
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-primary/20"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-lg ${
                      transaction.type === "deposit"
                        ? "bg-green-500/20"
                        : transaction.type === "withdrawal"
                          ? "bg-red-500/20"
                          : transaction.type === "roi"
                            ? "bg-blue-500/20"
                            : "bg-purple-500/20"
                    }`}
                  >
                    {transaction.type === "deposit" && <ArrowDownRight className="w-5 h-5 text-green-500" />}
                    {transaction.type === "withdrawal" && <ArrowUpRight className="w-5 h-5 text-red-500" />}
                    {transaction.type === "roi" && <Wallet className="w-5 h-5 text-blue-500" />}
                    {transaction.type === "referral" && <Wallet className="w-5 h-5 text-purple-500" />}
                  </div>
                  <div>
                    <div className="font-bold capitalize">{transaction.type}</div>
                    <div className="text-sm text-foreground/60">
                      {transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : "N/A"}
                    </div>
                    {transaction.txHash && (
                      <div className="text-xs text-foreground/50 font-mono break-all">{transaction.txHash}</div>
                    )}
                    {transaction.withdrawalAddress && (
                      <div className="text-xs text-foreground/50 font-mono break-all">
                        To: {transaction.withdrawalAddress}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-lg font-bold ${
                      transaction.type === "withdrawal" ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    {transaction.type === "withdrawal" ? "-" : "+"}${transaction.amount}
                  </div>
                  <div className="flex items-center justify-end gap-1 text-sm mt-1">
                    {transaction.status === "completed" && (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-green-500">Completed</span>
                      </>
                    )}
                    {transaction.status === "pending" && (
                      <>
                        <Clock className="w-4 h-4 text-amber-500" />
                        <span className="text-amber-500">Pending</span>
                      </>
                    )}
                    {transaction.status === "failed" && (
                      <>
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="text-red-500">Failed</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
