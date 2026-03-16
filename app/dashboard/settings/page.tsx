'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', currency: 'USD', terms: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const plan = (session?.user as any)?.plan ?? 'free';

  useEffect(() => {
    fetch('/api/business').then(r => r.json()).then(d => {
      if (d?.userId) setForm({ name: d.name||'', email: d.email||'', phone: d.phone||'', address: d.address||'', currency: d.currency||'USD', terms: d.terms||'', notes: d.notes||'' });
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setSaved(false);
    await fetch('/api/business', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
      <p className="text-gray-500 text-sm mb-8">Your business profile is used to autofill invoices.</p>

      {/* Plan status */}
      <div className={`mb-6 p-4 rounded-xl border flex items-center justify-between ${plan === 'pro' ? 'bg-blue-600/10 border-blue-600/30' : 'bg-gray-900 border-gray-700'}`}>
        <div>
          <p className="font-semibold text-white">{plan === 'pro' ? '⚡ Pro Plan' : 'Free Plan'}</p>
          <p className="text-sm text-gray-400">{plan === 'pro' ? 'Unlimited invoices · All features' : '3 invoices/month · 3 clients max'}</p>
        </div>
        {plan === 'free' && (
          <Link href="/#pricing" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-colors">
            See Plans
          </Link>
        )}
        {plan === 'pro' && <span className="text-green-400 text-sm">✓ Active</span>}
      </div>

      {/* Business profile */}
      <form onSubmit={handleSave} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-white mb-2">Business Profile</h2>
        {[
          { k: 'name', label: 'Business Name', placeholder: 'Acme Inc.' },
          { k: 'email', label: 'Business Email', placeholder: 'hello@acme.com' },
          { k: 'phone', label: 'Phone', placeholder: '+1 555 000 0000' },
          { k: 'address', label: 'Address', placeholder: '123 Main St, City, State' },
        ].map(({ k, label, placeholder }) => (
          <div key={k}>
            <label className="text-xs text-gray-500 mb-1 block">{label}</label>
            <input value={form[k as keyof typeof form]} onChange={e => setForm(f => ({...f, [k]: e.target.value}))}
              placeholder={placeholder}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
          </div>
        ))}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Default Currency</label>
          <select value={form.currency} onChange={e => setForm(f => ({...f, currency: e.target.value}))}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500">
            {['USD','EUR','GBP','CAD','AUD','JPY','CHF','MXN'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Default Terms</label>
          <textarea value={form.terms} onChange={e => setForm(f => ({...f, terms: e.target.value}))}
            placeholder="Payment due within 30 days..." rows={2}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none" />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Default Notes</label>
          <textarea value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))}
            placeholder="Thank you for your business!" rows={2}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none" />
        </div>
        <button type="submit" disabled={saving}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white rounded-xl font-medium transition-colors">
          {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
