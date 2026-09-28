import React from 'react';
import { ArrowRight, CheckCircle2, Shield, Key, FileSpreadsheet, Users, Sparkles, Building2, Headphones } from 'lucide-react';

interface ForSchoolsPageProps {
  onOpenContact: () => void;
  onOpenHowItWorks: () => void;
  onOpenFreeTrial: () => void;
}

export const ForSchoolsPage: React.FC<ForSchoolsPageProps> = ({
  onOpenContact,
  onOpenHowItWorks,
  onOpenFreeTrial,
}) => {
  return (
    <div className="space-y-12 py-4">
      
      {/* Top Breadcrumb & Hero Banner */}
      <div className="relative rounded-3xl bg-[#5B7A96]/10 p-6 sm:p-10 border border-[#5B7A96]/20 shadow-sm overflow-hidden">
        
        {/* Floating Background Mascot Graphic */}
        <div className="absolute right-6 top-6 hidden lg:block animate-bounce duration-1000">
          <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-[#5B7A96]/20 shadow-xl flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#5B7A96] flex items-center justify-center text-white text-2xl font-black shadow-md">
              🤖
            </div>
            <div>
              <span className="text-xs font-extrabold text-slate-900 block">AI IEP Companion</span>
              <span className="text-[11px] text-[#5B7A96] font-semibold">FERPA & COPPA Ready</span>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
          <span>Home</span>
          <span>/</span>
          <span className="text-[#5B7A96] font-bold">For schools</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#5B7A96]/15 border border-[#5B7A96]/30 text-[#2C3238] text-xs font-black">
              <Sparkles className="w-3.5 h-3.5 text-[#5B7A96]" />
              <span>For schools & districts</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
              Scalable, aligned support for every IEP
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium max-w-xl">
              Give every learner a personalized, neuro-affirming experience — and give your teams the rostering, controls, and reporting a district rollout requires.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenContact}
                className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#5B7A96] hover:bg-[#7C97AE] text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-[#5B7A96]/25 transition-all active:scale-95"
              >
                <span>Talk to our team</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenHowItWorks}
                className="px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-[#2C3238] border border-slate-300 font-extrabold text-xs sm:text-sm shadow-sm transition-all active:scale-95"
              >
                How EquiLink works
              </button>
            </div>

            <p className="text-[11px] font-semibold text-slate-500 pt-2">
              COPPA- and FERPA-aligned · SSO & rostering · DPA available
            </p>
          </div>

          {/* Right Hero Feature Card */}
          <div className="lg:col-span-5">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                Why families and schools choose EquiLink
              </span>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-[#5B7A96]/10 border border-[#5B7A96]/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black text-[#5B7A96] bg-[#5B7A96]/20 px-2.5 py-1 rounded-xl">
                      SSO
                    </span>
                    <span className="text-xs font-extrabold text-slate-800">
                      & class rostering
                    </span>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5B7A96]" />
                </div>

                <div className="p-4 rounded-2xl bg-[#8FA894]/15 border border-[#8FA894]/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black text-[#4A6350] bg-[#8FA894]/30 px-2.5 py-1 rounded-xl">
                      IEP
                    </span>
                    <span className="text-xs font-extrabold text-slate-800">
                      aligned by default
                    </span>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8FA894]" />
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black text-amber-800 bg-amber-200 px-2.5 py-1 rounded-xl">
                      FERPA
                    </span>
                    <span className="text-xs font-extrabold text-slate-800">
                      school-official model
                    </span>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* District Benefits Grid */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-black text-slate-900">
            Built for District Special Education Leadership
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Seamlessly bridge home environments and classroom instruction with automated data logging, sensory overload prevention, and IEP goal compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5B7A96]/15 text-[#5B7A96] flex items-center justify-center font-bold">
              <Key className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900">Google Workspace & ClassLink SSO</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instant district single sign-on with automatic teacher, paraprofessional, and parent account provisioning.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#8FA894]/20 text-[#8FA894] flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900">Automated IEP Goal Analytics</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Generate printable, verified IEP progress reports showing self-advocacy rates and sensory break effectiveness.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900">FERPA, COPPA & DPA Compliant</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Strict end-to-end data privacy with signed Data Processing Agreements available for state and municipal districts.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <h3 className="text-2xl font-black">Ready to elevate IEP outcomes in your district?</h3>
          <p className="text-xs text-slate-300">
            Start a 14-day free district trial or schedule a demo with our special education consultants.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenContact}
            className="px-6 py-3 rounded-full bg-[#5B7A96] hover:bg-[#7C97AE] text-white font-black text-xs shadow-lg"
          >
            Schedule District Demo
          </button>
          <button
            onClick={onOpenFreeTrial}
            className="px-6 py-3 rounded-full bg-white text-slate-950 font-black text-xs hover:bg-slate-100"
          >
            Start Free Trial
          </button>
        </div>
      </div>

    </div>
  );
};
