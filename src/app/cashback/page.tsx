'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Wallet, Gift, Clock, CheckCircle, Copy, ChevronDown, ChevronUp,
  ArrowUpRight, Sparkles, TrendingUp, Shield, Zap,
} from 'lucide-react';
import { useWallet } from '@/context/WalletContext';
import { useCurrency } from '@/context/CurrencyContext';
import { formatPriceWithCurrency } from '@/lib/utils';

const PROMO_CODES = [
  {
    code: 'WELCOME10',
    title: '10% Off First Booking',
    desc: 'Get 10% off your very first trip booking. Valid for all domestic & international trips.',
    discount: '10% OFF',
    validTill: '31 Dec 2026',
    color: 'from-amber-500 to-orange-500',
    badge: 'New User',
    badgeBg: 'bg-amber-100 text-amber-700',
    minOrder: '₹2,000',
  },
  {
    code: 'TRIPFIVE',
    title: '₹500 Off on Orders ₹5,000+',
    desc: 'Flat ₹500 discount on any trip booking of ₹5,000 or above.',
    discount: '₹500 OFF',
    validTill: '30 Jun 2026',
    color: 'from-green-500 to-teal-500',
    badge: 'Popular',
    badgeBg: 'bg-green-100 text-green-700',
    minOrder: '₹5,000',
  },
  {
    code: 'HOLIDAY15',
    title: '15% Off Holiday Packages',
    desc: 'Special discount on curated holiday packages above ₹25,000.',
    discount: '15% OFF',
    validTill: '15 Aug 2026',
    color: 'from-purple-500 to-violet-600',
    badge: 'Limited',
    badgeBg: 'bg-purple-100 text-purple-700',
    minOrder: '₹25,000',
  },
  {
    code: 'INDIATRAVEL',
    title: '₹1,000 Off India Tours',
    desc: 'Flat ₹1,000 off on our curated India tour packages (Golden Triangle, Kerala, Rajasthan).',
    discount: '₹1,000 OFF',
    validTill: '31 Mar 2027',
    color: 'from-terracotta to-rose-600',
    badge: 'India Tours',
    badgeBg: 'bg-rose-100 text-rose-700',
    minOrder: '₹15,000',
  },
];

const HOW_IT_WORKS = [
  { icon: Zap, step: '01', title: 'Book Any Trip', desc: 'Complete a trip booking through our checkout — domestic, international, or curated tours.' },
  { icon: TrendingUp, step: '02', title: 'Earn 10% Cashback', desc: 'Instantly receive 10% of your booking value as cashback in your WanderLoot.' },
  { icon: Wallet, step: '03', title: 'Apply on Next Booking', desc: 'Use your wallet balance to reduce the total on your next trip. No expiry on cashback.' },
];

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase bg-white border border-dashed border-primary/30 hover:border-primary/60 px-3 py-1.5 rounded-lg transition-all"
    >
      {copied ? <CheckCircle size={13} className="text-green-600" /> : <Copy size={13} />}
      {copied ? 'Copied!' : code}
    </button>
  );
}

function TransactionRow({ txn }: { txn: ReturnType<typeof useWallet>['transactions'][0] }) {
  const { currency } = useCurrency();
  const fp = (p: number) => formatPriceWithCurrency(p, currency);
  const date = new Date(txn.date);
  const isCredit = txn.type === 'cashback';
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-primary/5 last:border-0">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isCredit ? 'bg-green-100' : 'bg-amber-100'}`}>
          {isCredit
            ? <TrendingUp size={15} className="text-green-600" />
            : <Wallet size={15} className="text-amber-600" />}
        </div>
        <div>
          <p className="text-sm font-medium text-primary leading-tight">{txn.description}</p>
          <p className="text-[11px] text-primary/40 mt-0.5">
            {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            {txn.bookingRef && ` · Ref: ${txn.bookingRef.slice(0, 12)}…`}
          </p>
        </div>
      </div>
      <span className={`text-sm font-semibold tabular-nums ${isCredit ? 'text-green-600' : 'text-amber-600'}`}>
        {isCredit ? '+' : '-'}{fp(txn.amount)}
      </span>
    </div>
  );
}

export default function CashbackPage() {
  const { balance, transactions } = useWallet();
  const { currency } = useCurrency();
  const fp = (p: number) => formatPriceWithCurrency(p, currency);
  const [showAll, setShowAll] = useState(false);

  const visibleTxns = showAll ? transactions : transactions.slice(0, 5);
  const totalEarned = transactions.filter(t => t.type === 'cashback').reduce((s, t) => s + t.amount, 0);
  const totalUsed = transactions.filter(t => t.type === 'used').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="min-h-screen bg-cream pt-24 pb-20">
      <div className="section-container max-w-4xl mx-auto">

        {/* Page header */}
        <div className="mb-8">
          <p className="text-caption uppercase tracking-[0.3em] text-amber-600 mb-2">✨ No cap, real rewards</p>
          <h1 className="font-display text-3xl md:text-display-xl text-primary">WanderLoot 💸</h1>
          <p className="text-primary/55 mt-2">Book trips, stack loot. 10% cashback hits your wallet instantly — use it to slay your next adventure.</p>
        </div>

        {/* Wallet balance card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white p-7 md:p-10 mb-8 shadow-xl shadow-amber-500/20">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-8 -right-8 w-64 h-64 rounded-full bg-white" />
            <div className="absolute -bottom-12 -left-8 w-48 h-48 rounded-full bg-white" />
          </div>

          <div className="relative">
            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="text-white/70 text-xs uppercase tracking-widest font-semibold mb-1">WanderLoot</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-5xl md:text-6xl font-light">{fp(balance)}</span>
                </div>
                <p className="text-white/60 text-sm mt-1.5">Available balance</p>
              </div>
              <div className="w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Wallet size={26} className="text-white" />
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
              <div>
                <p className="text-white/55 text-[11px] uppercase tracking-wider mb-1">Total Earned</p>
                <p className="font-semibold text-lg">{fp(totalEarned)}</p>
              </div>
              <div>
                <p className="text-white/55 text-[11px] uppercase tracking-wider mb-1">Total Used</p>
                <p className="font-semibold text-lg">{fp(totalUsed)}</p>
              </div>
              <div>
                <p className="text-white/55 text-[11px] uppercase tracking-wider mb-1">Cashback Rate</p>
                <p className="font-semibold text-lg">10% / booking</p>
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-2xl border border-primary/8 p-6 md:p-8 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles size={18} className="text-amber-500" />
            <h2 className="font-display text-xl text-primary">How It Works</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="flex gap-4">
                <div className="shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center">
                    <Icon size={18} className="text-amber-600" />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-amber-500 tracking-widest uppercase mb-1">Step {step}</p>
                  <p className="font-semibold text-primary text-sm mb-1">{title}</p>
                  <p className="text-primary/50 text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 items-start">
            <Shield size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800">
              <span className="font-semibold">Wallet cashback has no expiry.</span> Your balance is stored securely and can be used on any future trip, tour, or hotel booking.
            </p>
          </div>
        </div>

        {/* Active Promo Codes */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-5">
            <Gift size={18} className="text-amber-500" />
            <h2 className="font-display text-xl text-primary">Active Promo Codes</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {PROMO_CODES.map((promo) => (
              <div key={promo.code} className="bg-white rounded-2xl border border-primary/8 overflow-hidden hover:shadow-md transition-shadow">
                {/* Colour bar */}
                <div className={`h-1.5 bg-gradient-to-r ${promo.color}`} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${promo.badgeBg}`}>
                        {promo.badge}
                      </span>
                      <h3 className="font-semibold text-primary mt-2 leading-snug">{promo.title}</h3>
                    </div>
                    <div className={`shrink-0 text-lg font-bold bg-gradient-to-r ${promo.color} bg-clip-text text-transparent`}>
                      {promo.discount}
                    </div>
                  </div>
                  <p className="text-xs text-primary/50 leading-relaxed mb-4">{promo.desc}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] text-primary/40">
                      Min. order {promo.minOrder} · Valid till {promo.validTill}
                    </div>
                    <CopyButton code={promo.code} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-2xl border border-primary/8 overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-primary/5 flex items-center gap-2">
            <Clock size={17} className="text-primary/40" />
            <h2 className="font-display text-xl text-primary">Cashback History</h2>
          </div>

          {transactions.length === 0 ? (
            <div className="py-16 text-center px-6">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet size={26} className="text-amber-400" />
              </div>
              <p className="font-medium text-primary mb-1">No transactions yet</p>
              <p className="text-sm text-primary/45 mb-6">Complete your first booking to start earning cashback</p>
              <Link
                href="/trips"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors"
              >
                Browse Trips <ArrowUpRight size={15} />
              </Link>
            </div>
          ) : (
            <div className="px-6">
              {visibleTxns.map((txn) => (
                <TransactionRow key={txn.id} txn={txn} />
              ))}
              {transactions.length > 5 && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="w-full flex items-center justify-center gap-1.5 py-4 text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
                >
                  {showAll ? (
                    <><ChevronUp size={16} /> Show Less</>
                  ) : (
                    <><ChevronDown size={16} /> Show All {transactions.length} Transactions</>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-sm text-primary/50 mb-4">Ready to earn more cashback?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/trips" className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-cream text-sm font-semibold px-6 py-3 rounded-full transition-colors">
              Browse Trips <ArrowUpRight size={15} />
            </Link>
            <Link href="/destinations/domestic" className="inline-flex items-center gap-2 border border-primary/20 hover:border-primary/50 text-primary text-sm font-semibold px-6 py-3 rounded-full transition-colors">
              India Tours
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
