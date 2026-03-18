import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Invoice vs Receipt: What\'s the Difference? | SlateInvoice',
  description: 'Invoices and receipts aren\'t the same thing — and mixing them up can cause real problems. Here\'s the clear difference, with examples.',
};

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '40px 20px', lineHeight: '1.8' }}>
        <div style={{ marginBottom: '12px' }}>
          <Link href="/blog" className="text-blue-400 text-sm hover:underline">← Back to Blog</Link>
        </div>
        <h1 className="text-4xl font-bold mb-2">Invoice vs Receipt: What&apos;s the Difference?</h1>
        <p className="text-gray-400 text-sm mb-10">March 2025 · 6 min read</p>

        <p className="mb-4">People mix these up constantly, and it matters more than you&apos;d think. Sending the wrong document at the wrong time looks unprofessional. More importantly, they serve entirely different purposes in business accounting.</p>

        <h2 className="text-2xl font-bold mt-10 mb-4">The Core Difference</h2>
        <p className="mb-4"><strong>An invoice is a request for payment.</strong> It&apos;s sent before payment is made — or at the time of delivery — and tells the client what they owe, for what, and by when.</p>
        <p className="mb-4"><strong>A receipt is a confirmation that payment was received.</strong> It&apos;s issued after payment and documents that the transaction is complete.</p>
        <p className="mb-4">Invoice → &quot;Please pay me.&quot; Receipt → &quot;You paid me. Here&apos;s your proof.&quot;</p>

        <h2 className="text-2xl font-bold mt-10 mb-4">When to Use an Invoice</h2>
        <p className="mb-2">Issue an invoice when:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>You&apos;ve completed work and are requesting payment</li>
          <li>You&apos;re billing on Net 30/60 terms</li>
          <li>A client pays by check, bank transfer, or credit card after the fact</li>
          <li>You&apos;re tracking accounts receivable (who owes you what)</li>
        </ul>
        <p className="mb-4">Invoices are forward-facing documents. They create a legal obligation to pay by a certain date.</p>

        <h2 className="text-2xl font-bold mt-10 mb-4">When to Issue a Receipt</h2>
        <p className="mb-2">Issue a receipt when:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Payment has been made and confirmed</li>
          <li>A customer pays at point of sale</li>
          <li>Someone requests written proof they paid you</li>
          <li>You want to close the transaction record</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-4">Why This Matters for Business Records</h2>
        <p className="mb-4"><strong>For you:</strong> Invoices tell you what&apos;s owed. Receipts tell you what&apos;s been received. If you&apos;re only tracking one or the other, your books are incomplete.</p>
        <p className="mb-4"><strong>For your clients:</strong> They need receipts for their own bookkeeping — to record expenses and potentially support tax deductions.</p>
        <p className="mb-4"><strong>For taxes:</strong> Both documents are important for your tax records. Invoices establish revenue. Receipts confirm collection. Auditors look at both.</p>

        <h2 className="text-2xl font-bold mt-10 mb-4">Can an Invoice Double as a Receipt?</h2>
        <p className="mb-4">Sometimes. When a client pays immediately upon receiving an invoice (say, paying online via a payment link), the invoice with a &quot;PAID&quot; stamp becomes a receipt equivalent. Many invoicing platforms automatically generate a payment confirmation that serves this dual purpose. But for clients on payment terms — Net 30, milestone billing — keep them separate.</p>

        <h2 className="text-2xl font-bold mt-10 mb-4">Using Software to Manage Both</h2>
        <p className="mb-4">Manually tracking invoices and receipts across email threads is how things fall through the cracks. Good invoicing software tracks invoice status, records payments, and generates receipts automatically when a payment is logged.</p>

        <div className="mt-12 p-6 bg-blue-950 rounded-xl border border-blue-800">
          <p className="font-bold text-lg mb-2">SlateInvoice handles invoices, payment tracking, and receipts in one place.</p>
          <p className="text-gray-300 mb-4">No spreadsheets, no confusion about what&apos;s paid and what isn&apos;t. Plans start at $7/month.</p>
          <Link href="https://slateinvoice.com" className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors">Try SlateInvoice</Link>
        </div>
      </div>
    </div>
  );
}
