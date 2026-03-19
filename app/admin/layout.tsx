import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top nav */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <Link href="/admin" className="text-white font-semibold text-lg">
          ⚙️ SlateInvoice Admin
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/admin/users" className="text-gray-400 hover:text-white text-sm transition-colors">
            Users
          </Link>
          <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm transition-colors">
            ← Back to Dashboard
          </Link>
        </div>
      </nav>
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}
