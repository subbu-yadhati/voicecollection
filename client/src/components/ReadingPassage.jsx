import React, { useState, useRef, useEffect } from 'react';
import {
  BookOpen,
  RefreshCw,
  Copy,
  Check,
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Send,
  Upload,
  Radio
} from 'lucide-react';
import { fetchGeneratedPassage } from '../utils/api';

export default function ReadingPassage({
  passageText = '',
  setPassageText,
  onPassageGenerated,
  onAudioChange,
  activeAudioType,
}) {
  const [localText, setLocalText] = useState(passageText || '');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState('text-2xl sm:text-3xl');

  // In-place Recording & Upload States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingError, setRecordingError] = useState('');
  const [showRecorderPanel, setShowRecorderPanel] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const fileInputRef = useRef(null);
  const recordingTimeRef = useRef(0);
  const recordStartTimeRef = useRef(null);
  const isRecordingRef = useRef(false);

  // Sync prop and local text
  const currentText = passageText || localText;

  const updatePassageText = (newText) => {
    setLocalText(newText);
    if (setPassageText) setPassageText(newText);
    if (onPassageGenerated) onPassageGenerated(newText);
  };

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setCopied(false);
    setRecordingError('');

    try {
      const data = await fetchGeneratedPassage();

      if (data && data.success && data.text) {
        updatePassageText(data.text);
      } else {
        const errStr = data?.message || 'Failed to fetch passage from backend.';
        setRecordingError(errStr);
      }
    } catch (err) {
      console.error('Backend fetch error:', err);
      setRecordingError(
        `Could not connect to backend server (${err.message}). Please ensure server is running.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!currentText) return;
    navigator.clipboard.writeText(currentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToSubmit = () => {
    const el = document.getElementById('submit-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const startRecording = async () => {
    setRecordingError('');
    audioChunksRef.current = [];
    setShowRecorderPanel(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      recordStartTimeRef.current = Date.now();
      recordingTimeRef.current = 0;
      isRecordingRef.current = true;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || 'audio/wav';
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const elapsedSeconds = Math.max(
          1,
          Math.round((Date.now() - (recordStartTimeRef.current || Date.now())) / 1000)
        );
        setAudioBlob(blob);
        setAudioUrl(url);
        isRecordingRef.current = false;
        setIsRecording(false);

        if (onAudioChange) {
          onAudioChange({ type: 'recorded', blob, url, duration: elapsedSeconds });
        }
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const next = prev + 1;
          recordingTimeRef.current = next;
          return next;
        });
      }, 1000);
    } catch (err) {
      console.error('Microphone access error:', err);
      isRecordingRef.current = false;
      setIsRecording(false);
      setRecordingError('Microphone permission denied or not supported by browser.');
    }
  };

  const stopRecording = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    isRecordingRef.current = false;
    setIsRecording(false);
  };

  const handleRecordAgain = () => {
    // 1. Pause any playing audio
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    // 2. Clean up previous recording URLs
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    // 3. Reset audio states but KEEP passage text completely intact
    setUploadedFile(null);
    setAudioBlob(null);
    setAudioUrl(null);
    setIsPlaying(false);
    setRecordingTime(0);
    setShowRecorderPanel(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // 4. Start recording immediately
    startRecording();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/') && !/\.(mp3|wav|m4a|ogg|webm|flac|aac)$/i.test(file.name)) {
      setRecordingError('Please select a valid audio file (MP3, WAV, M4A, OGG, etc.).');
      setShowRecorderPanel(true);
      return;
    }

    if (isRecording) {
      stopRecording();
    }

    if (audioUrl) URL.revokeObjectURL(audioUrl);
    const url = URL.createObjectURL(file);
    setUploadedFile(file);
    setAudioBlob(file);
    setAudioUrl(url);
    setRecordingError('');
    setShowRecorderPanel(true);

    if (onAudioChange) {
      onAudioChange({
        type: 'uploaded',
        file,
        url,
        name: file.name,
      });
    }
  };

  const handleClearFile = () => {
    setUploadedFile(null);
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setShowRecorderPanel(false);
    if (onAudioChange) onAudioChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
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

  const handleHeaderRecordClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      handleClearFile();
      startRecording();
    }
  };

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  // Sync when parent completely resets audio (e.g. on return home)
  useEffect(() => {
    if (!activeAudioType && !isRecordingRef.current && !audioBlob) {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      setUploadedFile(null);
      setAudioUrl(null);
      setIsPlaying(false);
      setRecordingTime(0);
      setShowRecorderPanel(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [activeAudioType]);

  return (
    <section id="passage" className="py-2 bg-white">
      <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/70">
          
          {/* Card Header with Heading (Left), Generate Button (Middle), Record Button (End) */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
            {/* Left: Title & Subtitle */}
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Reading Passage</h2>
                <p className="text-base sm:text-lg text-slate-600 font-medium">
                  Generate a passage to read aloud for your recording
                </p>
              </div>
            </div>

            {/* Middle: Generate Text Button */}
            <div className="flex items-center justify-center">
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-bold rounded-xl shadow-md transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 shrink-0 cursor-pointer"
              >
                <RefreshCw className={`w-4.5 h-4.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'Generating...' : 'Generate Text'}</span>
              </button>
            </div>

            {/* End (Right): Exclusive Record or Upload Button Selection */}
            <div className="flex items-center justify-end gap-2.5 shrink-0">
              {/* Show Record button only if NO pre-recorded file has been uploaded */}
              {!uploadedFile && (
                <button
                  onClick={handleHeaderRecordClick}
                  className={`inline-flex items-center justify-center gap-2 px-3.5 py-2.5 text-white text-base font-semibold rounded-xl shadow-md transition-all focus:outline-none focus:ring-4 shrink-0 transform cursor-pointer ${
                    isRecording
                      ? 'bg-red-600 animate-pulse ring-4 ring-red-300 hover:bg-red-700'
                      : audioBlob
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-red-600 hover:bg-red-700 hover:scale-105 active:scale-95'
                  }`}
                >
                  {isRecording ? (
                    <>
                      <Square className="w-5 h-5 fill-white" />
                      <span>Stop ({formatTime(recordingTime)})</span>
                    </>
                  ) : audioBlob ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Recorded ({formatTime(recordingTime)})</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5" />
                      <span>Record</span>
                    </>
                  )}
                </button>
              )}

              {/* Hidden Audio File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Show Upload button only if live recording is NOT active and NO live recording has been captured */}
              {!isRecording && !audioBlob && (
                <>
                  <span className="text-slate-400 font-bold text-sm">OR</span>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 text-base font-semibold rounded-xl shadow-xs transition-all focus:outline-none shrink-0 border cursor-pointer ${
                      uploadedFile
                        ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                        : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50 hover:border-slate-400'
                    }`}
                  >
                    <Upload className="w-5 h-5" />
                    <span>{uploadedFile ? 'Uploaded File' : 'Upload Audio'}</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Action & Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 mb-2.5">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Font Size Controls */}
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
                <button
                  onClick={() => setFontSize('text-xl')}
                  className={`px-2.5 py-1 rounded-md text-base font-bold transition-colors cursor-pointer ${
                    fontSize === 'text-xl' ? 'bg-blue-50 text-blue-600 shadow-xs' : 'text-slate-700'
                  }`}
                >
                  Medium
                </button>
                <button
                  onClick={() => setFontSize('text-2xl sm:text-3xl')}
                  className={`px-2.5 py-1 rounded-md text-base font-bold transition-colors cursor-pointer ${
                    fontSize === 'text-2xl sm:text-3xl'
                      ? 'bg-blue-50 text-blue-600 shadow-xs'
                      : 'text-slate-700'
                  }`}
                >
                  Large
                </button>
                <button
                  onClick={() => setFontSize('text-3xl sm:text-4xl')}
                  className={`px-2.5 py-1 rounded-md text-base font-bold transition-colors cursor-pointer ${
                    fontSize === 'text-3xl sm:text-4xl'
                      ? 'bg-blue-50 text-blue-600 shadow-xs'
                      : 'text-slate-700'
                  }`}
                >
                  XL
                </button>
              </div>

              {/* Copy Button */}
              {currentText && (
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 bg-white border border-slate-300 hover:border-blue-500 hover:text-blue-600 px-3.5 py-1 rounded-lg text-slate-800 text-sm font-bold transition-all shadow-xs cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Simple Inline Recording & Upload Panel placed ABOVE the Reading Paragraph Box */}
          {showRecorderPanel && (
            <div
              className={`mb-3 p-3 sm:p-4 rounded-xl shadow-xs transition-all animate-fadeIn ${
                isRecording
                  ? 'bg-gradient-to-r from-red-50/90 via-white to-red-50/90 border-2 border-red-300 ring-2 ring-red-100'
                  : 'bg-white border border-slate-200'
              }`}
            >
              {recordingError && (
                <div className="mb-2.5 p-2.5 bg-red-100 border border-red-300 text-red-800 rounded-lg text-sm font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4.5 h-4.5 shrink-0 text-red-600" />
                  <span>{recordingError}</span>
                </div>
              )}

              {isRecording && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-9 w-9 rounded-full bg-red-400 opacity-75"></span>
                      <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md z-10">
                        <Mic className="w-4 h-4 animate-pulse" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold font-mono text-slate-900 tracking-wider">
                          {formatTime(recordingTime)}
                        </span>
                        <span className="text-sm font-bold text-red-600 uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-100 animate-pulse">
                          Recording Live
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 font-medium">
                        Read the paragraph below clearly into your microphone
                      </p>
                    </div>
                  </div>

                  {/* Animated Soundwave Bar Visualizer */}
                  <div className="flex items-center gap-1.5 h-8 px-3 py-1 bg-red-50/50 rounded-lg">
                    <div className="w-1.5 h-3 bg-red-500 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
                    <div className="w-1.5 h-6 bg-red-600 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                    <div className="w-1.5 h-7 bg-red-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-4 bg-red-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-6 bg-red-500 rounded-full animate-bounce [animation-delay:-0.1s]"></div>
                    <div className="w-1.5 h-4 bg-red-600 rounded-full animate-bounce [animation-delay:-0.5s]"></div>
                  </div>

                  <button
                    onClick={stopRecording}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl shadow-md transition-all focus:outline-none shrink-0 cursor-pointer active:scale-95"
                  >
                    <Square className="w-4 h-4 fill-white" />
                    <span>Stop Recording</span>
                  </button>
                </div>
              )}

              {!isRecording && audioBlob && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                      {uploadedFile ? (
                        <Upload className="w-4.5 h-4.5 text-blue-600" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <span>
                          {uploadedFile ? 'Audio File Uploaded' : 'Passage Recording Captured'}
                        </span>
                        <span className="text-sm bg-slate-100 text-slate-800 border border-slate-300 px-2 py-0.5 rounded-md font-bold max-w-[180px] truncate">
                          {uploadedFile ? uploadedFile.name : `(${formatTime(recordingTime)})`}
                        </span>
                      </h4>
                      <p className="text-sm text-slate-600 font-medium">
                        {uploadedFile
                          ? `Pre-recorded file (${Math.round(uploadedFile.size / 1024)} KB) selected for submission`
                          : 'Saved & ready for submission'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                    <button
                      onClick={togglePlayback}
                      className="w-9 h-9 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shrink-0 transition-colors shadow-sm cursor-pointer"
                    >
                      {isPlaying ? (
                        <Pause className="w-4.5 h-4.5 fill-white" />
                      ) : (
                        <Play className="w-4.5 h-4.5 fill-white ml-0.5" />
                      )}
                    </button>

                    <audio
                      ref={audioPlayerRef}
                      src={audioUrl}
                      onEnded={() => setIsPlaying(false)}
                      className="h-8 w-44 sm:w-52"
                      controls
                    />

                    {uploadedFile ? (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 bg-white border border-slate-300 rounded-lg transition-colors shrink-0 shadow-xs cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Change File</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleRecordAgain}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors shrink-0 shadow-xs cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Re-record</span>
                      </button>
                    )}

                    <button
                      onClick={scrollToSubmit}
                      className="inline-flex items-center gap-1 px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg shadow-xs transition-all shrink-0 hover:shadow-md active:scale-95 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Go to Submit</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reading Paragraph Box */}
          <div
            className={`rounded-2xl p-4 sm:p-5 shadow-inner max-h-80 overflow-y-auto custom-scrollbar transition-all duration-300 ${
              isRecording
                ? 'bg-red-50/20 border-2 border-red-400 ring-4 ring-red-100/60 shadow-md'
                : 'bg-[#FFFDF9] border border-slate-200/80'
            }`}
          >
            {/* Live recording indicator banner directly above text when recording */}
            {isRecording && (
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-red-200 text-red-700 text-xs sm:text-sm font-bold animate-pulse">
                <Radio className="w-4 h-4 text-red-600" />
                <span>LIVE RECORDING ACTIVE — Please read the passage below:</span>
              </div>
            )}

            {isLoading ? (
              <div className="py-8 flex items-center justify-center text-blue-600 gap-2.5">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <p className="text-base font-bold text-slate-700">
                  Just a Second Your Passage is Loading.....
                </p>
              </div>
            ) : currentText ? (
              <p
                className={`${fontSize} text-slate-900 leading-relaxed whitespace-pre-line font-medium tracking-wide`}
              >
                {currentText}
              </p>
            ) : (
              <div className="py-8 text-center text-slate-500">
                <p className="text-base font-medium">Click "Generate Text" above to load a reading passage.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
