import React, { useState } from 'react';
import {
  CheckCircle,
  Home,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Globe,
  Loader2,
  X,
  AlertCircle,
  HelpCircle,
  Shield
} from 'lucide-react';
import { saveOpenSourceConsent } from '../utils/api';

export default function ThankYouModal({
  participantId,
  participantName,
  participantGender,
  audioData,
  fileName,
  onReturnHome,
}) {
  const [copied, setCopied] = useState(false);
  const [openSourceChoice, setOpenSourceChoice] = useState(null); // 'yes' | 'no' | null
  const [isSubmittingConsent, setIsSubmittingConsent] = useState(false);
  const [consentError, setConsentError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [highlightRequired, setHighlightRequired] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(participantId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenSourceResponse = async (choice, shouldNavigateHome = false) => {
    setConsentError('');
    setIsSubmittingConsent(true);

    try {
      if (choice === 'yes') {
        await saveOpenSourceConsent({
          participantId,
          name: participantName || '',
          gender: participantGender || '',
          fileName: fileName || '',
          consent: true,
        });
        setOpenSourceChoice('yes');
      } else {
        await saveOpenSourceConsent({
          participantId,
          name: participantName || '',
          gender: participantGender || '',
          fileName: fileName || '',
          consent: false,
        });
        setOpenSourceChoice('no');
      }

      setShowConfirmModal(false);

      if (shouldNavigateHome) {
        onReturnHome();
      }
    } catch (err) {
      console.error('Failed to submit open source consent:', err);
      setConsentError(err.message || 'Could not save your preference. Please try again.');
    } finally {
      setIsSubmittingConsent(false);
    }
  };

  const handleReturnHomeClick = () => {
    if (openSourceChoice === null) {
      setShowConfirmModal(true);
      setHighlightRequired(true);
    } else {
      onReturnHome();
    }
  };

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 flex items-center justify-center min-h-[70vh] bg-slate-50/50 animate-fadeIn">
      <div className="bg-white border-2 border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-10 shadow-xl text-center relative overflow-hidden">
        
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <CheckCircle className="w-9 h-9" />
        </div>

        {/* Header Message */}
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 tracking-tight">
          Thank you for contributing to multilingual speech research!
        </h2>
        <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed mb-6">
          Your audio has been submitted successfully and supports academic research in multilingual speech technologies.
        </p>

        {/* Participant Receipt Box */}
        <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 sm:p-5 mb-6 text-left shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-base font-bold text-slate-900 uppercase tracking-wide">
              Participant Receipt ID
            </span>
            <button
              onClick={handleCopyId}
              className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 focus:outline-none cursor-pointer transition-colors"
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
                {participantName?.trim() ? participantName : 'Anonymous'}
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

        {/* Open Source Training Consent Card (Required) */}
        <div className={`p-5 sm:p-6 mb-6 text-left rounded-2xl border-2 transition-all duration-300 ${
          openSourceChoice === null
            ? highlightRequired
              ? 'bg-amber-50/70 border-amber-400 ring-4 ring-amber-200/50'
              : 'bg-gradient-to-br from-indigo-50/80 via-blue-50/50 to-slate-50 border-indigo-200/90'
            : openSourceChoice === 'yes'
            ? 'bg-emerald-50/70 border-emerald-300'
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between gap-2.5 mb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    Open Source Voice Contribution
                  </h3>
                  <span className="text-red-600 font-bold text-base">*</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Multilingual AI & Speech Recognition Model Training
                </p>
              </div>
            </div>

            {openSourceChoice === null && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 uppercase tracking-wide shrink-0">
                Action Required
              </span>
            )}
          </div>

          <p className="text-sm sm:text-base font-medium text-slate-800 mb-4 leading-relaxed">
            Would you be okay if we make your voice <span className="font-bold text-slate-900">open source</span> and <span className="font-bold text-slate-900">only used for training purposes</span>?
          </p>

          {consentError && (
            <div className="mb-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{consentError}</span>
            </div>
          )}

          {openSourceChoice === null ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option: YES */}
              <button
                type="button"
                disabled={isSubmittingConsent}
                onClick={() => handleOpenSourceResponse('yes')}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/40 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed active:scale-98"
              >
                {isSubmittingConsent ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    <span>Yes, make it Open Source</span>
                  </>
                )}
              </button>

              {/* Option: NO */}
              <button
                type="button"
                disabled={isSubmittingConsent}
                onClick={() => handleOpenSourceResponse('no')}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-sm font-bold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed active:scale-98"
              >
                <X className="w-4 h-4 text-slate-400" />
                <span>No, keep for research only</span>
              </button>
            </div>
          ) : openSourceChoice === 'yes' ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3 animate-fadeIn">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-950">
                  🎉 Thank you for contributing to Open Source!
                </p>
                <p className="text-xs text-emerald-700 font-medium mt-0.5 leading-relaxed">
                  Your details have been registered into the Open Source Contributors dataset (<code className="font-mono text-emerald-900 bg-emerald-100 px-1 py-0.5 rounded">opensourcecontributors</code>) for AI training purposes only.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-start gap-3 animate-fadeIn">
              <div className="w-6 h-6 rounded-full bg-slate-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Understood & Respected
                </p>
                <p className="text-xs text-slate-600 font-medium mt-0.5 leading-relaxed">
                  Your voice recording will remain strictly restricted to our internal academic research and will not be included in open source datasets.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Return Home Button */}
        <button
          onClick={handleReturnHomeClick}
          className="w-full inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-bold rounded-xl shadow-md shadow-blue-600/25 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/30 cursor-pointer active:scale-95"
        >
          <Home className="w-5 h-5" />
          <span>Contribute Another Recording / Return Home</span>
        </button>

      </div>

      {/* Confirmation Modal if user clicks Return Home without answering */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-2 border-indigo-100 text-center space-y-4 animate-scaleUp">
            
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto shadow-xs">
              <HelpCircle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Open Source Preference Required
              </h3>
              <p className="text-sm text-slate-600 font-medium mt-1 leading-relaxed">
                Before returning to the home page, please let us know: Would you be okay if your voice recording is made <span className="font-bold text-slate-900">open source</span>?
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              {/* Option: YES & Return */}
              <button
                type="button"
                disabled={isSubmittingConsent}
                onClick={() => handleOpenSourceResponse('yes', true)}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm sm:text-base font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-60 active:scale-98"
              >
                {isSubmittingConsent ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    <span>Yes, make it Open Source & Continue</span>
                  </>
                )}
              </button>

              {/* Option: NO & Return */}
              <button
                type="button"
                disabled={isSubmittingConsent}
                onClick={() => handleOpenSourceResponse('no', true)}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-sm sm:text-base font-bold rounded-xl transition-all cursor-pointer disabled:opacity-60 active:scale-98"
              >
                <Shield className="w-4 h-4 text-slate-500" />
                <span>No, keep for research only & Continue</span>
              </button>

              {/* Cancel Button */}
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="w-full text-xs font-bold text-slate-400 hover:text-slate-600 pt-2 transition-colors cursor-pointer"
              >
                Cancel & Review Receipt
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
