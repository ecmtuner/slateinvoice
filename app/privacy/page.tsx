import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy — SlateInvoice',
  description: 'How SlateInvoice collects, uses, and protects your data.',
};

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
        <p className="text-gray-400 mb-12 text-lg">
          Your privacy matters to us. This policy explains what data we collect, how we use it, and what rights you have over it.
        </p>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">1. What Data We Collect</h2>
          <p className="text-gray-400 mb-4">When you use SlateInvoice, we collect the following types of information:</p>

          <h3 className="text-lg font-semibold text-white mb-2">Account Information</h3>
          <ul className="list-disc list-inside text-gray-400 space-y-1 mb-4 ml-2">
            <li>Name and email address (when you sign up)</li>
            <li>Password (stored as a secure hash — never in plain text)</li>
            <li>Business name and contact details (if provided in settings)</li>
          </ul>

          <h3 className="text-lg font-semibold text-white mb-2">Invoice & Business Data</h3>
          <ul className="list-disc list-inside text-gray-400 space-y-1 mb-4 ml-2">
            <li>Invoice records you create (line items, amounts, due dates, statuses)</li>
            <li>Client records (names, emails, addresses) that you save</li>
            <li>Products and services you add to your library</li>
          </ul>

          <h3 className="text-lg font-semibold text-white mb-2">Payment Information</h3>
          <ul className="list-disc list-inside text-gray-400 space-y-1 mb-4 ml-2">
            <li>Subscription billing is handled by <strong className="text-white">Stripe</strong>. We do not store your credit card number or payment details on our servers.</li>
            <li>We receive confirmation of successful payments and your Stripe customer ID for billing management.</li>
          </ul>

          <h3 className="text-lg font-semibold text-white mb-2">Usage & Technical Data</h3>
          <ul className="list-disc list-inside text-gray-400 space-y-1 ml-2">
            <li>Browser type and device information (for diagnostics)</li>
            <li>Log data such as IP address and pages visited (standard server logs)</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Data</h2>
          <p className="text-gray-400 mb-3">We use the data we collect to:</p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 ml-2">
            <li>Provide and operate the SlateInvoice service</li>
            <li>Allow you to create, manage, and send invoices and estimates</li>
            <li>Process subscription payments through Stripe</li>
            <li>Send transactional emails (password resets, billing receipts)</li>
            <li>Respond to support requests</li>
            <li>Improve the product based on usage patterns</li>
          </ul>
          <p className="text-gray-500 text-sm mt-4">We do not sell your data to third parties. We do not use your data for advertising.</p>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">3. Third-Party Services</h2>
          <p className="text-gray-400 mb-4">We rely on a small number of trusted third-party services to run SlateInvoice:</p>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-4">
            <h3 className="font-semibold text-white mb-1">Stripe — Payments</h3>
            <p className="text-gray-400 text-sm">Stripe processes all subscription payments. Your card details are entered directly on Stripe's secure forms and never touch our servers. Stripe's privacy policy: <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">stripe.com/privacy</a></p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="font-semibold text-white mb-1">NextAuth — Authentication</h3>
            <p className="text-gray-400 text-sm">We use NextAuth.js for secure sign-in and session management. Sessions are maintained via HTTP-only cookies and are not accessible to client-side JavaScript.</p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">4. Cookies</h2>
          <p className="text-gray-400 mb-3">SlateInvoice uses a minimal number of cookies — only what's needed to keep you signed in:</p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 ml-2">
            <li><strong className="text-white">Session cookie:</strong> Set by NextAuth to keep you authenticated between page loads. Expires when you sign out or the session expires.</li>
            <li><strong className="text-white">CSRF token:</strong> A security cookie to protect against cross-site request forgery.</li>
          </ul>
          <p className="text-gray-500 text-sm mt-4">We do not use advertising cookies, tracking pixels, or any third-party analytics cookies.</p>
        </section>

        {/* Section 5 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">5. Data Retention & Deletion</h2>
          <p className="text-gray-400 mb-3">
            Your data is retained as long as your account is active. If you delete your account, we will permanently remove your personal data, invoice records, and client data within 30 days.
          </p>
          <p className="text-gray-400">
            Some data may be retained for a limited period where required by law (e.g., financial transaction records) or for fraud prevention purposes.
          </p>
        </section>

        {/* Section 6 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">6. Your Rights</h2>
          <p className="text-gray-400 mb-3">You have the following rights regarding your data:</p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 ml-2">
            <li><strong className="text-white">Access:</strong> Request a copy of the data we hold about you.</li>
            <li><strong className="text-white">Correction:</strong> Update or correct inaccurate information in your account settings.</li>
            <li><strong className="text-white">Deletion:</strong> Request deletion of your account and all associated data.</li>
            <li><strong className="text-white">Portability:</strong> Request an export of your data in a common format.</li>
          </ul>
          <p className="text-gray-400 mt-4">To exercise any of these rights, email us at <a href="mailto:privacy@slateinvoice.com" className="text-blue-400 hover:underline">privacy@slateinvoice.com</a>.</p>
        </section>

        {/* Section 7 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">7. Data Security</h2>
          <p className="text-gray-400">
            We use industry-standard security practices including HTTPS encryption, hashed passwords, and HTTP-only session cookies. While we take security seriously, no system is 100% bulletproof — please use a strong, unique password for your account.
          </p>
        </section>

        {/* Section 8 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">8. Children's Privacy</h2>
          <p className="text-gray-400">
            SlateInvoice is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, contact us and we will delete it.
          </p>
        </section>

        {/* Section 9 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">9. Changes to This Policy</h2>
          <p className="text-gray-400">
            We may update this Privacy Policy from time to time. When we do, we'll update the "Last updated" date at the top of this page. Continued use of SlateInvoice after changes constitutes acceptance of the revised policy.
          </p>
        </section>

        {/* Section 10 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">10. Contact Us</h2>
          <p className="text-gray-400 mb-2">Questions or requests about your privacy? Reach out:</p>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-300 font-semibold">SlateInvoice</p>
            <p className="text-gray-400 text-sm mt-1">New Jersey, USA</p>
            <p className="text-gray-400 text-sm">Email: <a href="mailto:privacy@slateinvoice.com" className="text-blue-400 hover:underline">privacy@slateinvoice.com</a></p>
            <p className="text-gray-400 text-sm">Website: <a href="https://slateinvoice.com" className="text-blue-400 hover:underline">slateinvoice.com</a></p>
          </div>
        </section>
      </div>

      <footer className="border-t border-gray-800 py-8 text-center text-sm text-gray-600">
        <p>SlateInvoice · <Link href="/" className="hover:text-gray-400">Home</Link> · <Link href="/terms" className="hover:text-gray-400">Terms</Link> · <Link href="/cookies" className="hover:text-gray-400">Cookies</Link> · <Link href="/refund" className="hover:text-gray-400">Refund Policy</Link></p>
      </footer>
    </main>
  );
}
