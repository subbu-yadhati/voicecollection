import React, { useState } from 'react';
import { CheckCircle, Home, Copy, Check } from 'lucide-react';

export default function ThankYouModal({ participantId, participantName, participantGender, audioData, onReturnHome }) {
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(participantId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 flex items-center justify-center min-h-[70vh] bg-slate-50/50 animate-fadeIn">
      <div className="bg-white border-2 border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-10 shadow-xl text-center relative overflow-hidden">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <CheckCircle className="w-9 h-9" />
        </div>

        {/* Message */}
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 tracking-tight">
          Thank you for contributing to multilingual speech research!
        </h2>
        <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed mb-6">
          It helps us a lot. Your participation supports academic research in multilingual speech technologies and cross-lingual phonetic recognition algorithms.
        </p>

        {/* Participant ID Box */}
        <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 sm:p-5 mb-6 text-left shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-base font-bold text-slate-900 uppercase tracking-wide">
              Participant Receipt ID
            </span>
            <button
              onClick={handleCopyId}
              className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 focus:outline-none cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy ID'}</span>
            </button>
          </div>

          <div className="font-mono text-xl sm:text-2xl font-bold text-slate-900 bg-white border border-slate-300 p-3 rounded-xl text-center tracking-widest selection:bg-blue-100 shadow-inner">
            {participantId}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-3 gap-2 text-sm sm:text-base text-slate-700 font-medium">
            <div>
              <span className="text-slate-400 block text-xs uppercase font-bold">Contributor:</span>
              <span className="font-bold text-slate-900 truncate block">
                {participantName.trim() ? participantName : 'Anonymous'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs uppercase font-bold">Gender:</span>
              <span className="font-bold text-slate-900 truncate block">
                {participantGender ? participantGender : 'Unspecified'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs uppercase font-bold">Source Type:</span>
              <span className="font-bold text-slate-900 capitalize truncate block">
                {audioData?.type || 'Recorded'}
              </span>
            </div>
          </div>
        </div>

        {/* Return Home Button */}
        <button
          onClick={onReturnHome}
          className="w-full inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-bold rounded-xl shadow-md shadow-blue-600/25 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/30 cursor-pointer active:scale-95"
        >
          <Home className="w-5 h-5" />
          <span>Contribute Another Recording / Return Home</span>
        </button>
      </div>
    </section>
  );
}
