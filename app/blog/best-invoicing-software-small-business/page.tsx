import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Best Invoicing Software for Small Business 2025 | SlateInvoice',
  description: 'Comparing invoicing software for freelancers and small businesses in 2025. Features, pricing, and which tool actually fits your workflow.',
};

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '40px 20px', lineHeight: '1.8' }}>
        <div style={{ marginBottom: '12px' }}>
          <Link href="/blog" className="text-blue-400 text-sm hover:underline">← Back to Blog</Link>
        </div>
        <h1 className="text-4xl font-bold mb-2">Best Invoicing Software for Small Business 2025</h1>
        <p className="text-gray-400 text-sm mb-10">March 2025 · 8 min read</p>

        <p className="mb-4">If you&apos;re running a small business or freelancing, invoicing software is one of the highest-ROI tools you can use. The right one saves you hours per month, reduces late payments, and makes you look more professional to clients. Here&apos;s an honest look at the landscape in 2025.</p>

        <h2 className="text-2xl font-bold mt-10 mb-4">What to Look for in Invoicing Software</h2>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li><strong>Speed:</strong> Can you create and send an invoice in under 2 minutes?</li>
          <li><strong>Client management:</strong> Does it store your client details?</li>
          <li><strong>Payment collection:</strong> Can clients pay directly from the invoice?</li>
          <li><strong>Automation:</strong> Does it send payment reminders automatically?</li>
          <li><strong>Price:</strong> Does it make sense for your revenue level?</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-4">QuickBooks Online</h2>
        <p className="mb-2"><strong>Best for:</strong> Established small businesses that need full accounting</p>
        <p className="mb-4"><strong>Pricing:</strong> Starts ~$35/month</p>
        <p className="mb-4">QuickBooks is the gold standard of small business accounting — invoicing, payroll, expense tracking, bank reconciliation, and tax prep. Genuinely powerful, but also genuinely complex. Overkill if you just need invoicing.</p>

        <h2 className="text-2xl font-bold mt-10 mb-4">FreshBooks</h2>
        <p className="mb-2"><strong>Best for:</strong> Service-based freelancers and small agencies</p>
        <p className="mb-4"><strong>Pricing:</strong> Starts ~$19/month</p>
        <p className="mb-4">FreshBooks has a clean interface and solid invoicing features. Time tracking is built in, which is useful for hourly billing. Gets expensive as you add more clients. The UI is good but the pricing tiers are restrictive.</p>

        <h2 className="text-2xl font-bold mt-10 mb-4">Wave</h2>
        <p className="mb-2"><strong>Best for:</strong> Absolute beginners on a zero budget</p>
        <p className="mb-4"><strong>Pricing:</strong> Free (payment processing fees apply)</p>
        <p className="mb-4">Wave is free and handles basic invoicing well. The tradeoff: the interface feels dated, customer support is limited, and the free tier is constrained. It works for getting started; most businesses outgrow it.</p>

        <h2 className="text-2xl font-bold mt-10 mb-4">HoneyBook</h2>
        <p className="mb-2"><strong>Best for:</strong> Creative professionals (photographers, designers, event planners)</p>
        <p className="mb-4"><strong>Pricing:</strong> Starts ~$19/month</p>
        <p className="mb-4">HoneyBook combines invoicing with contracts, scheduling, and client communication in one workflow. Strong for client-facing service businesses. Less useful if you just need clean, fast invoicing without the project management layer.</p>

        <h2 className="text-2xl font-bold mt-10 mb-4">SlateInvoice</h2>
        <p className="mb-2"><strong>Best for:</strong> Freelancers and small businesses who want professional invoicing without complexity or cost</p>
        <p className="mb-4"><strong>Pricing:</strong> Free plan available; paid plans start at $7/month</p>
        <p className="mb-4">SlateInvoice is built for one thing: getting you paid faster with less friction. Create a professional invoice in under 2 minutes, accept online payments directly, track what&apos;s paid and what&apos;s outstanding, and send automatic payment reminders — without paying $30+/month for features you don&apos;t need.</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Auto-numbered invoices with your logo and branding</li>
          <li>Client database with autofill</li>
          <li>PDF export, payment links, multi-currency</li>
          <li>Recurring invoices for retainer clients</li>
          <li>Dashboard showing outstanding, paid, and overdue at a glance</li>
          <li>Dark mode. Always.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-4">The Bottom Line</h2>
        <p className="mb-4">If you need full accounting: QuickBooks. If you need project management + invoicing: HoneyBook or FreshBooks. If you need fast, clean, affordable invoicing without the bloat: SlateInvoice is the answer. The free plan gets you started with no credit card required.</p>

        <div className="mt-12 p-6 bg-blue-950 rounded-xl border border-blue-800">
          <p className="font-bold text-lg mb-2">SlateInvoice — professional invoicing without the enterprise price tag.</p>
          <p className="text-gray-300 mb-4">Create your first invoice free in under 2 minutes. Paid plans start at $7/month.</p>
          <Link href="https://slateinvoice.com/signup" className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors">Start Free at SlateInvoice</Link>
        </div>
      </div>
    </div>
  );
}
