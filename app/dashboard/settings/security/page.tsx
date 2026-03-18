'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

export default function SecuritySettingsPage() {
  const { data: session, update } = useSession();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);

  // Setup flow
  const [setupData, setSetupData] = useState<{ secret: string; qrCodeDataUrl: string } | null>(null);
  const [setupCode, setSetupCode] = useState('');
  const [setupLoading, setSetupLoading] = useState(false);
  const [setupError, setSetupError] = useState('');

  // Disable flow
  const [showDisableForm, setShowDisableForm] = useState(false);
  const [disableCode, setDisableCode] = useState('');
  const [disableLoading, setDisableLoading] = useState(false);
  const [disableError, setDisableError] = useState('');

  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetch('/api/auth/2fa/status')
      .then(r => r.json())
      .then(d => {
        setTwoFactorEnabled(d.enabled ?? false);
        setLoadingStatus(false);
      })
      .catch(() => setLoadingStatus(false));
  }, []);

  const handleEnable = async () => {
    setSetupError('');
    setSetupLoading(true);
    try {
      const res = await fetch('/api/auth/2fa/setup');
      const data = await res.json();
      setSetupData({ secret: data.secret, qrCodeDataUrl: data.qrCodeDataUrl });
    } catch {
      setSetupError('Failed to start 2FA setup.');
    } finally {
      setSetupLoading(false);
    }
  };

  const handleConfirmEnable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupData) return;
    setSetupLoading(true);
    setSetupError('');
    try {
      const res = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: setupCode, secret: setupData.secret }),
      });
      const data = await res.json();
      if (data.success) {
        setTwoFactorEnabled(true);
        setSetupData(null);
        setSetupCode('');
        setSuccessMsg('Two-factor authentication enabled successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
        await update();
      } else {
        setSetupError('Invalid code. Please try again.');
      }
    } catch {
      setSetupError('Verification failed. Please try again.');
    } finally {
      setSetupLoading(false);
    }
  };

  const handleDisable = async (e: React.FormEvent) => {
    e.preventDefault();
    setDisableLoading(true);
    setDisableError('');
    try {
      const res = await fetch('/api/auth/2fa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: disableCode }),
      });
      const data = await res.json();
      if (data.success) {
        setTwoFactorEnabled(false);
        setShowDisableForm(false);
        setDisableCode('');
        setSuccessMsg('Two-factor authentication disabled.');
        setTimeout(() => setSuccessMsg(''), 4000);
        await update();
      } else {
        setDisableError('Invalid code. Please try again.');
      }
    } catch {
      setDisableError('Failed to disable 2FA. Please try again.');
    } finally {
      setDisableLoading(false);
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/dashboard/settings" className="text-gray-500 hover:text-gray-300 text-sm mb-6 inline-flex items-center gap-1 transition-colors">
          ← Back to Settings
        </Link>

        <h1 className="text-2xl font-bold text-white mb-2">Security</h1>
        <p className="text-gray-500 text-sm mb-8">Manage your account security settings.</p>

        {successMsg && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-xl text-green-300 text-sm">
            ✓ {successMsg}
          </div>
        )}

        {/* 2FA Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
            🛡️ Two-Factor Authentication
          </h2>

          {loadingStatus ? (
            <p className="text-gray-500 text-sm mt-3">Loading...</p>
          ) : twoFactorEnabled ? (
            /* 2FA Enabled State */
            <div>
              <div className="mt-3 mb-4 inline-flex items-center gap-2 px-3 py-1.5 bg-green-900/30 border border-green-700/50 rounded-lg">
                <span className="text-green-400 text-sm font-medium">✓ Two-Factor Authentication is enabled</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Your account is protected with an authenticator app.
              </p>
              {!showDisableForm ? (
                <button
                  onClick={() => setShowDisableForm(true)}
                  className="px-4 py-2 bg-red-900/40 hover:bg-red-900/60 border border-red-800 text-red-400 rounded-xl text-sm font-medium transition-colors"
                >
                  Disable 2FA
                </button>
              ) : (
                <form onSubmit={handleDisable} className="space-y-3 mt-4">
                  <p className="text-gray-400 text-sm">Enter your current 6-digit code to confirm:</p>
                  {disableError && (
                    <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
                      {disableError}
                    </div>
                  )}
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="000000"
                    value={disableCode}
                    onChange={e => setDisableCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    required
                    autoFocus
                    className="w-40 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-red-500 text-center text-xl tracking-widest font-mono"
                  />
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={disableLoading || disableCode.length !== 6}
                      className="px-4 py-2 bg-red-900/40 hover:bg-red-900/60 border border-red-800 disabled:opacity-60 text-red-400 rounded-xl text-sm font-medium transition-colors"
                    >
                      {disableLoading ? 'Disabling...' : 'Confirm Disable'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowDisableForm(false); setDisableCode(''); setDisableError(''); }}
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-xl text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* 2FA Disabled State */
            <div>
              <p className="text-gray-400 text-sm mt-3 mb-4">
                Protect your account with an authenticator app. Each login will require a 6-digit code.
              </p>

              {!setupData ? (
                <button
                  onClick={handleEnable}
                  disabled={setupLoading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors"
                >
                  {setupLoading ? 'Setting up...' : 'Enable 2FA'}
                </button>
              ) : (
                <div className="space-y-4 mt-4">
                  <div>
                    <p className="text-gray-300 text-sm font-medium mb-2">1. Scan this QR code with your authenticator app:</p>
                    <div className="inline-block p-3 bg-white rounded-xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={setupData.qrCodeDataUrl} alt="QR Code" width={180} height={180} />
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-300 text-sm font-medium mb-1">Or enter this code manually:</p>
                    <code className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-indigo-300 text-sm font-mono tracking-widest break-all">
                      {setupData.secret}
                    </code>
                  </div>

                  <form onSubmit={handleConfirmEnable} className="space-y-3">
                    <p className="text-gray-300 text-sm font-medium">2. Enter the 6-digit code to confirm:</p>
                    {setupError && (
                      <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
                        {setupError}
                      </div>
                    )}
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="000000"
                      value={setupCode}
                      onChange={e => setSetupCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                      required
                      autoFocus
                      className="w-40 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 text-center text-xl tracking-widest font-mono"
                    />
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={setupLoading || setupCode.length !== 6}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors"
                      >
                        {setupLoading ? 'Enabling...' : 'Confirm & Enable'}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setSetupData(null); setSetupCode(''); setSetupError(''); }}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-xl text-sm font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
