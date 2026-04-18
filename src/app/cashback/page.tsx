'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Wallet, TrendingUp, Gift, Zap, ArrowRight, Copy, Check, Shield } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';
import { useCurrency } from '@/context/CurrencyContext';
import { formatPriceWithCurrency } from '@/lib/utils';

const HOW_IT_WORKS = [
  {
    icon: Zap,
    step: '01',
    title: 'Book Any Trip',
    body: 'Complete a trip booking through our checkout — domestic, international, or curated tours.',
  },
  {
    icon: TrendingUp,
    step: '02',
    title: 'Earn 10% Cashback',
    body: 'Instantly receive 10% of your booking value as cashback credited to your WanderLoot wallet.',
  },
  {
    icon: Wallet,
    step: '03',
    title: 'Apply on Next Booking',
    body: 'Use your wallet balance to reduce the total on your next trip. No expiry on wallet credits.',
  },
];

const PROMO_CODES = [
  { code: 'YLOO15', discount: '15% off', label: 'All trips' },
  { code: 'FIRST10', discount: '10% off', label: 'First booking' },
  { code: 'GROUP20', discount: '20% off', label: '4+ people' },
];


export default function WanderLootPage() {
  const { balance, transactions } = useWallet();
  const { currency } = useCurrency();
  const fp = (n: number) => formatPriceWithCurrency(n, currency);
  const [copied, setCopied] = useState<string | null>(null);

  const totalEarned = transactions.filter(t => t.type === 'cashback').reduce((s, t) => s + t.amount, 0) || 500;
  const totalUsed = transactions.filter(t => t.type === 'used').reduce((s, t) => s + t.amount, 0);

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-5 pb-16">
      <div className="section-container max-w-3xl">

        {/* Page header */}
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2">Your Rewards</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">WanderLoot Wallet</h1>
          <p className="text-gray-500 text-sm mt-2">Earn 10% cashback on every booking. Use it on your next adventure.</p>
        </div>

        {/* Balance card */}
        <div className="bg-gray-900 rounded-2xl p-6 md:p-8 mb-6">
          <p className="text-white/40 text-[10px] uppercase tracking-widest mb-3">WanderLoot</p>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-white/50 text-sm mb-1">Available balance</p>
              <p className="font-serif text-4xl md:text-5xl font-bold text-white">{fp(balance)}</p>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <Wallet size={22} className="text-white/70" />
            </div>
          </div>

          <div className="border-t border-white/10 mt-6 pt-5 grid grid-cols-3 gap-4">
            {[
              { label: 'Total Earned', value: fp(totalEarned || 500) },
              { label: 'Total Used', value: fp(totalUsed || 0) },
              { label: 'Cashback Rate', value: '10% / booking' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-white/35 text-[9px] uppercase tracking-widest mb-1">{label}</p>
                <p className="text-white font-semibold text-sm">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        {balance > 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="font-bold text-gray-900 text-sm">You have {fp(balance)} ready to use</p>
              <p className="text-gray-500 text-xs mt-0.5">Apply at checkout on your next trip — no minimum booking value.</p>
            </div>
            <Link href="/trips"
              className="shrink-0 flex items-center gap-2 bg-gray-900 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors whitespace-nowrap">
              Browse Trips <ArrowRight size={13} />
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="font-bold text-gray-900 text-sm">Book a trip to start earning</p>
              <p className="text-gray-500 text-xs mt-0.5">10% cashback is credited instantly after your first booking.</p>
            </div>
            <Link href="/trips"
              className="shrink-0 flex items-center gap-2 bg-gray-900 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors whitespace-nowrap">
              Browse Trips <ArrowRight size={13} />
            </Link>
          </div>
        )}

        {/* How it works */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
          <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-5">How It Works</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {HOW_IT_WORKS.map(({ icon: Icon, step, title, body }) => (
              <div key={step} className="flex gap-4 md:flex-col md:gap-3">
                <div className="shrink-0 w-10 h-10 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center">
                  <Icon size={16} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-1">Step {step}</p>
                  <p className="font-bold text-gray-900 text-sm mb-1">{title}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-gray-100 pt-4 flex items-start gap-2">
            <Shield size={13} className="text-gray-400 mt-0.5 shrink-0" />
            <p className="text-[11px] text-gray-400 leading-relaxed">
              <span className="font-semibold text-gray-600">Wallet cashback has no expiry.</span>{' '}
              Your balance is stored securely and can be used on any future trip, tour, or hotel booking.
            </p>
          </div>
        </div>

        {/* Promo codes */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
          <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-5">Promo Codes</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PROMO_CODES.map(({ code, discount, label }) => (
              <button key={code} onClick={() => copyCode(code)}
                className="flex items-center justify-between gap-2 border border-gray-200 hover:border-gray-400 bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 transition-all text-left">
                <div>
                  <p className="text-[10px] text-gray-400 leading-none mb-1">{label}</p>
                  <p className="font-bold text-gray-900 text-sm">{discount}</p>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg shrink-0">
                  {copied === code ? <Check size={11} /> : <Copy size={11} />}
                  {copied === code ? 'Copied' : code}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Transaction history */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-5">Transaction History</p>
          {transactions.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{tx.description}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <p className={`font-bold text-sm ${tx.type === 'cashback' ? 'text-green-600' : 'text-gray-700'}`}>
                    {tx.type === 'cashback' ? '+' : '−'}{fp(tx.amount)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-4">No transactions yet. Book a trip to earn cashback.</p>
          )}
        </div>

        {/* Refer & Earn */}
        <div className="mt-6 bg-gray-900 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Gift size={15} className="text-white/60" />
              <p className="text-white/50 text-[10px] uppercase tracking-widest">Refer & Earn</p>
            </div>
            <p className="font-serif text-xl font-bold text-white mb-1">Earn ₹1,000 per referral</p>
            <p className="text-white/50 text-xs">Your friend gets ₹1,000 off their first trip. You get ₹1,000 credited to your WanderLoot wallet instantly.</p>
          </div>
          <a href="https://wa.me/?text=Book%20your%20trip%20with%20YlooTrips%20and%20get%20₹1%2C000%20off!%20https%3A%2F%2Fylootrips.com"
            target="_blank" rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-2 bg-white text-gray-900 font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full hover:bg-gray-100 transition-colors whitespace-nowrap">
            Share & Earn <ArrowRight size={13} />
          </a>
        </div>

      </div>
    </main>
  );
}
