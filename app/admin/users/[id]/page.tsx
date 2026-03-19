import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

const PLAN_BADGE: Record<string, string> = {
  free: 'bg-gray-700 text-gray-300',
  starter: 'bg-blue-900/60 text-blue-300',
  freelancer: 'bg-indigo-900/60 text-indigo-300',
  business: 'bg-green-900/60 text-green-300',
};

const STATUS_COLOR: Record<string, string> = {
  draft: 'bg-gray-700 text-gray-300',
  sent: 'bg-blue-900/60 text-blue-300',
  paid: 'bg-green-900/60 text-green-300',
  overdue: 'bg-red-900/60 text-red-300',
};

export default async function AdminUserDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      invoices: {
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: {
          id: true,
          number: true,
          status: true,
          total: true,
          currency: true,
          issueDate: true,
          toName: true,
          createdAt: true,
        },
      },
      _count: { select: { invoices: true } },
    },
  });

  if (!user) notFound();

  const paidTotal = await prisma.invoice.aggregate({
    where: { userId: user.id, status: 'paid' },
    _sum: { total: true },
  });

  const totalPaidValue = paidTotal._sum.total ?? 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/users" className="text-gray-400 hover:text-white text-sm transition-colors">
          ← Users
        </Link>
        <span className="text-gray-700">/</span>
        <span className="text-gray-300 text-sm truncate">{user.email}</span>
      </div>

      {/* User info card */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-white">{user.name ?? user.email}</h1>
            <p className="text-gray-400 text-sm mt-0.5">{user.email}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${PLAN_BADGE[user.plan ?? 'free'] ?? PLAN_BADGE.free}`}>
            {user.plan ?? 'free'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500 text-xs mb-1">Joined</p>
            <p className="text-gray-200">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">2FA</p>
            <p className={user.twoFactorEnabled ? 'text-green-400' : 'text-gray-500'}>
              {user.twoFactorEnabled ? '✓ Enabled' : '— Disabled'}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Stripe Customer ID</p>
            <p className="text-gray-200 font-mono text-xs truncate">{user.stripeCustomerId ?? '—'}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-3xl font-bold text-white">{user._count.invoices}</p>
          <p className="text-sm text-gray-400 mt-1">Total Invoices</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-3xl font-bold text-white">${totalPaidValue.toFixed(2)}</p>
          <p className="text-sm text-gray-400 mt-1">Total Paid Value</p>
        </div>
      </div>

      {/* Recent invoices */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">
          Recent Invoices
          {user._count.invoices > 20 && (
            <span className="text-sm font-normal text-gray-500 ml-2">(showing last 20 of {user._count.invoices})</span>
          )}
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          {user.invoices.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No invoices yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase">
                  <th className="text-left px-4 py-3">Number</th>
                  <th className="text-left px-4 py-3">Client</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3">Total</th>
                  <th className="text-left px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {user.invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3 text-gray-200 font-mono text-xs">{inv.number}</td>
                    <td className="px-4 py-3 text-gray-300">{inv.toName || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[inv.status] ?? STATUS_COLOR.draft}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-200">
                      {inv.currency} {inv.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-gray-400">{inv.issueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
