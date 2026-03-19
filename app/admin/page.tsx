import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const PLAN_PRICES: Record<string, number> = {
  starter: 7,
  freelancer: 15,
  business: 25,
};

const PLAN_BADGE: Record<string, string> = {
  free: 'bg-gray-700 text-gray-300',
  starter: 'bg-blue-900/60 text-blue-300',
  freelancer: 'bg-indigo-900/60 text-indigo-300',
  business: 'bg-green-900/60 text-green-300',
};

export default async function AdminPage() {
  const [totalUsers, totalInvoices, recentUsers, planCounts] = await Promise.all([
    prisma.user.count(),
    prisma.invoice.count(),
    prisma.user.findMany({
      include: { _count: { select: { invoices: true } } },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
    prisma.user.groupBy({
      by: ['plan'],
      _count: { plan: true },
    }),
  ]);

  // Paying users = plan is not null and not 'free'
  const payingUsers = planCounts
    .filter(p => p.plan && p.plan !== 'free')
    .reduce((sum, p) => sum + p._count.plan, 0);

  // MRR calculation
  const mrr = planCounts.reduce((sum, p) => {
    const price = p.plan ? PLAN_PRICES[p.plan] ?? 0 : 0;
    return sum + price * p._count.plan;
  }, 0);

  // Plan breakdown map
  const planMap: Record<string, number> = {};
  for (const p of planCounts) {
    planMap[p.plan ?? 'free'] = p._count.plan;
  }

  const planRows = [
    { plan: 'free', label: 'Free', price: 0 },
    { plan: 'starter', label: 'Starter', price: 7 },
    { plan: 'freelancer', label: 'Freelancer', price: 15 },
    { plan: 'business', label: 'Business', price: 25 },
  ];

  const totalMRR = planRows.reduce((s, r) => s + r.price * (planMap[r.plan] ?? 0), 0);
  const totalAllUsers = planRows.reduce((s, r) => s + (planMap[r.plan] ?? 0), 0);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Overview</h1>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Users', value: totalUsers.toLocaleString() },
          { label: 'Paying Users', value: payingUsers.toLocaleString() },
          { label: 'MRR', value: `$${mrr.toLocaleString()}` },
          { label: 'Total Invoices', value: totalInvoices.toLocaleString() },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Signups */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-white mb-3">Recent Signups</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase">
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-4 py-3">Plan</th>
                  <th className="text-left px-4 py-3">Joined</th>
                  <th className="text-center px-4 py-3">2FA</th>
                  <th className="text-right px-4 py-3">Invoices</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {recentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3 text-gray-200 truncate max-w-[180px]">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PLAN_BADGE[user.plan ?? 'free'] ?? PLAN_BADGE.free}`}>
                        {user.plan ?? 'free'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {user.twoFactorEnabled
                        ? <span className="text-green-400">✓</span>
                        : <span className="text-gray-600">—</span>}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-300">{user._count.invoices}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Plan Breakdown */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Plan Breakdown</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase">
                  <th className="text-left px-4 py-3">Plan</th>
                  <th className="text-right px-4 py-3">Users</th>
                  <th className="text-right px-4 py-3">MRR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {planRows.map((row) => {
                  const count = planMap[row.plan] ?? 0;
                  const contrib = row.price * count;
                  return (
                    <tr key={row.plan} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PLAN_BADGE[row.plan]}`}>
                          {row.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-300">{count}</td>
                      <td className="px-4 py-3 text-right text-gray-300">${contrib}</td>
                    </tr>
                  );
                })}
                <tr className="border-t border-gray-700 font-semibold">
                  <td className="px-4 py-3 text-white">Total</td>
                  <td className="px-4 py-3 text-right text-white">{totalAllUsers}</td>
                  <td className="px-4 py-3 text-right text-white">${totalMRR}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
