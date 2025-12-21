"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { TrendingUp, Users, Shield, Zap, CircleDollarSign, BarChart3, Cpu, Bitcoin } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

gsap.registerPlugin(ScrollTrigger)

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const investmentsRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)


  useEffect(() => {
    setMounted(true)
    // Simulate initial page load
    const timer = setTimeout(() => {
      setPageLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.from(".hero-title", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
      })

      gsap.from(".hero-subtitle", {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.3,
        ease: "power3.out",
      })

      gsap.from(".hero-cta", {
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        delay: 0.6,
        ease: "back.out(1.7)",
      })

      // Features animation - ensure cards are visible first
      gsap.set(".feature-card", { opacity: 1, y: 0 })
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out",
        immediateRender: false,
      })

      // Investment cards animation - ensure cards are visible first
      gsap.set(".investment-card", { opacity: 1, scale: 1 })
      gsap.from(".investment-card", {
        scrollTrigger: {
          trigger: investmentsRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        scale: 0.9,
        stagger: 0.15,
        duration: 0.8,
        ease: "back.out(1.7)",
        immediateRender: false,
      })

      // Stats animation
      gsap.from(".stat-item", {
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.6,
        ease: "power3.out",
      })

      // Floating animation for cards
      gsap.to(".float-card", {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.3,
      })
    })

    return () => ctx.revert()
  }, [mounted])

  const features = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Daily ROI",
      description: "Earn consistent returns on your investments with our proven strategies",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "12-Level Referral",
      description: "Build your network and earn from 12 levels of referrals",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Platform",
      description: "Bank-grade security to protect your investments and data",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Withdrawals",
      description: "Access your earnings anytime with fast withdrawal processing",
    },
  ]

  const investments = [
    {
      icon: <CircleDollarSign className="w-12 h-12" />,
      title: "Oil Investment",
      roi: "1.5-2.5% Daily",
      minInvest: "$100",
      color: "from-amber-500/20 to-orange-500/20",
      glowColor: "from-amber-500/30 to-orange-500/30",
    },
    {
      icon: <BarChart3 className="w-12 h-12" />,
      title: "Shares",
      roi: "1.5-2.5% Daily",
      minInvest: "$100",
      color: "from-blue-500/20 to-cyan-500/20",
      glowColor: "from-blue-500/30 to-cyan-500/30",
    },
    {
      icon: <Bitcoin className="w-12 h-12" />,
      title: "Crypto",
      roi: "1.5-2.5% Daily",
      minInvest: "$100",
      color: "from-purple-500/20 to-pink-500/20",
      glowColor: "from-purple-500/30 to-pink-500/30",
    },
    {
      icon: <Cpu className="w-12 h-12" />,
      title: "AI Trading",
      roi: "1.5-2.5% Daily",
      minInvest: "$100",
      color: "from-green-500/20 to-emerald-500/20",
      glowColor: "from-green-500/30 to-emerald-500/30",
    },
  ]

  const stats = [
    { label: "Active Users", value: "50,000+" },
    { label: "Total Invested", value: "$25M+" },
    { label: "Paid Out", value: "$12M+" },
    { label: "Countries", value: "120+" },
  ]

  if (pageLoading || !mounted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/50 rounded-lg flex items-center justify-center shadow-lg shadow-primary/50">
              <span className="text-3xl font-bold font-[family-name:var(--font-orbitron)] text-primary-foreground">1C</span>
            </div>
            <div className="absolute inset-0 bg-primary/30 rounded-lg animate-ping"></div>
            <div className="absolute inset-0 bg-primary/20 rounded-lg animate-pulse"></div>
          </div>
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

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-primary/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/50 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold font-[family-name:var(--font-orbitron)]">1C</span>
              </div>
              <span className="text-2xl font-bold font-[family-name:var(--font-orbitron)] glow-cyan">1C Traders</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-foreground/80 hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="#investments" className="text-foreground/80 hover:text-primary transition-colors">
                Investments
              </Link>
              <Link href="#about" className="text-foreground/80 hover:text-primary transition-colors">
                About
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 border-glow">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="hero-title text-5xl md:text-7xl font-bold mb-6 font-[family-name:var(--font-orbitron)] glow-cyan">
              Welcome to 1C Traders
            </h1>
            <p className="hero-subtitle text-xl md:text-2xl text-foreground/80 mb-8">
              Invest in Oil, Shares, Crypto & AI with guaranteed daily ROI. Build wealth through our revolutionary
              12-level referral system.
            </p>
            <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 border-glow"
                >
                  Start Investing Now
                </Button>
              </Link>
              <Link href="#investments">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 border-primary/50 hover:bg-primary/10 bg-transparent"
                >
                  View Investment Options
                </Button>
              </Link>
            </div>
          </div>

          {/* Animated background elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
            <div
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2 font-[family-name:var(--font-orbitron)]">
                  {stat.value}
                </div>
                <div className="text-foreground/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} id="features" className="py-20 px-4 sm:px-6 lg:px-8 relative bg-background w-full overflow-x-visible">
        <div className="container mx-auto relative z-10 max-w-7xl w-full px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 font-[family-name:var(--font-orbitron)] glow-cyan text-foreground">
            Why Choose 1C Traders?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            {features.map((feature, index) => (
              <div key={index} className="w-full" style={{ minWidth: 0 }}>
              <Card
                  className="feature-card float-card group relative p-8 bg-card border-primary/30 card-glow hover:border-primary/60 transition-all duration-500 rounded-2xl w-full"
                  style={{ minHeight: '280px', boxSizing: 'border-box', opacity: mounted ? 1 : 0 }}
                >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                
                {/* Glowing corner accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10 h-full flex flex-col">
                  {/* Icon with animated background */}
                  <div className="mb-6 relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-xl blur-xl group-hover:bg-primary/30 transition-all duration-500"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl flex items-center justify-center border border-primary/30 group-hover:scale-110 transition-transform duration-500">
                      <div className="text-primary group-hover:scale-110 transition-transform duration-500">
                        {feature.icon}
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3 font-[family-name:var(--font-orbitron)] text-foreground group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-foreground/70 leading-relaxed group-hover:text-foreground/90 transition-colors duration-300 flex-grow">
                    {feature.description}
                  </p>
                  
                  {/* Decorative line */}
                  <div className="mt-6 w-12 h-1 bg-gradient-to-r from-primary to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Options */}
      <section ref={investmentsRef} id="investments" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30 relative w-full overflow-x-visible">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5 z-0">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(0, 217, 255, 0.1) 1px, transparent 1px),
              linear-gradient(rgba(0, 217, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="container mx-auto relative z-10 max-w-7xl w-full px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 font-[family-name:var(--font-orbitron)] glow-cyan text-foreground">
            Investment Options
          </h2>
          <p className="text-center text-foreground/70 mb-16 max-w-2xl mx-auto">
            Choose from multiple investment opportunities with guaranteed daily returns
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            {investments.map((investment, index) => (
              <div key={index} className="w-full" style={{ minWidth: 0 }}>
              <Card
                  className="investment-card group relative p-8 bg-card border-primary/30 card-glow hover:border-primary/60 transition-all duration-500 rounded-2xl cursor-pointer w-full"
                  style={{ minHeight: '380px', boxSizing: 'border-box', opacity: mounted ? 1 : 0 }}
                >
                {/* Animated gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${investment.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}></div>
                
                {/* Glowing effect with investment-specific color */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${investment.glowColor || 'from-primary/20 via-primary/10 to-transparent'} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 rounded-2xl`}></div>
                
                {/* Subtle pulse effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${investment.color} opacity-10 rounded-2xl animate-pulse`} style={{ animationDuration: '3s' }}></div>
                
                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl"></div>
                
                <div className="relative z-10 h-full flex flex-col">
                  {/* Icon with animated glow */}
                  <div className="mb-6 relative">
                    <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-primary/40 to-primary/10 rounded-2xl flex items-center justify-center border-2 border-primary/30 group-hover:border-primary/60 group-hover:scale-110 transition-all duration-500 backdrop-blur-sm">
                      <div className="text-primary scale-110 group-hover:scale-125 transition-transform duration-500">
                        {investment.icon}
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 font-[family-name:var(--font-orbitron)] text-foreground group-hover:text-primary transition-colors duration-300">
                    {investment.title}
                  </h3>
                  
                  <div className="space-y-3 mb-6 flex-grow">
                    <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg border border-primary/10 group-hover:border-primary/30 group-hover:bg-background/70 transition-all duration-300">
                      <span className="text-foreground/70 text-sm">ROI:</span>
                      <span className="text-primary font-bold text-lg group-hover:scale-110 transition-transform duration-300 inline-block">
                        {investment.roi}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg border border-primary/10 group-hover:border-primary/30 group-hover:bg-background/70 transition-all duration-300">
                      <span className="text-foreground/70 text-sm">Min. Investment:</span>
                      <span className="font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {investment.minInvest}
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 border-glow py-6 text-base font-semibold rounded-xl group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-primary/20"
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        window.location.href = "/auth/login"
                      }
                    }}
                  >
                    Invest Now
                  </Button>
                  
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="p-12 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 card-glow text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-[family-name:var(--font-orbitron)] glow-cyan">
              Ready to Start Earning?
            </h2>
            <p className="text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
              Join thousands of investors already earning daily returns. Create your account now and start your
              investment journey.
            </p>
            <Link href="/auth/register">
              <Button
                size="lg"
                className="text-lg px-12 py-6 bg-primary text-primary-foreground hover:bg-primary/90 border-glow"
              >
                Create Your Account
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-primary/30">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/50 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold font-[family-name:var(--font-orbitron)]">1C</span>
                </div>
                <span className="text-2xl font-bold font-[family-name:var(--font-orbitron)] glow-cyan">1C Traders</span>
              </div>
              <p className="text-foreground/60">Secure investment platform with guaranteed daily returns.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 font-[family-name:var(--font-orbitron)]">Platform</h4>
              <ul className="space-y-2 text-foreground/60">
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Investments
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Referrals
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Tasks
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 font-[family-name:var(--font-orbitron)]">Support</h4>
              <ul className="space-y-2 text-foreground/60">
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 font-[family-name:var(--font-orbitron)]">Connect</h4>
              <ul className="space-y-2 text-foreground/60">
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Telegram
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Discord
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    LinkedIn
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center text-foreground/60 pt-8 border-t border-primary/30">
            <p>&copy; 2025 1C Traders. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
