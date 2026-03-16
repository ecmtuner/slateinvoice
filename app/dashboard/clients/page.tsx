'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Client { id: string; name: string; company: string; email: string; phone: string; totalEarned: number; }

export default function ClientsPage() {
  const { data: session } = useSession();
  const [clients, setClients] = useState<Client[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', address: '' });
  const plan = (session?.user as any)?.plan ?? 'free';

  useEffect(() => {
    fetch('/api/clients').then(r => r.json()).then(d => { if (Array.isArray(d)) setClients(d); });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError('');
    const res = await fetch('/api/clients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (!res.ok) { setError(data.error || 'Failed to save'); setSaving(false); return; }
    setClients(prev => [...prev, data]);
    setForm({ name: '', company: '', email: '', phone: '', address: '' });
    setShowForm(false); setSaving(false);
  };

  const deleteClient = async (id: string) => {
    if (!confirm('Delete this client?')) return;
    await fetch(`/api/clients/${id}`, { method: 'DELETE' });
    setClients(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Clients</h1>
          {plan === 'free' && <p className="text-sm text-gray-500">{clients.length}/3 clients (free tier)</p>}
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors">
          + Add Client
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6 space-y-3">
          <h3 className="font-semibold text-white mb-2">New Client</h3>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[['name','Name *'],['company','Company'],['email','Email'],['phone','Phone'],['address','Address']].map(([k, label]) => (
              <input key={k} value={form[k as keyof typeof form]} onChange={e => setForm(f => ({...f, [k]: e.target.value}))}
                placeholder={label} required={k === 'name'}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
            ))}
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium disabled:opacity-60">
              {saving ? 'Saving...' : 'Save Client'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm">Cancel</button>
          </div>
        </form>
      )}

      {clients.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <div className="text-4xl mb-3">👥</div>
          <p className="text-gray-400">No clients yet. Add your first client above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map(c => (
            <div key={c.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-white">{c.name}</p>
                  {c.company && <p className="text-xs text-gray-500">{c.company}</p>}
                </div>
                <button onClick={() => deleteClient(c.id)} className="text-gray-600 hover:text-red-400 text-sm">×</button>
              </div>
              <p className="text-sm text-gray-400">{c.email}</p>
              <p className="text-sm text-gray-400">{c.phone}</p>
              <div className="mt-3 pt-3 border-t border-gray-800 flex items-center justify-between">
                <span className="text-xs text-gray-500">Lifetime earnings</span>
                <span className="text-sm font-semibold text-green-400">${c.totalEarned.toFixed(2)}</span>
              </div>
              <Link href={`/dashboard/invoices/new?clientId=${c.id}`} className="mt-2 block text-center text-xs text-blue-400 hover:text-blue-300">
                + New Invoice
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
