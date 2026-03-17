'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function DownloadInner() {
  const params = useSearchParams();
  const token = params.get('token');
  const mock = params.get('mock');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) { setError('No token found.'); return; }
    const raw = sessionStorage.getItem(`paystub_${token}`);
    if (!raw) { setError('Session expired. Please generate a new pay stub.'); return; }
    try { setData(JSON.parse(raw)); sessionStorage.removeItem(`paystub_${token}`); }
    catch { setError('Failed to load pay stub data.'); }
  }, [token]);

  const handlePrint = () => window.print();

  if (error) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-white font-bold text-lg mb-2">⚠️ {error}</p>
        <Link href="/dashboard/paystubs" className="text-blue-400 hover:text-blue-300">← Generate new stub</Link>
      </div>
    </div>
  );

  if (!data) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">Loading...</div>;

  const { form, grossPay, regularPay, overtimePay, federalTax, stateTax, socialSecurity, medicare, health, dental, vision, retirement, otherDeduction, totalDeductions, netPay } = data;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-8 print:py-0">
        {/* Actions — hidden on print */}
        <div className="flex items-center justify-between mb-6 print:hidden">
          <div>
            <h1 className="text-xl font-bold text-white">Pay Stub Ready</h1>
            <p className="text-gray-500 text-sm">{mock ? 'Demo mode' : '✓ Payment verified'}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handlePrint} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-colors">
              🖨️ Print / Save PDF
            </button>
            <Link href="/dashboard/paystubs" className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors">
              + New Stub
            </Link>
          </div>
        </div>

        {/* Pay stub — print-friendly white */}
        <div className="bg-white text-gray-900 rounded-xl p-8 text-sm print:rounded-none print:shadow-none">
          <div className="flex justify-between items-start border-b-2 border-gray-800 pb-4 mb-6">
            <div>
              <p className="font-bold text-xl text-gray-900">{form.companyName}</p>
              <p className="text-gray-600">{form.companyAddress}</p>
              <p className="text-gray-600">{form.companyCity}{form.companyCity && ','} {form.companyState} {form.companyZip}</p>
              {form.ein && <p className="text-gray-600">EIN: {form.ein}</p>}
            </div>
            <div className="text-right">
              <p className="font-bold text-xl text-gray-900">PAY STUB</p>
              <p className="text-gray-600">Pay Date: <strong>{form.payDate}</strong></p>
              <p className="text-gray-600">Period: {form.periodStart} – {form.periodEnd}</p>
              <p className="text-gray-600">{form.payPeriod}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="font-bold text-gray-500 text-xs uppercase mb-2">Employee</p>
              <p className="font-bold text-gray-900">{form.employeeName}</p>
              <p className="text-gray-600">{form.employeeAddress}</p>
              <p className="text-gray-600">{form.employeeCity}{form.employeeCity && ','} {form.employeeState} {form.employeeZip}</p>
              {form.ssn && <p className="text-gray-600">SSN: {form.ssn}</p>}
              {form.employeeId && <p className="text-gray-600">Employee ID: {form.employeeId}</p>}
            </div>
            <div>
              <p className="font-bold text-gray-500 text-xs uppercase mb-2">Compensation</p>
              <p className="text-gray-700">{form.rateType === 'hourly' ? `$${parseFloat(form.payRate).toFixed(2)}/hr` : `$${parseFloat(form.payRate).toFixed(2)}/period`}</p>
              {form.rateType === 'hourly' && <p className="text-gray-600">Regular Hours: {form.hoursWorked}</p>}
              {parseFloat(form.overtimeHours) > 0 && <p className="text-gray-600">Overtime Hours: {form.overtimeHours}</p>}
            </div>
          </div>

          <table className="w-full text-sm border border-gray-200 mb-6">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="text-left p-3">Earnings</th><th className="text-right p-3">This Period</th>
                <th className="text-left p-3 border-l border-gray-600">Deductions</th><th className="text-right p-3">This Period</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="p-3">Regular Pay</td><td className="p-3 text-right">${regularPay.toFixed(2)}</td>
                <td className="p-3 border-l border-gray-100">Federal Income Tax</td><td className="p-3 text-right">${federalTax.toFixed(2)}</td>
              </tr>
              {overtimePay > 0 && <tr className="border-b border-gray-100">
                <td className="p-3">Overtime Pay</td><td className="p-3 text-right">${overtimePay.toFixed(2)}</td>
                <td className="p-3 border-l border-gray-100">State Income Tax ({form.stateCode})</td><td className="p-3 text-right">${stateTax.toFixed(2)}</td>
              </tr>}
              <tr className="border-b border-gray-100">
                <td className="p-3"></td><td className="p-3"></td>
                <td className="p-3 border-l border-gray-100">Social Security (6.2%)</td><td className="p-3 text-right">${socialSecurity.toFixed(2)}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-3"></td><td className="p-3"></td>
                <td className="p-3 border-l border-gray-100">Medicare (1.45%)</td><td className="p-3 text-right">${medicare.toFixed(2)}</td>
              </tr>
              {health > 0 && <tr className="border-b border-gray-100"><td className="p-3"></td><td className="p-3"></td>
                <td className="p-3 border-l border-gray-100">Health Insurance</td><td className="p-3 text-right">${health.toFixed(2)}</td></tr>}
              {dental > 0 && <tr className="border-b border-gray-100"><td className="p-3"></td><td className="p-3"></td>
                <td className="p-3 border-l border-gray-100">Dental Insurance</td><td className="p-3 text-right">${dental.toFixed(2)}</td></tr>}
              {vision > 0 && <tr className="border-b border-gray-100"><td className="p-3"></td><td className="p-3"></td>
                <td className="p-3 border-l border-gray-100">Vision Insurance</td><td className="p-3 text-right">${vision.toFixed(2)}</td></tr>}
              {retirement > 0 && <tr className="border-b border-gray-100"><td className="p-3"></td><td className="p-3"></td>
                <td className="p-3 border-l border-gray-100">401(k) Contribution</td><td className="p-3 text-right">${retirement.toFixed(2)}</td></tr>}
              {otherDeduction > 0 && <tr className="border-b border-gray-100"><td className="p-3"></td><td className="p-3"></td>
                <td className="p-3 border-l border-gray-100">{form.otherDeductionName || 'Other'}</td><td className="p-3 text-right">${otherDeduction.toFixed(2)}</td></tr>}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-bold border-t-2 border-gray-300">
                <td className="p-3">Gross Pay</td><td className="p-3 text-right">${grossPay.toFixed(2)}</td>
                <td className="p-3 border-l border-gray-200">Total Deductions</td><td className="p-3 text-right">${totalDeductions.toFixed(2)}</td>
              </tr>
              <tr className="bg-gray-900 text-white font-bold text-lg">
                <td className="p-4" colSpan={2}>NET PAY</td>
                <td className="p-4 text-right text-xl font-bold" colSpan={2}>${netPay.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          <div className="flex justify-between text-xs text-gray-400 border-t border-gray-200 pt-4">
            <p>Generated by SlateInvoice · For record-keeping purposes only</p>
            <p>This is not a legal payroll document. Consult a payroll professional for compliance.</p>
          </div>
        </div>

        {/* Upsell — hidden on print */}
        <div className="mt-6 p-4 bg-gray-900 border border-gray-700 rounded-xl flex items-center justify-between gap-4 print:hidden">
          <p className="text-sm text-gray-400">💡 Need invoices too? SlateInvoice handles invoicing, estimates, receipts and more.</p>
          <Link href="/dashboard" className="shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg font-medium transition-colors">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DownloadPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">Loading...</div>}>
      <DownloadInner />
    </Suspense>
  );
}
