'use client';

import { MessageCircle, Clock } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
}

export default function WhatsAppButton({
  phoneNumber = '918427831127',
  message = 'Hi! I am interested in booking an India trip. Can you help me plan a custom itinerary?',
}: WhatsAppButtonProps) {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp — we reply within 1 hour"
      className="fixed bottom-24 right-5 z-50 group flex flex-col items-end gap-2"
    >
      {/* Reply-time badge — shows on hover */}
      <div className="flex items-center gap-1.5 bg-white text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full shadow-lg border border-gray-100 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap">
        <Clock size={12} className="text-green-500 shrink-0" />
        <span>We reply within <strong>1 hour</strong></span>
      </div>

      {/* Main button */}
      <div className="relative bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2">
        <MessageCircle size={24} className="fill-white shrink-0" />
        <span className="text-sm font-semibold pr-1 hidden sm:block">Chat with us</span>

        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 pointer-events-none" />
      </div>
    </a>
  );
}
