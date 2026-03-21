'use client';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
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
  const [plan, setPlan] = useState<string>('free');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sessionPlan = (session?.user as any)?.plan ?? 'free';
      // Fetch latest plan from DB
      fetch('/api/user/plan')
        .then(r => r.json())
        .then(d => { if (d.plan) setPlan(d.plan); })
        .catch(() => setPlan(sessionPlan));
    }
  }, [status, session]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setSidebarOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [sidebarOpen]);

  if (status === 'loading') {
    return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">Loading...</div>;
  }

  const planLabel = plan === 'free' ? 'Free'
    : plan === 'starter' ? '⚡ Starter'
    : plan === 'freelancer' ? '⚡ Freelancer'
    : plan === 'business' ? '⚡ Business'
    : 'Free';

  const isPaid = plan !== 'free';

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside ref={sidebarRef} className={`w-56 bg-gray-900 border-r border-gray-800 flex flex-col fixed inset-y-0 left-0 z-40 transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🧾</span>
              <span className="font-bold text-white text-lg">SlateInvoice</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white p-1">✕</button>
          </div>
          <div className="mt-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isPaid ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
              {planLabel}
            </span>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <Link key={item.href} href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === item.href ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30' : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}>
              <span>{item.icon}</span>{item.label}
            </Link>
          ))}
          {/* Upgrade link for free users */}
          {!isPaid && (
            <Link href="/#pricing"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 border border-blue-800/40 mt-2">
              <span>⬆️</span>Upgrade
            </Link>
          )}
        </nav>
        <div className="p-3 border-t border-gray-800">
          {!isPaid && (
            <Link href="/#pricing" className="block text-center text-xs px-3 py-2 bg-blue-600/20 border border-blue-600/30 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors mb-2">
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
      <main className="flex-1 md:ml-56 min-h-screen w-full">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-gray-900 border-b border-gray-800 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-white p-1 text-xl">☰</button>
          <span className="text-white font-semibold text-sm">SlateInvoice</span>
        </div>
        {children}
      </main>
    </div>
  );
}
