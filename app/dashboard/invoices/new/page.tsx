'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import TemplateSelector from '@/components/TemplateSelector';
import Link from 'next/link';

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

const glassCard = {
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '16px',
};

const inputStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: '10px',
  color: '#fff',
  outline: 'none',
  width: '100%',
  padding: '10px 12px',
  fontSize: '14px',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
};

function GlassInput({ value, onChange, placeholder, type = 'text', min, max, list }: {
  value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; type?: string; min?: string; max?: string; list?: string;
}) {
  return (
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder}
      min={min} max={max} list={list}
      style={inputStyle}
      onFocus={e => {
        e.target.style.borderColor = 'rgba(139,92,246,0.6)';
        e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.15)';
      }}
      onBlur={e => {
        e.target.style.borderColor = 'rgba(255,255,255,0.10)';
        e.target.style.boxShadow = 'none';
      }}
      className="placeholder-white/30"
    />
  );
}

function GlassSelect({ value, onChange, children }: {
  value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode;
}) {
  return (
    <select value={value} onChange={onChange}
      style={{ ...inputStyle, cursor: 'pointer' }}
      onFocus={e => {
        e.target.style.borderColor = 'rgba(139,92,246,0.6)';
        e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.15)';
      }}
      onBlur={e => {
        e.target.style.borderColor = 'rgba(255,255,255,0.10)';
        e.target.style.boxShadow = 'none';
      }}>
      {children}
    </select>
  );
}

function GlassTextarea({ value, onChange, placeholder, rows }: {
  value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string; rows?: number;
}) {
  return (
    <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows}
      style={{ ...inputStyle, resize: 'none' } as React.CSSProperties}
      onFocus={e => {
        e.target.style.borderColor = 'rgba(139,92,246,0.6)';
        e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.15)';
      }}
      onBlur={e => {
        e.target.style.borderColor = 'rgba(255,255,255,0.10)';
        e.target.style.boxShadow = 'none';
      }}
      className="placeholder-white/30"
    />
  );
}

function NewInvoiceInner() {
  const router = useRouter();
  const params = useSearchParams();
  const type = params.get('type') || 'invoice';

  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [userPlan, setUserPlan] = useState('free');

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
    fetch('/api/user/plan').then(r => r.json()).then(d => { if (d.plan) setUserPlan(d.plan); });
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
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          clientId: form.clientId || null,
          status,
          subtotal, taxAmount, discountAmount: discountAmount, total,
          items: items.filter(i => i.description.trim()),
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to save'); setSaving(false); return; }
      router.push(`/dashboard/invoices/${data.id}`);
    } catch (err: unknown) {
      const e = err as { name?: string };
      setError(e.name === 'AbortError' ? 'Request timed out — please try again' : 'Something went wrong. Please try again.');
      setSaving(false);
    }
  };

  const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);

  const sectionHeader = (text: string) => (
    <h3 className="text-xs font-semibold uppercase mb-4 tracking-wider"
      style={{ background: 'linear-gradient(90deg, #A78BFA, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
      {text}
    </h3>
  );

  return (
    <div className="p-6 max-w-4xl" style={{ position: 'relative', zIndex: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">New {typeLabel}</h1>
        <div className="flex gap-2">
          <button onClick={() => handleSave('draft')} disabled={saving}
            className="px-4 py-2 text-white/70 rounded-xl text-sm font-medium disabled:opacity-60 transition-all hover:text-white"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}>
            Save Draft
          </button>
          <button onClick={() => handleSave('sent')} disabled={saving}
            className="px-4 py-2 text-white rounded-xl text-sm font-medium disabled:opacity-60 transition-all btn-primary">
            {saving ? 'Saving...' : `Send ${typeLabel}`}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl text-sm"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#FCA5A5' }}>
          {error}
        </div>
      )}

      <div className="space-y-5">
        {/* Template Selector */}
        <TemplateSelector value={form.template} onChange={t => setForm(f => ({ ...f, template: t }))} />

        {/* From / To */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="p-5" style={glassCard}>
            {sectionHeader('From (Your Business)')}
            <div className="space-y-2.5">
              {(['fromName','fromEmail','fromPhone','fromAddress'] as const).map(k => (
                <GlassInput key={k} value={form[k]}
                  onChange={e => setForm(f => ({...f, [k]: e.target.value}))}
                  placeholder={k.replace('from','').replace(/([A-Z])/g,' $1').trim()} />
              ))}
            </div>
          </div>
          <div className="p-5" style={glassCard}>
            {sectionHeader('Bill To')}
            <div className="mb-2.5">
              <GlassSelect value={form.clientId} onChange={e => selectClient(e.target.value)}>
                <option value="" style={{ background: '#1a0035' }}>Select saved client...</option>
                {clients.map(c => <option key={c.id} value={c.id} style={{ background: '#1a0035' }}>{c.name}{c.company ? ` (${c.company})` : ''}</option>)}
              </GlassSelect>
            </div>
            <div className="space-y-2.5">
              {(['toName','toEmail','toPhone','toAddress'] as const).map(k => (
                <GlassInput key={k} value={form[k]}
                  onChange={e => setForm(f => ({...f, [k]: e.target.value}))}
                  placeholder={k.replace('to','').replace(/([A-Z])/g,' $1').trim()} />
              ))}
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="p-5" style={glassCard}>
          {sectionHeader('Invoice Details')}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">{typeLabel} Number</label>
              <GlassInput value={form.number} onChange={e => setForm(f => ({...f, number: e.target.value}))} placeholder="Auto" />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">Currency</label>
              <GlassSelect value={form.currency} onChange={e => setForm(f => ({...f, currency: e.target.value}))}>
                {CURRENCIES.map(c => <option key={c} style={{ background: '#1a0035' }}>{c}</option>)}
              </GlassSelect>
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">Issue Date</label>
              <GlassInput type="date" value={form.issueDate} onChange={e => setForm(f => ({...f, issueDate: e.target.value}))} />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">Due Date</label>
              <GlassInput type="date" value={form.dueDate} onChange={e => setForm(f => ({...f, dueDate: e.target.value}))} />
              <div className="flex gap-2 mt-1.5 flex-wrap">
                {DUE_TERMS.map(t => (
                  <button key={t.label} onClick={() => applyTerms(t.days)}
                    className="text-xs transition-colors"
                    style={{ color: '#A78BFA' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#C4B5FD'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#A78BFA'}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="p-5" style={glassCard}>
          {sectionHeader('Line Items')}
          <div className="space-y-2.5">
            {items.map((item, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center p-2.5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="col-span-5">
                  <GlassInput value={item.description}
                    onChange={e => updateItem(i, 'description', e.target.value)}
                    placeholder="Description" list={`products-${i}`} />
                  <datalist id={`products-${i}`}>
                    {products.map(p => <option key={p.id} value={p.name} />)}
                  </datalist>
                </div>
                <div className="col-span-2">
                  <GlassInput type="number" value={item.qty}
                    onChange={e => updateItem(i, 'qty', parseFloat(e.target.value) || 0)}
                    placeholder="Qty" min="0" />
                </div>
                <div className="col-span-2">
                  <GlassInput type="number" value={item.unitPrice}
                    onChange={e => updateItem(i, 'unitPrice', parseFloat(e.target.value) || 0)}
                    placeholder="Price" min="0" />
                </div>
                <div className="col-span-2 text-right text-sm font-medium text-white">
                  {form.currency} {item.amount.toFixed(2)}
                </div>
                <div className="col-span-1 text-right">
                  <button onClick={() => removeItem(i)}
                    className="text-white/20 hover:text-red-400 text-xl transition-colors leading-none">
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={addItem}
            className="mt-3 text-sm transition-colors"
            style={{ color: '#A78BFA' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#C4B5FD'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#A78BFA'}>
            + Add line item
          </button>

          {/* Totals */}
          <div className="mt-6 pt-4 space-y-3 max-w-xs ml-auto"
            style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex justify-between text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <span>Subtotal</span><span className="text-white">{form.currency} {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <span>Discount (%)</span>
              <input type="number" value={form.discountRate}
                onChange={e => setForm(f => ({...f, discountRate: parseFloat(e.target.value)||0}))}
                min="0" max="100"
                style={{ ...inputStyle, width: '80px', padding: '4px 8px', textAlign: 'right' }}
                onFocus={e => { e.target.style.borderColor = 'rgba(139,92,246,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.10)'; e.target.style.boxShadow = 'none'; }} />
            </div>
            <div className="flex justify-between items-center text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <span>Tax (%)</span>
              <input type="number" value={form.taxRate}
                onChange={e => setForm(f => ({...f, taxRate: parseFloat(e.target.value)||0}))}
                min="0" max="100"
                style={{ ...inputStyle, width: '80px', padding: '4px 8px', textAlign: 'right' }}
                onFocus={e => { e.target.style.borderColor = 'rgba(139,92,246,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.10)'; e.target.style.boxShadow = 'none'; }} />
            </div>
            <div className="flex justify-between items-center text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <span>Additional Fees</span>
              <input type="number" value={form.fees}
                onChange={e => setForm(f => ({...f, fees: parseFloat(e.target.value)||0}))}
                min="0"
                style={{ ...inputStyle, width: '80px', padding: '4px 8px', textAlign: 'right' }}
                onFocus={e => { e.target.style.borderColor = 'rgba(139,92,246,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.10)'; e.target.style.boxShadow = 'none'; }} />
            </div>
            <div className="flex justify-between text-base font-bold text-white pt-3"
              style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <span>Total</span>
              <span style={{ color: '#A78BFA' }}>{form.currency} {total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Notes & Terms */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="p-5" style={glassCard}>
            <label className="text-xs text-white/40 uppercase mb-2 block tracking-wider">Notes</label>
            <GlassTextarea value={form.notes}
              onChange={e => setForm(f => ({...f, notes: e.target.value}))}
              placeholder="Thank you for your business!" rows={3} />
          </div>
          <div className="p-5" style={glassCard}>
            <label className="text-xs text-white/40 uppercase mb-2 block tracking-wider">Terms & Conditions</label>
            <GlassTextarea value={form.terms}
              onChange={e => setForm(f => ({...f, terms: e.target.value}))}
              placeholder="Payment due within 30 days..." rows={3} />
          </div>
        </div>

        {/* Chargeback Protection CTA */}
        {userPlan === 'business' ? (
          <div className="p-4 rounded-xl text-sm"
            style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', color: 'rgba(255,255,255,0.6)' }}>
            <span style={{ color: '#A78BFA' }}>📍 GPS + Job Photos:</span> Save this invoice first, then open it to add job site evidence for chargeback protection.
          </div>
        ) : (
          <div className="p-5 rounded-2xl"
            style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.25)' }}>
            <div className="flex items-start gap-3">
              <span className="text-xl">🔒</span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-white">Chargeback Protection</span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(251,191,36,0.2)', color: '#FCD34D', border: '1px solid rgba(251,191,36,0.4)' }}>Business Plan</span>
                </div>
                <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>Add GPS location + job photos to protect against payment disputes.</p>
                <Link href="/dashboard/settings" className="text-xs px-3 py-1.5 rounded-xl" style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.4)', color: '#FCD34D' }}>
                  Upgrade to Business →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Save buttons */}
        <div className="flex gap-3 justify-end pb-6">
          <button onClick={() => handleSave('draft')} disabled={saving}
            className="px-6 py-3 text-white/70 rounded-xl font-medium disabled:opacity-60 transition-all hover:text-white"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
            Save as Draft
          </button>
          <button onClick={() => handleSave('sent')} disabled={saving}
            className="px-6 py-3 text-white rounded-xl font-semibold disabled:opacity-60 transition-all btn-primary">
            {saving ? 'Saving...' : `Send ${typeLabel}`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NewInvoicePage() {
  return (
    <Suspense fallback={<div className="p-6" style={{ color: 'rgba(255,255,255,0.4)' }}>Loading...</div>}>
      <NewInvoiceInner />
    </Suspense>
  );
}
