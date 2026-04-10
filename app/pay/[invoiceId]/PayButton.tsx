"use client";

import { useState } from "react";

interface Props {
  invoiceId: string;
  total: number;
  currency: string;
}

export default function PayButton({ invoiceId, total, currency }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: currency || "USD" }).format(n);

  const handlePay = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/pay/${invoiceId}/checkout`, { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Failed to create checkout session.");
        setLoading(false);
      }
    } catch (e: any) {
      setError(e?.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-lg font-semibold rounded-xl transition-colors duration-150 shadow-sm"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Redirecting to checkout…
          </span>
        ) : (
          `Pay ${fmt(total)} Now`
        )}
      </button>
      {error && <p className="mt-3 text-sm text-red-500 text-center">{error}</p>}
    </div>
  );
}
