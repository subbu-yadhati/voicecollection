import React, { useState, useRef } from 'react';
import { UploadCloud, FileAudio, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function UploadCard({ onAudioChange, activeAudioType }) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const allowedTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/m4a', 'audio/x-m4a', 'audio/mp4'];
  const allowedExtensions = ['.wav', '.mp3', '.m4a'];

  const validateAndProcessFile = (file) => {
    setUploadError('');
    if (!file) return;

    const extension = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(extension) && !allowedTypes.includes(file.type)) {
      setUploadError('Invalid file format. Please upload WAV, MP3, or M4A audio files.');
      return;
    }

    const url = URL.createObjectURL(file);
    setUploadedFile(file);
    setAudioUrl(url);

    if (onAudioChange) {
      onAudioChange({ type: 'uploaded', file, url, name: file.name, size: file.size });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setUploadedFile(null);
    setAudioUrl(null);
    setUploadError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onAudioChange && activeAudioType === 'uploaded') {
      onAudioChange(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const isCurrentActive = activeAudioType === 'uploaded';

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 border border-indigo-300 flex items-center justify-center text-indigo-600 shrink-0 shadow-sm">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">Upload Audio</h3>
            <p className="text-sm font-medium text-slate-600">Upload a pre-recorded speech audio file</p>
          </div>
        </div>

        {uploadError && (
          <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-sm font-semibold text-red-700 flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Upload Area */}
        {!uploadedFile ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            className={`py-6 px-4 text-center border-2 border-dashed rounded-2xl cursor-pointer transition-all bg-indigo-50/40 flex flex-col items-center justify-center ${
              isDragOver ? 'border-indigo-600 bg-indigo-100/60 scale-102' : 'border-indigo-300 hover:border-indigo-500'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".wav,.mp3,.m4a,audio/wav,audio/mp3,audio/m4a"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white shadow-md flex items-center justify-center mb-3">
              <UploadCloud className="w-7 h-7" />
            </div>
            <p className="text-base font-bold text-slate-900 mb-1">
              Drag & Drop audio file here
            </p>
            <p className="text-sm font-medium text-slate-600 mb-3">
              or <span className="text-indigo-600 font-bold underline">browse from your computer</span>
            </p>

            <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 bg-white border border-indigo-200 px-4 py-1.5 rounded-full shadow-xs">
              <span>Formats:</span>
              <span className="bg-indigo-100 px-2 py-0.5 rounded text-indigo-700">WAV</span>
              <span className="bg-indigo-100 px-2 py-0.5 rounded text-indigo-700">MP3</span>
              <span className="bg-indigo-100 px-2 py-0.5 rounded text-indigo-700">M4A</span>
            </div>
          </div>
        ) : (
          <div className="py-5 px-4 bg-emerald-50/60 border-2 border-emerald-300 rounded-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-sm font-bold mb-3 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Audio File Uploaded</span>
            </div>

            <div className="flex items-center gap-4 p-3 bg-white border-2 border-emerald-200 rounded-xl mb-3 shadow-sm">
              <FileAudio className="w-9 h-9 text-indigo-600 shrink-0" />
              <div className="overflow-hidden text-left flex-1">
                <p className="text-base font-bold text-slate-900 truncate">{uploadedFile.name}</p>
                <p className="text-xs font-semibold text-slate-600">{formatFileSize(uploadedFile.size)}</p>
              </div>
              <button
                onClick={handleRemoveFile}
                className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                title="Remove audio file"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <audio src={audioUrl} controls className="w-full h-10 rounded-lg" />
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
