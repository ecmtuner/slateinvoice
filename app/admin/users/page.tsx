import { prisma } from '@/lib/prisma';
import Link from 'next/link';

const PLAN_BADGE: Record<string, string> = {
  free: 'bg-gray-700 text-gray-300',
  starter: 'bg-blue-900/60 text-blue-300',
  freelancer: 'bg-indigo-900/60 text-indigo-300',
  business: 'bg-green-900/60 text-green-300',
};

const PAGE_SIZE = 50;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Math.max(1, parseInt(searchParams?.page ?? '1', 10));
  const skip = (page - 1) * PAGE_SIZE;

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: PAGE_SIZE,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { invoices: true } },
        invoices: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { createdAt: true },
        },
      },
    }),
    prisma.user.count(),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">All Users</h1>
        <p className="text-gray-400 text-sm">{totalCount.toLocaleString()} total</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase">
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Plan</th>
              <th className="text-left px-4 py-3">Joined</th>
              <th className="text-left px-4 py-3">Last Invoice</th>
              <th className="text-right px-4 py-3">Invoices</th>
              <th className="text-center px-4 py-3">2FA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-800/50 transition-colors cursor-pointer"
              >
                <td className="px-4 py-3">
                  <Link href={`/admin/users/${user.id}`} className="text-blue-400 hover:text-blue-300 hover:underline">
                    {user.email}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-300">{user.name ?? '—'}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PLAN_BADGE[user.plan ?? 'free'] ?? PLAN_BADGE.free}`}>
                    {user.plan ?? 'free'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {user.invoices[0]
                    ? new Date(user.invoices[0].createdAt).toLocaleDateString()
                    : '—'}
                </td>
                <td className="px-4 py-3 text-right text-gray-300">{user._count.invoices}</td>
                <td className="px-4 py-3 text-center">
                  {user.twoFactorEnabled
                    ? <span className="text-green-400">✓</span>
                    : <span className="text-gray-600">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-gray-400 text-sm">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/users?page=${page - 1}`}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors"
              >
                ← Prev
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/users?page=${page + 1}`}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors"
              >
                Next →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
