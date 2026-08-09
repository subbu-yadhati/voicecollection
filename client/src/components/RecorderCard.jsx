import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RecorderCard({ onAudioChange, activeAudioType }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingError, setRecordingError] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const recordingTimeRef = useRef(0);
  const recordStartTimeRef = useRef(null);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    setRecordingError('');
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      recordStartTimeRef.current = Date.now();
      recordingTimeRef.current = 0;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || 'audio/wav';
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const elapsedSeconds = Math.max(1, Math.round((Date.now() - (recordStartTimeRef.current || Date.now())) / 1000));
        setAudioBlob(blob);
        setAudioUrl(url);
        if (onAudioChange) {
          onAudioChange({ type: 'recorded', blob, url, duration: elapsedSeconds });
        }
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const next = prev + 1;
          recordingTimeRef.current = next;
          return next;
        });
      }, 1000);
    } catch (err) {
      console.error('Microphone access error:', err);
      setRecordingError('Microphone permission denied or not supported by browser.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerIntervalRef.current);
    }
  };

  const handleRecordAgain = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setIsPlaying(false);
    setRecordingTime(0);
    if (onAudioChange && activeAudioType === 'recorded') {
      onAudioChange(null);
    }
  };

  const togglePlayback = () => {
    if (!audioPlayerRef.current) return;
    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const isCurrentActive = activeAudioType === 'recorded';

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">Live Recording</h3>
            <p className="text-sm font-medium text-slate-600">Record directly using your device microphone</p>
          </div>
        </div>

        {recordingError && (
          <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-sm font-semibold text-red-700 flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
            <span>{recordingError}</span>
          </div>
        )}

        {/* State 1: Idle */}
        {!isRecording && !audioBlob && (
          <div className="py-6 px-4 text-center bg-blue-50/50 border-2 border-dashed border-blue-300 rounded-2xl flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-md flex items-center justify-center mb-3">
              <Mic className="w-7 h-7" />
            </div>
            <p className="text-sm font-medium text-slate-600 max-w-xs mb-4">
              Ensure you are in a quiet room before pressing record.
            </p>
            <button
              onClick={startRecording}
              className="inline-flex items-center gap-2.5 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-base font-bold rounded-xl shadow-md transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/30"
            >
              <Mic className="w-5 h-5" />
              <span>Start Recording</span>
            </button>
          </div>
        )}

        {/* State 2: Actively Recording */}
        {isRecording && (
          <div className="py-6 px-4 text-center bg-red-50/50 border-2 border-red-300 rounded-2xl flex flex-col items-center justify-center animate-pulse">
            <div className="w-4 h-4 rounded-full bg-red-600 mb-2 animate-ping"></div>
            <div className="text-3xl sm:text-4xl font-bold font-mono text-slate-900 mb-2 tracking-wider">
              {formatTime(recordingTime)}
            </div>
            <p className="text-sm font-bold text-slate-600 mb-4">
              {recordingTime < 120 ? `Target: min 02:00 (${120 - recordingTime}s remaining recommended)` : 'Minimum length reached'}
            </p>
            <button
              onClick={stopRecording}
              className="inline-flex items-center gap-2.5 px-5 py-3 bg-red-600 hover:bg-red-700 text-white text-base font-bold rounded-xl shadow-md transition-all focus:outline-none focus:ring-4 focus:ring-red-500/30"
            >
              <Square className="w-5 h-5 fill-white" />
              <span>Stop Recording</span>
            </button>
          </div>
        )}

        {/* State 3: Audio Ready */}
        {!isRecording && audioBlob && (
          <div className="py-5 px-4 bg-emerald-50/60 border-2 border-emerald-300 rounded-2xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-sm font-bold mb-3 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Recording Captured ({formatTime(recordingTime)})</span>
            </div>

            <div className="bg-white border-2 border-emerald-200 p-3 rounded-xl flex items-center justify-between gap-4 mb-3 shadow-sm">
              <button
                onClick={togglePlayback}
                className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shrink-0 transition-colors shadow-md"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
              </button>

              <audio
                ref={audioPlayerRef}
                src={audioUrl}
                onEnded={() => setIsPlaying(false)}
                className="w-full h-10"
                controls
              />
            </div>

            <button
              onClick={handleRecordAgain}
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-emerald-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Record Again</span>
            </button>
          </div>
        )}
      </div>

      {isCurrentActive && (
        <div className="mt-3 pt-2 border-t border-slate-200 text-right">
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-lg">
            Selected for Submission
          </span>
        </div>
      )}
    </div>
  );
}
