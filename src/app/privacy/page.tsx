'use client';

import Link from 'next/link';
import { Shield, Eye, Share2, UserCheck, Mail } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-5 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-amber-600">YlooTrips</Link>
          <p className="text-sm text-gray-400">Privacy Policy</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Title */}
        <div className="mb-8">
          <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-4">
            <Shield size={28} className="text-amber-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-500 text-sm">Last updated: April 2026 · We keep it simple and honest.</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8">
          <p className="text-amber-800 text-sm leading-relaxed">
            At <strong>YlooTrips</strong>, your privacy matters. This policy explains what data we collect, how we use it, and your rights. We will never sell your personal information. Questions? Email us at{' '}
            <a href="mailto:admin@ylootrips.com" className="underline font-semibold">admin@ylootrips.com</a>.
          </p>
        </div>

        <div className="space-y-6">
          {/* Data collected */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                <Eye size={20} className="text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 pt-1.5">What Data We Collect</h2>
            </div>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p>When you make a booking or contact us, we collect:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Identity data:</strong> Full name, date of birth (for flights), nationality</li>
                <li><strong>Contact data:</strong> Email address, phone number / WhatsApp</li>
                <li><strong>Booking data:</strong> Travel dates, destinations, number of guests/passengers, special requests</li>
                <li><strong>Payment data:</strong> Transaction IDs and payment status (we do not store full card details — these are handled by Easebuzz)</li>
                <li><strong>Technical data:</strong> IP address, browser type, and usage data collected automatically via cookies</li>
              </ul>
              <p>We only collect data that is necessary to provide our services to you.</p>
            </div>
          </div>

          {/* How we use it */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                <UserCheck size={20} className="text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 pt-1.5">How We Use Your Data</h2>
            </div>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p>We use your data to:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Process and confirm your booking</li>
                <li>Send confirmation emails and booking updates (via Resend)</li>
                <li>Issue flight tickets and event passes</li>
                <li>Provide customer support</li>
                <li>Comply with legal and regulatory requirements</li>
                <li>Improve our services (using aggregated, anonymised analytics)</li>
              </ul>
              <p>We will not use your data for unsolicited marketing without your explicit consent.</p>
            </div>
          </div>

          {/* Third parties */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                <Share2 size={20} className="text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 pt-1.5">Third Parties We Work With</h2>
            </div>
            <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
              <p>We share your data only with trusted partners who help us deliver services:</p>
              <div className="space-y-3">
                {[
                  {
                    name: 'Easebuzz',
                    purpose: 'Payment processing — we share your name, email, phone, and booking amount to process payments securely.',
                    link: 'https://easebuzz.in/privacy-policy',
                  },
                  {
                    name: 'Resend',
                    purpose: 'Transactional email service — we share your email address and booking details to send confirmation emails.',
                    link: 'https://resend.com/privacy',
                  },
                  {
                    name: 'Airlines & Hotels',
                    purpose: 'Passenger and guest details are shared as required to fulfill flight or hotel bookings.',
                    link: null,
                  },
                ].map(tp => (
                  <div key={tp.name} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">{tp.name}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{tp.purpose}</p>
                      {tp.link && (
                        <a href={tp.link} target="_blank" rel="noopener noreferrer" className="text-amber-600 underline text-xs mt-1 inline-block">
                          View their privacy policy
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <p>We never sell your personal data to third parties for marketing purposes.</p>
            </div>
          </div>

          {/* Your rights */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                <Shield size={20} className="text-amber-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 pt-1.5">Your Rights</h2>
            </div>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p>You have the following rights regarding your personal data:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Access:</strong> Request a copy of the data we hold about you</li>
                <li><strong>Correction:</strong> Ask us to correct inaccurate data</li>
                <li><strong>Deletion:</strong> Request deletion of your data (subject to legal and operational requirements)</li>
                <li><strong>Portability:</strong> Receive your data in a machine-readable format</li>
                <li><strong>Objection:</strong> Object to processing of your data in certain circumstances</li>
              </ul>
              <p>To exercise any of these rights, email us at <a href="mailto:admin@ylootrips.com" className="text-amber-600 underline">admin@ylootrips.com</a> with your name and booking reference. We will respond within 7 business days.</p>
            </div>
          </div>

          {/* Cookies */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Cookies</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We use essential cookies to make our website function correctly (e.g., to remember your currency preference). We may also use analytics cookies to understand how visitors use our site. You can disable cookies in your browser settings, but some features may not work correctly.
            </p>
          </div>

          {/* Data retention */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Data Retention</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We retain booking and customer data for up to 5 years to comply with tax and legal obligations. You may request earlier deletion where legally permissible.
            </p>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                <Mail size={20} className="text-gray-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 pt-1.5">Contact &amp; Complaints</h2>
            </div>
            <div className="space-y-2 text-gray-600 text-sm">
              <p><strong>Company:</strong> YlooTrips</p>
              <p><strong>Email:</strong> <a href="mailto:admin@ylootrips.com" className="text-amber-600 underline">admin@ylootrips.com</a></p>
              <p><strong>WhatsApp:</strong> <a href="https://wa.me/918427831127" target="_blank" rel="noopener noreferrer" className="text-amber-600 underline">+91 84278 31127</a></p>
            </div>
          </div>

          <div className="flex gap-4 text-sm pb-8">
            <Link href="/terms" className="text-amber-600 underline hover:text-amber-700">Terms &amp; Conditions</Link>
            <Link href="/" className="text-gray-500 hover:text-gray-700">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
