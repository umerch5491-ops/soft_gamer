'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Small delay so it doesn't flash on first paint
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-0"
    >
      <div className="sm:max-w-xl sm:mx-auto sm:mb-4 bg-[#111522] border border-[#272B3A] rounded-2xl shadow-2xl shadow-black/50 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 text-sm text-[#A1A1AA] leading-relaxed">
          <p>
            We use cookies to improve your experience and to show relevant ads via Google AdSense.
            By clicking <strong className="text-[#F8FAFC]">Accept</strong>, you consent to our use of cookies.{' '}
            <a href="/privacy-policy" className="text-[#38BDF8] hover:underline">Privacy Policy</a>
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2 rounded-lg text-sm font-medium text-[#A1A1AA] bg-[#171C2B] border border-[#272B3A] hover:border-[#A1A1AA] transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#8B5CF6] hover:bg-[#7C3AED] transition-colors"
          >
            Accept
          </button>
          <button
            onClick={decline}
            aria-label="Close"
            className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#171C2B] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
