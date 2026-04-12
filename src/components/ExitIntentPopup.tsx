'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Copy, X, MessageCircle } from 'lucide-react';
import Link from 'next/link';

const SHOWN_KEY = 'exitIntentShown';
const DISCOUNT_CODE = 'FIRST2000';
const EXCLUDED_PATHS = ['/checkout', '/payment', '/admin'];

export default function ExitIntentPopup() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const isExcluded = EXCLUDED_PATHS.some((p) => pathname.startsWith(p));

  const showPopup = useCallback(() => {
    if (sessionStorage.getItem(SHOWN_KEY)) return;
    sessionStorage.setItem(SHOWN_KEY, '1');
    setVisible(true);
  }, []);

  useEffect(() => {
    if (isExcluded) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 10) {
        showPopup();
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isExcluded, showPopup]);

  const handleClose = () => setVisible(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(DISCOUNT_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select text manually
    }
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8">
        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label="Close popup"
          className="absolute top-3 right-3 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="text-5xl mb-3" role="img" aria-label="Backpack">
            🎒
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Wait! Don&apos;t miss out
          </h2>

          <p className="text-gray-500 text-sm mb-5">
            Get ₹2,000 off your first trip — limited time offer
          </p>

          {/* Discount code box */}
          <div className="flex items-center justify-between bg-gray-50 border border-dashed border-orange-400 rounded-lg px-4 py-3 mb-5">
            <span className="font-mono font-bold text-lg tracking-widest text-orange-600">
              {DISCOUNT_CODE}
            </span>
            <button
              onClick={handleCopy}
              aria-label="Copy discount code"
              className="ml-3 flex items-center gap-1.5 text-sm text-orange-600 hover:text-orange-800 font-medium transition-colors"
            >
              <Copy className="h-4 w-4" />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col gap-3">
            <a
              href={`https://wa.me/918427831127?text=Hi!%20I%20want%20to%20use%20code%20FIRST2000%20for%20my%20trip%20booking`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              Chat on WhatsApp
            </a>

            <Link
              href="/trips"
              onClick={handleClose}
              className="flex items-center justify-center w-full py-3 px-5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-semibold rounded-xl transition-all"
            >
              Browse Trips
            </Link>
          </div>

          {/* No thanks */}
          <button
            onClick={handleClose}
            className="mt-4 text-sm text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors"
          >
            No thanks, I&apos;ll pay full price
          </button>
        </div>
      </div>
    </div>
  );
}
