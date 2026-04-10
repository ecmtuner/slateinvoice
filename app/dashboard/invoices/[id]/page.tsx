'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function CopyPaymentLinkButton({ invoiceId }: { invoiceId: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    const link = `${window.location.origin}/pay/${invoiceId}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className="px-3 py-1.5 bg-gray-800 hover:bg-indigo-900/40 text-gray-300 hover:text-indigo-300 rounded-lg text-sm border border-gray-700 hover:border-indigo-700 transition-colors print:hidden"
    >
      {copied ? '✓ Copied!' : '🔗 Copy Payment Link'}
    </button>
  );
}

function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm border border-gray-700 transition-colors print:hidden"
    >
      🖨️ Download PDF
    </button>
  );
}

interface InvoiceItem { description: string; qty: number; unitPrice: number; amount: number; }
interface InvoicePhoto { id: string; url: string; }
interface Invoice {
  id: string; number: string; type: string; status: string; currency: string;
  fromName: string; fromEmail: string; fromPhone: string; fromAddress: string;
  toName: string; toEmail: string; toPhone: string; toAddress: string;
  issueDate: string; dueDate: string; subtotal: number; taxRate: number; taxAmount: number;
  discountRate: number; discountAmount: number; fees: number; total: number;
  notes: string; terms: string; items: InvoiceItem[];
  locationLat?: number; locationLng?: number; locationAddress?: string;
  photos?: InvoicePhoto[];
}

const statusColor: Record<string,string> = {
  draft: 'text-gray-400 bg-gray-800', sent: 'text-blue-400 bg-blue-900/30',
  paid: 'text-green-400 bg-green-900/30', overdue: 'text-red-400 bg-red-900/30',
};

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [updating, setUpdating] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/invoices/${id}`).then(r => r.json()).then(d => { if (d.id) setInvoice(d); });
  }, [id]);

  const updateStatus = async (status: string) => {
    setUpdating(true);
    await fetch(`/api/invoices/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    setInvoice(inv => inv ? { ...inv, status } : inv);
    setUpdating(false);
  };

  const deleteInvoice = async () => {
    if (!confirm('Delete this invoice?')) return;
    await fetch(`/api/invoices/${id}`, { method: 'DELETE' });
    router.push('/dashboard/invoices');
  };

  if (!invoice) return <div className="p-6 text-gray-400">Loading...</div>;
  const typeLabel = invoice.type.charAt(0).toUpperCase() + invoice.type.slice(1);

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/invoices" className="text-gray-500 hover:text-white">← Back</Link>
          <h1 className="text-xl font-bold text-white">{typeLabel} {invoice.number}</h1>
          <span className={`text-xs px-2 py-1 rounded-full ${statusColor[invoice.status] || statusColor.draft}`}>{invoice.status}</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {invoice.status !== 'paid' && (
            <button onClick={() => updateStatus('paid')} disabled={updating} className="px-3 py-1.5 bg-green-700 hover:bg-green-600 text-white rounded-lg text-sm font-medium disabled:opacity-60">
              ✓ Mark Paid
            </button>
          )}
          {invoice.status === 'draft' && (
            <button onClick={() => updateStatus('sent')} disabled={updating} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium disabled:opacity-60">
              Send
            </button>
          )}
          {invoice.status !== 'paid' && (
            <Link href={`/dashboard/invoices/${invoice.id}/edit`} className="px-3 py-1.5 bg-gray-800 hover:bg-violet-900/40 text-gray-300 hover:text-violet-300 rounded-lg text-sm border border-gray-700 hover:border-violet-700 transition-colors print:hidden">
              ✏️ Edit
            </Link>
          )}
          <CopyPaymentLinkButton invoiceId={invoice.id} />
          <PrintButton />
          <button onClick={deleteInvoice} className="px-3 py-1.5 bg-gray-800 hover:bg-red-900/30 text-gray-400 hover:text-red-400 rounded-lg text-sm print:hidden">
            Delete
          </button>
        </div>
      </div>

      {/* Invoice view */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between">
          <div>
            <div className="text-3xl mb-1">🧾</div>
            <h2 className="text-2xl font-bold text-white">{typeLabel}</h2>
            <p className="text-gray-500 text-sm"># {invoice.number}</p>
          </div>
          <div className="text-right text-sm text-gray-400">
            <p>Issue date: <span className="text-white">{invoice.issueDate}</span></p>
            {invoice.dueDate && <p>Due: <span className="text-white">{invoice.dueDate}</span></p>}
          </div>
        </div>

        {/* From / To */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-xs text-gray-500 uppercase mb-2">From</p>
            <p className="text-white font-medium">{invoice.fromName}</p>
            <p className="text-gray-400 text-sm">{invoice.fromEmail}</p>
            <p className="text-gray-400 text-sm">{invoice.fromPhone}</p>
            <p className="text-gray-400 text-sm">{invoice.fromAddress}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-2">Bill To</p>
            <p className="text-white font-medium">{invoice.toName}</p>
            <p className="text-gray-400 text-sm">{invoice.toEmail}</p>
            <p className="text-gray-400 text-sm">{invoice.toPhone}</p>
            <p className="text-gray-400 text-sm">{invoice.toAddress}</p>
          </div>
        </div>

        {/* Items */}
        <div>
          <table className="w-full">
            <thead className="border-b border-gray-700">
              <tr className="text-xs text-gray-500 uppercase">
                <th className="text-left pb-2">Description</th>
                <th className="text-right pb-2">Qty</th>
                <th className="text-right pb-2">Price</th>
                <th className="text-right pb-2">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {invoice.items.map((item, i) => (
                <tr key={i}>
                  <td className="py-3 text-sm text-gray-300">{item.description}</td>
                  <td className="py-3 text-sm text-gray-400 text-right">{item.qty}</td>
                  <td className="py-3 text-sm text-gray-400 text-right">{invoice.currency} {item.unitPrice.toFixed(2)}</td>
                  <td className="py-3 text-sm text-white text-right font-medium">{invoice.currency} {item.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="border-t border-gray-700 pt-4 max-w-xs ml-auto space-y-2">
          <div className="flex justify-between text-sm text-gray-400"><span>Subtotal</span><span>{invoice.currency} {invoice.subtotal.toFixed(2)}</span></div>
          {invoice.discountAmount > 0 && <div className="flex justify-between text-sm text-gray-400"><span>Discount ({invoice.discountRate}%)</span><span>-{invoice.currency} {invoice.discountAmount.toFixed(2)}</span></div>}
          {invoice.taxAmount > 0 && <div className="flex justify-between text-sm text-gray-400"><span>Tax ({invoice.taxRate}%)</span><span>{invoice.currency} {invoice.taxAmount.toFixed(2)}</span></div>}
          {invoice.fees > 0 && <div className="flex justify-between text-sm text-gray-400"><span>Fees</span><span>{invoice.currency} {invoice.fees.toFixed(2)}</span></div>}
          <div className="flex justify-between text-lg font-bold text-white border-t border-gray-700 pt-2"><span>Total Due</span><span>{invoice.currency} {invoice.total.toFixed(2)}</span></div>
        </div>

        {/* Notes */}
        {(invoice.notes || invoice.terms) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-gray-800 pt-6">
            {invoice.notes && <div><p className="text-xs text-gray-500 uppercase mb-1">Notes</p><p className="text-sm text-gray-400">{invoice.notes}</p></div>}
            {invoice.terms && <div><p className="text-xs text-gray-500 uppercase mb-1">Terms</p><p className="text-sm text-gray-400">{invoice.terms}</p></div>}
          </div>
        )}

        {/* Job Site Evidence Section */}
        {((invoice.photos && invoice.photos.length > 0) || invoice.locationAddress) && (
          <div className="border-t border-gray-800 pt-6 mt-2">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-sm font-semibold text-white">📍 Job Site Evidence</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/30 text-green-400 border border-green-800">
                ✓ Chargeback Protected
              </span>
            </div>
            {invoice.locationAddress && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 uppercase mb-1">Work Location</p>
                <a
                  href={`https://maps.google.com/?q=${invoice.locationLat},${invoice.locationLng}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  📍 {invoice.locationAddress}
                </a>
              </div>
            )}
            {invoice.photos && invoice.photos.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 uppercase mb-2">Job Site Photos ({invoice.photos.length})</p>
                <div className="grid grid-cols-3 gap-2">
                  {invoice.photos.map(photo => (
                    <div key={photo.id} className="aspect-square rounded-xl overflow-hidden cursor-pointer border border-gray-700 hover:border-gray-500 transition-colors"
                      onClick={() => setLightboxUrl(photo.url)}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo.url} alt="Job site" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Payment link — shows on printed PDF */}
        <div className="hidden print:block border-t border-gray-200 pt-6 mt-4 text-center">
          <p className="text-sm text-gray-500 mb-1">Pay online securely at:</p>
          <p className="text-blue-600 font-medium text-sm break-all">
            {typeof window !== 'undefined' ? `${window.location.origin}/pay/${invoice.id}` : `slateinvoice.com/pay/${invoice.id}`}
          </p>
          <p className="text-xs text-gray-400 mt-1">Powered by SlateInvoice · Secure payments via Stripe</p>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          onClick={() => setLightboxUrl(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightboxUrl} alt="Job site photo" className="max-w-full rounded-2xl object-contain" style={{ maxHeight: '85vh' }} onClick={e => e.stopPropagation()} />
          <button className="absolute top-4 right-4 text-white text-3xl font-bold" onClick={() => setLightboxUrl(null)}>×</button>
        </div>
      )}

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body { background: white !important; color: black !important; }
          .bg-gray-950 { background: white !important; }
          .bg-gray-900 { background: white !important; border: 1px solid #e5e7eb !important; }
          .text-white { color: #111 !important; }
          .text-gray-400, .text-gray-500 { color: #6b7280 !important; }
          .border-gray-800, .border-gray-700 { border-color: #e5e7eb !important; }
          .divide-gray-800 > * { border-color: #e5e7eb !important; }
        }
      `}</style>
    </div>
  );
}
