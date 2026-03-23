'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', currency: 'USD', terms: '', notes: '', logo: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [plan, setPlan] = useState<string>('free');
  const [periodEnd, setPeriodEnd] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sessionPlan = (session?.user as any)?.plan ?? 'free';

  useEffect(() => {
    fetch('/api/business').then(r => r.json()).then(d => {
      if (d?.userId) setForm({ name: d.name||'', email: d.email||'', phone: d.phone||'', address: d.address||'', currency: d.currency||'USD', terms: d.terms||'', notes: d.notes||'', logo: d.logo||'' });
    });
    // Fetch latest plan from DB
    fetch('/api/user/plan').then(r => r.json()).then(d => {
      if (d.plan) setPlan(d.plan);
      if (d.stripeCurrentPeriodEnd) setPeriodEnd(d.stripeCurrentPeriodEnd);
    }).catch(() => setPlan(sessionPlan));
  }, [sessionPlan]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('Logo must be under 2MB'); return; }
    setLogoUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setForm(f => ({ ...f, logo: reader.result as string }));
      setLogoUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setSaved(false);
    await fetch('/api/business', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleManageBilling = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch('/api/subscription/portal', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to open billing portal');
      }
    } catch {
      alert('Failed to open billing portal');
    } finally {
      setPortalLoading(false);
    }
  };

  const planLabel = plan === 'free' ? 'Free'
    : plan === 'starter' ? 'Starter ($7/mo)'
    : plan === 'freelancer' ? 'Freelancer ($15/mo)'
    : plan === 'business' ? 'Business ($25/mo)'
    : 'Free';

  const isPaid = plan !== 'free';

  const formatDate = (dateStr: string) => {
    try { return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); }
    catch { return dateStr; }
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
      <p className="text-gray-500 text-sm mb-8">Your business profile is used to autofill invoices.</p>

      {/* Billing section */}
      <div className={`mb-8 p-5 rounded-xl border ${isPaid ? 'bg-blue-600/10 border-blue-600/30' : 'bg-gray-900 border-gray-700'}`}>
        <h2 className="font-semibold text-white mb-3">Billing</h2>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-white font-medium">{isPaid ? `⚡ ${planLabel}` : `Free Plan`}</p>
            {isPaid ? (
              <p className="text-sm text-gray-400 mt-0.5">
                {periodEnd ? `Renews on ${formatDate(periodEnd)}` : 'Active subscription'}
              </p>
            ) : (
              <p className="text-sm text-gray-400 mt-0.5">5 invoices/month · 3 clients max</p>
            )}
          </div>
          {isPaid && <span className="text-green-400 text-sm">✓ Active</span>}
        </div>
        <div className="flex flex-wrap gap-3">
          {!isPaid && (
            <Link href="/#pricing"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-colors">
              Upgrade Plan
            </Link>
          )}
          {isPaid && (
            <button
              onClick={handleManageBilling}
              disabled={portalLoading}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors">
              {portalLoading ? 'Loading...' : 'Manage Subscription'}
            </button>
          )}
          {!isPaid && (
            <Link href="/#pricing"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300 rounded-xl text-sm font-medium transition-colors">
              See All Plans
            </Link>
          )}
        </div>
      </div>

      {/* Security section */}
      <div className="mb-8">
        <Link
          href="/dashboard/settings/security"
          className="flex items-center justify-between p-5 bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl transition-colors group"
        >
          <div>
            <h2 className="font-semibold text-white group-hover:text-indigo-300 transition-colors">🛡️ Security</h2>
            <p className="text-sm text-gray-500 mt-0.5">Two-factor authentication and account security</p>
          </div>
          <span className="text-gray-600 group-hover:text-gray-400 transition-colors">→</span>
        </Link>
      </div>

      {/* Business profile */}
      <form onSubmit={handleSave} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-white mb-2">Business Profile</h2>

        {/* Logo Upload */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">
            Business Logo
            {!isPaid && <span className="ml-2 text-yellow-500 text-xs">⚡ Starter+ only</span>}
          </label>
          {!isPaid ? (
            <div className="flex items-center gap-4 p-4 bg-gray-800 border border-dashed border-gray-600 rounded-xl">
              <div className="w-16 h-16 rounded-lg bg-gray-700 border border-gray-600 flex items-center justify-center text-gray-500 text-xs text-center leading-tight">
                🖼️<br/>Logo
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">Upload your logo to brand your invoices</p>
                <Link href="/#pricing" className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors">
                  Upgrade to add logo →
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                {form.logo ? (
                  <img src={form.logo} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-gray-500 text-xs text-center">No logo</span>
                )}
              </div>
              <div className="flex-1">
                <label className="cursor-pointer inline-block px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-xl font-medium transition-colors">
                  {logoUploading ? 'Uploading...' : form.logo ? 'Change Logo' : 'Upload Logo'}
                  <input type="file" accept="image/png,image/jpeg,image/jpg,image/svg+xml" onChange={handleLogoUpload} className="hidden" />
                </label>
                {form.logo && (
                  <button type="button" onClick={() => setForm(f => ({...f, logo: ''}))} className="ml-2 text-xs text-red-400 hover:text-red-300">Remove</button>
                )}
                <p className="text-xs text-gray-500 mt-1">PNG, JPG or SVG · Max 2MB · Square works best</p>
              </div>
            </div>
          )}
        </div>
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
