'use client';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/dashboard/invoices', label: 'Invoices', icon: '🧾' },
  { href: '/dashboard/clients', label: 'Clients', icon: '👥' },
  { href: '/dashboard/products', label: 'Products', icon: '📦' },
  { href: '/dashboard/paystubs', label: 'Pay Stubs', icon: '💵' },
  { href: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  if (status === 'loading') {
    return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">Loading...</div>;
  }

  const plan = (session?.user as any)?.plan ?? 'free';

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col fixed inset-y-0 left-0 z-40">
        <div className="p-4 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🧾</span>
            <span className="font-bold text-white text-lg">InvoiceBuddy</span>
          </Link>
          <div className="mt-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${plan === 'pro' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
              {plan === 'pro' ? '⚡ Pro' : 'Free'}
            </span>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === item.href ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30' : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}>
              <span>{item.icon}</span>{item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-800">
          {plan === 'free' && (
            <Link href="/dashboard/settings" className="block text-center text-xs px-3 py-2 bg-blue-600/20 border border-blue-600/30 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors mb-2">
              ⚡ Freelancer — $15/mo · Unlimited
            </Link>
          )}
          <div className="text-xs text-gray-600 mb-1 truncate">{session?.user?.email}</div>
          <button onClick={() => signOut({ callbackUrl: '/login' })} className="w-full text-left text-xs text-gray-500 hover:text-white transition-colors px-1 py-1">
            Sign out →
          </button>
        </div>
      </aside>
      {/* Main */}
      <main className="flex-1 ml-56 min-h-screen">
        {children}
      </main>
    </div>
  );
}
