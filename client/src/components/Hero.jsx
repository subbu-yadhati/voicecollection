import React from 'react';
import { Mic, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Hero({ onStartClick }) {
  return (
    <section id="about" className="py-5 sm:py-7 bg-white">
      <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 text-center">
        {/* Academic Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-base sm:text-lg font-bold text-slate-800 shadow-sm mb-3">
          {/* <ShieldCheck className="w-5 h-5 text-blue-600" /> */}
          <span>Department of Computer Science & Engineering</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold text-slate-900 tracking-tight leading-tight mb-3 max-w-5xl mx-auto">
          Help Build Better{' '}
          <span className="bg-clip-text text-red-300">
            Multilingual Speech Research
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-xl sm:text-2xl text-slate-600 max-w-4xl mx-auto mb-4 font-medium leading-relaxed">
          Contribute a short speech recording to support academic research on multilingual speech technologies and Telugu-English code-switching models.
        </p>

        {/* Action Button */}
        <button
          onClick={onStartClick}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-black text-white hover:bg-gray-800 rounded-xl text-lg font-semibold tracking-wide transition-all duration-200 hover:shadow-lg"
        >
          <Mic className="w-5 h-5" />
          <span>Start Contributing</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
