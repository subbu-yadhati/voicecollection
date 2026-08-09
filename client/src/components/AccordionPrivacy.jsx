import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function AccordionPrivacy() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section id="privacy" className="py-2 bg-white">
      <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/70">
          {/* Header Accordion Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between text-left focus:outline-none rounded-xl transition-colors"
            aria-expanded={isOpen}
          >
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Privacy Policy & Consent</h2>
              <p className="text-base sm:text-lg text-slate-600 font-medium">Click to view academic research participant rights & data safeguards</p>
            </div>
            <ChevronDown
              className={`w-7 h-7 text-slate-500 hover:text-slate-800 transition-transform duration-200 ${
                isOpen ? 'transform rotate-180' : ''
              }`}
            />
          </button>

          {/* Accordion Body */}
          {isOpen && (
            <div className="mt-3 pt-3 border-t border-slate-200 text-base sm:text-lg text-slate-700 space-y-2.5 leading-relaxed animate-fadeIn">
              <p className="font-bold text-slate-900 text-lg sm:text-xl mb-2">
                Please review the following safeguards before providing your consent:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></div>
                  <span><strong className="text-slate-900">Purpose of Voice Collection:</strong> Recordings will be used strictly for acoustic and phonetic research.</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></div>
                  <span><strong className="text-slate-900">Academic Research Only:</strong> Conducted solely for university research purposes.</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></div>
                  <span><strong className="text-slate-900">Data Stored Securely:</strong> Audio recordings are encrypted on restricted servers.</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></div>
                  <span><strong className="text-slate-900">Participation is Voluntary:</strong> Withdraw at any time prior to final submission.</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></div>
                  <span><strong className="text-slate-900">Optional Name Collection:</strong> Name submission is optional; anonymous ID used if omitted.</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></div>
                  <span><strong className="text-slate-900">Never Commercialized:</strong> Collected speech data will never be sold or used for ads.</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></div>
                  <span><strong className="text-slate-900">No Open Sourced:</strong> Collected audios never be open-sourced in any platform and will be stored securly.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
