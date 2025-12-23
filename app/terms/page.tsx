"use client"

import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2 font-[family-name:var(--font-orbitron)] text-foreground">
            Terms of Service
          </h1>
          <p className="text-foreground/70">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card className="p-8 bg-card border-primary/30 rounded-2xl">
          <div className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p className="text-foreground/80 leading-relaxed">
                By accessing and using 1C Traders ("the Platform", "we", "us", or "our"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Description of Service</h2>
              <p className="text-foreground/80 leading-relaxed">
                1C Traders is an investment platform that offers various investment plans including Oil Investment, Shares Trading, Crypto Trading, and AI Trading Bot services. We provide a platform for users to invest funds and potentially earn returns based on their chosen investment plan.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. User Accounts</h2>
              <div className="text-foreground/80 leading-relaxed space-y-2">
                <p>3.1. You must be at least 18 years old to use this service.</p>
                <p>3.2. You are responsible for maintaining the confidentiality of your account credentials.</p>
                <p>3.3. You agree to provide accurate, current, and complete information during registration.</p>
                <p>3.4. You are responsible for all activities that occur under your account.</p>
                <p>3.5. You must notify us immediately of any unauthorized use of your account.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Investment Terms</h2>
              <div className="text-foreground/80 leading-relaxed space-y-2">
                <p>4.1. All investments are subject to the terms and conditions of the specific investment plan you choose.</p>
                <p>4.2. Investment returns are not guaranteed and may vary based on market conditions.</p>
                <p>4.3. Minimum and maximum investment amounts apply to each plan as specified.</p>
                <p>4.4. Daily ROI (Return on Investment) calculations are based on the investment plan selected.</p>
                <p>4.5. We reserve the right to modify investment plans, terms, and conditions at any time with prior notice.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Payments and Transactions</h2>
              <div className="text-foreground/80 leading-relaxed space-y-2">
                <p>5.1. All payments must be made through approved payment methods.</p>
                <p>5.2. Cryptocurrency payments are processed through third-party payment processors.</p>
                <p>5.3. Transaction fees may apply as specified in the payment terms.</p>
                <p>5.4. Withdrawal requests are subject to review and approval.</p>
                <p>5.5. We reserve the right to hold or delay withdrawals for security or compliance reasons.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Referral Program</h2>
              <div className="text-foreground/80 leading-relaxed space-y-2">
                <p>6.1. Our referral program allows you to earn rewards for referring new users.</p>
                <p>6.2. Referral rewards are subject to the terms of the referral program.</p>
                <p>6.3. We reserve the right to modify or terminate the referral program at any time.</p>
                <p>6.4. Fraudulent referral activities are strictly prohibited and may result in account suspension.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">7. Prohibited Activities</h2>
              <div className="text-foreground/80 leading-relaxed space-y-2">
                <p>You agree not to:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Use the Platform for any illegal or unauthorized purpose</li>
                  <li>Violate any laws in your jurisdiction</li>
                  <li>Infringe upon the rights of others</li>
                  <li>Transmit any viruses, malware, or harmful code</li>
                  <li>Attempt to gain unauthorized access to the Platform</li>
                  <li>Engage in any fraudulent, abusive, or harmful activity</li>
                  <li>Create multiple accounts to circumvent restrictions</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">8. Risk Disclosure</h2>
              <p className="text-foreground/80 leading-relaxed">
                Investing involves substantial risk of loss. Past performance is not indicative of future results. You should carefully consider whether investing is suitable for you in light of your circumstances, knowledge, and financial resources. You may lose all or more than your initial investment.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">9. Limitation of Liability</h2>
              <p className="text-foreground/80 leading-relaxed">
                To the maximum extent permitted by law, 1C Traders shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of the Platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">10. Termination</h2>
              <div className="text-foreground/80 leading-relaxed space-y-2">
                <p>10.1. We reserve the right to terminate or suspend your account at any time for violation of these terms.</p>
                <p>10.2. You may terminate your account at any time by contacting support.</p>
                <p>10.3. Upon termination, your right to use the Platform will immediately cease.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">11. Changes to Terms</h2>
              <p className="text-foreground/80 leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the Platform. Your continued use of the Platform after such modifications constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">12. Contact Information</h2>
              <p className="text-foreground/80 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us through the Platform's support system or email.
              </p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  )
}

