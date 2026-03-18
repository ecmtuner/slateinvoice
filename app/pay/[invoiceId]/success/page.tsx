import { prisma } from "@/lib/prisma";

interface Props {
  params: { invoiceId: string };
}

export default async function PaySuccessPage({ params }: Props) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: params.invoiceId },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-3xl mx-auto px-4 flex items-center gap-2">
          <span className="text-2xl">🧾</span>
          <span className="text-xl font-bold text-gray-800">SlateInvoice</span>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✅</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>

          {invoice ? (
            <>
              <p className="text-gray-500 mb-4">
                Your payment for{" "}
                <span className="font-semibold text-gray-700">Invoice #{invoice.number}</span>{" "}
                has been received.
              </p>
              {invoice.toEmail && (
                <p className="text-sm text-gray-400">
                  A confirmation will be sent to{" "}
                  <span className="font-medium text-gray-600">{invoice.toEmail}</span>
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-500">Your payment has been received. Thank you!</p>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
              <span>🔒</span>
              <span>Secured by Stripe</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
