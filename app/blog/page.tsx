import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Invoicing & Freelance Business Blog | SlateInvoice',
  description: 'Practical guides on invoicing, getting paid faster, and running your freelance or small business finances. Written for real people.',
};

const posts = [
  {
    slug: 'how-to-write-a-professional-invoice',
    title: 'How to Write a Professional Invoice (Step-by-Step)',
    desc: 'A professional invoice gets you paid faster and looks credible. Here\'s exactly what to include, how to format it, and the fastest way to send one.',
    date: 'March 2025',
    readTime: '6 min read',
  },
  {
    slug: 'invoice-vs-receipt-difference',
    title: 'Invoice vs Receipt: What\'s the Difference?',
    desc: 'Invoices and receipts aren\'t the same thing — and mixing them up can cause real problems. Here\'s the clear difference, with examples.',
    date: 'March 2025',
    readTime: '5 min read',
  },
  {
    slug: 'how-to-get-paid-faster-freelancer',
    title: 'How to Get Paid Faster as a Freelancer',
    desc: 'Late payments hurt your cash flow. Here are proven invoicing practices, payment term strategies, and follow-up tactics that get you paid faster.',
    date: 'March 2025',
    readTime: '7 min read',
  },
  {
    slug: 'client-wont-pay-invoice',
    title: 'What to Do When a Client Won\'t Pay Your Invoice',
    desc: 'A client is ignoring your invoice. Here\'s a step-by-step escalation strategy — from polite reminder to formal demand — that gets you paid.',
    date: 'March 2025',
    readTime: '6 min read',
  },
  {
    slug: 'best-invoicing-software-small-business',
    title: 'Best Invoicing Software for Small Business (2025)',
    desc: 'Comparing the top invoicing tools for freelancers and small businesses. Features, pricing, and who each one is actually built for.',
    date: 'March 2025',
    readTime: '8 min read',
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <nav className="border-b border-gray-800 bg-gray-900/60 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🧾</span>
              <span className="text-xl font-bold text-white">SlateInvoice</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</Link>
            <Link href="/blog" className="text-sm text-blue-400 hover:text-white transition-colors">Blog</Link>
            <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Sign in</Link>
            <Link href="/signup" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg font-medium transition-colors">Start Free</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white mb-3">Invoicing & Business Blog</h1>
        <p className="text-gray-400 mb-12 text-lg">Practical guides on invoicing, getting paid faster, and running your freelance or small business finances.</p>

        <div className="space-y-6">
          {posts.map(p => (
            <article key={p.slug} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
              <Link href={`/blog/${p.slug}`}>
                <h2 className="font-bold text-lg text-white hover:text-blue-400 transition-colors mb-2">{p.title}</h2>
              </Link>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">{p.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">{p.date} · {p.readTime}</span>
                <Link href={`/blog/${p.slug}`} className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">Read more →</Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 bg-blue-600/10 border border-blue-500/30 rounded-2xl p-8 text-center">
          <h3 className="font-bold text-xl text-white mb-3">Ready to send your first invoice?</h3>
          <p className="text-gray-400 mb-6">Create professional invoices in under 2 minutes. Free plan available, no credit card needed.</p>
          <Link href="/signup" className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors">
            Start Free →
          </Link>
        </div>
      </div>

      <footer className="border-t border-gray-800 py-8 text-center text-sm text-gray-600">
        <p>SlateInvoice · Simple invoicing for everyone · <Link href="/login" className="hover:text-gray-400">Sign in</Link> · <Link href="/blog" className="hover:text-gray-400">Blog</Link></p>
      </footer>
    </main>
  );
}
