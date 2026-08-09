import React from 'react';
import { Clock, Volume2, Mic, VolumeX, Languages } from 'lucide-react';

export default function GuidelinesCard() {
  const guidelines = [
    {
      icon: Clock,
      title: 'Duration',
      desc: 'Minimum recording length: 2 minutes will very helpful for us',
      bgClass: 'bg-blue-50/70 text-blue-900',
      iconClass: 'text-black'
    },
    {
      icon: Mic,
      title: 'Natural Tone',
      desc: 'Speak naturally at a steady cadence and normal volume.',
      bgClass: 'bg-indigo-50/70 text-indigo-900',
      iconClass: 'text-black'
    },
    {
      icon: Volume2,
      title: 'Quiet Environment',
      desc: 'Use a quiet room to minimize background room reflections.',
      bgClass: 'bg-emerald-50/70 text-emerald-900',
      iconClass: 'text-black'
    },
    {
      icon: VolumeX,
      title: 'No Background Noise',
      desc: 'Avoid background music, fan noise, or overlapping voices.',
      bgClass: 'bg-amber-50/70 text-amber-900',
      iconClass: 'text-black'
    },
  ];

  return (
    <section id="guidelines" className="py-1 sm:py-2 bg-white">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-10 lg:px-16">
        <div className="mb-1 sm:mb-2">
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-0.5">Recording Guidelines</h2>
          <p className="text-xs sm:text-base lg:text-lg text-slate-600 font-medium">Simple recommendations to ensure high acoustic quality for research analysis</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3.5">
          {guidelines.map((g, idx) => {
            const IconComp = g.icon;
            return (
              <div
                key={idx}
                className={`p-2.5 sm:p-4 bg-white rounded-xl sm:rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-sm ${g.bgClass}`}
              >
                <div className="flex items-center gap-1.5 sm:gap-2.5 mb-1 sm:mb-1.5">
                  <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-xs shrink-0 ${g.iconClass}`}>
                    <IconComp className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="text-sm sm:text-xl font-semibold text-slate-900 leading-tight">{g.title}</h3>
                </div>
                <p className="text-xs sm:text-base leading-snug sm:leading-relaxed font-medium text-slate-700">{g.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
