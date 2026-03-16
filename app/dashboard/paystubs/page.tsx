'use client';
import { useState } from 'react';

const PAY_PERIODS = ['Weekly', 'Bi-Weekly', 'Semi-Monthly', 'Monthly'];
const STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

interface StubForm {
  // Employer
  companyName: string;
  companyAddress: string;
  companyCity: string;
  companyState: string;
  companyZip: string;
  ein: string;
  // Employee
  employeeName: string;
  employeeAddress: string;
  employeeCity: string;
  employeeState: string;
  employeeZip: string;
  ssn: string;
  employeeId: string;
  // Pay info
  payPeriod: string;
  payDate: string;
  periodStart: string;
  periodEnd: string;
  payRate: string;
  rateType: 'hourly' | 'salary';
  hoursWorked: string;
  overtimeHours: string;
  overtimeRate: string;
  // Deductions
  federalFiling: string;
  stateCode: string;
  stateFiling: string;
  additionalFederal: string;
  health: string;
  dental: string;
  vision: string;
  retirement401k: string;
  otherDeductionName: string;
  otherDeductionAmount: string;
}

function calcFederalTax(gross: number, filing: string): number {
  // Simplified 2024 federal withholding estimate
  const annual = gross * 26; // assume bi-weekly
  let tax = 0;
  if (filing === 'single') {
    if (annual <= 11600) tax = annual * 0.10;
    else if (annual <= 47150) tax = 1160 + (annual - 11600) * 0.12;
    else if (annual <= 100525) tax = 5426 + (annual - 47150) * 0.22;
    else if (annual <= 191950) tax = 17168 + (annual - 100525) * 0.24;
    else tax = 39110 + (annual - 191950) * 0.32;
  } else {
    if (annual <= 23200) tax = annual * 0.10;
    else if (annual <= 94300) tax = 2320 + (annual - 23200) * 0.12;
    else if (annual <= 201050) tax = 10852 + (annual - 94300) * 0.22;
    else tax = 34337 + (annual - 201050) * 0.24;
  }
  return Math.max(0, (tax / 26));
}

function calcStateTax(gross: number, state: string): number {
  // Simplified flat-ish estimates by state
  const rates: Record<string, number> = {
    CA: 0.093, NY: 0.0685, NJ: 0.0637, MA: 0.05, IL: 0.0495,
    TX: 0, FL: 0, WA: 0, NV: 0, TN: 0, WY: 0, SD: 0, AK: 0,
    PA: 0.0307, OH: 0.0399, GA: 0.055, NC: 0.0525, VA: 0.0575,
    CO: 0.044, AZ: 0.025, MI: 0.0425, MN: 0.0985, OR: 0.099,
  };
  return gross * (rates[state] || 0.05);
}

export default function PayStubsPage() {
  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState<StubForm>({
    companyName: '', companyAddress: '', companyCity: '', companyState: 'NJ', companyZip: '', ein: '',
    employeeName: '', employeeAddress: '', employeeCity: '', employeeState: 'NJ', employeeZip: '', ssn: '', employeeId: '',
    payPeriod: 'Bi-Weekly', payDate: today, periodStart: today, periodEnd: today,
    payRate: '', rateType: 'hourly', hoursWorked: '80', overtimeHours: '0', overtimeRate: '',
    federalFiling: 'single', stateCode: 'NJ', stateFiling: 'single',
    additionalFederal: '0', health: '0', dental: '0', vision: '0', retirement401k: '0',
    otherDeductionName: '', otherDeductionAmount: '0',
  });

  const [step, setStep] = useState(1); // 1=employer, 2=employee, 3=pay, 4=deductions, 5=preview
  const [paying, setPaying] = useState(false);

  const f = (k: keyof StubForm, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  // Calculations
  const rate = parseFloat(form.payRate) || 0;
  const hours = parseFloat(form.hoursWorked) || 0;
  const otHours = parseFloat(form.overtimeHours) || 0;
  const otRate = parseFloat(form.overtimeRate) || rate * 1.5;

  const regularPay = form.rateType === 'hourly' ? rate * hours : rate;
  const overtimePay = form.rateType === 'hourly' ? otHours * otRate : 0;
  const grossPay = regularPay + overtimePay;

  const federalTax = calcFederalTax(grossPay, form.federalFiling) + (parseFloat(form.additionalFederal) || 0);
  const stateTax = calcStateTax(grossPay, form.stateCode);
  const socialSecurity = grossPay * 0.062;
  const medicare = grossPay * 0.0145;
  const health = parseFloat(form.health) || 0;
  const dental = parseFloat(form.dental) || 0;
  const vision = parseFloat(form.vision) || 0;
  const retirement = parseFloat(form.retirement401k) || 0;
  const otherDeduction = parseFloat(form.otherDeductionAmount) || 0;

  const totalDeductions = federalTax + stateTax + socialSecurity + medicare + health + dental + vision + retirement + otherDeduction;
  const netPay = grossPay - totalDeductions;

  const handleCheckout = async () => {
    setPaying(true);
    // Store form data in sessionStorage with token
    const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
    const stubData = { form, grossPay, regularPay, overtimePay, federalTax, stateTax, socialSecurity, medicare, health, dental, vision, retirement, otherDeduction, totalDeductions, netPay };
    sessionStorage.setItem(`paystub_${token}`, JSON.stringify(stubData));

    const res = await fetch('/api/paystubs/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stubToken: token }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else { alert('Payment failed. Please try again.'); setPaying(false); }
  };

  const inputClass = "w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500";
  const labelClass = "text-xs text-gray-500 mb-1 block";

  const steps = ['Employer', 'Employee', 'Pay Info', 'Deductions', 'Preview & Pay'];

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Pay Stub Generator</h1>
          <p className="text-gray-500 text-sm">Professional pay stubs in minutes — $5 per stub</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-1">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-1">
            <button onClick={() => setStep(i + 1)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                step === i + 1 ? 'bg-blue-600 text-white' : step > i + 1 ? 'bg-green-900/30 text-green-400' : 'bg-gray-800 text-gray-500'
              }`}>
              {step > i + 1 ? '✓' : i + 1}. {s}
            </button>
            {i < steps.length - 1 && <span className="text-gray-700">→</span>}
          </div>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

        {/* Step 1 — Employer */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-white mb-4">Employer Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2"><label className={labelClass}>Company Name *</label>
                <input value={form.companyName} onChange={e => f('companyName', e.target.value)} placeholder="Acme Plumbing LLC" className={inputClass} /></div>
              <div className="sm:col-span-2"><label className={labelClass}>Street Address</label>
                <input value={form.companyAddress} onChange={e => f('companyAddress', e.target.value)} placeholder="123 Main St" className={inputClass} /></div>
              <div><label className={labelClass}>City</label>
                <input value={form.companyCity} onChange={e => f('companyCity', e.target.value)} placeholder="Lyndhurst" className={inputClass} /></div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className={labelClass}>State</label>
                  <select value={form.companyState} onChange={e => f('companyState', e.target.value)} className={inputClass}>
                    {STATES.map(s => <option key={s}>{s}</option>)}
                  </select></div>
                <div><label className={labelClass}>ZIP</label>
                  <input value={form.companyZip} onChange={e => f('companyZip', e.target.value)} placeholder="07071" className={inputClass} /></div>
              </div>
              <div><label className={labelClass}>EIN (optional)</label>
                <input value={form.ein} onChange={e => f('ein', e.target.value)} placeholder="XX-XXXXXXX" className={inputClass} /></div>
            </div>
          </div>
        )}

        {/* Step 2 — Employee */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-white mb-4">Employee Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2"><label className={labelClass}>Employee Full Name *</label>
                <input value={form.employeeName} onChange={e => f('employeeName', e.target.value)} placeholder="John Smith" className={inputClass} /></div>
              <div className="sm:col-span-2"><label className={labelClass}>Street Address</label>
                <input value={form.employeeAddress} onChange={e => f('employeeAddress', e.target.value)} placeholder="456 Oak Ave" className={inputClass} /></div>
              <div><label className={labelClass}>City</label>
                <input value={form.employeeCity} onChange={e => f('employeeCity', e.target.value)} placeholder="Rutherford" className={inputClass} /></div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className={labelClass}>State</label>
                  <select value={form.employeeState} onChange={e => f('employeeState', e.target.value)} className={inputClass}>
                    {STATES.map(s => <option key={s}>{s}</option>)}
                  </select></div>
                <div><label className={labelClass}>ZIP</label>
                  <input value={form.employeeZip} onChange={e => f('employeeZip', e.target.value)} placeholder="07070" className={inputClass} /></div>
              </div>
              <div><label className={labelClass}>SSN (last 4 shown on stub)</label>
                <input value={form.ssn} onChange={e => f('ssn', e.target.value)} placeholder="XXX-XX-1234" className={inputClass} /></div>
              <div><label className={labelClass}>Employee ID (optional)</label>
                <input value={form.employeeId} onChange={e => f('employeeId', e.target.value)} placeholder="EMP001" className={inputClass} /></div>
            </div>
          </div>
        )}

        {/* Step 3 — Pay Info */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-white mb-4">Pay Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className={labelClass}>Pay Period</label>
                <select value={form.payPeriod} onChange={e => f('payPeriod', e.target.value)} className={inputClass}>
                  {PAY_PERIODS.map(p => <option key={p}>{p}</option>)}
                </select></div>
              <div><label className={labelClass}>Pay Date *</label>
                <input type="date" value={form.payDate} onChange={e => f('payDate', e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>Period Start</label>
                <input type="date" value={form.periodStart} onChange={e => f('periodStart', e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>Period End</label>
                <input type="date" value={form.periodEnd} onChange={e => f('periodEnd', e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>Pay Type</label>
                <select value={form.rateType} onChange={e => f('rateType', e.target.value as 'hourly' | 'salary')} className={inputClass}>
                  <option value="hourly">Hourly</option>
                  <option value="salary">Salary (per period)</option>
                </select></div>
              <div><label className={labelClass}>{form.rateType === 'hourly' ? 'Hourly Rate ($)' : 'Salary per Period ($)'}</label>
                <input type="number" value={form.payRate} onChange={e => f('payRate', e.target.value)} placeholder="25.00" min="0" step="0.01" className={inputClass} /></div>
              {form.rateType === 'hourly' && <>
                <div><label className={labelClass}>Regular Hours</label>
                  <input type="number" value={form.hoursWorked} onChange={e => f('hoursWorked', e.target.value)} placeholder="80" className={inputClass} /></div>
                <div><label className={labelClass}>Overtime Hours</label>
                  <input type="number" value={form.overtimeHours} onChange={e => f('overtimeHours', e.target.value)} placeholder="0" className={inputClass} /></div>
                <div><label className={labelClass}>OT Rate (leave blank for 1.5x)</label>
                  <input type="number" value={form.overtimeRate} onChange={e => f('overtimeRate', e.target.value)} placeholder={`${(rate * 1.5).toFixed(2)}`} className={inputClass} /></div>
              </>}
            </div>

            {/* Live calc preview */}
            {grossPay > 0 && (
              <div className="mt-4 p-4 bg-gray-800 rounded-xl">
                <div className="flex justify-between text-sm"><span className="text-gray-400">Regular Pay</span><span className="text-white">${regularPay.toFixed(2)}</span></div>
                {overtimePay > 0 && <div className="flex justify-between text-sm mt-1"><span className="text-gray-400">Overtime Pay</span><span className="text-white">${overtimePay.toFixed(2)}</span></div>}
                <div className="flex justify-between text-base font-bold mt-2 pt-2 border-t border-gray-700"><span className="text-white">Gross Pay</span><span className="text-green-400">${grossPay.toFixed(2)}</span></div>
              </div>
            )}
          </div>
        )}

        {/* Step 4 — Deductions */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-white mb-4">Deductions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className={labelClass}>Federal Filing Status</label>
                <select value={form.federalFiling} onChange={e => f('federalFiling', e.target.value)} className={inputClass}>
                  <option value="single">Single</option>
                  <option value="married">Married Filing Jointly</option>
                </select></div>
              <div><label className={labelClass}>Additional Federal Withholding ($)</label>
                <input type="number" value={form.additionalFederal} onChange={e => f('additionalFederal', e.target.value)} placeholder="0" className={inputClass} /></div>
              <div><label className={labelClass}>State</label>
                <select value={form.stateCode} onChange={e => f('stateCode', e.target.value)} className={inputClass}>
                  {STATES.map(s => <option key={s}>{s}</option>)}
                </select></div>
              <div><label className={labelClass}>Health Insurance ($/period)</label>
                <input type="number" value={form.health} onChange={e => f('health', e.target.value)} placeholder="0" className={inputClass} /></div>
              <div><label className={labelClass}>Dental ($/period)</label>
                <input type="number" value={form.dental} onChange={e => f('dental', e.target.value)} placeholder="0" className={inputClass} /></div>
              <div><label className={labelClass}>Vision ($/period)</label>
                <input type="number" value={form.vision} onChange={e => f('vision', e.target.value)} placeholder="0" className={inputClass} /></div>
              <div><label className={labelClass}>401(k) Contribution ($/period)</label>
                <input type="number" value={form.retirement401k} onChange={e => f('retirement401k', e.target.value)} placeholder="0" className={inputClass} /></div>
              <div><label className={labelClass}>Other Deduction Name</label>
                <input value={form.otherDeductionName} onChange={e => f('otherDeductionName', e.target.value)} placeholder="Union Dues" className={inputClass} /></div>
              <div><label className={labelClass}>Other Deduction Amount ($)</label>
                <input type="number" value={form.otherDeductionAmount} onChange={e => f('otherDeductionAmount', e.target.value)} placeholder="0" className={inputClass} /></div>
            </div>

            {/* Deduction preview */}
            <div className="mt-4 p-4 bg-gray-800 rounded-xl space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Gross Pay</span><span className="text-white">${grossPay.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Federal Tax</span><span className="text-red-400">-${federalTax.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">State Tax ({form.stateCode})</span><span className="text-red-400">-${stateTax.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Social Security (6.2%)</span><span className="text-red-400">-${socialSecurity.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Medicare (1.45%)</span><span className="text-red-400">-${medicare.toFixed(2)}</span></div>
              {health > 0 && <div className="flex justify-between"><span className="text-gray-400">Health Insurance</span><span className="text-red-400">-${health.toFixed(2)}</span></div>}
              {dental > 0 && <div className="flex justify-between"><span className="text-gray-400">Dental</span><span className="text-red-400">-${dental.toFixed(2)}</span></div>}
              {vision > 0 && <div className="flex justify-between"><span className="text-gray-400">Vision</span><span className="text-red-400">-${vision.toFixed(2)}</span></div>}
              {retirement > 0 && <div className="flex justify-between"><span className="text-gray-400">401(k)</span><span className="text-red-400">-${retirement.toFixed(2)}</span></div>}
              {otherDeduction > 0 && <div className="flex justify-between"><span className="text-gray-400">{form.otherDeductionName || 'Other'}</span><span className="text-red-400">-${otherDeduction.toFixed(2)}</span></div>}
              <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-700">
                <span className="text-white">Net Pay</span><span className="text-green-400">${netPay.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 5 — Preview */}
        {step === 5 && (
          <div className="space-y-6">
            <h2 className="font-semibold text-white mb-2">Preview Your Pay Stub</h2>
            <p className="text-gray-500 text-sm mb-4">Review the information below then pay $5 to download your PDF.</p>

            {/* Pay stub preview */}
            <div className="bg-white text-gray-900 rounded-xl p-6 text-sm font-mono">
              <div className="flex justify-between items-start border-b-2 border-gray-800 pb-4 mb-4">
                <div>
                  <p className="font-bold text-lg text-gray-900">{form.companyName || 'Company Name'}</p>
                  <p className="text-gray-600">{form.companyAddress}</p>
                  <p className="text-gray-600">{form.companyCity}{form.companyCity && ','} {form.companyState} {form.companyZip}</p>
                  {form.ein && <p className="text-gray-600">EIN: {form.ein}</p>}
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">PAY STUB</p>
                  <p className="text-gray-600">Pay Date: {form.payDate}</p>
                  <p className="text-gray-600">Period: {form.periodStart} – {form.periodEnd}</p>
                  <p className="text-gray-600">{form.payPeriod}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="font-bold text-gray-700 text-xs uppercase mb-1">Employee</p>
                  <p className="font-semibold">{form.employeeName || 'Employee Name'}</p>
                  <p className="text-gray-600">{form.employeeAddress}</p>
                  <p className="text-gray-600">{form.employeeCity}{form.employeeCity && ','} {form.employeeState} {form.employeeZip}</p>
                  {form.ssn && <p className="text-gray-600">SSN: {form.ssn}</p>}
                  {form.employeeId && <p className="text-gray-600">ID: {form.employeeId}</p>}
                </div>
                <div>
                  <p className="font-bold text-gray-700 text-xs uppercase mb-1">Pay Rate</p>
                  <p>{form.rateType === 'hourly' ? `$${rate.toFixed(2)}/hr` : `$${rate.toFixed(2)}/period`}</p>
                  {form.rateType === 'hourly' && <p className="text-gray-600">Regular: {form.hoursWorked} hrs</p>}
                  {otHours > 0 && <p className="text-gray-600">Overtime: {form.overtimeHours} hrs @ ${otRate.toFixed(2)}</p>}
                </div>
              </div>

              <table className="w-full text-xs mb-4">
                <thead><tr className="bg-gray-100">
                  <th className="text-left p-2">Earnings</th><th className="text-right p-2">Amount</th>
                  <th className="text-left p-2 border-l border-gray-300">Deductions</th><th className="text-right p-2">Amount</th>
                </tr></thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="p-2">Regular Pay</td><td className="p-2 text-right">${regularPay.toFixed(2)}</td>
                    <td className="p-2 border-l border-gray-300">Federal Tax</td><td className="p-2 text-right">${federalTax.toFixed(2)}</td>
                  </tr>
                  {overtimePay > 0 && <tr className="border-b border-gray-100">
                    <td className="p-2">Overtime Pay</td><td className="p-2 text-right">${overtimePay.toFixed(2)}</td>
                    <td className="p-2 border-l border-gray-300">State Tax ({form.stateCode})</td><td className="p-2 text-right">${stateTax.toFixed(2)}</td>
                  </tr>}
                  <tr className="border-b border-gray-100">
                    <td className="p-2"></td><td className="p-2"></td>
                    <td className="p-2 border-l border-gray-300">Social Security</td><td className="p-2 text-right">${socialSecurity.toFixed(2)}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-2"></td><td className="p-2"></td>
                    <td className="p-2 border-l border-gray-300">Medicare</td><td className="p-2 text-right">${medicare.toFixed(2)}</td>
                  </tr>
                  {health > 0 && <tr className="border-b border-gray-100"><td className="p-2"></td><td className="p-2"></td>
                    <td className="p-2 border-l border-gray-300">Health Insurance</td><td className="p-2 text-right">${health.toFixed(2)}</td></tr>}
                  {dental > 0 && <tr className="border-b border-gray-100"><td className="p-2"></td><td className="p-2"></td>
                    <td className="p-2 border-l border-gray-300">Dental</td><td className="p-2 text-right">${dental.toFixed(2)}</td></tr>}
                  {retirement > 0 && <tr className="border-b border-gray-100"><td className="p-2"></td><td className="p-2"></td>
                    <td className="p-2 border-l border-gray-300">401(k)</td><td className="p-2 text-right">${retirement.toFixed(2)}</td></tr>}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 font-bold">
                    <td className="p-2">Gross Pay</td><td className="p-2 text-right">${grossPay.toFixed(2)}</td>
                    <td className="p-2 border-l border-gray-300">Total Deductions</td><td className="p-2 text-right">${totalDeductions.toFixed(2)}</td>
                  </tr>
                  <tr className="bg-gray-800 text-white font-bold">
                    <td className="p-2" colSpan={2}>NET PAY</td>
                    <td className="p-2 text-right text-lg" colSpan={2}>${netPay.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>

              <p className="text-xs text-gray-400 text-center mt-2">Generated by InvoiceBuddy · This document is for record-keeping purposes</p>
            </div>

            {/* Pay CTA */}
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-white font-semibold">Ready to download?</p>
                <p className="text-gray-400 text-sm">Pay $5 to get a print-ready PDF of this pay stub</p>
                <p className="text-gray-500 text-xs mt-1">No account needed · Secure payment via Stripe</p>
              </div>
              <button onClick={handleCheckout} disabled={paying}
                className="shrink-0 px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white rounded-xl font-bold transition-colors">
                {paying ? 'Redirecting...' : 'Pay $5 & Download PDF'}
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-800">
          {step > 1 ? (
            <button onClick={() => setStep(s => s - 1)} className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors">
              ← Back
            </button>
          ) : <div />}
          {step < 5 && (
            <button onClick={() => setStep(s => s + 1)} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors">
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}