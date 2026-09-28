import React from 'react';
import { Check, Sparkles, Building, User, ShieldCheck, ArrowRight } from 'lucide-react';

interface PricingPageProps {
  onOpenFreeTrial: () => void;
  onOpenContact: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  onOpenFreeTrial,
  onOpenContact,
}) => {
  return (
    <div className="space-y-10 py-4">
      
      {/* Pricing Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8FA894]/20 text-[#2C3238] text-xs font-black">
          <Sparkles className="w-3.5 h-3.5 text-[#5B7A96]" />
          <span>Simple, Transparent Pricing</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
          Neuro-Affirming Support for Families & School Districts
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          Start with a 14-day free trial. No credit card required. Upgrade anytime as your student network expands.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Tier 1: Family / Parent */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Family Sync</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-slate-900">$9</span>
                <span className="text-xs text-slate-500 font-bold">/ month</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Ideal for individual families tracking sleep & sensory sync with teachers.</p>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700">
              {[
                '1 Student Profile',
                'Home Morning Sleep & Energy Logger',
                'Real-Time Teacher Sync Alerts',
                'Classroom Sensory Trigger Feed',
                'Basic Exportable Progress Summaries',
              ].map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#8FA894] shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={onOpenFreeTrial}
            className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-extrabold text-xs transition-all"
          >
            Start 14-Day Free Trial
          </button>
        </div>

        {/* Tier 2: Special Educator / Classroom (Highlighted) */}
        <div className="bg-[#3F5A73] text-white rounded-3xl p-6 sm:p-8 border-2 border-[#5B7A96] shadow-xl space-y-6 flex flex-col justify-between relative">
          
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#D9A15F] text-slate-950 font-black text-[11px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
            Most Popular for Educators
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">Classroom & IEP Suite</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-white">$29</span>
                <span className="text-xs text-slate-200 font-bold">/ month / classroom</span>
              </div>
              <p className="text-xs text-slate-200 mt-1">Full IEP tracking suite for special educators, OT/SLP specialists & paras.</p>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-100">
              {[
                'Up to 15 Student Profiles',
                'Interactive Visual Schedule Mirroring',
                'Gemini AI Decompression Assistant',
                'Tactile Fidget Pad & Soothing Audio Synth',
                'Verifiable IEP Goal 3.2 & 4.1 Export Reports',
                'Unlimited Parent Connections',
              ].map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D9A15F] shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={onOpenFreeTrial}
            className="w-full py-3 rounded-2xl bg-[#5B7A96] hover:bg-[#7C97AE] text-white font-extrabold text-xs shadow-md transition-all"
          >
            Start Free Trial Now
          </button>
        </div>

        {/* Tier 3: School District */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">School District & Enterprise</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-slate-900">Custom</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">District-wide rollout with Google Workspace & ClassLink SSO and DPA agreements.</p>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700">
              {[
                'Unlimited School & District Profiles',
                'Google Workspace / ClassLink Single Sign-On',
                'FERPA & COPPA Signed DPA Agreements',
                'Dedicated Special Education Onboarding',
                'Custom IEP Management Software Integrations',
                'Priority 24/7 Clinical Support',
              ].map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#8FA894] shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={onOpenContact}
            className="w-full py-3 rounded-2xl bg-[#5B7A96] hover:bg-[#7C97AE] text-white font-extrabold text-xs transition-all"
          >
            Talk to Our District Team
          </button>
        </div>

      </div>

    </div>
  );
};
