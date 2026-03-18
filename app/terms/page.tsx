import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service — SlateInvoice',
  description: 'Terms and conditions for using SlateInvoice.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <nav className="border-b border-gray-800 bg-gray-900/60 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🧾</span>
            <span className="text-xl font-bold text-white">SlateInvoice</span>
          </Link>
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">← Back to Home</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-16">
        <p className="text-sm text-gray-500 mb-2">Last updated: March 2025</p>
        <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
        <p className="text-gray-400 mb-12 text-lg">
          Please read these terms carefully before using SlateInvoice. By creating an account or using our service, you agree to be bound by these terms.
        </p>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-400">
            By accessing or using SlateInvoice ("the Service") at slateinvoice.com, you agree to these Terms of Service and our Privacy Policy. If you do not agree, please do not use the Service. These terms apply to all users, including free and paid plan subscribers.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
          <p className="text-gray-400 mb-3">
            SlateInvoice is a web-based invoicing platform for freelancers and small businesses. It allows users to:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-1 ml-2">
            <li>Create, send, and manage professional invoices and estimates</li>
            <li>Store client and product information</li>
            <li>Track payment status and generate reports</li>
            <li>Export invoices as PDF documents</li>
          </ul>
          <p className="text-gray-500 text-sm mt-4">
            We reserve the right to modify, suspend, or discontinue any part of the Service at any time with reasonable notice where possible.
          </p>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">3. Account Creation & Responsibilities</h2>
          <p className="text-gray-400 mb-3">To use SlateInvoice, you must create an account with a valid email address and password. You agree to:</p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 ml-2">
            <li>Provide accurate and up-to-date registration information</li>
            <li>Keep your password confidential and not share account access</li>
            <li>Be responsible for all activity that occurs under your account</li>
            <li>Notify us immediately if you suspect unauthorized access to your account</li>
          </ul>
          <p className="text-gray-400 mt-4">
            You must be at least 18 years old (or the age of majority in your jurisdiction) to create an account.
          </p>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">4. Free Plan</h2>
          <p className="text-gray-400 mb-3">The Free plan is available at no cost and includes:</p>
          <ul className="list-disc list-inside text-gray-400 space-y-1 ml-2">
            <li>Up to 5 invoices per month</li>
            <li>Up to 3 saved clients</li>
            <li>Basic invoice template</li>
          </ul>
          <p className="text-gray-400 mt-4">
            The Free plan is provided as-is with no service level guarantees. We reserve the right to modify free plan features or limits at any time.
          </p>
        </section>

        {/* Section 5 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">5. Paid Subscriptions</h2>

          <h3 className="text-lg font-semibold text-white mb-2">Billing</h3>
          <p className="text-gray-400 mb-4">
            Paid plans (Starter at $7/mo, Freelancer at $15/mo, Business at $25/mo) are billed monthly or annually via Stripe. By subscribing, you authorize us to charge your payment method on a recurring basis. All prices are in USD.
          </p>

          <h3 className="text-lg font-semibold text-white mb-2">Free Trial</h3>
          <p className="text-gray-400 mb-4">
            Paid plans include a 7-day free trial. You will not be charged until the trial period ends. You may cancel during the trial without being billed.
          </p>

          <h3 className="text-lg font-semibold text-white mb-2">Cancellation</h3>
          <p className="text-gray-400 mb-4">
            You may cancel your subscription at any time from your account settings. Cancellation takes effect at the end of your current billing period. You retain access to paid features until the end of the period you've paid for.
          </p>

          <h3 className="text-lg font-semibold text-white mb-2">Refunds</h3>
          <p className="text-gray-400">
            Monthly subscriptions are generally non-refundable for the current billing period. Annual subscriptions may be eligible for a prorated refund within 14 days of purchase. See our <Link href="/refund" className="text-blue-400 hover:underline">Refund Policy</Link> for full details.
          </p>
        </section>

        {/* Section 6 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">6. Prohibited Uses</h2>
          <p className="text-gray-400 mb-3">You agree not to use SlateInvoice to:</p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 ml-2">
            <li>Violate any applicable laws or regulations</li>
            <li>Create or send fraudulent invoices or misrepresent your identity</li>
            <li>Harass, defraud, or harm other users or third parties</li>
            <li>Reverse-engineer, scrape, or attempt to access systems without authorization</li>
            <li>Upload malicious code, viruses, or any harmful content</li>
            <li>Use the Service in a way that could damage, disable, or impair our infrastructure</li>
            <li>Resell or sublicense access to the Service without our written permission</li>
          </ul>
          <p className="text-gray-500 text-sm mt-4">
            Violation of these terms may result in immediate account suspension or termination without refund.
          </p>
        </section>

        {/* Section 7 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">7. Intellectual Property</h2>
          <p className="text-gray-400 mb-3">
            SlateInvoice and all related content, features, and functionality (including but not limited to the software, design, text, and logos) are owned by SlateInvoice and protected by copyright and other intellectual property laws.
          </p>
          <p className="text-gray-400">
            Your data — including invoices, client records, and business information you create — remains yours. You grant us a limited license to store and process it solely to provide the Service. We do not claim ownership of your content.
          </p>
        </section>

        {/* Section 8 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">8. Disclaimer of Warranties</h2>
          <p className="text-gray-400">
            SlateInvoice is provided <strong className="text-white">"as is"</strong> and <strong className="text-white">"as available"</strong> without warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, error-free, or free of viruses or other harmful components. Your use of the Service is at your sole risk.
          </p>
        </section>

        {/* Section 9 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">9. Limitation of Liability</h2>
          <p className="text-gray-400">
            To the fullest extent permitted by law, SlateInvoice shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Service — including but not limited to lost profits, lost data, or business interruption. Our total liability to you for any claims arising from the use of the Service shall not exceed the amount you paid us in the 12 months preceding the claim.
          </p>
        </section>

        {/* Section 10 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">10. Termination</h2>
          <p className="text-gray-400">
            We reserve the right to suspend or terminate your account at any time for violation of these Terms or for any other reason at our discretion. You may also delete your account at any time from your settings. Upon termination, your right to use the Service ceases immediately.
          </p>
        </section>

        {/* Section 11 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">11. Governing Law</h2>
          <p className="text-gray-400">
            These Terms are governed by and construed in accordance with the laws of the State of <strong className="text-white">New Jersey, USA</strong>, without regard to conflict of law principles. Any disputes arising from these Terms or your use of the Service shall be subject to the exclusive jurisdiction of the courts located in New Jersey.
          </p>
        </section>

        {/* Section 12 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">12. Changes to Terms</h2>
          <p className="text-gray-400">
            We may revise these Terms from time to time. When we do, we'll update the "Last updated" date at the top of this page. For significant changes, we may also notify you by email. Continued use of SlateInvoice after changes have been posted constitutes your acceptance of the revised Terms.
          </p>
        </section>

        {/* Section 13 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">13. Contact</h2>
          <p className="text-gray-400 mb-2">Questions about these Terms? Get in touch:</p>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-300 font-semibold">SlateInvoice</p>
            <p className="text-gray-400 text-sm mt-1">New Jersey, USA</p>
            <p className="text-gray-400 text-sm">Email: <a href="mailto:support@slateinvoice.com" className="text-blue-400 hover:underline">support@slateinvoice.com</a></p>
            <p className="text-gray-400 text-sm">Website: <a href="https://slateinvoice.com" className="text-blue-400 hover:underline">slateinvoice.com</a></p>
          </div>
        </section>
      </div>

      <footer className="border-t border-gray-800 py-8 text-center text-sm text-gray-600">
        <p>SlateInvoice · <Link href="/" className="hover:text-gray-400">Home</Link> · <Link href="/privacy" className="hover:text-gray-400">Privacy</Link> · <Link href="/cookies" className="hover:text-gray-400">Cookies</Link> · <Link href="/refund" className="hover:text-gray-400">Refund Policy</Link></p>
      </footer>
    </main>
  );
}
