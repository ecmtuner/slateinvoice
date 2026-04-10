'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function useCounter(target: number, duration: number = 2000) {
  const [count, setCount] = useState(target - 300);
  useEffect(() => {
    const step = Math.ceil(300 / (duration / 50));
    const timer = setInterval(() => {
      setCount(prev => {
        if (prev >= target) { clearInterval(timer); return target; }
        return prev + step;
      });
    }, 50);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

const testimonials = [
  {
    name: 'Marcus T.',
    role: 'Freelance Web Designer',
    avatar: '👨🏽‍💻',
    text: 'I was paying $20/month for FreshBooks and barely using half the features. SlateInvoice does everything I need at less than half the price. Switched in 10 minutes.',
  },
  {
    name: 'Sarah K.',
    role: 'Marketing Consultant',
    avatar: '👩🏼‍💼',
    text: 'The payment link feature is a game changer. I send the invoice, client clicks the link, pays in 2 minutes. No more "I\'ll send a check" excuses.',
  },
  {
    name: 'James R.',
    role: 'Independent Contractor',
    avatar: '👨🏻‍🔧',
    text: 'Super clean, nothing confusing. I sent my first invoice in under 3 minutes. My clients actually comment on how professional it looks.',
  },
];

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
  { icon: '🛡️', title: 'Chargeback Protection', desc: 'Attach GPS location + job site photos to invoices. Dispute-proof evidence built right in. Business plan.' },
  { icon: '🔁', title: 'Recurring Invoices', desc: 'Automatic recurring billing for retainer clients.' },
  { icon: '🌙', title: 'Dark Mode', desc: 'Easy on the eyes. Always dark, always clean.' },
  { icon: '📊', title: 'Dashboard', desc: 'See outstanding, paid, overdue totals at a glance.' },
  { icon: '🔵', title: 'Google Sign-In', desc: 'One-click signup and login with your Google account. No password to remember.' },
  { icon: '📧', title: 'Email Notifications', desc: 'Get notified the moment a client pays. Clients receive their invoice by email automatically.' },
  { icon: '⏰', title: 'Overdue Reminders', desc: 'Automatic reminder emails sent to clients with unpaid invoices — so you never have to chase.' },
  { icon: '🎨', title: 'Invoice Templates', desc: 'Choose from Classic, Modern, or Minimal invoice designs. Your brand, your style.' },
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
      '1 invoice template',
      'Multi-currency',
      'Dashboard',
      'Google Sign-In',
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
      'All 3 invoice templates',
      'PDF download',
      'Estimates & receipts',
      'Products library',
      'Payment links',
      'Email notifications',
      'Google Sign-In',
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
      'All 3 invoice templates',
      'PDF download',
      'Estimates & receipts',
      'Products library',
      'Payment links',
      'Recurring invoices',
      'Email notifications',
      'Overdue auto-reminders',
      'Google Sign-In',
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
      'All 3 invoice templates',
      'Email notifications',
      'Overdue auto-reminders',
      '📍 GPS job site location on invoices',
      '📸 Job site photo attachments (up to 10)',
      '🛡️ Chargeback protection badge',
      'Advanced reporting',
      'Priority support',
      'Early access to new features',
    ],
    fee: '0% payment processing fee',
  },
];

function StatCounter({ value, label, label2, icon }: { value: number; label: string; label2?: string; icon: string }) {
  const count = useCounter(value);
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-3xl font-bold text-white">
        {icon} {count.toLocaleString()}{label2 || ''}
      </div>
      <div className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</div>
    </div>
  );
}

const glassCard = {
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '16px',
};

export default function LandingPage() {
  return (
    <main className="min-h-screen text-white" style={{ position: 'relative', zIndex: 1 }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50"
        style={{
          background: 'rgba(10,0,21,0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧾</span>
            <span className="text-xl font-bold"
              style={{ background: 'linear-gradient(135deg, #A78BFA, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              SlateInvoice
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="#pricing" className="text-sm text-white/50 hover:text-white transition-colors">Pricing</Link>
            <Link href="/blog" className="text-sm text-white/50 hover:text-white transition-colors">Blog</Link>
            <Link href="/login" className="text-sm text-white/50 hover:text-white transition-colors">Sign in</Link>
            <Link href="/signup"
              className="px-4 py-2 text-white text-sm rounded-lg font-medium transition-all btn-primary">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-28 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm mb-8 font-medium"
          style={{
            background: 'rgba(139,92,246,0.12)',
            border: '1px solid rgba(139,92,246,0.25)',
            color: '#A78BFA',
          }}>
          <span>🚀</span> No credit card required to start
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">
          Invoicing that<br />
          <span style={{ background: 'linear-gradient(135deg, #A78BFA 0%, #22D3EE 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            just works
          </span>
        </h1>
        <p className="text-xl text-white/60 mb-4 max-w-2xl mx-auto">
          Create professional invoices, estimates, and receipts in seconds. Built for freelancers and small businesses.
        </p>
        <p className="text-lg text-white/40 mb-10">
          Up to <strong className="text-white">$5 cheaper</strong> than the competition — same features, better price.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup"
            className="px-8 py-4 text-white rounded-xl font-bold text-lg transition-all btn-primary">
            Create Free Account
          </Link>
          <Link href="#pricing"
            className="px-8 py-4 text-white rounded-xl font-bold text-lg transition-all"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.10)',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.10)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'}>
            See Pricing
          </Link>
        </div>
        <p className="text-white/25 text-sm mt-4">Free plan available · No credit card needed · Cancel anytime</p>

        {/* Social proof counter */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-10">
          <StatCounter value={3847} label="Invoices sent this month" icon="🧾" />
          <StatCounter value={912} label="Active users" icon="👥" />
          <StatCounter value={97} label="Satisfaction rate" label2="%" icon="⭐" />
        </div>
      </section>

      {/* Comparison callout */}
      <section className="max-w-3xl mx-auto px-4 pb-14">
        <div className="p-6 text-center rounded-2xl"
          style={{
            background: 'rgba(139,92,246,0.08)',
            border: '1px solid rgba(139,92,246,0.2)',
            backdropFilter: 'blur(16px)',
          }}>
          <p className="font-semibold text-lg mb-2" style={{ color: '#A78BFA' }}>💸 Why pay more?</p>
          <p className="text-sm text-white/50">Competitors charge $20–$30/month for the same features. SlateInvoice starts at <strong className="text-white">$7/mo</strong> for Starter and <strong className="text-white">$15/mo</strong> for unlimited — saving you up to $180/year.</p>
        </div>
      </section>

      {/* Payment Link Highlight */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="p-8 sm:p-12 grid sm:grid-cols-2 gap-8 items-center rounded-2xl"
          style={glassCard}>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-4 font-medium"
              style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#10B981' }}>
              ✨ New Feature
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Get paid with one link
            </h2>
            <p className="text-white/50 mb-6 leading-relaxed">
              Every invoice gets a secure payment page. Share the link via email, text, or WhatsApp — your client clicks, pays by card, and the invoice marks itself as paid. No chasing, no follow-ups.
            </p>
            <ul className="space-y-2 text-sm text-white/70 mb-8">
              <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> No login required for your client</li>
              <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Secure Stripe payment processing</li>
              <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Invoice auto-marks as paid instantly</li>
              <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Payment link printed on PDF invoices</li>
            </ul>
            <Link href="/signup"
              className="inline-block px-6 py-3 text-white rounded-xl font-bold transition-all btn-primary">
              Try it free →
            </Link>
          </div>
          <div className="text-sm font-mono rounded-xl p-6"
            style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
            <div className="text-xs uppercase tracking-wide mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>Payment Page</div>
            <div className="text-white font-semibold text-base mb-1">Invoice #INV-2025-047</div>
            <div className="text-white/40 mb-4">From: Your Business Name</div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-white/50"><span>Web Design — 10hrs</span><span>$950</span></div>
              <div className="flex justify-between text-white/50"><span>Logo Design</span><span>$350</span></div>
            </div>
            <div className="pt-3 flex justify-between text-white font-bold text-base mb-4"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span>Total Due</span><span>$1,300.00</span>
            </div>
            <div className="w-full py-3 rounded-lg text-white text-center font-bold text-sm btn-primary">
              💳 Pay $1,300.00 Now
            </div>
            <div className="text-xs text-center mt-2" style={{ color: 'rgba(255,255,255,0.25)' }}>Secured by Stripe · Visa · Mastercard · Amex</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Everything you need to get paid</h2>
          <p className="text-white/40 max-w-xl mx-auto">All the tools freelancers and small businesses need — in one clean, fast app.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div key={i} className="p-6 rounded-xl transition-all glass-card">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Simple, honest pricing</h2>
          <p className="text-white/40">Always $5 less than the competition. Cancel anytime.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, i) => (
            <div key={i} className={`relative rounded-2xl p-7 flex flex-col transition-all`}
              style={plan.highlight ? {
                background: 'rgba(139,92,246,0.12)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '2px solid rgba(139,92,246,0.5)',
                boxShadow: '0 8px 40px rgba(139,92,246,0.25)',
              } : {
                ...glassCard,
              }}>
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-white text-xs font-bold rounded-full whitespace-nowrap"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)', boxShadow: '0 4px 12px rgba(139,92,246,0.4)' }}>
                  {plan.badge}
                </div>
              )}
              <div className="mb-5">
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>{plan.desc}</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{plan.period}</span>
                </div>
                {plan.fee && (
                  <p className={`text-xs mt-2 font-medium ${plan.fee.startsWith('0%') ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {plan.fee.startsWith('0%') ? '✓ ' : '⚡ '}{plan.fee}
                  </p>
                )}
              </div>
              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-white/70">
                    <span className="mt-0.5" style={{ color: plan.highlight ? '#A78BFA' : '#10B981' }}>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href={plan.href}
                className={`block text-center px-4 py-3 rounded-xl font-semibold text-sm transition-all text-white ${plan.highlight ? 'btn-primary' : ''}`}
                style={!plan.highlight ? {
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                } : {}}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
        <p className="text-center text-sm mt-8" style={{ color: 'rgba(255,255,255,0.3)' }}>7-day free trial on paid plans · No credit card to start · Cancel anytime</p>

        {/* Comparison table */}
        <div className="mt-16 p-6 rounded-2xl overflow-x-auto"
          style={glassCard}>
          <h3 className="text-lg font-bold text-white mb-6 text-center">How we compare</h3>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <th className="text-left pb-3 font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>Plan</th>
                <th className="text-center pb-3 font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>Invoices</th>
                <th className="text-center pb-3 font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>SlateInvoice</th>
                <th className="text-center pb-3 font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>Competitor</th>
                <th className="text-center pb-3 font-medium text-white">You Save</th>
              </tr>
            </thead>
            <tbody>
              {[
                { plan: 'Starter', invoices: '5/mo', ours: '$7', theirs: '$12', save: '$5/mo' },
                { plan: 'Freelancer', invoices: 'Unlimited', ours: '$15', theirs: '$20', save: '$5/mo' },
                { plan: 'Business', invoices: 'Unlimited + 0% fee', ours: '$25', theirs: '$30', save: '$5/mo' },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="py-3 text-white font-medium">{row.plan}</td>
                  <td className="py-3 text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>{row.invoices}</td>
                  <td className="py-3 text-center font-bold" style={{ color: '#A78BFA' }}>{row.ours}</td>
                  <td className="py-3 text-center line-through" style={{ color: 'rgba(255,255,255,0.3)' }}>{row.theirs}</td>
                  <td className="py-3 text-center font-semibold text-emerald-400">{row.save}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Invoice Preview */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">This is what your client receives</h2>
          <p className="text-white/40">Professional, clean, and branded to you — in seconds.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl mx-auto text-gray-900" style={{ boxShadow: '0 0 80px rgba(139,92,246,0.2), 0 40px 80px rgba(0,0,0,0.5)' }}>
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">Your Business</div>
              <div className="text-sm text-gray-500">yourname@email.com</div>
              <div className="text-sm text-gray-500">New York, NY</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600 mb-1">INVOICE</div>
              <div className="text-sm text-gray-500">#INV-2025-047</div>
              <div className="text-sm text-gray-500">Due: Apr 15, 2025</div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Bill To</div>
            <div className="font-semibold text-gray-800">Acme Corp</div>
            <div className="text-sm text-gray-500">billing@acmecorp.com</div>
          </div>
          <table className="w-full text-sm mb-6">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 text-xs uppercase">
                <th className="text-left pb-2">Description</th>
                <th className="text-right pb-2">Qty</th>
                <th className="text-right pb-2">Rate</th>
                <th className="text-right pb-2">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr><td className="py-2 text-gray-800">Website Redesign</td><td className="text-right text-gray-600">1</td><td className="text-right text-gray-600">$950</td><td className="text-right font-medium">$950.00</td></tr>
              <tr><td className="py-2 text-gray-800">Logo &amp; Branding</td><td className="text-right text-gray-600">1</td><td className="text-right text-gray-600">$350</td><td className="text-right font-medium">$350.00</td></tr>
            </tbody>
          </table>
          <div className="flex justify-end mb-6">
            <div className="text-right">
              <div className="flex justify-between gap-12 text-sm text-gray-500 mb-1"><span>Subtotal</span><span>$1,300.00</span></div>
              <div className="flex justify-between gap-12 text-sm text-gray-500 mb-2"><span>Tax (0%)</span><span>$0.00</span></div>
              <div className="flex justify-between gap-12 text-lg font-bold text-gray-900 border-t border-gray-200 pt-2"><span>Total</span><span>$1,300.00</span></div>
            </div>
          </div>
          <div className="w-full py-3 bg-blue-600 rounded-xl text-white text-center font-bold text-sm">
            💳 Pay $1,300.00 Now — Secured by Stripe
          </div>
          <div className="text-center text-xs text-gray-400 mt-3">Visa · Mastercard · American Express · Apple Pay</div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Freelancers love it</h2>
          <p className="text-white/40">Real people, real results.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="p-6 rounded-2xl transition-all glass-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">{t.avatar}</div>
                <div>
                  <div className="font-semibold text-white text-sm">{t.name}</div>
                  <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{t.role}</div>
                </div>
              </div>
              <div className="text-amber-400 text-sm mb-3">★★★★★</div>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>&ldquo;{t.text}&rdquo;</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="p-10 rounded-2xl"
          style={{
            background: 'rgba(139,92,246,0.08)',
            border: '1px solid rgba(139,92,246,0.2)',
            backdropFilter: 'blur(20px)',
          }}>
          <h2 className="text-3xl font-bold text-white mb-4">Send your first invoice in 60 seconds</h2>
          <p className="text-white/50 mb-8">Join thousands of freelancers using SlateInvoice. No credit card. No commitment. Just create, send, get paid.</p>
          <Link href="/signup"
            className="inline-block px-8 py-4 text-white rounded-xl font-bold text-lg transition-all btn-primary">
            Create Free Account — No Card Needed →
          </Link>
          <p className="text-sm mt-5" style={{ color: 'rgba(255,255,255,0.25)' }}>✓ Free plan forever &nbsp;·&nbsp; ✓ Set up in 60 seconds &nbsp;·&nbsp; ✓ Cancel anytime</p>
        </div>
      </section>

      <footer className="py-8 text-center text-sm" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.25)' }}>
        <p className="mb-2">SlateInvoice · Simple invoicing for everyone · <Link href="/login" className="hover:text-white/60 transition-colors">Sign in</Link> · <Link href="/blog" className="hover:text-white/60 transition-colors">Blog</Link></p>
        <p>
          <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
          {' · '}
          <Link href="/terms" className="hover:text-white/60 transition-colors">Terms of Service</Link>
          {' · '}
          <Link href="/cookies" className="hover:text-white/60 transition-colors">Cookie Policy</Link>
          {' · '}
          <Link href="/refund" className="hover:text-white/60 transition-colors">Refund Policy</Link>
        </p>
      </footer>
    </main>
  );
}
