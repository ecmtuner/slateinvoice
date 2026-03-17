'use client';
import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const PLAN_PRICE_IDS: Record<string, string> = {
  starter: 'price_1TBpA3RvM1EJXqUQcjNb48oj',
  freelancer: 'price_1TBpA3RvM1EJXqUQQfyTZjKW',
  business: 'price_1TBpA4RvM1EJXqUQt0GE86QD',
};

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get('plan') || '';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');

    // 1. Create account
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || 'Signup failed'); setLoading(false); return; }

    // 2. Sign in
    const signin = await signIn('credentials', { email, password, redirect: false });
    if (!signin?.ok) {
      setError('Account created but sign-in failed. Try logging in.');
      setLoading(false);
      return;
    }

    // 3. If plan selected (non-free), redirect to Stripe checkout
    if (planParam && planParam !== 'free' && PLAN_PRICE_IDS[planParam]) {
      const priceId = PLAN_PRICE_IDS[planParam];
      const checkoutRes = await fetch('/api/subscription/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, plan: planParam }),
      });
      const checkoutData = await checkoutRes.json();
      if (checkoutRes.ok && checkoutData.url) {
        window.location.href = checkoutData.url;
        return;
      } else {
        // Fall through to dashboard if checkout creation fails
        console.error('Checkout failed:', checkoutData.error);
      }
    }

    // 4. Default: go to dashboard
    router.push('/dashboard');
  };

  const planLabels: Record<string, string> = {
    starter: 'Starter — $7/mo',
    freelancer: 'Freelancer — $15/mo',
    business: 'Business — $25/mo',
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl">🧾</Link>
          <h1 className="text-2xl font-bold text-white mt-3">Create your account</h1>
          {planParam && planParam !== 'free' ? (
            <p className="text-blue-400 text-sm mt-1 font-medium">
              Selected plan: {planLabels[planParam] || planParam}
            </p>
          ) : (
            <p className="text-gray-500 text-sm mt-1">Free forever · No credit card needed</p>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">{error}</div>}
          <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
          <input type="password" placeholder="Password (min 6 chars)" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white rounded-xl font-semibold transition-colors">
            {loading ? 'Creating account...' : planParam && planParam !== 'free' ? 'Create Account & Continue to Payment' : 'Create Free Account'}
          </button>
        </form>
        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account? <Link href="/login" className="text-blue-400 hover:text-blue-300">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
}
