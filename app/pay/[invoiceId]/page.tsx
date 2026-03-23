import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PayButton from "./PayButton";

interface Props {
  params: { invoiceId: string };
}

export default async function PublicPayPage({ params }: Props) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: params.invoiceId },
    include: { items: true, user: { include: { business: true } } },
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const business = (invoice as any)?.user?.business;
  const userPlan = (invoice as any)?.user?.plan ?? 'free';
  const isPaidPlan = userPlan !== 'free';
  const logoUrl = isPaidPlan ? (business?.logo || null) : null;

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Invoice Not Found</h1>
          <p className="text-gray-500">This invoice link may be invalid or expired.</p>
        </div>
      </div>
    );
  }

  if (invoice.status === "paid") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full mx-4 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Invoice Already Paid</h1>
          <p className="text-gray-500 mb-4">
            Invoice #{invoice.number} has already been paid. Thank you!
          </p>
          {invoice.paidAt && (
            <p className="text-sm text-gray-400">
              Paid on {new Date(invoice.paidAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          )}
        </div>
      </div>
    );
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: invoice.currency || "USD" }).format(n);

  const template = (invoice as any).template || 'classic';
  const headerClass =
    template === 'modern'
      ? 'bg-gray-900'
      : template === 'minimal'
      ? 'bg-white border-b border-gray-200'
      : 'bg-blue-600'; // classic default
  const logoTextClass =
    template === 'minimal' ? 'text-gray-800' : 'text-white';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className={`${headerClass} py-4`}>
        <div className="max-w-3xl mx-auto px-4 flex items-center gap-2">
          <span className="text-2xl">🧾</span>
          {logoUrl ? (
            <img src={logoUrl} alt="Business Logo" className="h-10 w-auto max-w-[160px] object-contain" />
          ) : (
            <span className={`text-xl font-bold ${logoTextClass}`}>{invoice.fromName || 'SlateInvoice'}</span>
          )}
        </div>
        {!isPaidPlan && (
          <span className="text-xs text-white/60">Powered by SlateInvoice</span>
        )}
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Title */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-1">Invoice from</p>
          <h1 className="text-3xl font-bold text-gray-800">{invoice.fromName || "Your Business"}</h1>
        </div>

        {/* Invoice card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Invoice meta */}
          <div className="p-8 border-b border-gray-100">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Invoice #</p>
                <p className="text-sm font-semibold text-gray-700">{invoice.number}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Issue Date</p>
                <p className="text-sm font-semibold text-gray-700">{invoice.issueDate}</p>
              </div>
              {invoice.dueDate && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Due Date</p>
                  <p className="text-sm font-semibold text-gray-700">{invoice.dueDate}</p>
                </div>
              )}
            </div>
          </div>

          {/* From / To */}
          <div className="p-8 border-b border-gray-100 grid grid-cols-2 gap-8">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">From</p>
              <p className="font-medium text-gray-800">{invoice.fromName}</p>
              {invoice.fromEmail && <p className="text-sm text-gray-500">{invoice.fromEmail}</p>}
              {invoice.fromPhone && <p className="text-sm text-gray-500">{invoice.fromPhone}</p>}
              {invoice.fromAddress && <p className="text-sm text-gray-500">{invoice.fromAddress}</p>}
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Bill To</p>
              <p className="font-medium text-gray-800">{invoice.toName}</p>
              {invoice.toEmail && <p className="text-sm text-gray-500">{invoice.toEmail}</p>}
              {invoice.toPhone && <p className="text-sm text-gray-500">{invoice.toPhone}</p>}
              {invoice.toAddress && <p className="text-sm text-gray-500">{invoice.toAddress}</p>}
            </div>
          </div>

          {/* Line items */}
          <div className="p-8 border-b border-gray-100">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                  <th className="text-left pb-3 font-medium">Description</th>
                  <th className="text-right pb-3 font-medium">Qty</th>
                  <th className="text-right pb-3 font-medium">Unit Price</th>
                  <th className="text-right pb-3 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {invoice.items.map((item, i) => (
                  <tr key={i}>
                    <td className="py-3 text-sm text-gray-700">{item.description}</td>
                    <td className="py-3 text-sm text-gray-500 text-right">{item.qty}</td>
                    <td className="py-3 text-sm text-gray-500 text-right">{fmt(item.unitPrice)}</td>
                    <td className="py-3 text-sm text-gray-800 font-medium text-right">{fmt(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="p-8 border-b border-gray-100">
            <div className="max-w-xs ml-auto space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>{fmt(invoice.subtotal)}</span>
              </div>
              {invoice.discountAmount > 0 && (
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Discount ({invoice.discountRate}%)</span>
                  <span className="text-green-600">−{fmt(invoice.discountAmount)}</span>
                </div>
              )}
              {invoice.taxAmount > 0 && (
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Tax ({invoice.taxRate}%)</span>
                  <span>{fmt(invoice.taxAmount)}</span>
                </div>
              )}
              {invoice.fees > 0 && (
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Fees</span>
                  <span>{fmt(invoice.fees)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-3">
                <span>Total Due</span>
                <span>{fmt(invoice.total)}</span>
              </div>
            </div>
          </div>

          {/* Notes / Terms */}
          {(invoice.notes || invoice.terms) && (
            <div className="p-8 border-b border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {invoice.notes && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Notes</p>
                  <p className="text-sm text-gray-600">{invoice.notes}</p>
                </div>
              )}
              {invoice.terms && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Terms</p>
                  <p className="text-sm text-gray-600">{invoice.terms}</p>
                </div>
              )}
            </div>
          )}

          {/* Pay button */}
          <div className="p-8">
            <PayButton invoiceId={invoice.id} total={invoice.total} currency={invoice.currency} />

            <div className="mt-4 flex items-center justify-center gap-3 text-xs text-gray-400">
              <span>🔒 Secure payment</span>
              <span>·</span>
              <span>Visa · Mastercard · Amex · Discover</span>
              <span>·</span>
              <span>Powered by Stripe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
