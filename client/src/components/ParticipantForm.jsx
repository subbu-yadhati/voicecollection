import React from 'react';
import { User } from 'lucide-react';

export default function ParticipantForm({
  participantName,
  setParticipantName,
}) {
  return (
    <section id="participant" className="py-2 bg-white">
      <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/70">
          <div className="flex items-center gap-3 mb-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Participant Information</h2>
              <p className="text-base sm:text-lg text-slate-600 font-medium">
                Providing your name is optional. If left blank, your voice recording will be anonymized using an auto-generated participant ID.
              </p>
            </div>
          </div>

          <div className="max-w-2xl mt-2">
            <label
              htmlFor="participant-name"
              className="block text-base sm:text-lg font-bold text-slate-900 mb-1.5"
            >
              Full Name <span className="text-slate-500 font-normal text-sm sm:text-base">(Optional)</span>
            </label>
            <input
              id="participant-name"
              type="text"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              placeholder="e.g. Subrahmanyam or leave blank for Anonymous"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-base sm:text-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all shadow-xs"
            />
          </div>
        </div>
      </div>
    </section>
  );
}