'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Invoice {
  id: string; number: string; toName: string; total: number;
  status: string; issueDate: string; dueDate: string; currency: string;
}

const statusColor: Record<string, string> = {
  draft: 'text-gray-400 bg-gray-800',
  sent: 'text-blue-400 bg-blue-900/30',
  paid: 'text-green-400 bg-green-900/30',
  overdue: 'text-red-400 bg-red-900/30',
};

export default function DashboardPage() {
  const { data: session } = useSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [plan, setPlan] = useState<string>('free');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sessionPlan = (session?.user as any)?.plan ?? 'free';

  useEffect(() => {
    fetch('/api/invoices').then(r => r.json()).then(d => { if (Array.isArray(d)) setInvoices(d); });
    // Fetch latest plan from DB (in case session is stale)
    fetch('/api/user/plan').then(r => r.json()).then(d => { if (d.plan) setPlan(d.plan); }).catch(() => setPlan(sessionPlan));
  }, [sessionPlan]);

  const outstanding = invoices.filter(i => i.status === 'sent').reduce((s, i) => s + i.total, 0);
  const paid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0);
  const overdue = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.total, 0);
  const drafts = invoices.filter(i => i.status === 'draft').length;

  // Count invoices this month for free plan usage bar
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthCount = invoices.filter(i => new Date(i.issueDate) >= monthStart || true).length;
  const limit = plan === 'free' ? 5 : plan === 'starter' ? 50 : null;

  return (
    <div className="p-6 max-w-5xl">
      {/* Upgrade banner for free users */}
      {plan === 'free' && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-600/40 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-white font-semibold">You&apos;re on the Free plan.</p>
            <p className="text-gray-400 text-sm mt-0.5">Upgrade to unlock unlimited invoices and clients.</p>
          </div>
          <Link href="/#pricing" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ml-4">
            Upgrade Plan
          </Link>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back{session?.user?.name ? `, ${session.user.name}` : ''}</p>
        </div>
        <Link href="/dashboard/invoices/new" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors">
          + New Invoice
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Outstanding', value: `$${outstanding.toFixed(2)}`, color: 'text-blue-400' },
          { label: 'Paid This Month', value: `$${paid.toFixed(2)}`, color: 'text-green-400' },
          { label: 'Overdue', value: `$${overdue.toFixed(2)}`, color: 'text-red-400' },
          { label: 'Drafts', value: String(drafts), color: 'text-gray-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Plan usage bar (free & starter) */}
      {limit !== null && (
        <div className="mb-6 p-4 bg-gray-900 border border-gray-700 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-sm text-white font-medium">{plan === 'free' ? 'Free' : 'Starter'} plan usage</p>
            <p className="text-xs text-gray-500">{monthCount}/{limit} invoices used this month</p>
            <div className="w-48 h-1.5 bg-gray-700 rounded-full mt-2">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, (monthCount / limit) * 100)}%` }} />
            </div>
          </div>
          <Link href="/#pricing" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors">
            Upgrade
          </Link>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { href: '/dashboard/invoices/new', label: 'New Invoice', icon: '🧾' },
          { href: '/dashboard/clients', label: 'Add Client', icon: '👥' },
          { href: '/dashboard/invoices', label: 'View All', icon: '📋' },
          { href: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
        ].map((a, i) => (
          <Link key={i} href={a.href} className="bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl p-4 text-center transition-colors">
            <div className="text-2xl mb-1">{a.icon}</div>
            <div className="text-sm text-gray-300">{a.label}</div>
          </Link>
        ))}
      </div>

      {/* Recent invoices */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="font-semibold text-white">Recent Invoices</h2>
          <Link href="/dashboard/invoices" className="text-sm text-blue-400 hover:text-blue-300">View all →</Link>
        </div>
        {invoices.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-3xl mb-2">🧾</div>
            <p>No invoices yet. <Link href="/dashboard/invoices/new" className="text-blue-400 hover:text-blue-300">Create your first one →</Link></p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {invoices.slice(0, 5).map(inv => (
              <Link key={inv.id} href={`/dashboard/invoices/${inv.id}`} className="flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-white">{inv.number}</p>
                  <p className="text-xs text-gray-500">{inv.toName || 'No client'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{inv.currency} {inv.total.toFixed(2)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[inv.status] || statusColor.draft}`}>{inv.status}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
