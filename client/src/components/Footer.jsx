import React from 'react';
import { Mic, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="bg-slate-900 text-slate-400 py-6 sm:py-8 border-t border-slate-800">
      <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Project Branding */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
            <Mic className="w-4 h-4" />
          </div>
          <div className="text-left">
            <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">Speech Research Corpus</h4>
            <p className="text-xs sm:text-sm text-slate-400">Telugu-English Code-Switching Academic Benchmark</p>
          </div>
        </div>

        {/* Center: Contact Information */}
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">Contact:</span>
          <a
            href="mailto:subbuyadhati@gmail.com"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 hover:text-white rounded-lg text-xs sm:text-sm font-medium transition-all shadow-xs"
          >
            <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>subbuyadhati@gmail.com</span>
          </a>
        </div>

        {/* Right: Copyright & Disclaimer */}
        <p className="text-xs sm:text-sm text-slate-400 text-center md:text-right">
          © 2026 Academic Speech Research Group. All rights reserved. • Strictly for non-commercial research purposes.
        </p>

      </div>
    </footer>
  );
}
