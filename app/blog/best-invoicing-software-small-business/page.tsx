import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Best Invoicing Software for Small Business (2025) | SlateInvoice',
  description: 'Comparing the top invoicing tools for freelancers and small businesses. Features, pricing, and who each one is actually built for.',
};

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <nav className="border-b border-gray-800 bg-gray-900/60 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🧾</span>
            <span className="text-xl font-bold text-white">SlateInvoice</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</Link>
            <Link href="/blog" className="text-sm text-blue-400 hover:text-white transition-colors">Blog</Link>
            <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Sign in</Link>
            <Link href="/signup" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg font-medium transition-colors">Start Free</Link>
          </div>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-4 py-16">
        <div className="mb-8">
          <Link href="/blog" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">← Back to Blog</Link>
        </div>

        <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
          Best Invoicing Software for Small Business (2025)
        </h1>
        <p className="text-gray-500 text-sm mb-12">March 2025 · 8 min read</p>

        <div className="prose prose-invert max-w-none space-y-6 text-gray-300 leading-relaxed">
          <p>There are dozens of invoicing tools out there — some built for accountants, some for enterprise teams, and a handful actually designed for freelancers and small businesses who just need to send a professional invoice and get paid.</p>
          <p>This guide cuts through the noise. Here's what the top options actually offer, what they cost, and who each one makes sense for.</p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">What to Look For in Invoicing Software</h2>
          <p>Before comparing tools, know what matters:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-white">Ease of use</strong> — Can you create and send an invoice in under 2 minutes?</li>
            <li><strong className="text-white">Payment links</strong> — Can clients pay directly from the invoice?</li>
            <li><strong className="text-white">Automation</strong> — Does it send payment reminders automatically?</li>
            <li><strong className="text-white">Client management</strong> — Can you save client details for future invoices?</li>
            <li><strong className="text-white">PDF export</strong> — Can you download a clean PDF to send or print?</li>
            <li><strong className="text-white">Price</strong> — Are you paying for features you'll never use?</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">1. SlateInvoice — Best Value for Freelancers</h2>
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5 my-4">
            <p className="text-blue-300 font-semibold mb-2">⭐ Best for: Freelancers and small businesses who want full features without overpaying</p>
            <p className="text-gray-400 text-sm"><strong className="text-white">Pricing:</strong> Free plan (5 invoices/mo) · Starter $7/mo · Freelancer $15/mo · Business $25/mo</p>
          </div>
          <p>SlateInvoice is purpose-built for freelancers and small businesses. It covers invoices, estimates, receipts, client management, recurring billing, payment links, and PDF exports — everything you need, nothing you don't.</p>
          <p>The standout difference is price. Where competitors charge $20–$30/month for comparable features, SlateInvoice consistently runs $5 cheaper at every tier. Over a year, that's real money.</p>
          <p><strong className="text-white">What's included:</strong> Unlimited invoices (on paid plans), client database, products library, multi-currency, payment links, recurring invoices, PDF export, dark mode.</p>
          <p><strong className="text-white">Best for:</strong> Freelancers and small businesses who invoice regularly and want clean software at a fair price.</p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">2. FreshBooks — Best for Service Businesses That Need Accounting</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 my-4">
            <p className="text-gray-400 text-sm"><strong className="text-white">Pricing:</strong> Lite $19/mo · Plus $33/mo · Premium $60/mo</p>
          </div>
          <p>FreshBooks is strong if you need invoicing plus basic accounting features — expense tracking, time tracking, profit & loss reports. It's more than just an invoicing tool.</p>
          <p>The downside: it's more expensive, and if you're just invoicing (not running full books), you're paying for features you won't use. The UI is polished but the pricing tiers are aggressive.</p>
          <p><strong className="text-white">Best for:</strong> Service businesses that also want basic bookkeeping and expense tracking bundled in.</p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">3. Wave — Best Free Option (With Caveats)</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 my-4">
            <p className="text-gray-400 text-sm"><strong className="text-white">Pricing:</strong> Free (invoicing) · Payment processing fees apply</p>
          </div>
          <p>Wave is genuinely free for invoicing and accounting. There's no monthly fee. They make money on payment processing (2.9% + $0.60 per transaction for credit cards).</p>
          <p>The catch: if you're processing significant volume through their payment system, those fees add up fast. And Wave's feature set is more limited than paid alternatives — no recurring invoices on the free tier, fewer customization options.</p>
          <p><strong className="text-white">Best for:</strong> Businesses that invoice infrequently and need a truly free solution to start.</p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">4. QuickBooks Online — Best for Businesses That Need Full Accounting</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 my-4">
            <p className="text-gray-400 text-sm"><strong className="text-white">Pricing:</strong> Simple Start $30/mo · Essentials $60/mo · Plus $90/mo</p>
          </div>
          <p>QuickBooks is the accounting standard for small businesses. If you have employees, complex tax situations, inventory, or work with a bookkeeper or accountant, QuickBooks is the right tool.</p>
          <p>For pure invoicing? It's overkill and expensive. The invoicing features aren't better than simpler tools — you're paying for the full accounting suite.</p>
          <p><strong className="text-white">Best for:</strong> Established businesses that need full bookkeeping, payroll, tax prep, and accounting — not just invoicing.</p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">5. Invoice Ninja — Best Open-Source Option</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 my-4">
            <p className="text-gray-400 text-sm"><strong className="text-white">Pricing:</strong> Free (self-hosted) · Cloud plan $10/mo</p>
          </div>
          <p>Invoice Ninja is open source and feature-rich — time tracking, expense tracking, project management, client portal, and strong customization. If you're technical and want to self-host, it's essentially free.</p>
          <p>The downside is complexity. It takes setup time, and the UI isn't as polished as commercial alternatives. Not ideal if you want something that works immediately out of the box.</p>
          <p><strong className="text-white">Best for:</strong> Technical users who want full control and don't mind self-hosting.</p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">The Bottom Line: Which Should You Use?</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-800 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-gray-900 border-b border-gray-800">
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">If you need...</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Use this</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {[
                  ['Best value for regular invoicing', 'SlateInvoice'],
                  ['Free to start, basic needs', 'Wave'],
                  ['Invoicing + accounting bundled', 'FreshBooks'],
                  ['Full accounting + payroll', 'QuickBooks Online'],
                  ['Self-hosted, full control', 'Invoice Ninja'],
                ].map(([need, tool], i) => (
                  <tr key={i} className="bg-gray-950 hover:bg-gray-900/50">
                    <td className="px-4 py-3 text-gray-300">{need}</td>
                    <td className={`px-4 py-3 font-medium ${tool === 'SlateInvoice' ? 'text-blue-400' : 'text-white'}`}>{tool}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6">For most freelancers and small businesses, the choice comes down to this: if you want the most features for the lowest price, SlateInvoice is the answer. If you need full accounting, go FreshBooks or QuickBooks. If you need free, Wave works.</p>
        </div>

        <div className="mt-16 bg-blue-600/10 border border-blue-500/30 rounded-2xl p-8 text-center">
          <h3 className="font-bold text-xl text-white mb-3">Try SlateInvoice Free</h3>
          <p className="text-gray-400 mb-6">Full-featured invoicing for freelancers and small businesses — up to $5/month cheaper than the competition. Free plan available, no credit card needed.</p>
          <Link href="/signup" className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors">
            Create Free Account →
          </Link>
        </div>
      </article>

      <footer className="border-t border-gray-800 py-8 text-center text-sm text-gray-600">
        <p>SlateInvoice · Simple invoicing for everyone · <Link href="/login" className="hover:text-gray-400">Sign in</Link> · <Link href="/blog" className="hover:text-gray-400">Blog</Link></p>
      </footer>
    </main>
  );
}
