import React from 'react';
import { Send, AlertTriangle, AlertCircle } from 'lucide-react';

export default function SubmitButton({
  consentAccepted,
  setConsentAccepted,
  participantGender,
  setParticipantGender,
  audioData,
  onSubmit,
  isSubmitting
}) {
  const isAudioReady = Boolean(audioData && (audioData.blob || audioData.file));
  const isGenderSelected = Boolean(participantGender && participantGender.trim() !== '');
  const canSubmit = consentAccepted && isAudioReady && isGenderSelected;

  return (
    <section id="submit-section" className="py-3 bg-white border-t border-slate-200">
      <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col xl:flex-row items-center justify-between gap-4">
          {/* Left: Consent Checkbox */}
          <div className="flex-1 text-left">
            <label className="flex items-start sm:items-center gap-3 cursor-pointer select-none group">
              <input
                type="checkbox"
                id="consent-checkbox"
                checked={consentAccepted}
                onChange={(e) => setConsentAccepted(e.target.checked)}
                className="w-5 h-5 text-emerald-600 border-slate-300 rounded-md focus:ring-emerald-500 cursor-pointer accent-emerald-600 shrink-0 mt-0.5 sm:mt-0"
              />
              <span className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                I have read the privacy policy and voluntarily agree to participate.
              </span>
            </label>
            {!consentAccepted && (
              <p className="mt-1.5 ml-8 text-sm text-red-700 font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                Required to enable submission.
              </p>
            )}
          </div>

          {/* Middle/Before Submit: Gender Radio Buttons (Required) */}
          <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-2.5 bg-slate-50 border px-3.5 py-2 rounded-xl shrink-0 transition-colors ${
            !isGenderSelected ? 'border-amber-300 bg-amber-50/30' : 'border-slate-200/80'
          }`}>
            <span className="text-base font-bold text-slate-900 flex items-center gap-1">
              <span>Gender</span>
              <span className="text-red-600 font-bold text-base">*</span>
              <span className="text-xs text-slate-500 font-semibold">(Required)</span>:
            </span>
            <div className="flex items-center gap-3.5 text-base font-bold text-slate-900">
              <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={participantGender === 'Male'}
                  onChange={(e) => setParticipantGender(e.target.value)}
                  className="w-4.5 h-4.5 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer accent-blue-600"
                />
                <span>Male</span>
              </label>

              <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={participantGender === 'Female'}
                  onChange={(e) => setParticipantGender(e.target.value)}
                  className="w-4.5 h-4.5 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer accent-blue-600"
                />
                <span>Female</span>
              </label>

              {/* <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="radio"
                  name="gender"
                  value="Other"
                  checked={participantGender === 'Other'}
                  onChange={(e) => setParticipantGender(e.target.value)}
                  className="w-4.5 h-4.5 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer accent-blue-600"
                />
                <span>Other</span>
              </label> */}
            </div>
          </div>

          {/* Right: Submit Button in Same Row */}
          <div className="shrink-0 w-full xl:w-auto">
            <button
              onClick={onSubmit}
              disabled={!canSubmit || isSubmitting}
              className={`w-full xl:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3 text-base sm:text-lg font-bold rounded-xl transition-all transform ${
                canSubmit && !isSubmitting
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white cursor-pointer shadow-md shadow-blue-600/25 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-blue-500/30'
                  : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
              }`}
            >
              <Send className={`w-4.5 h-4.5 ${isSubmitting ? 'animate-bounce' : ''}`} />
              <span>{isSubmitting ? 'Submitting Recording...' : 'Submit Recording'}</span>
            </button>
          </div>
        </div>

        {!canSubmit && (
          <p className="mt-2 text-sm sm:text-base text-amber-800 font-bold flex items-center justify-center gap-1.5 text-center">
            <AlertTriangle className="w-4.5 h-4.5 text-amber-600 shrink-0" />
            {(() => {
              const missing = [];
              if (!consentAccepted) missing.push('accept the consent policy');
              if (!isGenderSelected) missing.push('select your gender');
              if (!isAudioReady) missing.push('record a passage');

              if (missing.length === 3) return 'Please accept consent, select your gender, and record a passage to submit.';
              if (missing.length === 2) return `Please ${missing[0]} and ${missing[1]} to submit.`;
              if (missing.length === 1) return `Please ${missing[0]} to submit.`;
              return 'Please complete all required fields to submit.';
            })()}
          </p>
        )}
      </div>
    </section>
  );
}
