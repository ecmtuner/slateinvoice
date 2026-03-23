'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import TemplateSelector from '@/components/TemplateSelector';

interface Client { id: string; name: string; company: string; email: string; phone: string; address: string; }
interface Product { id: string; name: string; price: number; unit: string; }
interface LineItem { description: string; qty: number; unitPrice: number; amount: number; }

const CURRENCIES = ['USD','EUR','GBP','CAD','AUD','JPY','CHF','MXN'];
const DUE_TERMS = [
  { label: 'Due on Receipt', days: 0 },
  { label: 'Net 15', days: 15 },
  { label: 'Net 30', days: 30 },
  { label: 'Net 60', days: 60 },
];

function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function NewInvoiceInner() {
  const router = useRouter();
  const params = useSearchParams();
  const type = params.get('type') || 'invoice';

  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    fromName: '', fromEmail: '', fromPhone: '', fromAddress: '',
    toName: '', toEmail: '', toPhone: '', toAddress: '',
    clientId: '',
    number: '',
    currency: 'USD',
    issueDate: today,
    dueDate: addDays(today, 30),
    taxRate: 0,
    discountRate: 0,
    fees: 0,
    notes: '',
    terms: '',
    status: 'draft',
    type,
    template: 'classic',
  });

  const [items, setItems] = useState<LineItem[]>([
    { description: '', qty: 1, unitPrice: 0, amount: 0 },
  ]);

  useEffect(() => {
    fetch('/api/clients').then(r => r.json()).then(d => { if (Array.isArray(d)) setClients(d); });
    fetch('/api/products').then(r => r.json()).then(d => { if (Array.isArray(d)) setProducts(d); });
    fetch('/api/business').then(r => r.json()).then(d => {
      if (d?.name) setForm(f => ({ ...f, fromName: d.name, fromEmail: d.email, fromPhone: d.phone, fromAddress: d.address }));
    });
  }, []);

  const selectClient = (clientId: string) => {
    const c = clients.find(c => c.id === clientId);
    if (!c) return;
    setForm(f => ({ ...f, clientId, toName: c.name, toEmail: c.email, toPhone: c.phone, toAddress: c.address }));
  };

  const updateItem = (i: number, field: keyof LineItem, val: string | number) => {
    const updated = [...items];
    updated[i] = { ...updated[i], [field]: val };
    updated[i].amount = updated[i].qty * updated[i].unitPrice;
    setItems(updated);
  };

  const addItem = () => setItems([...items, { description: '', qty: 1, unitPrice: 0, amount: 0 }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));

  const subtotal = items.reduce((s, i) => s + i.amount, 0);
  const discountAmount = subtotal * (form.discountRate / 100);
  const taxAmount = (subtotal - discountAmount) * (form.taxRate / 100);
  const total = subtotal - discountAmount + taxAmount + Number(form.fees);

  const applyTerms = (days: number) => {
    setForm(f => ({ ...f, dueDate: addDays(f.issueDate, days) }));
  };

  const handleSave = async (status: string) => {
    setSaving(true); setError('');
    const res = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form, status,
        subtotal, taxAmount, discountAmount: discountAmount, total,
        items: items.filter(i => i.description.trim()),
      }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || 'Failed to save'); setSaving(false); return; }
    router.push(`/dashboard/invoices/${data.id}`);
  };

  const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">New {typeLabel}</h1>
        <div className="flex gap-2">
          <button onClick={() => handleSave('draft')} disabled={saving} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm font-medium disabled:opacity-60 transition-colors">
            Save Draft
          </button>
          <button onClick={() => handleSave('sent')} disabled={saving} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium disabled:opacity-60 transition-colors">
            {saving ? 'Saving...' : `Send ${typeLabel}`}
          </button>
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-xl text-red-300 text-sm">{error}</div>}

      <div className="space-y-6">
        {/* Template Selector */}
        <TemplateSelector value={form.template} onChange={t => setForm(f => ({ ...f, template: t }))} />

        {/* From / To */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">From (Your Business)</h3>
            <div className="space-y-2">
              {(['fromName','fromEmail','fromPhone','fromAddress'] as const).map(k => (
                <input key={k} value={form[k]} onChange={e => setForm(f => ({...f, [k]: e.target.value}))}
                  placeholder={k.replace('from','').replace(/([A-Z])/g,' $1').trim()}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
              ))}
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">Bill To</h3>
            <select value={form.clientId} onChange={e => selectClient(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white mb-2 focus:outline-none focus:border-blue-500">
              <option value="">Select saved client...</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}{c.company ? ` (${c.company})` : ''}</option>)}
            </select>
            <div className="space-y-2">
              {(['toName','toEmail','toPhone','toAddress'] as const).map(k => (
                <input key={k} value={form[k]} onChange={e => setForm(f => ({...f, [k]: e.target.value}))}
                  placeholder={k.replace('to','').replace(/([A-Z])/g,' $1').trim()}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
              ))}
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">{typeLabel} Number</label>
              <input value={form.number} onChange={e => setForm(f => ({...f, number: e.target.value}))} placeholder="Auto"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Currency</label>
              <select value={form.currency} onChange={e => setForm(f => ({...f, currency: e.target.value}))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500">
                {CURRENCIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Issue Date</label>
              <input type="date" value={form.issueDate} onChange={e => setForm(f => ({...f, issueDate: e.target.value}))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Due Date</label>
              <input type="date" value={form.dueDate} onChange={e => setForm(f => ({...f, dueDate: e.target.value}))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500" />
              <div className="flex gap-1 mt-1 flex-wrap">
                {DUE_TERMS.map(t => (
                  <button key={t.label} onClick={() => applyTerms(t.days)} className="text-xs text-blue-400 hover:text-blue-300">
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-400 uppercase mb-4">Line Items</h3>
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-5">
                  <input value={item.description} onChange={e => updateItem(i, 'description', e.target.value)}
                    placeholder="Description" list={`products-${i}`}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                  <datalist id={`products-${i}`}>
                    {products.map(p => <option key={p.id} value={p.name} />)}
                  </datalist>
                </div>
                <div className="col-span-2">
                  <input type="number" value={item.qty} onChange={e => updateItem(i, 'qty', parseFloat(e.target.value) || 0)}
                    placeholder="Qty" min="0"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div className="col-span-2">
                  <input type="number" value={item.unitPrice} onChange={e => updateItem(i, 'unitPrice', parseFloat(e.target.value) || 0)}
                    placeholder="Price" min="0"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div className="col-span-2 text-right text-sm font-medium text-white">
                  {form.currency} {item.amount.toFixed(2)}
                </div>
                <div className="col-span-1 text-right">
                  <button onClick={() => removeItem(i)} className="text-gray-600 hover:text-red-400 text-lg">×</button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={addItem} className="mt-3 text-sm text-blue-400 hover:text-blue-300">+ Add line item</button>

          {/* Totals */}
          <div className="mt-6 border-t border-gray-800 pt-4 space-y-2 max-w-xs ml-auto">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Subtotal</span><span className="text-white">{form.currency} {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span>Discount (%)</span>
              <input type="number" value={form.discountRate} onChange={e => setForm(f => ({...f, discountRate: parseFloat(e.target.value)||0}))}
                className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-white text-right focus:outline-none focus:border-blue-500" min="0" max="100" />
            </div>
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span>Tax (%)</span>
              <input type="number" value={form.taxRate} onChange={e => setForm(f => ({...f, taxRate: parseFloat(e.target.value)||0}))}
                className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-white text-right focus:outline-none focus:border-blue-500" min="0" max="100" />
            </div>
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span>Additional Fees</span>
              <input type="number" value={form.fees} onChange={e => setForm(f => ({...f, fees: parseFloat(e.target.value)||0}))}
                className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-white text-right focus:outline-none focus:border-blue-500" min="0" />
            </div>
            <div className="flex justify-between text-base font-bold text-white border-t border-gray-700 pt-2">
              <span>Total</span><span>{form.currency} {total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Notes & Terms */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <label className="text-xs text-gray-500 uppercase mb-2 block">Notes</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))}
              placeholder="Thank you for your business!" rows={3}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none" />
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <label className="text-xs text-gray-500 uppercase mb-2 block">Terms & Conditions</label>
            <textarea value={form.terms} onChange={e => setForm(f => ({...f, terms: e.target.value}))}
              placeholder="Payment due within 30 days..." rows={3}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none" />
          </div>
        </div>

        {/* Save buttons */}
        <div className="flex gap-3 justify-end">
          <button onClick={() => handleSave('draft')} disabled={saving} className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium disabled:opacity-60 transition-colors">
            Save as Draft
          </button>
          <button onClick={() => handleSave('sent')} disabled={saving} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold disabled:opacity-60 transition-colors">
            {saving ? 'Saving...' : `Send ${typeLabel}`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NewInvoicePage() {
  return (
    <Suspense fallback={<div className="p-6 text-gray-400">Loading...</div>}>
      <NewInvoiceInner />
    </Suspense>
  );
}
