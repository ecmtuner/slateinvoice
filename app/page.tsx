import Link from 'next/link';

const features = [
  { icon: '🧾', title: 'Invoices', desc: 'Professional invoices with auto-numbering, due dates, and status tracking' },
  { icon: '📋', title: 'Estimates', desc: 'Send estimates to win jobs. Convert to invoice in one click.' },
  { icon: '🧾', title: 'Receipts', desc: 'Generate receipts for completed payments automatically.' },
  { icon: '👥', title: 'Client Database', desc: 'Save client details and autofill on new invoices. Track lifetime earnings.' },
  { icon: '📦', title: 'Products Library', desc: 'Save your services and products. Select from dropdown when invoicing.' },
  { icon: '🧮', title: 'Taxes & Discounts', desc: 'Apply tax rates, discounts, and fees as % or flat rate. Auto-calculated.' },
  { icon: '📄', title: 'PDF Export', desc: 'Download professional PDF invoices to send or print.' },
  { icon: '🔗', title: 'Pay Invoice Online', desc: 'Every invoice gets a secure payment link. Share it — clients pay by card instantly, no login needed.' },
  { icon: '💱', title: 'Multi-Currency', desc: 'Invoice in USD, EUR, GBP, CAD, AUD and more.' },
  { icon: '🔁', title: 'Recurring Invoices', desc: 'Automatic recurring billing for retainer clients.' },
  { icon: '🌙', title: 'Dark Mode', desc: 'Easy on the eyes. Always dark, always clean.' },
  { icon: '📊', title: 'Dashboard', desc: 'See outstanding, paid, overdue totals at a glance.' },
];

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/mo',
    desc: 'Try it out, no card needed',
    href: '/signup',
    cta: 'Start Free',
    highlight: false,
    badge: null,
    features: [
      '5 invoices per month',
      '3 clients',
      'Basic template',
      'Multi-currency',
      'Dashboard',
    ],
    fee: null,
  },
  {
    name: 'Starter',
    price: '$7',
    period: '/mo',
    desc: 'Perfect for getting started',
    href: '/signup?plan=starter',
    cta: 'Start 7-Day Free Trial',
    highlight: false,
    badge: null,
    features: [
      '5 invoices per month',
      'Unlimited clients',
      'All templates + logo',
      'PDF download',
      'Estimates & receipts',
      'Products library',
      'Payment links',
      'Email support',
    ],
    fee: '1% payment processing fee',
  },
  {
    name: 'Freelancer',
    price: '$15',
    period: '/mo',
    desc: 'For active freelancers',
    href: '/signup?plan=freelancer',
    cta: 'Start 7-Day Free Trial',
    highlight: true,
    badge: '🔥 Most Popular',
    features: [
      'Unlimited invoices',
      'Unlimited clients',
      'All templates + logo',
      'PDF download',
      'Estimates & receipts',
      'Products library',
      'Payment links',
      'Recurring invoices',
      'Priority support',
    ],
    fee: '1% payment processing fee',
  },
  {
    name: 'Business',
    price: '$25',
    period: '/mo',
    desc: 'For growing businesses',
    href: '/signup?plan=business',
    cta: 'Start 7-Day Free Trial',
    highlight: false,
    badge: null,
    features: [
      'Everything in Freelancer',
      'Unlimited invoices',
      'Unlimited clients',
      'No payment processing fee',
      'Advanced reporting',
      'Priority support',
      'Early access to new features',
    ],
    fee: '0% payment processing fee',
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <nav className="border-b border-gray-800 bg-gray-900/60 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧾</span>
            <span className="text-xl font-bold text-white">SlateInvoice</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</Link>
            <Link href="/blog" className="text-sm text-gray-400 hover:text-white transition-colors">Blog</Link>
            <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Sign in</Link>
            <Link href="/signup" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg font-medium transition-colors">Start Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm mb-8">
          <span>🚀</span> No credit card required to start
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
          Invoicing that<br /><span className="text-blue-400">just works</span>
        </h1>
        <p className="text-xl text-gray-400 mb-4 max-w-2xl mx-auto">
          Create professional invoices, estimates, and receipts in seconds. Built for freelancers and small businesses.
        </p>
        <p className="text-lg text-gray-500 mb-10">
          Up to <strong className="text-white">$5 cheaper</strong> than the competition — same features, better price.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-colors shadow-lg shadow-blue-900/40">
            Create Free Account
          </Link>
          <Link href="#pricing" className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold text-lg transition-colors">
            See Pricing
          </Link>
        </div>
        <p className="text-gray-600 text-sm mt-4">Free plan available · No credit card needed · Cancel anytime</p>
      </section>

      {/* Comparison callout */}
      <section className="max-w-3xl mx-auto px-4 pb-12">
        <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-6 text-center">
          <p className="text-blue-300 font-semibold text-lg mb-2">💸 Why pay more?</p>
          <p className="text-gray-400 text-sm">Competitors charge $20–$30/month for the same features. SlateInvoice starts at <strong className="text-white">$7/mo</strong> for Starter and <strong className="text-white">$15/mo</strong> for unlimited — saving you up to $180/year.</p>
        </div>
      </section>

      {/* Payment Link Highlight */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 sm:p-12 grid sm:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs mb-4">
              ✨ New Feature
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Get paid with one link
            </h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Every invoice gets a secure payment page. Share the link via email, text, or WhatsApp — your client clicks, pays by card, and the invoice marks itself as paid. No chasing, no follow-ups.
            </p>
            <ul className="space-y-2 text-sm text-gray-300 mb-8">
              <li className="flex items-center gap-2"><span className="text-green-400">✓</span> No login required for your client</li>
              <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Secure Stripe payment processing</li>
              <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Invoice auto-marks as paid instantly</li>
              <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Payment link printed on PDF invoices</li>
            </ul>
            <Link href="/signup" className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors">
              Try it free →
            </Link>
          </div>
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 text-sm font-mono">
            <div className="text-gray-500 mb-3 text-xs uppercase tracking-wide">Payment Page</div>
            <div className="text-white font-semibold text-base mb-1">Invoice #INV-2025-047</div>
            <div className="text-gray-400 mb-4">From: Your Business Name</div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-400"><span>Web Design — 10hrs</span><span>$950</span></div>
              <div className="flex justify-between text-gray-400"><span>Logo Design</span><span>$350</span></div>
            </div>
            <div className="border-t border-gray-800 pt-3 flex justify-between text-white font-bold text-base mb-4">
              <span>Total Due</span><span>$1,300.00</span>
            </div>
            <div className="w-full py-3 bg-blue-600 rounded-lg text-white text-center font-bold text-sm">
              💳 Pay $1,300.00 Now
            </div>
            <div className="text-gray-600 text-xs text-center mt-2">Secured by Stripe · Visa · Mastercard · Amex</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Everything you need to get paid</h2>
          <p className="text-gray-400 max-w-xl mx-auto">All the tools freelancers and small businesses need — in one clean, fast app.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Simple, honest pricing</h2>
          <p className="text-gray-400">Always $5 less than the competition. Cancel anytime.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, i) => (
            <div key={i} className={`relative rounded-2xl p-7 flex flex-col ${plan.highlight ? 'bg-blue-600/10 border-2 border-blue-500' : 'bg-gray-900 border border-gray-800'}`}>
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full whitespace-nowrap">{plan.badge}</div>
              )}
              <div className="mb-5">
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-gray-500 text-xs mb-3">{plan.desc}</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 text-sm mb-1">{plan.period}</span>
                </div>
                {plan.fee && (
                  <p className={`text-xs mt-2 font-medium ${plan.fee.startsWith('0%') ? 'text-green-400' : 'text-yellow-500'}`}>
                    {plan.fee.startsWith('0%') ? '✓ ' : '⚡ '}{plan.fee}
                  </p>
                )}
              </div>
              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className={`mt-0.5 ${plan.highlight ? 'text-blue-400' : 'text-green-400'}`}>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href={plan.href}
                className={`block text-center px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${
                  plan.highlight
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-600 text-sm mt-8">7-day free trial on paid plans · No credit card to start · Cancel anytime</p>

        {/* Comparison table */}
        <div className="mt-16 bg-gray-900 border border-gray-800 rounded-2xl p-6 overflow-x-auto">
          <h3 className="text-lg font-bold text-white mb-6 text-center">How we compare</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left pb-3 text-gray-500 font-medium">Plan</th>
                <th className="text-center pb-3 text-gray-500 font-medium">Invoices</th>
                <th className="text-center pb-3 text-gray-500 font-medium">SlateInvoice</th>
                <th className="text-center pb-3 text-gray-500 font-medium">Competitor</th>
                <th className="text-center pb-3 text-gray-400 font-medium">You Save</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {[
                { plan: 'Starter', invoices: '5/mo', ours: '$7', theirs: '$12', save: '$5/mo' },
                { plan: 'Freelancer', invoices: 'Unlimited', ours: '$15', theirs: '$20', save: '$5/mo' },
                { plan: 'Business', invoices: 'Unlimited + 0% fee', ours: '$25', theirs: '$30', save: '$5/mo' },
              ].map((row, i) => (
                <tr key={i}>
                  <td className="py-3 text-white font-medium">{row.plan}</td>
                  <td className="py-3 text-center text-gray-400">{row.invoices}</td>
                  <td className="py-3 text-center text-blue-400 font-bold">{row.ours}</td>
                  <td className="py-3 text-center text-gray-500 line-through">{row.theirs}</td>
                  <td className="py-3 text-center text-green-400 font-semibold">{row.save}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to get paid faster?</h2>
        <p className="text-gray-400 mb-8">Join freelancers and small businesses using SlateInvoice — professional invoicing at half the price.</p>
        <Link href="/signup" className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-colors">
          Create Free Account →
        </Link>
      </section>

      <footer className="border-t border-gray-800 py-8 text-center text-sm text-gray-600">
        <p className="mb-2">SlateInvoice · Simple invoicing for everyone · <Link href="/login" className="hover:text-gray-400">Sign in</Link> · <Link href="/blog" className="hover:text-gray-400">Blog</Link></p>
        <p>
          <Link href="/privacy" className="hover:text-gray-400">Privacy Policy</Link>
          {' · '}
          <Link href="/terms" className="hover:text-gray-400">Terms of Service</Link>
          {' · '}
          <Link href="/cookies" className="hover:text-gray-400">Cookie Policy</Link>
          {' · '}
          <Link href="/refund" className="hover:text-gray-400">Refund Policy</Link>
        </p>
      </footer>
    </main>
  );
}
