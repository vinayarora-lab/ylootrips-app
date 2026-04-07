'use client';

import { useState } from 'react';
import Link from 'next/link';

const sections = [
  { id: 'bookings', label: 'Bookings & Payments' },
  { id: 'cancellation', label: 'Cancellation Policy' },
  { id: 'refunds', label: 'Refund Policy' },
  { id: 'flights', label: 'Flight Bookings' },
  { id: 'hotels', label: 'Hotel Bookings' },
  { id: 'insurance', label: 'Travel Insurance' },
  { id: 'privacy', label: 'Privacy' },
  { id: 'liability', label: 'Liability' },
  { id: 'contact', label: 'Contact' },
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState('bookings');

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-amber-600">YlooTrips</Link>
          <p className="text-sm text-gray-400">Terms &amp; Conditions</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Terms &amp; Conditions</h1>
          <p className="text-gray-500 text-sm">Last updated: April 2026 · Effective immediately upon booking</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar nav */}
          <aside className="lg:w-56 shrink-0">
            <div className="lg:sticky lg:top-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 px-2">Sections</p>
              {sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    activeSection === s.id
                      ? 'bg-amber-50 text-amber-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 space-y-10">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <p className="text-amber-800 text-sm leading-relaxed">
                By making a booking with <strong>YlooTrips</strong>, you agree to these Terms &amp; Conditions. Please read them carefully before proceeding with any purchase. If you have questions, email us at{' '}
                <a href="mailto:admin@ylootrips.com" className="underline font-semibold">admin@ylootrips.com</a>.
              </p>
            </div>

            {/* Bookings & Payments */}
            <section id="bookings" className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">1. Bookings &amp; Payments</h2>
              <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
                <p>All bookings are subject to availability and confirmed only upon receipt of full payment (or agreed deposit). A booking confirmation email will be sent to your registered email address within 24 hours of successful payment.</p>
                <p>Prices are displayed in INR (Indian Rupees) unless stated otherwise. For international travelers, payment is processed in INR and your bank will convert at the prevailing exchange rate. We accept UPI, credit cards, debit cards, and net banking via Easebuzz payment gateway.</p>
                <p>A payment processing fee of up to 3% may apply to card payments. UPI payments attract no surcharge.</p>
                <p>EMI (Equated Monthly Instalment) options are available on select credit cards. EMI is facilitated by your bank; YlooTrips is not responsible for any issues arising from EMI arrangements.</p>
                <p>Half-payment (50% advance) is available for select trip packages. The remaining balance must be paid no later than 14 days before the travel date. Failure to pay the balance will result in automatic cancellation without refund of the deposit.</p>
              </div>
            </section>

            {/* Cancellation */}
            <section id="cancellation" className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">2. Cancellation Policy</h2>
              <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                Cancellations must be submitted in writing to <a href="mailto:admin@ylootrips.com" className="text-amber-600 underline">admin@ylootrips.com</a>. The cancellation date is the date we receive your written notice. Refund amounts are calculated based on the number of days before departure:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-amber-50">
                      <th className="text-left px-4 py-3 font-bold text-gray-900 border border-amber-200 rounded-tl-xl">Days Before Departure</th>
                      <th className="text-left px-4 py-3 font-bold text-gray-900 border border-amber-200">Refund Amount</th>
                      <th className="text-left px-4 py-3 font-bold text-gray-900 border border-amber-200 rounded-tr-xl">Cancellation Charge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { days: '30+ days before departure', refund: '90% of total booking amount', charge: '10%' },
                      { days: '15–30 days before departure', refund: '50% of total booking amount', charge: '50%' },
                      { days: '7–15 days before departure', refund: '25% of total booking amount', charge: '75%' },
                      { days: 'Less than 7 days before departure', refund: 'No refund', charge: '100%' },
                    ].map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 border border-gray-200 text-gray-700">{row.days}</td>
                        <td className={`px-4 py-3 border border-gray-200 font-semibold ${row.refund === 'No refund' ? 'text-red-600' : 'text-green-700'}`}>{row.refund}</td>
                        <td className={`px-4 py-3 border border-gray-200 ${row.charge === '100%' ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>{row.charge}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-gray-400 mt-3">* Flight bookings, hotel bookings, and events have separate cancellation policies. See relevant sections below.</p>
            </section>

            {/* Refunds */}
            <section id="refunds" className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">3. Refund Policy</h2>
              <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
                <p>Approved refunds will be processed within 7–10 business days to the original payment method. Processing times may vary depending on your bank or payment provider.</p>
                <p>Refunds will not include payment processing fees (where applicable) or any third-party charges already incurred (e.g., hotel deposits, airline fees).</p>
                <p>YlooTrips reserves the right to modify or cancel a trip due to unforeseen circumstances including but not limited to: natural disasters, political unrest, pandemic-related restrictions, or insufficient participant numbers. In such cases, a full refund will be issued or an alternative trip of equal value offered.</p>
                <p>No refunds will be issued for voluntary no-shows or unused portions of a trip once commenced.</p>
              </div>
            </section>

            {/* Flights */}
            <section id="flights" className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">4. Flight Bookings</h2>
              <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
                <p>YlooTrips acts as an intermediary for flight bookings. E-tickets are issued within 30 minutes to 2 hours of confirmed payment. In rare cases this may take up to 24 hours.</p>
                <p>Flight fares are dynamic and subject to change until ticket issuance. If the quoted fare is no longer available, we will contact you to confirm an alternative price before proceeding.</p>
                <p>Flight cancellations and modifications are subject to the respective airline's policy. YlooTrips will charge a service fee of ₹500 per passenger per sector in addition to any airline charges.</p>
                <p>Passengers are responsible for ensuring they hold valid travel documents (passports, visas, etc.). YlooTrips is not liable for any losses arising from inadequate documentation.</p>
                <p>Check-in times, baggage allowances, and other operational matters are governed by the operating airline. Please verify these directly with the airline before travel.</p>
              </div>
            </section>

            {/* Hotels */}
            <section id="hotels" className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">5. Hotel Bookings</h2>
              <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
                <p>Hotel bookings are subject to the individual property's cancellation policy. Non-refundable rates will be clearly marked at the time of booking.</p>
                <p>Check-in and check-out times vary by property. Early check-in or late checkout is subject to availability and may incur additional charges.</p>
                <p>YlooTrips is not responsible for any changes in hotel services, facilities, or quality that occur after booking confirmation.</p>
              </div>
            </section>

            {/* Insurance */}
            <section id="insurance" className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">6. Travel Insurance</h2>
              <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
                <p>YlooTrips strongly recommends that all travelers obtain comprehensive travel insurance that covers medical emergencies, trip cancellation, baggage loss, and personal liability.</p>
                <p>YlooTrips does not currently provide travel insurance directly. Travelers are responsible for arranging their own cover.</p>
                <p>YlooTrips will not be liable for any costs, losses, or damages that adequate travel insurance would have covered.</p>
              </div>
            </section>

            {/* Privacy */}
            <section id="privacy" className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">7. Privacy</h2>
              <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
                <p>By making a booking, you consent to the collection and use of your personal data as described in our{' '}
                  <Link href="/privacy" className="text-amber-600 underline font-medium">Privacy Policy</Link>.
                </p>
                <p>We will use your data to process your booking, send confirmation communications, and provide customer support. We will not sell your data to third parties.</p>
                <p>We may share limited data with our service partners (airlines, hotels, payment processors) solely to fulfill your booking.</p>
              </div>
            </section>

            {/* Liability */}
            <section id="liability" className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
                <p>YlooTrips acts as an agent for airlines, hotels, tour operators, and other service providers. We are not liable for any act, omission, injury, loss, accident, delay, or irregularity arising from the services of these independent contractors.</p>
                <p>YlooTrips' total liability to any customer in connection with any booking shall not exceed the total amount paid by that customer for that specific booking.</p>
                <p>YlooTrips shall not be liable for any indirect, consequential, or punitive damages arising from any booking or service.</p>
                <p>These Terms &amp; Conditions are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Punjab, India.</p>
              </div>
            </section>

            {/* Contact */}
            <section id="contact" className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">9. Contact Us</h2>
              <div className="space-y-2 text-gray-600 text-sm">
                <p><strong>Company:</strong> YlooTrips</p>
                <p><strong>Email:</strong> <a href="mailto:admin@ylootrips.com" className="text-amber-600 underline">admin@ylootrips.com</a></p>
                <p><strong>WhatsApp:</strong> <a href="https://wa.me/918427831127" target="_blank" rel="noopener noreferrer" className="text-amber-600 underline">+91 84278 31127</a></p>
                <p className="pt-2 text-xs text-gray-400">For any queries related to bookings, refunds, or complaints, please reach out via email and we will respond within 1 business day.</p>
              </div>
            </section>

            <p className="text-xs text-gray-400 text-center pb-8">
              These terms were last updated in April 2026. YlooTrips reserves the right to update these terms at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
