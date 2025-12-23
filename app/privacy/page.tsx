"use client"

import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-foreground/70">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card className="p-8 bg-card border-primary/30 rounded-2xl">
          <div className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
              <p className="text-foreground/80 leading-relaxed">
                1C Traders ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Platform. Please read this policy carefully to understand our practices regarding your personal data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Information We Collect</h2>
              <div className="text-foreground/80 leading-relaxed space-y-3">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">2.1. Personal Information</h3>
                  <p>We may collect the following personal information:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                    <li>Name and username</li>
                    <li>Email address</li>
                    <li>Phone number (optional)</li>
                    <li>Password (encrypted)</li>
                    <li>Payment information</li>
                    <li>Cryptocurrency wallet addresses</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">2.2. Transaction Information</h3>
                  <p>We collect information about your transactions, including:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                    <li>Investment history</li>
                    <li>Deposit and withdrawal records</li>
                    <li>Payment method details</li>
                    <li>Transaction amounts and dates</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">2.3. Technical Information</h3>
                  <p>We automatically collect certain technical information:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                    <li>IP address</li>
                    <li>Browser type and version</li>
                    <li>Device information</li>
                    <li>Usage data and analytics</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. How We Use Your Information</h2>
              <div className="text-foreground/80 leading-relaxed space-y-2">
                <p>We use the collected information for the following purposes:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>To provide, maintain, and improve our services</li>
                  <li>To process transactions and manage your account</li>
                  <li>To send you important notifications and updates</li>
                  <li>To verify your identity and prevent fraud</li>
                  <li>To comply with legal obligations</li>
                  <li>To analyze usage patterns and improve user experience</li>
                  <li>To send marketing communications (with your consent)</li>
                  <li>To provide customer support</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Information Sharing and Disclosure</h2>
              <div className="text-foreground/80 leading-relaxed space-y-3">
                <p>We do not sell your personal information. We may share your information in the following circumstances:</p>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">4.1. Service Providers</h3>
                  <p>We may share information with third-party service providers who perform services on our behalf, such as payment processing, email delivery, and analytics.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">4.2. Legal Requirements</h3>
                  <p>We may disclose information if required by law, court order, or government regulation, or to protect our rights and the safety of our users.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">4.3. Business Transfers</h3>
                  <p>In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new entity.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">4.4. With Your Consent</h3>
                  <p>We may share information with third parties when you explicitly consent to such sharing.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Data Security</h2>
              <p className="text-foreground/80 leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Data Retention</h2>
              <p className="text-foreground/80 leading-relaxed">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">7. Your Rights</h2>
              <div className="text-foreground/80 leading-relaxed space-y-2">
                <p>Depending on your location, you may have the following rights regarding your personal information:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>Access:</strong> Request access to your personal information</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Request transfer of your data</li>
                  <li><strong>Objection:</strong> Object to processing of your information</li>
                  <li><strong>Withdrawal:</strong> Withdraw consent where processing is based on consent</li>
                </ul>
                <p className="mt-3">To exercise these rights, please contact us through the Platform's support system.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">8. Cookies and Tracking Technologies</h2>
              <p className="text-foreground/80 leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our Platform and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">9. Third-Party Links</h2>
              <p className="text-foreground/80 leading-relaxed">
                Our Platform may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to read the privacy policies of any third-party sites you visit.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">10. Children's Privacy</h2>
              <p className="text-foreground/80 leading-relaxed">
                Our Platform is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">11. International Data Transfers</h2>
              <p className="text-foreground/80 leading-relaxed">
                Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from those in your country. By using our Platform, you consent to the transfer of your information to these countries.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">12. Changes to This Privacy Policy</h2>
              <p className="text-foreground/80 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">13. Contact Us</h2>
              <p className="text-foreground/80 leading-relaxed">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us through the Platform's support system or email.
              </p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  )
}

