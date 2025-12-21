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
import { Wallet, ArrowDownRight, ArrowUpRight, Clock, CheckCircle2, XCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function WalletPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [depositAmount, setDepositAmount] = useState("")
  const [depositPaymentMethod, setDepositPaymentMethod] = useState<"crypto" | "bank">("crypto")
  const [cryptoAddress, setCryptoAddress] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [withdrawAddress, setWithdrawAddress] = useState("")
  const [depositLoading, setDepositLoading] = useState(false)
  const [withdrawLoading, setWithdrawLoading] = useState(false)
  const [transactions, setTransactions] = useState<any[]>([])
  const [depositDialogOpen, setDepositDialogOpen] = useState(false)
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false)

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
      return
    }

    if (depositPaymentMethod === "crypto" && !cryptoAddress) {
      alert("Please enter your crypto wallet address")
      return
    }

    setDepositLoading(true)
    try {
      const response = await apiClient.createDeposit({
        amount: parseFloat(depositAmount),
        paymentMethod: depositPaymentMethod,
        cryptoAddress: depositPaymentMethod === "crypto" ? cryptoAddress : undefined,
      })

      if (response.error) {
        alert(response.error)
      } else {
        alert(`Deposit of $${depositAmount} initiated!`)
        setDepositAmount("")
        setCryptoAddress("")
        setDepositDialogOpen(false)
        // Reload transactions
        const txResponse = await apiClient.getUserTransactions()
        if (txResponse.data) {
          setTransactions(txResponse.data.transactions || [])
        }
      }
    } catch (error) {
      alert("Failed to create deposit")
    } finally {
      setDepositLoading(false)
    }
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
        alert(`Withdrawal of $${withdrawAmount} initiated!`)
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
              <Dialog open={depositDialogOpen} onOpenChange={setDepositDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
                    <ArrowDownRight className="w-5 h-5 mr-2" />
                    Deposit
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-primary/30">
                  <DialogHeader>
                    <DialogTitle className="font-[family-name:var(--font-orbitron)] text-2xl">
                      Deposit Funds
                    </DialogTitle>
                    <DialogDescription>Add funds to your wallet to start investing</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="depositAmount">Amount ($)</Label>
                      <Input
                        id="depositAmount"
                        type="number"
                        placeholder="Enter amount"
                        className="bg-input border-primary/30"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Payment Method</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          type="button"
                          variant={depositPaymentMethod === "bank" ? "default" : "outline"}
                          className={
                            depositPaymentMethod === "bank"
                              ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                              : "border-primary/50 bg-transparent hover:bg-primary/10"
                          }
                          onClick={() => {
                            setDepositPaymentMethod("bank")
                            setCryptoAddress("")
                          }}
                        >
                          Bank Transfer
                        </Button>
                        <Button
                          type="button"
                          variant={depositPaymentMethod === "crypto" ? "default" : "outline"}
                          className={
                            depositPaymentMethod === "crypto"
                              ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                              : "border-primary/50 bg-transparent hover:bg-primary/10"
                          }
                          onClick={() => setDepositPaymentMethod("crypto")}
                        >
                          Crypto
                        </Button>
                      </div>
                    </div>
                    {depositPaymentMethod === "crypto" && (
                      <div className="space-y-2">
                        <Label htmlFor="cryptoAddress">Crypto Wallet Address</Label>
                        <Input
                          id="cryptoAddress"
                          placeholder="Enter your crypto wallet address (BTC, ETH, USDT)"
                          className="bg-input border-primary/30"
                          value={cryptoAddress}
                          onChange={(e) => setCryptoAddress(e.target.value)}
                        />
                        <p className="text-xs text-foreground/60">
                          Supported: Bitcoin (BTC), Ethereum (ETH), Tether (USDT), and other major cryptocurrencies
                        </p>
                      </div>
                    )}
                    {depositPaymentMethod === "bank" && (
                      <div className="space-y-2">
                        <p className="text-sm text-foreground/70">
                          Bank transfer details will be provided after you confirm the deposit.
                        </p>
                      </div>
                    )}
                    <Button
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={handleDeposit}
                      disabled={depositLoading || !depositAmount || parseFloat(depositAmount) <= 0 || (depositPaymentMethod === "crypto" && !cryptoAddress)}
                    >
                      {depositLoading ? "Processing..." : "Confirm Deposit"}
                    </Button>
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
