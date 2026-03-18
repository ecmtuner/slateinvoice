import Link from 'next/link';

export const metadata = {
  title: 'Refund Policy — SlateInvoice',
  description: 'SlateInvoice refund and cancellation policy for paid plans.',
};

export default function RefundPage() {
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
        <h1 className="text-4xl font-bold text-white mb-4">Refund Policy</h1>
        <p className="text-gray-400 mb-12 text-lg">
          We keep it simple and fair. Here's exactly how refunds work for SlateInvoice subscriptions.
        </p>

        {/* Plan summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-center">
            <div className="text-3xl mb-2">🆓</div>
            <h3 className="font-bold text-white mb-1">Free Plan</h3>
            <p className="text-gray-500 text-sm">No charges, no refunds needed</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-center">
            <div className="text-3xl mb-2">📅</div>
            <h3 className="font-bold text-white mb-1">Monthly Plans</h3>
            <p className="text-gray-500 text-sm">Cancel anytime — no refund for current period</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-center">
            <div className="text-3xl mb-2">📆</div>
            <h3 className="font-bold text-white mb-1">Annual Plans</h3>
            <p className="text-gray-500 text-sm">Prorated refund within 14 days</p>
          </div>
        </div>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">1. Free Plan</h2>
          <p className="text-gray-400">
            The Free plan is completely free — no credit card required, no charges. There is nothing to refund. You can use the Free plan indefinitely without any payment obligation.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">2. Monthly Subscriptions</h2>
          <p className="text-gray-400 mb-3">
            Monthly plans (Starter $7/mo, Freelancer $15/mo, Business $25/mo) are billed at the start of each billing cycle.
          </p>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-4">
            <ul className="text-gray-400 space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span><strong className="text-white">Cancel anytime:</strong> You can cancel your subscription at any time from your account settings. No cancellation fees.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 mt-0.5">⚡</span>
                <span><strong className="text-white">Access until period ends:</strong> After cancellation, you retain full access to your plan until the end of the current billing period.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-500 mt-0.5">✕</span>
                <span><strong className="text-white">No refund for current period:</strong> Monthly subscriptions are non-refundable for the billing period already paid.</span>
              </li>
            </ul>
          </div>
          <p className="text-gray-500 text-sm">
            Example: If your billing date is the 1st and you cancel on the 15th, you'll continue to have full access through the end of that month. You won't be charged again, and no refund is issued for that month.
          </p>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">3. Annual Subscriptions</h2>
          <p className="text-gray-400 mb-4">
            Annual plans are billed upfront for the full year at a discounted rate.
          </p>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-4">
            <ul className="text-gray-400 space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span><strong className="text-white">14-day refund window:</strong> If you cancel an annual plan within 14 days of the initial purchase or annual renewal, you are eligible for a prorated refund for the unused portion of the year.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 mt-0.5">⚡</span>
                <span><strong className="text-white">After 14 days:</strong> Annual subscriptions are non-refundable after the 14-day window has passed. You retain access for the remainder of the annual period.</span>
              </li>
            </ul>
          </div>
          <p className="text-gray-500 text-sm">
            Prorated refund = (months remaining / 12) × annual price paid, minus any applicable fees.
          </p>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">4. Free Trial Period</h2>
          <p className="text-gray-400">
            Paid plans include a 7-day free trial. You will not be charged during the trial period. If you cancel before the trial ends, you will not be billed at all — no refund is needed.
          </p>
        </section>

        {/* Section 5 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">5. How to Request a Refund</h2>
          <p className="text-gray-400 mb-4">
            If you believe you're eligible for a refund, please email us with your request:
          </p>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-white font-semibold mb-3">📧 Email us at:</p>
            <a href="mailto:support@slateinvoice.com" className="text-blue-400 hover:underline text-lg font-medium">support@slateinvoice.com</a>
            <p className="text-gray-500 text-sm mt-4">Please include:</p>
            <ul className="text-gray-400 text-sm space-y-1 mt-2 ml-2">
              <li>• Your account email address</li>
              <li>• The plan you're canceling</li>
              <li>• The date you were billed</li>
              <li>• A brief reason for your refund request (optional but helpful)</li>
            </ul>
            <p className="text-gray-500 text-sm mt-4">We typically respond within 1–2 business days.</p>
          </div>
        </section>

        {/* Section 6 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">6. Payment Processing</h2>
          <p className="text-gray-400 mb-3">
            All payments are processed securely by <strong className="text-white">Stripe</strong>. Refunds are issued back to your original payment method. Depending on your bank or card issuer, it may take 5–10 business days for the refund to appear on your statement.
          </p>
          <p className="text-gray-400">
            SlateInvoice does not store your credit card details. Refunds are initiated on our end via Stripe and processed by your financial institution.
          </p>
        </section>

        {/* Section 7 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">7. Exceptions</h2>
          <p className="text-gray-400">
            We handle each refund request individually and may make exceptions at our discretion. If you've experienced a billing error (e.g., double charge, charge after cancellation), contact us immediately and we will make it right.
          </p>
        </section>

        {/* Section 8 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">8. Changes to This Policy</h2>
          <p className="text-gray-400">
            We may update this Refund Policy from time to time. The "Last updated" date at the top of this page reflects the most recent revision. Any changes apply to purchases made after the updated date.
          </p>
        </section>
      </div>

      <footer className="border-t border-gray-800 py-8 text-center text-sm text-gray-600">
        <p>SlateInvoice · <Link href="/" className="hover:text-gray-400">Home</Link> · <Link href="/privacy" className="hover:text-gray-400">Privacy</Link> · <Link href="/terms" className="hover:text-gray-400">Terms</Link> · <Link href="/cookies" className="hover:text-gray-400">Cookies</Link></p>
      </footer>
    </main>
  );
}
