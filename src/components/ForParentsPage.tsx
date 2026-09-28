import React from 'react';
import { Home, Heart, Moon, ShieldCheck, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ForParentsPageProps {
  onOpenFreeTrial: () => void;
  onLaunchApp: () => void;
}

export const ForParentsPage: React.FC<ForParentsPageProps> = ({
  onOpenFreeTrial,
  onLaunchApp,
}) => {
  return (
    <div className="space-y-10 py-4">
      
      {/* Hero Banner */}
      <div className="bg-[#3F5A73] rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8FA894]/20 text-[#8FA894] border border-[#8FA894]/30 text-xs font-bold">
          <Heart className="w-3.5 h-3.5 text-[#8FA894]" />
          <span>Designed for Families & Parents</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
          No More "How Was School?" Guesswork
        </h1>

        <p className="text-xs sm:text-sm text-slate-200 max-w-2xl font-medium leading-relaxed">
          EquiLink gives parents a real-time window into their child's school day. Log sleep quality in the morning, receive instant sensory alert notifications, and know exactly how your child is feeling before they walk through the door at dismissal.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={onLaunchApp}
            className="px-6 py-3.5 rounded-full bg-[#8FA894] hover:bg-[#7A9680] text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all"
          >
            Open Parent Workspace →
          </button>
          <button
            onClick={onOpenFreeTrial}
            className="px-6 py-3.5 rounded-full bg-white text-[#2C3238] hover:bg-slate-100 font-black text-xs sm:text-sm shadow-md transition-all"
          >
            Start 14-Day Free Family Trial
          </button>
        </div>
      </div>

      {/* 3 Core Parent Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#5B7A96]/15 text-[#5B7A96] flex items-center justify-center font-bold">
            <Moon className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-slate-900">10-Second Morning Sleep Sync</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Quickly tap your child's sleep duration and morning energy level so teachers know how to support them during arrival.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#8FA894]/20 text-[#8FA894] flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-slate-900">Proactive Decompression Steps</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            If loud gym classes or fire drills trigger sensory overload, EquiLink provides immediate AI decompression strategies for home after-school rest.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-slate-900">Empowered IEP Goal Advocacy</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Access verified IEP self-advocacy logs to ensure your child receives all mandated sensory accommodations and break support.
          </p>
        </div>
      </div>

    </div>
  );
};
