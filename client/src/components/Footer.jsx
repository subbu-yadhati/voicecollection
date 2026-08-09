import React from 'react';
import { Mic, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="bg-slate-900 text-slate-400 py-6 sm:py-8 border-t border-slate-800">
      <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">Speech Research Corpus</h4>
            <p className="text-sm text-slate-400">Telugu-English Code-Switching Academic Benchmark</p>
          </div>
        </div>

        <p className="text-sm text-slate-400 text-center md:text-right">
          © 2026 Academic Speech Research Group. All rights reserved. • Strictly for non-commercial research purposes.
        </p>

      </div>
    </footer>
  );
}
