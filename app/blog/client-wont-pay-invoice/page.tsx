import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'What to Do When a Client Won\'t Pay Your Invoice | SlateInvoice',
  description: 'A client is ignoring your invoice. Here\'s a step-by-step escalation strategy — from polite reminder to formal demand — that actually gets you paid.',
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
          What to Do When a Client Won&apos;t Pay Your Invoice
        </h1>
        <p className="text-gray-500 text-sm mb-12">March 2025 · 6 min read</p>

        <div className="prose prose-invert max-w-none space-y-6 text-gray-300 leading-relaxed">
          <p>You delivered the work. You sent the invoice. The due date passed. And now the client isn't responding.</p>
          <p>This is one of the most stressful situations in freelancing and small business — but it's also more common than you'd think, and there's a clear path through it. Here's what to do, step by step.</p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">First: Don't Assume the Worst</h2>
          <p>Before escalating, consider the most likely explanations for non-payment:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The invoice went to spam or the wrong email address</li>
            <li>The client is busy and genuinely forgot</li>
            <li>There's an internal approval delay on their end</li>
            <li>They have a question about the invoice and didn't ask</li>
          </ul>
          <p>Most late payments in the first 1–2 weeks fall into these categories. Approach early follow-ups assuming the best — it keeps the relationship intact and often resolves things immediately.</p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">Step 1: Send a Friendly Reminder (Day 1–3 Overdue)</h2>
          <p>A brief, non-accusatory email is all you need:</p>
          <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-400 my-4">
            "Hi [Name], just following up on Invoice #[number] for $[amount], which was due on [date]. Please let me know if you have any questions or need me to resend it. Happy to help make payment easy."
          </blockquote>
          <p>Keep it short. Keep it friendly. Attach the invoice again. Many clients pay immediately after this email.</p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">Step 2: Follow Up More Directly (Day 7–10 Overdue)</h2>
          <p>If the first reminder got no response, follow up again — this time slightly more direct:</p>
          <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-400 my-4">
            "Hi [Name], I'm following up again on Invoice #[number] for $[amount], now [X] days past due. Could you please confirm when this will be processed? I'd like to get this resolved as soon as possible."
          </blockquote>
          <p>This email signals that you're tracking the situation and won't let it slide. Still professional, but clear about the expectation.</p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">Step 3: Call or Message Directly (Day 14 Overdue)</h2>
          <p>Email is easy to ignore. A phone call or direct message is harder to avoid. If you have a phone number or a way to reach the client outside of email, use it.</p>
          <p>Keep the call factual and calm. "I'm calling about Invoice #[number] for $[amount] — it's been two weeks past due and I haven't been able to get a response by email. I wanted to make sure everything is okay and get a sense of when I can expect payment."</p>
          <p>Many situations resolve here. The client is often embarrassed about the delay and will commit to a specific date.</p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">Step 4: Send a Formal Demand Letter (Day 30 Overdue)</h2>
          <p>If you've had no response or empty promises by the 30-day mark, it's time to formalize. A demand letter is a written notice stating:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The amount owed and invoice number</li>
            <li>The original due date and how many days it's overdue</li>
            <li>Any late fees that have accrued (per your original terms)</li>
            <li>A final deadline to pay (typically 7–14 days)</li>
            <li>The next steps you'll take if payment isn't received (small claims court, collections, etc.)</li>
          </ul>
          <p>Send it by email and, if possible, by certified mail. The formality of a demand letter often breaks a stalemate that email conversations couldn't.</p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">Step 5: Small Claims Court</h2>
          <p>For amounts under $5,000–$10,000 (varies by state), small claims court is a legitimate and relatively simple option. Filing fees are usually $30–$100. You don't need a lawyer. You present your invoices, your contract, and your documentation of attempts to collect.</p>
          <p>Many clients pay when they receive a summons — the cost and hassle of showing up to court motivates resolution. If they don't pay and you win the judgment, you can pursue wage garnishment or bank levies to collect.</p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">Step 6: Collections Agency (For Larger Amounts)</h2>
          <p>For larger amounts or clients who have judgment-proof assets, a collections agency can pursue payment on your behalf. They typically take 25–50% of what they collect — but 50% of something is better than 100% of nothing.</p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">What Not to Do</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-white">Don't threaten or harass.</strong> Keep every communication professional. You may need these emails as evidence later.</li>
            <li><strong className="text-white">Don't continue working for free.</strong> If a client owes you money and is asking for more work, stop until the balance is resolved.</li>
            <li><strong className="text-white">Don't give up too early.</strong> Most freelancers abandon collection after the first non-response. Persistence works.</li>
            <li><strong className="text-white">Don't publicly shame clients online</strong> before exhausting other options — it can expose you to defamation claims and usually doesn't help.</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">How to Prevent This Next Time</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Require a deposit (25–50%) before starting work</li>
            <li>Include late fee terms in your contract and on every invoice</li>
            <li>Use invoicing software with payment links — the easier you make it to pay, the fewer excuses there are not to</li>
            <li>Do a brief credit/reputation check on new clients before large projects</li>
          </ul>
        </div>

        <div className="mt-16 bg-blue-600/10 border border-blue-500/30 rounded-2xl p-8 text-center">
          <h3 className="font-bold text-xl text-white mb-3">Make Payment Easy — Get Paid Faster</h3>
          <p className="text-gray-400 mb-6">SlateInvoice includes payment links, automatic reminders, and invoice tracking so fewer invoices go past due in the first place. Plans start at $7/month.</p>
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
