'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Invoice {
  id: string; number: string; toName: string; total: number;
  status: string; issueDate: string; dueDate: string; currency: string;
}

const statusConfig: Record<string, { text: string; bg: string; border: string; glow: string }> = {
  draft: { text: 'rgba(255,255,255,0.5)', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', glow: 'transparent' },
  sent: { text: '#22D3EE', bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.3)', glow: 'rgba(6,182,212,0.2)' },
  paid: { text: '#10B981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', glow: 'rgba(16,185,129,0.2)' },
  overdue: { text: '#F87171', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', glow: 'rgba(239,68,68,0.2)' },
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [plan, setPlan] = useState<string>('free');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sessionPlan = (session?.user as any)?.plan ?? 'free';

  useEffect(() => {
    fetch('/api/invoices').then(r => r.json()).then(d => { if (Array.isArray(d)) setInvoices(d); });
    fetch('/api/user/plan').then(r => r.json()).then(d => { if (d.plan) setPlan(d.plan); }).catch(() => setPlan(sessionPlan));
  }, [sessionPlan]);

  const outstanding = invoices.filter(i => i.status === 'sent').reduce((s, i) => s + i.total, 0);
  const paid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0);
  const overdue = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.total, 0);
  const drafts = invoices.filter(i => i.status === 'draft').length;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthCount = invoices.filter(i => new Date(i.issueDate) >= monthStart || true).length;
  const limit = plan === 'free' ? 5 : plan === 'starter' ? 50 : null;

  const stats = [
    {
      label: 'Outstanding',
      value: `$${outstanding.toFixed(2)}`,
      icon: '💸',
      topColor: '#8B5CF6',
      glow: 'rgba(139,92,246,0.25)',
      textColor: '#A78BFA',
    },
    {
      label: 'Total Revenue',
      value: `$${paid.toFixed(2)}`,
      icon: '💰',
      topColor: '#06B6D4',
      glow: 'rgba(6,182,212,0.25)',
      textColor: '#22D3EE',
    },
    {
      label: 'Overdue',
      value: `$${overdue.toFixed(2)}`,
      icon: '⚠️',
      topColor: '#F59E0B',
      glow: 'rgba(245,158,11,0.25)',
      textColor: '#FCD34D',
    },
    {
      label: 'Drafts',
      value: String(drafts),
      icon: '📝',
      topColor: '#10B981',
      glow: 'rgba(16,185,129,0.25)',
      textColor: '#34D399',
    },
  ];

  return (
    <div className="p-6 max-w-5xl" style={{ position: 'relative', zIndex: 1 }}>
      {/* Upgrade banner for free users */}
      {plan === 'free' && (
        <div className="mb-6 p-4 rounded-2xl flex items-center justify-between"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(6,182,212,0.08))',
            border: '1px solid rgba(139,92,246,0.25)',
            backdropFilter: 'blur(16px)',
          }}>
          <div>
            <p className="text-white font-semibold">You&apos;re on the Free plan.</p>
            <p className="text-white/50 text-sm mt-0.5">Upgrade to unlock unlimited invoices and clients.</p>
          </div>
          <Link href="/#pricing"
            className="px-4 py-2 text-white rounded-xl text-sm font-semibold transition-all ml-4 whitespace-nowrap btn-primary">
            Upgrade Plan
          </Link>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-white/40 text-sm mt-1">Welcome back{session?.user?.name ? `, ${session.user.name}` : ''} 👋</p>
        </div>
        <Link href="/dashboard/invoices/new"
          className="px-4 py-2 text-white rounded-xl font-medium transition-all btn-primary text-sm">
          + New Invoice
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="p-5 rounded-2xl relative overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderTop: `2px solid ${stat.topColor}`,
              boxShadow: `0 4px 20px ${stat.glow}`,
            }}>
            <div className="text-xl mb-2">{stat.icon}</div>
            <p className="text-xs text-white/40 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold" style={{ color: stat.textColor }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Plan usage bar (free & starter) */}
      {limit !== null && (
        <div className="mb-6 p-4 rounded-2xl flex items-center justify-between"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
          <div>
            <p className="text-sm text-white font-medium">{plan === 'free' ? 'Free' : 'Starter'} plan usage</p>
            <p className="text-xs text-white/40">{monthCount}/{limit} invoices used this month</p>
            <div className="w-48 h-1.5 rounded-full mt-2" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(100, (monthCount / limit) * 100)}%`,
                  background: 'linear-gradient(90deg, #7C3AED, #06B6D4)',
                }} />
            </div>
          </div>
          <Link href="/#pricing"
            className="px-4 py-2 text-white text-sm rounded-lg transition-all btn-primary">
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
          <Link key={i} href={a.href}
            className="p-4 rounded-xl text-center transition-all hover:-translate-y-0.5 glass-card">
            <div className="text-2xl mb-1">{a.icon}</div>
            <div className="text-sm text-white/70">{a.label}</div>
          </Link>
        ))}
      </div>

      {/* Recent invoices */}
      <div className="rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
        <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="font-semibold text-white">Recent Invoices</h2>
          <Link href="/dashboard/invoices" className="text-sm transition-colors" style={{ color: '#A78BFA' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#C4B5FD'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#A78BFA'}>
            View all →
          </Link>
        </div>
        {invoices.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-3xl mb-2">🧾</div>
            <p className="text-white/40">No invoices yet. <Link href="/dashboard/invoices/new" className="text-violet-400 hover:text-violet-300 transition-colors">Create your first one →</Link></p>
          </div>
        ) : (
          <div>
            {invoices.slice(0, 5).map(inv => {
              const sc = statusConfig[inv.status] || statusConfig.draft;
              return (
                <Link key={inv.id} href={`/dashboard/invoices/${inv.id}`}
                  className="flex items-center justify-between p-4 transition-all"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                  <div>
                    <p className="text-sm font-medium text-white">{inv.number}</p>
                    <p className="text-xs text-white/40">{inv.toName || 'No client'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">{inv.currency} {inv.total.toFixed(2)}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                      style={{
                        color: sc.text,
                        background: sc.bg,
                        border: `1px solid ${sc.border}`,
                        boxShadow: `0 0 8px ${sc.glow}`,
                      }}>
                      {inv.status}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
