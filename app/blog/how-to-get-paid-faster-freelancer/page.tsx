import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How to Get Paid Faster as a Freelancer | SlateInvoice',
  description: 'Late payments hurt your cash flow. Here are proven invoicing practices, payment term strategies, and follow-up tactics that get you paid faster.',
};

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '40px 20px', lineHeight: '1.8' }}>
        <div style={{ marginBottom: '12px' }}>
          <Link href="/blog" className="text-blue-400 text-sm hover:underline">← Back to Blog</Link>
        </div>
        <h1 className="text-4xl font-bold mb-2">How to Get Paid Faster as a Freelancer</h1>
        <p className="text-gray-400 text-sm mb-10">March 2025 · 8 min read</p>

        <p className="mb-4">Late payments are one of the most common and damaging problems freelancers face. You do the work, you send the invoice, and then you wait. And wait. And chase. And wait again. The good news: most late payment problems are preventable.</p>

        <h2 className="text-2xl font-bold mt-10 mb-4">Set Clear Payment Terms Before You Start</h2>
        <p className="mb-4">The biggest driver of late payments isn&apos;t bad clients — it&apos;s ambiguous expectations. Fix this before you start any project. In your contract or proposal, specify:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Payment schedule (upfront deposit, milestone payments, or net terms)</li>
          <li>Due date structure (Net 15, Net 30, or &quot;due upon receipt&quot;)</li>
          <li>Late fee policy (&quot;A 1.5% monthly fee applies after the due date&quot;)</li>
          <li>Accepted payment methods</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-4">Require a Deposit</h2>
        <p className="mb-4">Asking for 25–50% upfront is standard practice. It filters out non-serious clients and gets money in your account before you&apos;ve done all the work. Some freelancers require 100% upfront for smaller projects or first-time clients. Frame it as your standard process, not a personal trust issue.</p>

        <h2 className="text-2xl font-bold mt-10 mb-4">Invoice Immediately</h2>
        <p className="mb-4">The moment a project milestone is complete — or the work is delivered — send the invoice. Delays in invoicing translate directly to delays in payment. If you&apos;re sending Net 30 invoices, every day you wait to send is a day added to when you&apos;ll receive payment.</p>

        <h2 className="text-2xl font-bold mt-10 mb-4">Make Paying Easy</h2>
        <p className="mb-2">Every friction point between &quot;client sees invoice&quot; and &quot;client pays&quot; delays your money:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Include a payment link directly in the invoice</li>
          <li>Accept multiple payment methods</li>
          <li>Include all payment instructions on the invoice itself</li>
          <li>Send invoices as PDFs so they&apos;re easy to forward to accounts payable</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-4">Follow Up Before the Due Date</h2>
        <p className="mb-4">A friendly reminder a few days before the due date is completely professional. It prompts clients who&apos;ve simply forgotten and signals that you&apos;re watching the due date.</p>

        <h2 className="text-2xl font-bold mt-10 mb-4">Have a Follow-Up System for Overdue Invoices</h2>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li><strong>Day 1 overdue:</strong> Friendly reminder email</li>
          <li><strong>Day 7 overdue:</strong> Second email, slightly more direct, reference late fee</li>
          <li><strong>Day 14 overdue:</strong> Phone call or formal email</li>
          <li><strong>Day 30 overdue:</strong> Final notice, pause on active work</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-4">Use Payment Terms That Reduce Your Exposure</h2>
        <p className="mb-4">Net 30 is the default but not always the best. Consider Net 15 for smaller projects, 50% upfront / 50% on delivery for project work, weekly invoicing for retainer clients, or &quot;due upon receipt&quot; for small one-time gigs.</p>

        <h2 className="text-2xl font-bold mt-10 mb-4">Automate Where You Can</h2>
        <p className="mb-4">Manual invoicing and follow-up is a full-time job if you have enough clients. Invoicing software that sends automatic payment reminders takes the mental load off your plate entirely.</p>

        <div className="mt-12 p-6 bg-blue-950 rounded-xl border border-blue-800">
          <p className="font-bold text-lg mb-2">SlateInvoice automates invoice reminders, tracks payment status, and accepts online payments directly.</p>
          <p className="text-gray-300 mb-4">Spend less time chasing money and more time doing the work. Plans start at $7/month.</p>
          <Link href="https://slateinvoice.com" className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors">Get Paid Faster with SlateInvoice</Link>
        </div>
      </div>
    </div>
  );
}
