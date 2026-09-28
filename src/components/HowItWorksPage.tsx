import React, { useState } from 'react';
import { Sparkles, Moon, Calendar, ShieldAlert, Award, ArrowRight, CheckCircle2, Play, HeartHandshake } from 'lucide-react';

interface HowItWorksPageProps {
  onOpenFreeTrial: () => void;
  onOpenContact: () => void;
  onLaunchApp: () => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({
  onOpenFreeTrial,
  onOpenContact,
  onLaunchApp,
}) => {
  const [selectedPillar, setSelectedPillar] = useState<number>(0);

  const PILLARS = [
    {
      icon: Moon,
      title: '1. Home Morning Check-In & Sleep Sync',
      subtitle: 'Parents log sleep quality & emotional tone in under 30 seconds before school.',
      description: 'Educators receive instant morning alerts before the student steps off the bus. If the student had under 7 hours of sleep, the system suggests proactive 10-minute quiet decompression.',
      badge: 'Home Continuity'
    },
    {
      icon: Calendar,
      title: '2. Visual Schedule Mirroring',
      subtitle: 'Classroom schedules mirror onto student tablets with zero-anxiety visual prompts.',
      description: 'When schedule shifts happen (e.g. fire drill or substitute teacher), teachers tap once to mirror visual updates across student tablets simultaneously, preventing transition meltdowns.',
      badge: 'Visual Support'
    },
    {
      icon: ShieldAlert,
      title: '3. Real-Time Sensory Overload Monitoring',
      subtitle: 'Log sensory triggers (gym acoustics, cafeteria noise) with quick-tap feedback.',
      description: 'Student or teacher taps sensory state on tablet. If sensory overload is flagged, EquiLink alerts the parent and suggests immediate decompression strategies.',
      badge: 'Sensory Prevention'
    },
    {
      icon: Sparkles,
      title: '4. Gemini AI Decompression Engine',
      subtitle: 'Contextual AI strategies tailored to the student’s unique neurodivergent profile.',
      description: 'Generates real-time, non-pharmacological decompression steps (e.g., weighted lap pads, 5-minute pink-noise rain audio) based on environmental context.',
      badge: 'AI Powered'
    },
    {
      icon: Award,
      title: '5. Verified IEP Goal & District Reporting',
      subtitle: 'Track IEP Goal 3.2 & 4.1 progress automatically for quarterly reviews.',
      description: 'Export verifiable, print-ready IEP documentation showing self-advocacy rates, headphone usage, and sensory regulation progress.',
      badge: 'IEP Verified'
    },
  ];

  return (
    <div className="space-y-10 py-4">
      
      {/* Header Banner */}
      <div className="bg-[#5B7A96] rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8FA894]/20 text-[#8FA894] border border-[#8FA894]/30 text-xs font-bold">
          <HeartHandshake className="w-3.5 h-3.5 text-[#8FA894]" />
          <span>Neuro-Affirming Home & School Platform</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
          How EquiLink Connects Home & Classroom
        </h1>

        <p className="text-xs sm:text-sm text-slate-200 max-w-2xl font-medium leading-relaxed">
          Autistic and neurodivergent students thrive when there is zero gap between home sleep context and classroom expectations. Here is how EquiLink creates continuous emotional safety.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={onLaunchApp}
            className="px-6 py-3 rounded-full bg-[#D9A15F] hover:bg-[#c48e4d] text-slate-950 font-black text-xs sm:text-sm shadow-md"
          >
            Launch Interactive Demo App →
          </button>
          <button
            onClick={onOpenFreeTrial}
            className="px-6 py-3 rounded-full bg-[#8FA894] hover:bg-[#7A9680] text-slate-950 font-black text-xs sm:text-sm shadow-md"
          >
            Start Free Trial
          </button>
        </div>
      </div>

      {/* Interactive 5 Pillars Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Pillar Nav */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block px-1">
            The 5 Continuity Steps
          </span>

          {PILLARS.map((p, idx) => {
            const Icon = p.icon;
            const isSelected = selectedPillar === idx;

            return (
              <div
                key={idx}
                onClick={() => setSelectedPillar(idx)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#5B7A96]/10 border-[#5B7A96] shadow-md scale-101'
                    : 'bg-white border-slate-200 hover:border-[#5B7A96]/40 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    isSelected ? 'bg-[#5B7A96] text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#5B7A96] block">
                      {p.badge}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{p.title}</h3>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Detail Card */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg space-y-6 sticky top-24">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs font-extrabold bg-[#8FA894]/20 text-[#2C3238] px-3 py-1 rounded-full">
                {PILLARS[selectedPillar].badge}
              </span>
              <span className="text-xs text-slate-400 font-bold">Step {selectedPillar + 1} of 5</span>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900">{PILLARS[selectedPillar].title}</h2>
              <p className="text-sm font-semibold text-[#5B7A96] mt-1">{PILLARS[selectedPillar].subtitle}</p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium bg-slate-50 p-5 rounded-2xl border border-slate-200">
              {PILLARS[selectedPillar].description}
            </p>

            <div className="pt-2 flex justify-between items-center">
              <button
                onClick={onLaunchApp}
                className="text-xs font-extrabold text-[#5B7A96] hover:text-[#3F5A73] flex items-center gap-1 underline"
              >
                <span>Try this feature in live app</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenContact}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800"
              >
                Request District Overview
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
