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
      fetch('/api/user/plan')
        .then(r => r.json())
        .then(d => { if (d.plan) setPlan(d.plan); })
        .catch(() => setPlan(sessionPlan));
    }
  }, [status, session]);

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
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a0015 0%, #1a0035 30%, #0d1b4b 60%, #0a0015 100%)' }}>
        <div className="text-white/50 text-sm">Loading...</div>
      </div>
    );
  }

  const planLabel = plan === 'free' ? 'Free'
    : plan === 'starter' ? '⚡ Starter'
    : plan === 'freelancer' ? '⚡ Freelancer'
    : plan === 'business' ? '⚡ Business'
    : 'Free';

  const isPaid = plan !== 'free';

  // Get user initials for avatar
  const userName = session?.user?.name || session?.user?.email || 'U';
  const initials = userName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen flex" style={{ position: 'relative', zIndex: 1 }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`w-56 flex flex-col fixed inset-y-0 left-0 z-40 transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRight: '1px solid rgba(255,255,255,0.10)',
        }}
      >
        {/* Logo */}
        <div className="p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🧾</span>
              <span className="font-bold text-lg" style={{ background: 'linear-gradient(135deg, #A78BFA, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                SlateInvoice
              </span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white/40 hover:text-white p-1 transition-colors">✕</button>
          </div>
          <div className="mt-3">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              isPaid
                ? 'text-violet-300 border border-violet-500/30'
                : 'text-white/40 border border-white/10'
            }`} style={isPaid ? { background: 'rgba(139,92,246,0.15)' } : { background: 'rgba(255,255,255,0.05)' }}>
              {planLabel}
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'text-white'
                    : 'text-white/50 hover:text-white'
                }`}
                style={isActive ? {
                  background: 'rgba(139,92,246,0.2)',
                  border: '1px solid rgba(139,92,246,0.35)',
                  borderLeft: '3px solid #8B5CF6',
                  boxShadow: '0 4px 15px rgba(139,92,246,0.15)',
                } : {
                  border: '1px solid transparent',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                    (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.08)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.border = '1px solid transparent';
                  }
                }}
              >
                <span>{item.icon}</span>{item.label}
              </Link>
            );
          })}

          {/* Upgrade link for free users */}
          {!isPaid && (
            <Link href="/#pricing"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mt-2 text-violet-400 hover:text-violet-300"
              style={{
                background: 'rgba(139,92,246,0.1)',
                border: '1px solid rgba(139,92,246,0.25)',
              }}>
              <span>⚡</span>Upgrade
            </Link>
          )}
        </nav>

        {/* Bottom user section */}
        <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {!isPaid && (
            <Link href="/#pricing"
              className="block text-center text-xs px-3 py-2 rounded-xl text-violet-300 hover:text-violet-200 transition-colors mb-3"
              style={{
                background: 'rgba(139,92,246,0.12)',
                border: '1px solid rgba(139,92,246,0.25)',
              }}>
              ⚡ Freelancer — $15/mo · Unlimited
            </Link>
          )}
          {/* User profile card */}
          <div className="p-2.5 rounded-xl flex items-center gap-3"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-white/60 truncate">{session?.user?.email}</div>
              <button onClick={() => signOut({ callbackUrl: '/login' })} className="text-xs text-white/30 hover:text-white/70 transition-colors">
                Sign out →
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 md:ml-56 min-h-screen w-full" style={{ position: 'relative', zIndex: 1 }}>
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 sticky top-0 z-20"
          style={{
            background: 'rgba(10,0,21,0.8)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}>
          <button onClick={() => setSidebarOpen(true)} className="text-white/50 hover:text-white p-1 text-xl transition-colors">☰</button>
          <span className="font-semibold text-sm" style={{ background: 'linear-gradient(135deg, #A78BFA, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            SlateInvoice
          </span>
        </div>
        {children}
      </main>
    </div>
  );
}
