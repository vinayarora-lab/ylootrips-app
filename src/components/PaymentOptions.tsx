'use client';

import { useState } from 'react';
import {
  CreditCard, CalendarDays, Percent, Lock, ChevronRight,
  CheckCircle, Info, Wallet, AlertCircle, Shield,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface EmiPlan {
  months: number;
  monthlyAmount: number;
  totalAmount: number;
  savings: number;
  tag?: string;
}

interface PaymentOptionsProps {
  tripPrice: number;               // Total trip price in INR
  tripTitle?: string;
  onProceed?: (payload: PaymentPayload) => void;
}

interface PaymentPayload {
  mode: 'full' | 'emi' | 'partial';
  amountNow: number;
  emiPlan?: EmiPlan;
  bank?: string;
  paymentMethod?: string;
}

// Payment is processed via Easebuzz — see api.initiatePayment() in src/lib/api.ts
// onProceed callback carries the selected plan; the parent checkout page
// calls api.createBooking() → api.initiatePayment() → redirects to Easebuzz URL.

// ─── Constants ────────────────────────────────────────────────────────────────

const BANKS = [
  { id: 'hdfc',  name: 'HDFC',  color: '#004C8F', bg: '#EBF3FF', offer: '0% EMI up to 12 months' },
  { id: 'icici', name: 'ICICI', color: '#B02A30', bg: '#FFEBEC', offer: '0% EMI up to 9 months'  },
  { id: 'axis',  name: 'Axis',  color: '#97144D', bg: '#FFEEF5', offer: '0% EMI up to 6 months'  },
  { id: 'sbi',   name: 'SBI',   color: '#22409A', bg: '#EEF1FF', offer: '0% EMI up to 6 months'  },
];

const PARTIAL_SCHEDULE = [
  { label: 'Pay now',                  pct: 20, when: 'Today',               color: 'bg-primary',      dot: 'bg-primary' },
  { label: '30 days before departure', pct: 30, when: '30 days before trip',  color: 'bg-secondary',    dot: 'bg-secondary' },
  { label: 'At departure',             pct: 50, when: 'Day of travel',        color: 'bg-terracotta',   dot: 'bg-terracotta' },
];

function buildEmiPlans(price: number): EmiPlan[] {
  return [
    { months: 3,  monthlyAmount: Math.ceil(price / 3),  totalAmount: price, savings: 0, tag: 'Popular' },
    { months: 6,  monthlyAmount: Math.ceil(price / 6),  totalAmount: price, savings: 0, tag: 'Best value' },
    { months: 12, monthlyAmount: Math.ceil(price / 12), totalAmount: price, savings: 0 },
  ];
}

function fmt(n: number) {
  return '₹' + Math.round(n).toLocaleString('en-IN');
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 px-2 text-sm font-medium rounded-xl transition-all ${
        active
          ? 'bg-primary text-cream shadow-sm'
          : 'text-secondary hover:text-primary hover:bg-cream-dark'
      }`}
    >
      {children}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const PAYMENT_METHODS = [
  { id: 'upi',          label: 'UPI',          icon: '📱', sub: '5% instant discount', discount: 5 },
  { id: 'credit_card',  label: 'Credit Card',  icon: '💳', sub: '3% off · Visa / MC / Amex', discount: 3 },
  { id: 'debit_card',   label: 'Debit Card',   icon: '🏦', sub: 'All major banks', discount: 0 },
  { id: 'net_banking',  label: 'Net Banking',  icon: '🏛️', sub: 'HDFC / ICICI / SBI / Axis', discount: 0 },
  { id: 'wallet',       label: 'Wallets',      icon: '👛', sub: 'Paytm · PhonePe · GPay', discount: 0 },
];

export default function PaymentOptions({ tripPrice, tripTitle, onProceed }: PaymentOptionsProps) {
  const [tab, setTab] = useState<'full' | 'emi' | 'partial'>('full');
  const [selectedEmi, setSelectedEmi] = useState<EmiPlan | null>(null);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>('upi');
  const [processing, setProcessing] = useState(false);

  const emiPlans = buildEmiPlans(tripPrice);
  const emiEligible = tripPrice >= 5000;
  const partialNow = Math.ceil(tripPrice * 0.2);
  const partial30d = Math.ceil(tripPrice * 0.3);
  const partialDepart = tripPrice - partialNow - partial30d;

  const amountNow =
    tab === 'full'    ? tripPrice :
    tab === 'partial' ? partialNow :
    selectedEmi       ? selectedEmi.monthlyAmount : 0;

  const canProceed =
    tab === 'full' ||
    tab === 'partial' ||
    (tab === 'emi' && selectedEmi !== null);

  const handleProceed = () => {
    if (!canProceed) return;
    setProcessing(true);

    const payload: PaymentPayload = {
      mode: tab,
      amountNow,
      emiPlan: tab === 'emi' ? (selectedEmi ?? undefined) : undefined,
      bank:    tab === 'emi' ? (selectedBank ?? undefined) : undefined,
      paymentMethod: tab === 'emi' ? 'credit_card' : selectedMethod,
    };

    console.log('[PaymentOptions] Selected:', payload);
    // Parent checkout page handles api.createBooking() → api.initiatePayment() → Easebuzz redirect
    onProceed?.(payload);
    setProcessing(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-cream-dark shadow-sm overflow-hidden">

      {/* ── Header: Price breakdown ─────────────────────────────────────────── */}
      <div className="bg-primary px-5 py-5 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-cream-dark text-xs font-medium uppercase tracking-wider mb-1">Total Trip Price</p>
            <p className="font-display text-3xl sm:text-4xl text-cream font-semibold">{fmt(tripPrice)}</p>
            {tripTitle && <p className="text-cream-dark text-sm mt-1 truncate max-w-xs">{tripTitle}</p>}
          </div>
          <div className="flex-shrink-0 bg-accent/20 border border-accent/30 rounded-xl px-3 py-2 text-right">
            <p className="text-accent text-xs font-semibold">Includes</p>
            <p className="text-cream text-xs mt-0.5">All taxes</p>
            <p className="text-cream text-xs">No hidden fees</p>
          </div>
        </div>

        {/* Price bar */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { label: '20% Now',    value: fmt(partialNow) },
            { label: '30% @ -30d', value: fmt(partial30d) },
            { label: '50% Travel', value: fmt(partialDepart) },
          ].map(({ label, value }) => (
            <div key={label} className="bg-primary-light rounded-lg px-3 py-2 text-center">
              <p className="text-cream-dark text-[10px] uppercase tracking-wide">{label}</p>
              <p className="text-cream text-sm font-semibold mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────────────── */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex gap-1.5 bg-cream p-1 rounded-xl">
          <TabButton active={tab === 'full'}    onClick={() => setTab('full')}>
            <span className="flex items-center justify-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" />Pay Full
            </span>
          </TabButton>
          <TabButton active={tab === 'emi'}     onClick={() => setTab('emi')}>
            <span className="flex items-center justify-center gap-1.5">
              <Percent className="w-3.5 h-3.5" />Pay in EMI
            </span>
          </TabButton>
          <TabButton active={tab === 'partial'} onClick={() => setTab('partial')}>
            <span className="flex items-center justify-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5" />Pay 20% Now
            </span>
          </TabButton>
        </div>
      </div>

      {/* ── Tab content ─────────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-5 pb-4">

        {/* PAY FULL */}
        {tab === 'full' && (
          <div className="space-y-3 pt-3">
            {/* Payment method selector */}
            <p className="text-xs font-semibold text-secondary uppercase tracking-wider">Choose Payment Method</p>
            <div className="space-y-2">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMethod(m.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left ${
                    selectedMethod === m.id
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-cream-dark hover:border-secondary/40 bg-cream'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedMethod === m.id ? 'border-primary' : 'border-secondary/30'
                    }`}>
                      {selectedMethod === m.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <span className="text-lg">{m.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-primary">{m.label}</p>
                      <p className="text-xs text-secondary mt-0.5">{m.sub}</p>
                    </div>
                  </div>
                  {m.discount > 0 && (
                    <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full shrink-0">
                      {m.discount}% OFF
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Perks row */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {[
                { icon: CheckCircle, text: 'Instant confirmation' },
                { icon: Wallet,  text: 'Earn 10% cashback' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs text-secondary">
                  <Icon className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAY IN EMI */}
        {tab === 'emi' && (
          <div className="space-y-4 pt-3">
            {/* Eligibility note */}
            <div className={`flex items-start gap-2 text-xs px-3 py-2.5 rounded-lg border ${emiEligible ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
              {emiEligible
                ? <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                : <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />}
              {emiEligible
                ? <span>No-cost EMI available · 0% interest · No processing fee</span>
                : <span>No-cost EMI available on orders above ₹5,000</span>}
            </div>

            {/* EMI plans */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-secondary uppercase tracking-wider">Select EMI Plan</p>
              {emiPlans.map(plan => (
                <button
                  key={plan.months}
                  onClick={() => setSelectedEmi(plan)}
                  disabled={!emiEligible}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all text-left ${
                    selectedEmi?.months === plan.months
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-cream-dark hover:border-secondary/40 bg-cream'
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedEmi?.months === plan.months ? 'border-primary' : 'border-secondary/30'
                    }`}>
                      {selectedEmi?.months === plan.months && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-primary">{plan.months} months</p>
                        {plan.tag && (
                          <span className="text-[10px] font-bold bg-accent/20 text-secondary px-2 py-0.5 rounded-full">
                            {plan.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-secondary mt-0.5">0% interest · No processing fee</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg font-semibold text-primary">{fmt(plan.monthlyAmount)}<span className="text-xs font-normal text-secondary">/mo</span></p>
                    <p className="text-xs text-secondary">Total: {fmt(plan.totalAmount)}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Bank selection */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <p className="text-xs font-semibold text-secondary uppercase tracking-wider">Select Bank</p>
                <div className="flex items-center gap-1 text-[10px] text-secondary">
                  <Info className="w-3 h-3" />
                  No-cost EMI on these cards
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {BANKS.map(bank => (
                  <button
                    key={bank.id}
                    onClick={() => setSelectedBank(bank.id)}
                    disabled={!emiEligible}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                      selectedBank === bank.id
                        ? 'border-primary ring-1 ring-primary'
                        : 'border-cream-dark hover:border-secondary/30'
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    {/* Bank logo placeholder */}
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-black text-xs"
                      style={{ backgroundColor: bank.bg, color: bank.color }}
                    >
                      {bank.name}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-primary">{bank.name} Bank</p>
                      <p className="text-[10px] text-secondary leading-tight mt-0.5">{bank.offer}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected EMI summary */}
            {selectedEmi && (
              <div className="bg-primary/5 border border-primary/10 rounded-xl px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs text-secondary">You pay today</p>
                  <p className="font-display text-xl font-semibold text-primary">{fmt(selectedEmi.monthlyAmount)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-secondary">Then {selectedEmi.months - 1} more payments of</p>
                  <p className="font-semibold text-primary text-sm">{fmt(selectedEmi.monthlyAmount)}/month</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PAY 20% NOW */}
        {tab === 'partial' && (
          <div className="space-y-4 pt-3">
            <p className="text-sm text-secondary leading-relaxed">
              Reserve your trip today with just <strong className="text-primary">20% upfront</strong>. The rest is spread across two simple payments before your journey begins.
            </p>

            {/* Schedule timeline */}
            <div className="space-y-2">
              {PARTIAL_SCHEDULE.map(({ label, pct, when, dot }, i) => {
                const amount = i === 0 ? partialNow : i === 1 ? partial30d : partialDepart;
                return (
                  <div key={label} className="flex items-start gap-3">
                    {/* Timeline */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className={`w-3 h-3 rounded-full mt-1 ${dot}`} />
                      {i < 2 && <div className="w-0.5 h-8 bg-cream-dark mt-1" />}
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-primary">{pct}% — {label}</p>
                          <p className="text-xs text-secondary mt-0.5">{when}</p>
                        </div>
                        <p className="font-display text-lg font-semibold text-primary">{fmt(amount)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Highlight */}
            <div className="bg-cream border border-cream-dark rounded-xl p-3.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <Wallet className="w-4 h-4 text-cream" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">Pay just {fmt(partialNow)} today</p>
                  <p className="text-xs text-secondary mt-0.5">Secure your spot · Cancel free up to 7 days before</p>
                </div>
              </div>
            </div>

            {/* Bullet benefits */}
            <div className="space-y-1.5">
              {[
                'Flexible — reschedule up to 14 days before departure',
                'Auto-reminders before each payment is due',
                'Full refund if you cancel within 24 hours of booking',
              ].map(b => (
                <div key={b} className="flex items-start gap-2 text-xs text-secondary">
                  <CheckCircle className="w-3.5 h-3.5 text-accent flex-shrink-0 mt-0.5" />
                  {b}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Divider + Amount summary ──────────────────────────────────────── */}
      <div className="mx-4 sm:mx-5 border-t border-cream-dark" />
      <div className="px-4 sm:px-5 py-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-secondary">
            {tab === 'full'    ? 'Paying full amount' :
             tab === 'partial' ? 'Amount due today' :
             selectedEmi       ? `First EMI of ${selectedEmi.months}` : 'Select a plan above'}
          </p>
          <p className="font-display text-2xl font-semibold text-primary">
            {tab === 'full' || tab === 'partial' || selectedEmi
              ? fmt(amountNow)
              : '—'}
          </p>
        </div>
        <div className="text-right text-xs text-secondary">
          <p className="flex items-center gap-1 justify-end">
            <Lock className="w-3 h-3" /> 256-bit SSL
          </p>
          <p>PCI-DSS compliant</p>
        </div>
      </div>

      {/* ── Proceed button ───────────────────────────────────────────────── */}
      <div className="px-4 sm:px-5 pb-5">
        <button
          onClick={handleProceed}
          disabled={!canProceed || processing}
          className="w-full flex items-center justify-center gap-2.5 bg-primary hover:bg-primary-light text-cream font-semibold text-sm py-4 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        >
          {processing ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Opening payment...
            </span>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Proceed to Pay
              {(tab === 'full' || tab === 'partial' || selectedEmi) && (
                <span className="font-display text-base">{fmt(amountNow)}</span>
              )}
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
        <p className="text-center text-[11px] text-secondary mt-2.5">
          Powered by Easebuzz · UPI · Cards · EMI · Net Banking · Wallets
        </p>
      </div>
    </div>
  );
}
