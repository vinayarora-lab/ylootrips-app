'use client';

import { Shield, Clock, Users, MapPin, Star, HeartHandshake, CheckCircle2, Award, Zap } from 'lucide-react';
import Link from 'next/link';

const stats = [
    { value: '12+', label: 'Years', sub: 'Founded 2012', icon: Award, gradient: 'from-amber-400 to-orange-500' },
    { value: '25K+', label: 'Travelers', sub: '40+ countries', icon: Users, gradient: 'from-blue-400 to-violet-500' },
    { value: '4.9★', label: 'Rating', sub: '2,400+ reviews', icon: Star, gradient: 'from-yellow-400 to-amber-500' },
    { value: '98%', label: 'Satisfaction', sub: 'Would recommend', icon: HeartHandshake, gradient: 'from-pink-400 to-rose-500' },
];

const reasons = [
    { icon: Shield, emoji: '🛡️', title: 'Licensed & Govt. Registered', description: 'MSME certified, Govt. of India registered. Your booking is legally protected end-to-end.', color: 'text-blue-400', bg: 'bg-blue-500/10 group-hover:bg-blue-500/20' },
    { icon: Clock, emoji: '⚡', title: 'Real human · Under 1 hour', description: 'A real travel expert (not a bot) responds to every query. WhatsApp or email, 7 days a week.', color: 'text-amber-400', bg: 'bg-amber-500/10 group-hover:bg-amber-500/20' },
    { icon: MapPin, emoji: '🗺️', title: 'Born & Based in India', description: 'Our guides grew up in Rajasthan, Kerala, the Himalayas. Insider knowledge = extraordinary trips.', color: 'text-green-400', bg: 'bg-green-500/10 group-hover:bg-green-500/20' },
    { icon: Users, emoji: '🧳', title: 'Private Tours — No Crowds', description: 'Your own car, guide, and schedule. No strangers. No buses. Just your group and the open road.', color: 'text-purple-400', bg: 'bg-purple-500/10 group-hover:bg-purple-500/20' },
    { icon: Star, emoji: '🏨', title: 'Every Hotel Personally Inspected', description: 'Palace havelis in Jaipur, eco-lodges in Munnar — we\'ve stayed there. No surprises on arrival.', color: 'text-rose-400', bg: 'bg-rose-500/10 group-hover:bg-rose-500/20' },
    { icon: HeartHandshake, emoji: '💚', title: 'Free Cancel · Flex Dates', description: 'Cancel free up to 14 days before. Reschedule any time at zero charge. We get it — life happens.', color: 'text-emerald-400', bg: 'bg-emerald-500/10 group-hover:bg-emerald-500/20' },
];

const guarantees = [
    '✅ Free 14-day cancellation',
    '✅ Price match guarantee',
    '✅ 24/7 on-trip emergency line',
    '✅ Zero hidden fees — ever',
];

export default function WhyChooseUs() {
    return (
        <section className="py-16 md:py-24 lg:py-32 bg-gray-950 text-white relative overflow-hidden">
            {/* Ambient background glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="section-container relative">
                {/* Header */}
                <div className="text-center mb-12 md:mb-20">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-5">
                        <Zap size={12} /> Why YlooTrips
                    </span>
                    <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                        India experts you can <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent italic">actually trust</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-xl mx-auto">
                        Trusted by travelers from USA, UK, Australia, Germany, Canada & 35+ more countries.
                    </p>
                </div>

                {/* Stats — gradient border cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
                    {stats.map(({ value, label, sub, icon: Icon, gradient }) => (
                        <div key={label}
                            className="group relative p-[1px] rounded-2xl bg-gradient-to-br from-white/10 to-white/5 hover:from-amber-500/40 hover:to-orange-500/20 transition-all duration-500">
                            <div className="bg-gray-900 rounded-2xl p-5 md:p-7 text-center h-full">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon size={18} className="text-white" />
                                </div>
                                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{value}</div>
                                <div className="text-xs uppercase tracking-widest text-gray-400 mb-0.5">{label}</div>
                                <div className="text-[10px] text-gray-600">{sub}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Reasons — glass cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
                    {reasons.map(({ emoji, title, description, color, bg }) => (
                        <div key={title}
                            className="group flex gap-4 p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 hover:-translate-y-1">
                            <div className={`shrink-0 w-11 h-11 rounded-xl ${bg} flex items-center justify-center transition-colors duration-300 text-xl`}>
                                {emoji}
                            </div>
                            <div>
                                <h3 className={`font-semibold text-sm mb-1.5 ${color}`}>{title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Guarantee strip */}
                <div className="relative p-[1px] rounded-2xl bg-gradient-to-r from-amber-500/30 via-orange-500/20 to-amber-500/30 mb-16">
                    <div className="bg-gray-900 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <p className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">Our Promise to You 🤝</p>
                            <div className="flex flex-wrap gap-x-6 gap-y-2">
                                {guarantees.map(g => (
                                    <span key={g} className="text-gray-300 text-sm">{g}</span>
                                ))}
                            </div>
                        </div>
                        <Link href="/contact"
                            className="shrink-0 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm hover:from-amber-600 hover:to-orange-600 transition-all duration-300 hover:scale-105 shadow-lg shadow-amber-500/20 whitespace-nowrap">
                            Plan My Trip ✈️
                        </Link>
                    </div>
                </div>

                {/* Countries */}
                <div className="text-center">
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-5">Travelers from 40+ countries</p>
                    <div className="flex flex-wrap justify-center gap-3 text-2xl">
                        {['🇺🇸','🇬🇧','🇦🇺','🇨🇦','🇩🇪','🇫🇷','🇳🇱','🇯🇵','🇸🇬','🇨🇭','🇸🇪','🇳🇿','🇦🇹','🇮🇹','🇪🇸','🇮🇱','🇰🇷','🇿🇦','🇧🇷','🇵🇹'].map(f => (
                            <span key={f} className="hover:scale-125 transition-transform duration-200 cursor-default">{f}</span>
                        ))}
                    </div>
                    <p className="text-gray-700 text-xs mt-3">+ 20 more countries</p>
                </div>
            </div>
        </section>
    );
}
