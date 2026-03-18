'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function TwoFactorPage() {
  const { update } = useSession();
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/2fa/login-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: code }),
      });
      const data = await res.json();

      if (data.success) {
        await update({ twoFactorVerified: true });
        router.push('/dashboard');
      } else {
        setError('Invalid code. Please try again.');
        setLoading(false);
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🔐</div>
          <h1 className="text-2xl font-bold text-white">Two-Factor Authentication</h1>
          <p className="text-gray-500 text-sm mt-2">Enter the 6-digit code from your authenticator app</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="000000"
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              required
              autoFocus
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 text-center text-2xl tracking-widest font-mono"
            />
            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white rounded-xl font-semibold transition-colors"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
