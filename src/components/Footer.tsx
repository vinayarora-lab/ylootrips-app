'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Instagram, Facebook, Twitter, Settings } from 'lucide-react';
import AdminLoginModal from './AdminLoginModal';

export default function Footer() {
  const [showAdminModal, setShowAdminModal] = useState(false);
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    explore: [
      { name: 'All Destinations', href: '/destinations' },
      { name: 'Curated Experiences', href: '/trips' },
      { name: 'Boutique Stays', href: '/hotels' },
      { name: 'The Journal', href: '/blogs' },
      { name: 'India Travel Guide', href: '/india-travel-guide' },
    ],
    tours: [
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
      { name: 'Refund Policy', href: '/privacy-policy#cancellation' },
    ],
  };

  const handleLoginSuccess = (token: string, name: string) => {
    setShowAdminModal(false);
    router.push('/admin');
  };

  return (
    <>
      <footer className="bg-primary text-cream">
        {/* Main Footer */}
        <div className="section-container py-12 md:py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
            {/* Brand Column */}
            <div className="lg:col-span-5 space-y-8">
              <Link href="/" className="inline-block">
                <img src="/logo.png" alt="YlooTrips" className="h-12 w-auto object-contain brightness-0 invert" />
              </Link>
              <p className="text-cream/60 text-body-sm leading-relaxed max-w-md">
                We believe in slow travel and meaningful connections. Our curated journeys
                are designed for those who seek authentic experiences and lasting memories.
              </p>

              {/* Newsletter */}
              <div className="pt-4">
                <p className="text-caption uppercase tracking-[0.2em] text-accent mb-4">
                  Join Our Newsletter
                </p>
                <form className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="flex-1 min-w-0 bg-white/5 border border-white/10 px-5 py-4 text-cream text-sm placeholder:text-cream/40 focus:outline-none focus:border-accent transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-6 py-4 sm:py-0 bg-accent text-primary hover:bg-accent-warm transition-colors shrink-0"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
                <div>
                  <h4 className="text-caption uppercase tracking-[0.2em] text-accent mb-6">Explore</h4>
                  <ul className="space-y-4">
                    {footerLinks.explore.map((link) => (
                      <li key={link.name}>
                        <Link href={link.href} className="text-cream/60 hover:text-cream transition-colors text-sm">
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-caption uppercase tracking-[0.2em] text-accent mb-6">Tours</h4>
                  <ul className="space-y-4">
                    {footerLinks.tours.map((link) => (
                      <li key={link.name}>
                        <Link href={link.href} className="text-cream/60 hover:text-cream transition-colors text-sm">
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-caption uppercase tracking-[0.2em] text-accent mb-6">Company</h4>
                  <ul className="space-y-4">
                    {footerLinks.company.map((link) => (
                      <li key={link.name}>
                        <Link href={link.href} className="text-cream/60 hover:text-cream transition-colors text-sm">
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-caption uppercase tracking-[0.2em] text-accent mb-6">Legal</h4>
                  <ul className="space-y-4">
                    {footerLinks.legal.map((link) => (
                      <li key={link.name}>
                        <Link href={link.href} className="text-cream/60 hover:text-cream transition-colors text-sm">
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="section-container py-6 md:py-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 text-center sm:text-left">
              <p className="text-caption text-cream/40 uppercase tracking-widest">
                © {currentYear} YlooTrips. All rights reserved.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-6">
                <a
                  href="https://www.instagram.com/ylootrips/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream/40 hover:text-accent transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61574908545709"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream/40 hover:text-accent transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                {/* <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream/40 hover:text-accent transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a> */}

                {/* Hidden Admin Button - appears as a very subtle dot */}
                <button
                  onClick={() => setShowAdminModal(true)}
                  className="w-2 h-2 rounded-full bg-cream/10 hover:bg-accent/50 transition-colors ml-2"
                  aria-label="Admin"
                  title=""
                />
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}