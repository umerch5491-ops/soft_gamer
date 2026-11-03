'use client';

import { useState } from 'react';
import { Mail, Clock, ShieldCheck, Send, MessageSquare } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default function ContactPage() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'umerjamil126@gmail.com';

  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoUrl = `mailto:${contactEmail}?subject=${encodeURIComponent(
      form.subject || 'Soft Gamer Reader Inquiry'
    )}&body=${encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    )}`;
    window.location.href = mailtoUrl;
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Contact Us' }]} />

      <header className="mb-10 pb-6 border-b border-[#272B3A]">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F8FAFC] tracking-tight mb-4">
          Contact Us
        </h1>
        <p className="text-lg text-[#A1A1AA] leading-relaxed">
          Have a question, feedback, news tip, or review inquiry? Reach out to the Soft Gamer editorial desk.
        </p>
      </header>

      {/* Main Direct Contact Card */}
      <div className="bg-linear-to-b from-[#111522] to-[#0D101A] border border-[#272B3A] rounded-2xl p-6 sm:p-10 mb-10 shadow-xl shadow-black/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-[#272B3A]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6] shrink-0">
              <Mail className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[#A1A1AA] font-semibold">
                Direct Editorial Email
              </p>
              <a
                href={`mailto:${contactEmail}`}
                className="text-xl sm:text-2xl font-bold text-[#F8FAFC] hover:text-[#38BDF8] transition-colors break-all"
              >
                {contactEmail}
              </a>
            </div>
          </div>

          <a
            href={`mailto:${contactEmail}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-[#8B5CF6] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] text-white font-semibold text-sm transition-all shadow-lg shadow-[#8B5CF6]/25 shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>Open Email Client</span>
          </a>
        </div>

        {/* Contact Form */}
        <div className="pt-8">
          <h2 className="text-xl font-bold text-[#F8FAFC] mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#8B5CF6]" />
            <span>Send a Message</span>
          </h2>

          {submitted ? (
            <div className="p-6 rounded-xl bg-[#171C2B] border border-[#10B981]/40 text-[#10B981] space-y-2">
              <p className="font-bold text-base">Opening your email client...</p>
              <p className="text-xs text-[#A1A1AA]">
                If your email application did not launch automatically, please email us directly at{' '}
                <a href={`mailto:${contactEmail}`} className="text-[#38BDF8] underline font-mono">
                  {contactEmail}
                </a>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-[#A1A1AA] mb-1.5">
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Alex"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090B12] border border-[#272B3A] text-sm text-[#F8FAFC] placeholder-[#71717A] focus:outline-hidden focus:border-[#8B5CF6] transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-[#A1A1AA] mb-1.5">
                    Your Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="alex@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090B12] border border-[#272B3A] text-sm text-[#F8FAFC] placeholder-[#71717A] focus:outline-hidden focus:border-[#8B5CF6] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-xs font-semibold uppercase tracking-wider text-[#A1A1AA] mb-1.5">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="News Tip / Guide Feedback / Business Inquiry"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090B12] border border-[#272B3A] text-sm text-[#F8FAFC] placeholder-[#71717A] focus:outline-hidden focus:border-[#8B5CF6] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-[#A1A1AA] mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Please write your detailed message or feedback here..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090B12] border border-[#272B3A] text-sm text-[#F8FAFC] placeholder-[#71717A] focus:outline-hidden focus:border-[#8B5CF6] transition-colors resize-y"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold text-sm transition-all shadow-md shadow-[#8B5CF6]/20 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Response Time & Guarantee */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
        <div className="p-6 rounded-2xl bg-[#111522] border border-[#272B3A] flex items-start gap-3">
          <Clock className="w-5 h-5 text-[#38BDF8] shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-[#F8FAFC] mb-1">Expected Response Time</h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              We review every email received and aim to respond within 24 to 48 business hours.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#111522] border border-[#272B3A] flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#8B5CF6] shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-[#F8FAFC] mb-1">Confidential Tips</h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Anonymous tips and whistleblower contributions are handled with strict journalistic confidentiality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
