'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Instagram, Facebook, ShieldCheck, Lock, Star, Phone, Mail, MapPin } from 'lucide-react';
import AdminLoginModal from './AdminLoginModal';

export default function Footer() {
  const [showAdminModal, setShowAdminModal] = useState(false);
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    explore: [
      { name: 'All Destinations', href: '/destinations' },
      { name: 'Curated Experiences', href: '/trips' },
      { name: 'Hidden Gems', href: '/hidden-spots' },
      { name: 'Boutique Stays', href: '/hotels' },
      { name: 'The Journal', href: '/blogs' },
    ],
    tours: [
      { name: 'All India Tours', href: '/tours' },
      { name: '10-Day Golden Triangle', href: '/tours/golden-triangle-10-day' },
      { name: '14-Day Kerala & South India', href: '/tours/kerala-south-india-14-day' },
      { name: '7-Day Rajasthan Heritage', href: '/tours/rajasthan-heritage-7-day' },
    ],
    company: [
      { name: 'Our Story', href: '/about' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Careers', href: '/careers' },
      { name: 'Partnerships', href: '/partnerships' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms of Service', href: '/privacy-policy' },
      { name: 'Cancellation & Refunds', href: '/privacy-policy#cancellation' },
    ],
  };

  const handleLoginSuccess = () => {
    setShowAdminModal(false);
    router.push('/admin');
  };

  return (
    <>
      <footer className="bg-primary text-cream">

        {/* Trust strip above main footer */}
        <div className="border-b border-white/8 py-4">
          <div className="section-container">
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
              <div className="flex items-center gap-2 text-cream/50">
                <ShieldCheck className="w-4 h-4 text-green-400 shrink-0" />
                <span className="text-[10px] uppercase tracking-widest">Govt. Registered Company</span>
              </div>
              <div className="flex items-center gap-2 text-cream/50">
                <Lock className="w-4 h-4 text-accent shrink-0" />
                <span className="text-[10px] uppercase tracking-widest">256-bit SSL · PCI-DSS Compliant</span>
              </div>
              <div className="flex items-center gap-1.5 text-cream/50">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-[#FBBC05] text-[#FBBC05]" />)}
                </div>
                <span className="text-[10px] uppercase tracking-widest">4.9 Google · 2,400+ Reviews</span>
              </div>
              <div className="flex items-center gap-2 text-cream/50">
                <span className="text-[10px] uppercase tracking-widest">Free Cancellation · 14 Days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="section-container py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">

            {/* Brand column */}
            <div className="lg:col-span-4 space-y-6">
              <Link href="/" className="inline-block">
                <img src="/logo.png" alt="YlooTrips — India Travel Experts" className="h-12 w-auto object-contain brightness-0 invert" />
              </Link>
              <p className="text-cream/55 text-sm leading-relaxed">
                We believe in slow travel and meaningful connections. Curated journeys for those who seek authentic experiences and lasting memories.
              </p>

              {/* Contact info */}
              <div className="space-y-2.5">
                <a href="https://wa.me/918427831127" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-cream/50 hover:text-accent transition-colors text-sm group">
                  <Phone className="w-3.5 h-3.5 group-hover:text-accent" />
                  <span>+91 84278 31127 (WhatsApp)</span>
                </a>
                <a href="mailto:connectylootrips@gmail.com"
                  className="flex items-center gap-2.5 text-cream/50 hover:text-accent transition-colors text-sm group">
                  <Mail className="w-3.5 h-3.5 group-hover:text-accent" />
                  <span>connectylootrips@gmail.com</span>
                </a>
                <div className="flex items-start gap-2.5 text-cream/40 text-sm">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>New Delhi, India · Serving travelers worldwide</span>
                </div>
              </div>

              {/* GST / Registration */}
              <div className="border border-white/8 rounded px-4 py-3 space-y-1">
                <p className="text-[9px] uppercase tracking-[0.2em] text-accent">Company Details</p>
                <p className="text-[10px] text-cream/35">MSME Registered · Govt. of India Licensed</p>
                <p className="text-[10px] text-cream/35">GST Registered Travel Company</p>
                <p className="text-[10px] text-cream/35">New Delhi, India · Est. 2012</p>
              </div>

              {/* Newsletter */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-accent mb-3">Travel Inspiration Weekly</p>
                <form className="flex gap-0">
                  <input type="email" placeholder="your@email.com"
                    className="flex-1 min-w-0 bg-white/5 border border-white/10 px-4 py-3 text-cream text-sm placeholder:text-cream/30 focus:outline-none focus:border-accent transition-colors" />
                  <button type="submit" className="px-4 py-3 bg-accent text-primary hover:bg-accent-warm transition-colors shrink-0">
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </form>
                <p className="text-[9px] text-cream/25 mt-1.5">No spam. Unsubscribe any time.</p>
              </div>
            </div>

            {/* Links */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { title: 'Explore', links: footerLinks.explore },
                  { title: 'Tours', links: footerLinks.tours },
                  { title: 'Company', links: footerLinks.company },
                  { title: 'Legal', links: footerLinks.legal },
                ].map(({ title, links }) => (
                  <div key={title}>
                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-accent mb-5">{title}</h4>
                    <ul className="space-y-3">
                      {links.map(l => (
                        <li key={l.name}>
                          <Link href={l.href} className="text-cream/50 hover:text-cream transition-colors text-sm">
                            {l.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8">
          <div className="section-container py-5">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
              <div className="space-y-1">
                <p className="text-[10px] text-cream/35 uppercase tracking-widest">
                  © {currentYear} YlooTrips India Pvt. Ltd. · All rights reserved.
                </p>
                <p className="text-[9px] text-cream/20">
                  Prices are inclusive of all taxes · No hidden fees · Currency shown based on your selection
                </p>
              </div>
              <div className="flex items-center gap-5">
                <a href="https://www.instagram.com/ylootrips/" target="_blank" rel="noopener noreferrer"
                  className="text-cream/35 hover:text-accent transition-colors" aria-label="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://www.facebook.com/profile.php?id=61574908545709" target="_blank" rel="noopener noreferrer"
                  className="text-cream/35 hover:text-accent transition-colors" aria-label="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
                {/* Hidden admin */}
                <button onClick={() => setShowAdminModal(true)}
                  className="w-1.5 h-1.5 rounded-full bg-cream/8 hover:bg-accent/40 transition-colors ml-1"
                  aria-label="Admin" title="" />
              </div>
            </div>
          </div>
        </div>
      </footer>

      <AdminLoginModal isOpen={showAdminModal} onClose={() => setShowAdminModal(false)} onLoginSuccess={handleLoginSuccess} />
    </>
  );
}
