'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Invoice {
  id: string; number: string; toName: string; total: number;
  status: string; issueDate: string; dueDate: string; currency: string; type: string;
}

const statusConfig: Record<string, { text: string; bg: string; border: string; glow: string }> = {
  draft: { text: 'rgba(255,255,255,0.5)', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', glow: 'transparent' },
  sent: { text: '#22D3EE', bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.3)', glow: 'rgba(6,182,212,0.15)' },
  paid: { text: '#10B981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', glow: 'rgba(16,185,129,0.15)' },
  overdue: { text: '#F87171', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', glow: 'rgba(239,68,68,0.15)' },
};

const typeConfig: Record<string, { label: string; color: string; bg: string }> = {
  invoice: { label: 'Invoice', color: '#A78BFA', bg: 'rgba(139,92,246,0.1)' },
  estimate: { label: 'Estimate', color: '#F5A623', bg: 'rgba(245,166,35,0.1)' },
  receipt: { label: 'Receipt', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/invoices').then(r => r.json()).then(d => { if (Array.isArray(d)) setInvoices(d); });
  }, []);

  const markPaid = async (id: string) => {
    await fetch(`/api/invoices/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'paid' }) });
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status: 'paid' } : i));
  };

  const convertToInvoice = async (id: string) => {
    const res = await fetch(`/api/invoices/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'invoice', status: 'draft' }),
    });
    const data = await res.json();
    if (data.id) router.push(`/dashboard/invoices/${data.id}`);
  };

  const filtered = invoices.filter(i => {
    const matchStatus = statusFilter === 'all' || i.status === statusFilter;
    const matchType = typeFilter === 'all' || i.type === typeFilter;
    return matchStatus && matchType;
  });

  const btnActive = {
    background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
    border: '1px solid rgba(139,92,246,0.4)',
    color: '#fff',
    boxShadow: '0 4px 12px rgba(139,92,246,0.3)',
  };
  const btnInactive = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: 'rgba(255,255,255,0.5)',
  };

  return (
    <div className="p-6 max-w-5xl" style={{ position: 'relative', zIndex: 1 }}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-white">Invoices & Estimates</h1>
        <div className="flex gap-2">
          <Link href="/dashboard/invoices/new?type=estimate"
            className="px-4 py-2 text-white rounded-xl font-medium transition-all text-sm"
            style={{ background: 'rgba(245,166,35,0.15)', border: '1px solid rgba(245,166,35,0.3)', color: '#F5A623' }}>
            + New Estimate
          </Link>
          <Link href="/dashboard/invoices/new"
            className="px-4 py-2 text-white rounded-xl font-medium transition-all btn-primary text-sm">
            + New Invoice
          </Link>
        </div>
      </div>

      {/* Type Tabs */}
      <div className="flex gap-2 mb-3 flex-wrap">
        {[['all', 'All'], ['invoice', 'Invoices'], ['estimate', 'Estimates'], ['receipt', 'Receipts']].map(([val, label]) => (
          <button key={val} onClick={() => setTypeFilter(val)}
            className="px-3 py-1.5 rounded-lg text-sm transition-all font-medium"
            style={typeFilter === val ? btnActive : btnInactive}>
            {label}
          </button>
        ))}
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'draft', 'sent', 'paid', 'overdue'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className="px-3 py-1.5 rounded-lg text-sm capitalize transition-all font-medium"
            style={statusFilter === s ? btnActive : btnInactive}>
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl p-12 text-center"
          style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
          <div className="text-4xl mb-3">🧾</div>
          <p className="text-white/40 mb-4">No invoices found.</p>
          <Link href="/dashboard/invoices/new"
            className="inline-block px-4 py-2 text-white rounded-xl font-medium transition-all btn-primary text-sm">
            Create Your First Invoice
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
          <table className="w-full">
            <thead style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <tr className="text-xs uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>
                <th className="text-left p-4">Number</th>
                <th className="text-left p-4">Type</th>
                <th className="text-left p-4">Client</th>
                <th className="text-left p-4">Date</th>
                <th className="text-right p-4">Amount</th>
                <th className="text-center p-4">Status</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv, idx) => {
                const sc = statusConfig[inv.status] || statusConfig.draft;
                return (
                  <tr key={inv.id}
                    className="transition-all"
                    style={{ borderBottom: idx < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                    <td className="p-4">
                      <Link href={`/dashboard/invoices/${inv.id}`}
                        className="font-medium text-sm transition-colors"
                        style={{ color: '#A78BFA' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#C4B5FD'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#A78BFA'}>
                        {inv.number}
                      </Link>
                    </td>
                    <td className="p-4">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          color: typeConfig[inv.type]?.color || '#A78BFA',
                          background: typeConfig[inv.type]?.bg || 'rgba(139,92,246,0.1)',
                        }}>
                        {typeConfig[inv.type]?.label || inv.type}
                      </span>
                    </td>
                    <td className="p-4 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{inv.toName || '—'}</td>
                    <td className="p-4 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>{inv.issueDate}</td>
                    <td className="p-4 text-right text-sm font-semibold text-white">{inv.currency} {inv.total.toFixed(2)}</td>
                    <td className="p-4 text-center">
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium capitalize"
                        style={{
                          color: sc.text,
                          background: sc.bg,
                          border: `1px solid ${sc.border}`,
                          boxShadow: `0 0 10px ${sc.glow}`,
                        }}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {inv.type === 'estimate' && (
                          <button onClick={() => convertToInvoice(inv.id)}
                            className="text-xs px-2 py-1 rounded-lg transition-all"
                            style={{
                              color: '#F5A623',
                              background: 'rgba(245,166,35,0.1)',
                              border: '1px solid rgba(245,166,35,0.25)',
                            }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(245,166,35,0.2)'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(245,166,35,0.1)'}>
                            → Convert
                          </button>
                        )}
                        {inv.status !== 'paid' && inv.type !== 'estimate' && (
                          <button onClick={() => markPaid(inv.id)}
                            className="text-xs px-2 py-1 rounded-lg transition-all"
                            style={{
                              color: '#10B981',
                              background: 'rgba(16,185,129,0.1)',
                              border: '1px solid rgba(16,185,129,0.25)',
                            }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(16,185,129,0.2)'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(16,185,129,0.1)'}>
                            Mark Paid
                          </button>
                        )}
                        <Link href={`/dashboard/invoices/${inv.id}`}
                          className="text-xs transition-colors"
                          style={{ color: 'rgba(255,255,255,0.4)' }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)'}>
                          View →
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
