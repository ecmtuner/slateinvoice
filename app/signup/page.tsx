'use client';
import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function GoogleLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

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
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');

    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || 'Signup failed'); setLoading(false); return; }

    const signin = await signIn('credentials', { email, password, redirect: false });
    if (!signin?.ok) {
      setError('Account created but sign-in failed. Try logging in.');
      setLoading(false);
      return;
    }

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
        console.error('Checkout failed:', checkoutData.error);
      }
    }

    router.push('/dashboard');
  };

  const planLabels: Record<string, string> = {
    starter: 'Starter — $7/mo',
    freelancer: 'Freelancer — $15/mo',
    business: 'Business — $25/mo',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ position: 'relative', zIndex: 1 }}>
      <div className="w-full max-w-sm">
        {/* Logo & heading */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-5xl mb-4">🧾</Link>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          {planParam && planParam !== 'free' ? (
            <p className="text-sm mt-2 font-medium" style={{ color: '#A78BFA' }}>
              Selected plan: {planLabels[planParam] || planParam}
            </p>
          ) : (
            <p className="text-white/40 text-sm mt-2">Free forever · No credit card needed</p>
          )}
        </div>

        {/* Glass card */}
        <div className="p-6 rounded-2xl"
          style={{
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 8px 40px rgba(139,92,246,0.15)',
          }}>
          {/* Google Sign Up */}
          <button
            onClick={async () => { setGoogleLoading(true); await signIn('google', { callbackUrl: '/dashboard' }); }}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-semibold transition-all mb-4"
            style={{ background: 'rgba(255,255,255,0.95)', color: '#111' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,1)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.95)'}>
            <GoogleLogo />
            {googleLoading ? 'Redirecting...' : 'Sign up with Google'}
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1" style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>or sign up with email</span>
            <div className="flex-1" style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="p-3 rounded-xl text-sm"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#FCA5A5' }}>
                {error}
              </div>
            )}
            <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)}
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = 'rgba(139,92,246,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.15)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.10)'; e.target.style.boxShadow = 'none'; }}
              className="placeholder-white/30" />
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = 'rgba(139,92,246,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.15)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.10)'; e.target.style.boxShadow = 'none'; }}
              className="placeholder-white/30" />
            <input type="password" placeholder="Password (min 6 chars)" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = 'rgba(139,92,246,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.15)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.10)'; e.target.style.boxShadow = 'none'; }}
              className="placeholder-white/30" />
            <button type="submit" disabled={loading}
              className="w-full py-3 text-white rounded-xl font-semibold disabled:opacity-60 transition-all btn-primary mt-1">
              {loading ? 'Creating account...' : planParam && planParam !== 'free' ? 'Create Account & Continue to Payment' : 'Create Free Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-white/30 text-sm mt-5">
          Already have an account?{' '}
          <Link href="/login" className="text-violet-400 hover:text-violet-300 transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ color: 'rgba(255,255,255,0.4)' }}>
        Loading...
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}
