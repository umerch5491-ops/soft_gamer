import { Mail, Info } from 'lucide-react';

export function NewsletterPlaceholder() {
  return (
    <div className="relative rounded-2xl bg-[#111522] border border-[#272B3A] p-6 sm:p-10 overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#8B5CF6]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#171C2B] border border-[#272B3A] text-[#8B5CF6] mb-4">
          <Mail className="w-6 h-6" />
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight mb-3">
          Soft Gamer Dispatch
        </h3>

        <p className="text-sm sm:text-base text-[#A1A1AA] mb-6">
          Curated weekend digests summarizing breakthrough hardware benchmarks, key industry developments, and comprehensive tactical guides.
        </p>

        {/* Non-functional placeholder form with clear, honest indicator */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <input
            type="email"
            disabled
            placeholder="Enter your email address..."
            className="w-full px-4 py-2.5 rounded-lg bg-[#090B12] border border-[#272B3A] text-sm text-[#A1A1AA] cursor-not-allowed opacity-75 focus:outline-hidden"
          />
          <button
            type="button"
            disabled
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#272B3A] text-sm font-semibold text-[#A1A1AA] cursor-not-allowed shrink-0"
          >
            Subscribe
          </button>
        </div>

        {/* Transparent notice */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-[#A1A1AA]">
          <Info className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>Newsletter registration is in preparation for Phase 2 launch. Subscriptions are currently inactive.</span>
        </div>
      </div>
    </div>
  );
}

