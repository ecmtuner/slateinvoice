'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Invoice {
  id: string; number: string; toName: string; total: number;
  status: string; issueDate: string; dueDate: string; currency: string; type: string;
}

const statusColor: Record<string, string> = {
  draft: 'text-gray-400 bg-gray-800',
  sent: 'text-blue-400 bg-blue-900/30',
  paid: 'text-green-400 bg-green-900/30',
  overdue: 'text-red-400 bg-red-900/30',
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/invoices').then(r => r.json()).then(d => { if (Array.isArray(d)) setInvoices(d); });
  }, []);

  const markPaid = async (id: string) => {
    await fetch(`/api/invoices/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'paid' }) });
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status: 'paid' } : i));
  };

  const filtered = filter === 'all' ? invoices : invoices.filter(i => i.status === filter);

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Invoices</h1>
        <Link href="/dashboard/invoices/new" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors">
          + New Invoice
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'draft', 'sent', 'paid', 'overdue'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${filter === s ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <div className="text-4xl mb-3">🧾</div>
          <p className="text-gray-400 mb-4">No invoices found.</p>
          <Link href="/dashboard/invoices/new" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors">
            Create Your First Invoice
          </Link>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-gray-800">
              <tr className="text-xs text-gray-500 uppercase">
                <th className="text-left p-4">Invoice #</th>
                <th className="text-left p-4">Client</th>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Due</th>
                <th className="text-right p-4">Amount</th>
                <th className="text-center p-4">Status</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.map(inv => (
                <tr key={inv.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="p-4">
                    <Link href={`/dashboard/invoices/${inv.id}`} className="text-blue-400 hover:text-blue-300 font-medium text-sm">{inv.number}</Link>
                  </td>
                  <td className="p-4 text-sm text-gray-300">{inv.toName || '—'}</td>
                  <td className="p-4 text-sm text-gray-400">{inv.issueDate}</td>
                  <td className="p-4 text-sm text-gray-400">{inv.dueDate || '—'}</td>
                  <td className="p-4 text-right text-sm font-semibold text-white">{inv.currency} {inv.total.toFixed(2)}</td>
                  <td className="p-4 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColor[inv.status] || statusColor.draft}`}>{inv.status}</span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {inv.status !== 'paid' && (
                        <button onClick={() => markPaid(inv.id)} className="text-xs text-green-400 hover:text-green-300 bg-green-900/20 px-2 py-1 rounded">
                          Mark Paid
                        </button>
                      )}
                      <Link href={`/dashboard/invoices/${inv.id}`} className="text-xs text-gray-400 hover:text-white">View →</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
