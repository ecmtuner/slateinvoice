import Link from 'next/link';

export const metadata = {
  title: 'Cookie Policy — SlateInvoice',
  description: 'How SlateInvoice uses cookies and what they do.',
};

export default function CookiesPage() {
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
        <h1 className="text-4xl font-bold text-white mb-4">Cookie Policy</h1>
        <p className="text-gray-400 mb-12 text-lg">
          SlateInvoice uses a minimal number of cookies — just what's needed to keep you signed in. No tracking, no ads, no surprises.
        </p>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">1. What Are Cookies?</h2>
          <p className="text-gray-400">
            Cookies are small text files stored on your device by your browser when you visit a website. They help websites remember information about your visit — like whether you're signed in — so you don't have to log in again on every page load.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">2. Cookies We Use</h2>
          <p className="text-gray-400 mb-6">We keep it minimal. Here's exactly what we set:</p>

          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-medium rounded">Essential</span>
                <h3 className="font-semibold text-white">Session Cookie</h3>
              </div>
              <p className="text-gray-400 text-sm mb-2">
                Set by NextAuth.js to maintain your authenticated session. Without this cookie, you'd be signed out on every page navigation.
              </p>
              <ul className="text-gray-500 text-xs space-y-1">
                <li><span className="text-gray-400">Name:</span> next-auth.session-token</li>
                <li><span className="text-gray-400">Type:</span> HTTP-only, Secure</li>
                <li><span className="text-gray-400">Expires:</span> When you sign out, or after 30 days of inactivity</li>
              </ul>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-medium rounded">Essential</span>
                <h3 className="font-semibold text-white">CSRF Token Cookie</h3>
              </div>
              <p className="text-gray-400 text-sm mb-2">
                A security cookie that protects your account against cross-site request forgery (CSRF) attacks. It ensures that form submissions originate from your authenticated session.
              </p>
              <ul className="text-gray-500 text-xs space-y-1">
                <li><span className="text-gray-400">Name:</span> next-auth.csrf-token</li>
                <li><span className="text-gray-400">Type:</span> HTTP-only, Secure</li>
                <li><span className="text-gray-400">Expires:</span> Session</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">3. What We Don't Use</h2>
          <p className="text-gray-400 mb-4">We want to be transparent. SlateInvoice does <strong className="text-white">not</strong> use:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: '🚫', label: 'Advertising cookies' },
              { icon: '🚫', label: 'Tracking pixels' },
              { icon: '🚫', label: 'Analytics cookies (e.g. Google Analytics)' },
              { icon: '🚫', label: 'Social media cookies' },
              { icon: '🚫', label: 'Third-party retargeting cookies' },
              { icon: '🚫', label: 'Fingerprinting or device tracking' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-lg px-4 py-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-gray-400 text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">4. Why These Cookies Are Necessary</h2>
          <p className="text-gray-400">
            The cookies we set are strictly necessary to operate the Service. Without the session cookie, you cannot stay signed in. Without the CSRF token, your account would be vulnerable to certain types of attacks. These cookies cannot be opted out of while using SlateInvoice — they are a functional requirement, not a choice.
          </p>
        </section>

        {/* Section 5 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">5. How to Manage or Disable Cookies</h2>
          <p className="text-gray-400 mb-4">
            You can control and delete cookies through your browser settings. Here's how to do it in popular browsers:
          </p>
          <div className="space-y-2">
            {[
              { browser: 'Chrome', url: 'https://support.google.com/chrome/answer/95647' },
              { browser: 'Firefox', url: 'https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop' },
              { browser: 'Safari', url: 'https://support.apple.com/guide/safari/manage-cookies-sfri11471' },
              { browser: 'Edge', url: 'https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-lg px-4 py-3">
                <span className="text-gray-300 text-sm font-medium">{item.browser}</span>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm hover:underline">View instructions →</a>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-sm mt-4">
            Note: Disabling cookies will sign you out of SlateInvoice and you will not be able to stay logged in without enabling session cookies.
          </p>
        </section>

        {/* Section 6 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">6. Changes to This Policy</h2>
          <p className="text-gray-400">
            If we ever add new cookies or change how we use them, we'll update this page and the "Last updated" date. We're committed to keeping our cookie use minimal and transparent.
          </p>
        </section>

        {/* Section 7 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">7. Questions?</h2>
          <p className="text-gray-400 mb-4">If you have any questions about our cookie usage, contact us:</p>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-300 font-semibold">SlateInvoice</p>
            <p className="text-gray-400 text-sm mt-1">Email: <a href="mailto:privacy@slateinvoice.com" className="text-blue-400 hover:underline">privacy@slateinvoice.com</a></p>
            <p className="text-gray-400 text-sm">Website: <a href="https://slateinvoice.com" className="text-blue-400 hover:underline">slateinvoice.com</a></p>
          </div>
        </section>
      </div>

      <footer className="border-t border-gray-800 py-8 text-center text-sm text-gray-600">
        <p>SlateInvoice · <Link href="/" className="hover:text-gray-400">Home</Link> · <Link href="/privacy" className="hover:text-gray-400">Privacy</Link> · <Link href="/terms" className="hover:text-gray-400">Terms</Link> · <Link href="/refund" className="hover:text-gray-400">Refund Policy</Link></p>
      </footer>
    </main>
  );
}
