import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AccordionPrivacy from './components/AccordionPrivacy';
import GuidelinesCard from './components/GuidelinesCard';
import ReadingPassage from './components/ReadingPassage';
import ParticipantForm from './components/ParticipantForm';
import SubmitButton from './components/SubmitButton';
import ThankYouModal from './components/ThankYouModal';
import Footer from './components/Footer';
import { uploadSpeechRecording } from './utils/api';

export default function App() {
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [audioData, setAudioData] = useState(null); // { type: 'recorded' | 'uploaded', blob, file, url, ... }
  const [participantName, setParticipantName] = useState('');
  const [participantGender, setParticipantGender] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [participantId, setParticipantId] = useState('');
  const [submitError, setSubmitError] = useState('');

  const generateParticipantId = () => {
    const randomHex = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `RESP-2026-${randomHex}`;
  };

  const handleAudioChange = (newAudioData) => {
    setAudioData(newAudioData);
    setSubmitError('');
  };

  const handleSubmit = async () => {
    if (!consentAccepted || (!audioData?.blob && !audioData?.file) || !participantGender) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const formData = new FormData();

      // Determine audio file object
      let audioFile;
      if (audioData.file) {
        audioFile = audioData.file;
      } else if (audioData.blob) {
        const ext = audioData.blob.type && audioData.blob.type.includes('webm') ? '.webm' : '.wav';
        audioFile = new File([audioData.blob], `audio_recording_${Date.now()}${ext}`, {
          type: audioData.blob.type || 'audio/wav',
        });
      }

      formData.append('audio', audioFile);
      formData.append('name', participantName ? participantName.trim() : '');
      formData.append('gender', participantGender);
      formData.append('consent', consentAccepted);
      formData.append('duration', audioData.duration || 0);

      console.log('Sending upload request to backend /api/upload...');

      const data = await uploadSpeechRecording(formData);
      console.log('Backend response:', data);

      if (data && data.success) {
        setParticipantId(data.participantId || generateParticipantId());
        setIsSubmitted(true);
      } else {
        const errorMsg = data?.message || 'Server error during audio upload.';
        setSubmitError(errorMsg);
        alert(`Upload Failed: ${errorMsg}`);
      }
    } catch (err) {
      console.error('Error during submission:', err);
      const networkErrMsg = err.message || 'Could not connect to backend server.';
      setSubmitError(networkErrMsg);
      alert(`Upload Failed:\n${networkErrMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReturnHome = () => {
    setIsSubmitted(false);
    setConsentAccepted(false);
    setAudioData(null);
    setParticipantName('');
    setParticipantGender('');
    setParticipantId('');
    setSubmitError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToConsent = () => {
    const el = document.getElementById('privacy');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-[#4B5563] flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Sticky Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero onStartClick={scrollToConsent} />

        {/* Section Container with tight spacing */}
        <div className="space-y-0.5">
          {/* Section 3: Privacy Policy */}
          <AccordionPrivacy />

          {/* Section 4: Recording Guidelines */}
          <GuidelinesCard />

          {/* Section 5: Reading Passage */}
          <ReadingPassage
            onAudioChange={handleAudioChange}
            activeAudioType={audioData?.type}
          />

          {/* Section 6: Participant Information */}
          <ParticipantForm
            participantName={participantName}
            setParticipantName={setParticipantName}
          />

          {/* Section 7: Submit */}
          <SubmitButton
            consentAccepted={consentAccepted}
            setConsentAccepted={setConsentAccepted}
            participantGender={participantGender}
            setParticipantGender={setParticipantGender}
            audioData={audioData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </main>

      {/* Section 9: Thank You Modal / View */}
      {isSubmitted && (
        <ThankYouModal
          participantId={participantId}
          participantName={participantName}
          participantGender={participantGender}
          audioData={audioData}
          onReturnHome={handleReturnHome}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
