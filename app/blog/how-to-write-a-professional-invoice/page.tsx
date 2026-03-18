import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How to Write a Professional Invoice (Step-by-Step) | SlateInvoice',
  description: 'A professional invoice gets you paid faster and looks credible. Here\'s exactly what to include, how to format it, and the fastest way to send one.',
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
          How to Write a Professional Invoice (Step-by-Step)
        </h1>
        <p className="text-gray-500 text-sm mb-12">March 2025 · 6 min read</p>

        <div className="prose prose-invert max-w-none space-y-6 text-gray-300 leading-relaxed">
          <p>An invoice is how you get paid. If it's missing information, poorly formatted, or confusing to read, you're giving clients a reason to delay. A professional invoice removes every excuse and makes payment the obvious next step.</p>
          <p>Here's exactly how to write one — and what you should never leave out.</p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">What Is an Invoice (and Why It Matters)</h2>
          <p>An invoice is a formal document requesting payment for goods or services. It's not just a polite ask — it's a legal record of what was agreed, what was delivered, and what's owed. In any payment dispute, an invoice is your primary evidence.</p>
          <p>Good invoices also signal professionalism. Clients who receive a clean, detailed invoice take payment more seriously than clients who get a "hey, here's my Venmo" message.</p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">Required Elements of a Professional Invoice</h2>

          <h3 className="text-xl font-semibold text-white mt-8 mb-3">1. The Word "Invoice" at the Top</h3>
          <p>Sounds obvious. You'd be surprised how many people skip it. Label your document clearly — it signals this is a formal billing document, not an estimate or proposal.</p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-3">2. Invoice Number</h3>
          <p>Every invoice needs a unique identifier. This helps you track payments, reference specific invoices in conversations, and maintain organized records. Use a simple sequential system: INV-001, INV-002, or incorporate the year: INV-2025-001.</p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-3">3. Invoice Date and Due Date</h3>
          <p><strong className="text-white">Invoice date:</strong> When you issued the invoice.<br /><strong className="text-white">Due date:</strong> When payment is expected.</p>
          <p>Without a due date, "when is this due?" becomes a conversation you'll have every time. Set clear terms. Common standards: Net 15, Net 30, or "Due upon receipt."</p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-3">4. Your Business Information</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your full name or business name</li>
            <li>Address</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Website (optional but professional)</li>
          </ul>

          <h3 className="text-xl font-semibold text-white mt-8 mb-3">5. Client Information</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Client's name or company name</li>
            <li>Billing address</li>
            <li>Contact email</li>
          </ul>
          <p>Always double-check the billing contact — the person who commissioned the work isn't always the accounts payable person.</p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-3">6. Itemized List of Services or Products</h3>
          <p>This is the core of the invoice. For each item include:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-white">Description:</strong> What exactly was delivered</li>
            <li><strong className="text-white">Quantity:</strong> Hours, units, or a fixed project</li>
            <li><strong className="text-white">Rate:</strong> Price per unit or hourly rate</li>
            <li><strong className="text-white">Amount:</strong> Quantity × Rate</li>
          </ul>
          <p>Be specific. "Website design" is vague. "Homepage redesign — 12 hours @ $95/hr" is clear and defensible.</p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-3">7. Subtotal, Taxes, and Total</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-white">Subtotal:</strong> Sum of all line items</li>
            <li><strong className="text-white">Tax:</strong> If applicable, show the rate and dollar amount</li>
            <li><strong className="text-white">Total Due:</strong> The final number, bolded and obvious</li>
          </ul>
          <p>Don't bury the total. It should be impossible to miss.</p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-3">8. Payment Methods</h3>
          <p>List exactly how you accept payment:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Bank transfer (include account/routing details or a link)</li>
            <li>Credit card</li>
            <li>PayPal, Venmo, Zelle, etc.</li>
            <li>Check (make payable to...)</li>
          </ul>
          <p>The easier you make it to pay, the faster you get paid. Friction kills payment speed.</p>

          <h3 className="text-xl font-semibold text-white mt-8 mb-3">9. Notes or Terms</h3>
          <p>Optional but useful:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Late payment fee policy</li>
            <li>Thank you note</li>
            <li>Project-specific notes</li>
            <li>Contract reference number</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">Common Invoice Mistakes That Delay Payment</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-white">No due date:</strong> Client assumes there's no urgency</li>
            <li><strong className="text-white">Vague line items:</strong> Client questions what they're paying for</li>
            <li><strong className="text-white">Missing payment instructions:</strong> Client has to ask how to pay</li>
            <li><strong className="text-white">Wrong billing contact:</strong> Invoice lands in the wrong inbox and sits</li>
            <li><strong className="text-white">No follow-up system:</strong> Invoice is sent and forgotten until it's 60 days overdue</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">How to Send an Invoice Professionally</h2>
          <p>Email is standard. Send as a PDF — never an editable document. Include a brief, professional note in the email body:</p>
          <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-400 my-4">
            "Hi [Name], please find attached Invoice #INV-2025-047 for [project] totaling $[amount], due [date]. Payment instructions are included on the invoice. Let me know if you have any questions."
          </blockquote>
          <p>Simple. Clear. Done.</p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">Use Software to Do This Faster</h2>
          <p>Building invoices in Word or Google Docs works once. If you're invoicing regularly, it becomes tedious and inconsistent. Invoicing software handles numbering, client records, due date tracking, and payment status automatically.</p>
        </div>

        <div className="mt-16 bg-blue-600/10 border border-blue-500/30 rounded-2xl p-8 text-center">
          <h3 className="font-bold text-xl text-white mb-3">Send Your First Invoice in 2 Minutes</h3>
          <p className="text-gray-400 mb-6">SlateInvoice makes professional invoicing fast — auto-numbered, beautifully formatted, ready to send. Plans start at $7/month.</p>
          <Link href="/signup" className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors">
            Start Free →
          </Link>
        </div>
      </article>

      <footer className="border-t border-gray-800 py-8 text-center text-sm text-gray-600">
        <p>SlateInvoice · Simple invoicing for everyone · <Link href="/login" className="hover:text-gray-400">Sign in</Link> · <Link href="/blog" className="hover:text-gray-400">Blog</Link></p>
      </footer>
    </main>
  );
}
