'use client';

import { MessageCircle, FileText, Luggage, Compass, ShieldCheck, RefreshCcw, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const steps = [
    {
        number: '01',
        icon: MessageCircle,
        emoji: '💬',
        title: 'Tell us your dream',
        description: 'Fill a quick form or drop us a WhatsApp. Share your vibe, budget, dates, destinations. A real expert listens — not a bot.',
        time: '2 min',
        gradient: 'from-blue-500 to-violet-600',
        glow: 'group-hover:shadow-blue-500/25',
    },
    {
        number: '02',
        icon: FileText,
        emoji: '📋',
        title: 'Get your itinerary',
        description: 'Within 24 hours you get a day-by-day plan handcrafted just for you. No templates. Tweak anything until it\'s perfect.',
        time: '< 24 hrs',
        gradient: 'from-amber-500 to-orange-600',
        glow: 'group-hover:shadow-amber-500/25',
    },
    {
        number: '03',
        icon: Luggage,
        emoji: '🏨',
        title: 'We handle everything',
        description: 'Hotels, transfers, guides, entry tickets, visa help, 24/7 on-trip support. You confirm — we handle every detail.',
        time: 'Fully managed',
        gradient: 'from-emerald-500 to-teal-600',
        glow: 'group-hover:shadow-emerald-500/25',
    },
    {
        number: '04',
        icon: Compass,
        emoji: '🧭',
        title: 'You just explore',
        description: 'Land in India and your driver\'s waiting with your name. Your guide already knows your preferences. Just soak it in.',
        time: 'Stress-free',
        gradient: 'from-rose-500 to-pink-600',
        glow: 'group-hover:shadow-rose-500/25',
    },
];

const guarantees = [
    { icon: ShieldCheck, label: 'Free cancellation · 14 days before', emoji: '🛡️' },
    { icon: RefreshCcw, label: 'Reschedule any time — no fee', emoji: '🔄' },
];

export default function HowItWorks() {
    return (
        <section className="py-16 md:py-24 lg:py-32 bg-gray-50 relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-50 via-transparent to-transparent" />

            <div className="section-container relative">
                {/* Header */}
                <div className="text-center mb-12 md:mb-20">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-widest mb-5">
                        ✨ The Process
                    </span>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Your trip in <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent italic">4 easy steps</span>
                    </h2>
                    <p className="text-gray-500 text-lg max-w-xl mx-auto">
                        25,000+ travelers planned India effortlessly with us. Here's exactly how it works.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative mb-14">
                    {/* Connector line */}
                    <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-blue-200 via-amber-200 to-pink-200" />

                    {steps.map(({ number, emoji, title, description, time, gradient, glow }, i) => (
                        <div key={number}
                            className={`group relative flex flex-col items-center text-center gap-4 p-6 rounded-3xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-xl ${glow} transition-all duration-400 hover:-translate-y-2`}
                            style={{ transitionDelay: `${i * 50}ms` }}>

                            {/* Step circle */}
                            <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <span className="text-3xl">{emoji}</span>
                                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border-2 border-gray-100 text-gray-800 text-xs font-black flex items-center justify-center shadow-sm">
                                    {number}
                                </span>
                            </div>

                            <div>
                                <span className="inline-block px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">{time}</span>
                                <h3 className="font-bold text-lg text-gray-900 mb-2">{title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
                            </div>

                            {/* Arrow connector on desktop */}
                            {i < steps.length - 1 && (
                                <div className="hidden lg:block absolute -right-3 top-10 z-10">
                                    <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                                        <ArrowRight size={12} className="text-gray-400" />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Guarantees */}
                <div className="flex flex-col sm:flex-row justify-center gap-3 mb-10">
                    {guarantees.map(({ label, emoji }) => (
                        <div key={label}
                            className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-green-50 border border-green-200 hover:bg-green-100 transition-colors">
                            <span className="text-lg">{emoji}</span>
                            <span className="text-sm text-green-800 font-semibold">{label}</span>
                        </div>
                    ))}
                </div>

                {/* CTAs */}
                <div className="text-center flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/contact"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm hover:from-amber-600 hover:to-orange-600 transition-all duration-300 hover:scale-105 shadow-lg shadow-amber-500/30">
                        Start Planning Now ✈️
                    </Link>
                    <a href="https://wa.me/918427831127?text=Hi!%20I%27d%20like%20to%20plan%20a%20trip."
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-sm transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/20">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        WhatsApp Us 💬
                    </a>
                </div>
                <p className="text-center text-xs text-gray-400 mt-4">
                    Avg. reply under 1 hour · 7 days a week · No commitment required
                </p>
            </div>
        </section>
    );
}
