'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Product { id: string; name: string; description: string; price: number; unit: string; }

export default function ProductsPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: 0, unit: 'item' });
  const plan = (session?.user as any)?.plan ?? 'free';

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(d => { if (Array.isArray(d)) setProducts(d); });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const res = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (res.ok) { setProducts(prev => [...prev, data]); setForm({ name: '', description: '', price: 0, unit: 'item' }); setShowForm(false); }
    setSaving(false);
  };

  if (plan === 'free') {
    return (
      <div className="p-6 max-w-2xl">
        <h1 className="text-2xl font-bold text-white mb-4">Products & Services</h1>
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-10 text-center">
          <div className="text-4xl mb-3">📦</div>
          <p className="text-white font-semibold mb-2">Pro feature</p>
          <p className="text-gray-400 text-sm mb-6">Save your services and products to quickly add them to any invoice.</p>
          <Link href="/dashboard/settings" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-colors">
            Upgrade to Pro — $5.99/mo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Products & Services</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors">+ Add Item</button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Name *" required
              className="col-span-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
            <input type="number" value={form.price} onChange={e => setForm(f => ({...f, price: parseFloat(e.target.value)||0}))} placeholder="Price"
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500" />
            <input value={form.unit} onChange={e => setForm(f => ({...f, unit: e.target.value}))} placeholder="Unit (e.g. hr)"
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
            <input value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} placeholder="Description"
              className="col-span-4 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium disabled:opacity-60">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm">Cancel</button>
          </div>
        </form>
      )}

      {products.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <div className="text-4xl mb-2">📦</div>
          <p className="text-gray-400">No products yet. Add your services above — they&apos;ll appear as suggestions in your invoice builder.</p>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-gray-800"><tr className="text-xs text-gray-500 uppercase">
              <th className="text-left p-4">Name</th><th className="text-left p-4">Description</th>
              <th className="text-right p-4">Price</th><th className="text-left p-4">Unit</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-800">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-gray-800/50">
                  <td className="p-4 text-sm text-white font-medium">{p.name}</td>
                  <td className="p-4 text-sm text-gray-400">{p.description}</td>
                  <td className="p-4 text-sm text-white text-right">${p.price.toFixed(2)}</td>
                  <td className="p-4 text-sm text-gray-400">{p.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
