'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowUpRight, Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { api } from '@/lib/api';

const PACKAGE_LABELS: Record<string, string> = {
  'bali-honeymoon-package': 'Bali Honeymoon Package — 6 Nights (₹52,499/person)',
  'dubai-tour-package-from-delhi': 'Dubai Tour Package from Delhi — 5 Nights (₹36,499/person)',
  'thailand-budget-trip': 'Thailand Trip — Bangkok + Phuket 5 Nights (₹49,499/person)',
  'singapore-tour-package': 'Singapore Tour Package — 4 Nights (₹32,999/person)',
  'maldives-luxury-package': 'Maldives Luxury Package — 4 Nights (₹89,999/person)',
  'kashmir-tour-package': 'Kashmir Tour Package — 5 Nights (₹18,999/person)',
  'kerala-tour-package': 'Kerala Tour Package — 5 Nights (₹15,999/person)',
  'goa-tour-package': 'Goa Tour Package — 4 Nights (₹9,999/person)',
  'manali-tour-package': 'Manali Tour Package — 4 Nights (₹6,999/person)',
};

function ContactForm() {
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    destination: '',
    travelers: '',
    dates: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [ticket, setTicket] = useState('');

  // Pre-fill from ?package= / ?destination= / ?activity= query params
  useEffect(() => {
    const pkg = searchParams.get('package');
    const dest = searchParams.get('destination');
    const guests = searchParams.get('guests');
    const date = searchParams.get('date');
    const activity = searchParams.get('activity');
    const city = searchParams.get('city');

    if (pkg || dest || activity) {
      const destinationValue = pkg
        ? (PACKAGE_LABELS[pkg] || pkg.replace(/-/g, ' '))
        : dest
        ? dest.replace(/-/g, ' ')
        : `${activity!.replace(/-/g, ' ')}${city ? ` — ${city}` : ''}`;

      const travelersValue = guests && parseInt(guests) > 0
        ? (parseInt(guests) === 1 ? '1' : parseInt(guests) === 2 ? '2' : parseInt(guests) <= 4 ? '3-4' : '5+')
        : '';

      const messageValue = pkg
        ? `Hi! I'd like to book the ${PACKAGE_LABELS[pkg] || pkg.replace(/-/g, ' ')}.${date ? ` Preferred travel date: ${date}.` : ''} Please share availability and payment details.`
        : activity
        ? `Hi! I'm interested in the "${activity.replace(/-/g, ' ')}" experience${city ? ` in ${city}` : ''}. Please share details and availability.`
        : '';

      setFormData((prev) => ({
        ...prev,
        destination: destinationValue,
        travelers: travelersValue || prev.travelers,
        message: messageValue,
      }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          destination: formData.destination || undefined,
          travelers: formData.travelers || undefined,
          preferredDates: formData.dates || undefined,
          message: formData.message || undefined,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitStatus('success');
        setTicket(data.ticket || '');
        setStatusMessage(data.message || "Thank you! We'll get back to you within 24 hours.");
        setFormData({ name: '', email: '', phone: '', destination: '', travelers: '', dates: '', message: '' });
      } else {
        setSubmitStatus('error');
        setStatusMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setSubmitStatus('error');
      setStatusMessage('Failed to submit inquiry. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pkg = searchParams.get('package');
  const guests = searchParams.get('guests');

  return (
    <>
      {/* Package selected banner */}
      {pkg && (
        <div className="bg-green-50 border-b border-green-200 px-4 py-3">
          <div className="section-container flex items-center gap-3">
            <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
            <p className="text-sm text-green-800 font-medium">
              Booking enquiry for: <span className="font-bold">{PACKAGE_LABELS[pkg] || pkg}</span>
              {guests && ` · ${guests} traveler${parseInt(guests) > 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
      )}

      <section className="py-10 md:py-16 lg:py-24 bg-cream">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
            {/* Form */}
            <div>
              <h2 className="font-display text-display-lg text-primary mb-6 md:mb-8">
                Tell us about your dream trip
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-caption uppercase tracking-widest text-primary/60 mb-2">Your Name *</label>
                    <input
                      type="text" required value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-5 py-4 bg-cream-dark border border-primary/10 text-primary focus:outline-none focus:border-secondary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-caption uppercase tracking-widest text-primary/60 mb-2">Email Address *</label>
                    <input
                      type="email" required value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-5 py-4 bg-cream-dark border border-primary/10 text-primary focus:outline-none focus:border-secondary transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-caption uppercase tracking-widest text-primary/60 mb-2">Phone Number</label>
                    <input
                      type="tel" value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-5 py-4 bg-cream-dark border border-primary/10 text-primary focus:outline-none focus:border-secondary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-caption uppercase tracking-widest text-primary/60 mb-2">Dream Destination</label>
                    <input
                      type="text" placeholder="e.g., Bali, Japan, Iceland"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      className="w-full px-5 py-4 bg-cream-dark border border-primary/10 text-primary placeholder:text-primary/30 focus:outline-none focus:border-secondary transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-caption uppercase tracking-widest text-primary/60 mb-2">Number of Travelers</label>
                    <select
                      value={formData.travelers}
                      onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
                      className="w-full px-5 py-4 bg-cream-dark border border-primary/10 text-primary focus:outline-none focus:border-secondary transition-colors cursor-pointer"
                    >
                      <option value="">Select</option>
                      <option value="1">Solo traveler</option>
                      <option value="2">Couple</option>
                      <option value="3-4">Small group (3-4)</option>
                      <option value="5+">Larger group (5+)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-caption uppercase tracking-widest text-primary/60 mb-2">Preferred Dates</label>
                    <input
                      type="text" placeholder="e.g., March 2025, flexible"
                      value={formData.dates}
                      onChange={(e) => setFormData({ ...formData, dates: e.target.value })}
                      className="w-full px-5 py-4 bg-cream-dark border border-primary/10 text-primary placeholder:text-primary/30 focus:outline-none focus:border-secondary transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-caption uppercase tracking-widest text-primary/60 mb-2">Tell us about your ideal trip</label>
                  <textarea
                    rows={5} value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="What kind of experiences are you looking for? Any specific interests, requirements, or dreams?"
                    className="w-full px-5 py-4 bg-cream-dark border border-primary/10 text-primary placeholder:text-primary/30 focus:outline-none focus:border-secondary transition-colors resize-none"
                  />
                </div>

                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-50 border border-green-200 text-green-700 space-y-1">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 shrink-0" />
                      <p>{statusMessage}</p>
                    </div>
                    {ticket && (
                      <p className="text-xs font-semibold pl-8">
                        Your ticket number: <span className="font-mono bg-green-100 px-2 py-0.5 rounded">{ticket}</span> — check your email for confirmation.
                      </p>
                    )}
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>{statusMessage}</p>
                  </div>
                )}

                <button
                  type="submit" disabled={isSubmitting}
                  className="btn-primary w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /><span>Sending...</span></>
                  ) : (
                    <><span>Send Inquiry</span><Send className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="lg:pl-12">
              <div className="bg-primary text-cream p-6 md:p-10 lg:p-12 mb-6 md:mb-8">
                <h3 className="font-display text-xl md:text-2xl mb-6 md:mb-8">Prefer to speak directly?</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Mail className="w-5 h-5 text-accent mt-1" />
                    <div>
                      <p className="text-caption uppercase tracking-widest text-cream/50 mb-1">Email</p>
                      <a href="mailto:connectylootrips@gmail.com" className="text-lg hover:text-accent transition-colors">connectylootrips@gmail.com</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="w-5 h-5 text-accent mt-1" />
                    <div>
                      <p className="text-caption uppercase tracking-widest text-cream/50 mb-1">Phone</p>
                      <a href="tel:+918427831127" className="text-lg hover:text-accent transition-colors">+91 84278 31127</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Clock className="w-5 h-5 text-accent mt-1" />
                    <div>
                      <p className="text-caption uppercase tracking-widest text-cream/50 mb-1">Hours</p>
                      <p className="text-lg">Mon – Sun: 9am – 9pm IST</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-accent mt-1" />
                    <div>
                      <p className="text-caption uppercase tracking-widest text-cream/50 mb-1">Office</p>
                      <p className="text-lg">130/131 Avenue 69, Sector 69<br />Gurugram</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-cream-dark p-6 md:p-10 lg:p-12">
                <h3 className="font-display text-xl md:text-2xl text-primary mb-4">What happens next?</h3>
                <ul className="space-y-4 text-primary/70">
                  {[
                    "We'll review your inquiry within 24 hours",
                    'A travel expert will schedule a call to discuss your vision',
                    "We'll craft a personalized itinerary just for you",
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-secondary text-cream text-sm flex items-center justify-center shrink-0">{i + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Plan Your Journey"
        subtitle="Let our travel experts design a bespoke experience tailored to your dreams. Every great adventure starts with a conversation."
        breadcrumb="Contact"
      />
      <Suspense fallback={
        <div className="py-24 text-center text-primary/40 text-sm">Loading...</div>
      }>
        <ContactForm />
      </Suspense>
    </>
  );
}
