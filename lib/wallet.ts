// Wallet connection utilities
export interface WalletInfo {
  address: string
  chainId?: number
  provider?: any
}

export class WalletService {
  private static instance: WalletService
  private wallet: WalletInfo | null = null

  private constructor() {}

  static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService()
    }
    return WalletService.instance
  }

  async connectWallet(): Promise<{ success: boolean; address?: string; error?: string }> {
    try {
      // Check if MetaMask is installed
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const ethereum = (window as any).ethereum

        // Request account access
        const accounts = await ethereum.request({ method: "eth_requestAccounts" })
        
        if (accounts && accounts.length > 0) {
          const address = accounts[0]
          const chainId = await ethereum.request({ method: "eth_chainId" })

          this.wallet = {
            address,
            chainId: parseInt(chainId, 16),
            provider: ethereum,
          }

          // Store in localStorage
          localStorage.setItem("walletAddress", address)
          localStorage.setItem("walletChainId", chainId)

          return { success: true, address }
        }

        return { success: false, error: "No accounts found" }
      } else {
        // MetaMask not installed - simulate wallet connection for demo
        const demoAddress = `0x${Array.from({ length: 40 }, () => 
          Math.floor(Math.random() * 16).toString(16)
        ).join('')}`
        
        this.wallet = {
          address: demoAddress,
          chainId: 1,
        }

        localStorage.setItem("walletAddress", demoAddress)
        localStorage.setItem("walletChainId", "1")

        return { success: true, address: demoAddress }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to connect wallet",
      }
    }
  }

  async disconnectWallet(): Promise<void> {
    this.wallet = null
    localStorage.removeItem("walletAddress")
    localStorage.removeItem("walletChainId")
  }

  getWallet(): WalletInfo | null {
    if (!this.wallet) {
      const address = localStorage.getItem("walletAddress")
      if (address) {
        this.wallet = {
          address,
          chainId: parseInt(localStorage.getItem("walletChainId") || "1", 10),
        }
      }
    }
    return this.wallet
  }

  isConnected(): boolean {
    return this.getWallet() !== null
  }
}

export const walletService = WalletService.getInstance()

