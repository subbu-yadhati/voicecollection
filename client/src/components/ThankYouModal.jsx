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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border-2 border-slate-200 rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl text-center relative overflow-hidden">
        {/* Success Icon */}
        <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-sm">
          <CheckCircle className="w-8 h-8" />
        </div>

        {/* Message */}
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 tracking-tight">
          Thank you for contributing to multilingual speech research.
        </h2>
        <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed mb-4">
          It helps us a lot. Your participation supports academic research in multilingual speech technologies and cross-lingual phonetic recognition algorithms.
        </p>

        {/* Participant ID Box */}
        <div className="bg-slate-100 border border-slate-200 rounded-xl p-3.5 mb-4 text-left shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-base font-bold text-slate-900 uppercase">
              Participant Receipt ID
            </span>
            <button
              onClick={handleCopyId}
              className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 focus:outline-none"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy ID'}</span>
            </button>
          </div>

          <div className="font-mono text-xl sm:text-2xl font-bold text-slate-900 bg-white border border-slate-300 p-2.5 rounded-lg text-center tracking-widest selection:bg-blue-100 shadow-inner">
            {participantId}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-3 gap-2 text-sm sm:text-base text-slate-700 font-medium">
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
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-bold rounded-xl shadow-md shadow-blue-600/25 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/30"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </button>
      </div>
    </div>
  );
}
