"use client"

export function LogoLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/50 rounded-lg flex items-center justify-center shadow-lg shadow-primary/50">
            <span className="text-3xl font-bold font-[family-name:var(--font-orbitron)] text-primary-foreground">1C</span>
          </div>
          {/* Pulsing glow effect */}
          <div className="absolute inset-0 bg-primary/30 rounded-lg animate-ping"></div>
          <div className="absolute inset-0 bg-primary/20 rounded-lg animate-pulse"></div>
        </div>
        
        {/* Loading text */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-orbitron)] glow-cyan">1C Traders</h2>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

