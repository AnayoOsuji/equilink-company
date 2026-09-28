import React, { useState } from 'react';
import { StatusLog, SleepLog, StudentProfile, IncidentAlert } from '../types';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  BarChart2, 
  TrendingUp, 
  Moon, 
  ShieldAlert, 
  Download, 
  FileText, 
  CheckCircle2, 
  Calendar,
  Award
} from 'lucide-react';

interface AnalyticsDashboardProps {
  student: StudentProfile;
  logs: StatusLog[];
  sleepLogs: SleepLog[];
  incidents: IncidentAlert[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  student,
  logs,
  sleepLogs,
  incidents,
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '14d' | '30d'>('7d');
  const [showExportModal, setShowExportModal] = useState(false);

  // Transform logs into numerical values for chart
  const moodToScore = (mood: string) => {
    switch (mood) {
      case 'happy': return 5;
      case 'calm': return 4;
      case 'focused': return 4;
      case 'tired': return 2;
      case 'anxious': return 2;
      case 'overwhelmed': return 1;
      default: return 3;
    }
  };

  const sensoryToScore = (sensory: string) => {
    switch (sensory) {
      case 'low': return 1;
      case 'medium': return 2;
      case 'high': return 3;
      case 'overloaded': return 4;
      default: return 1;
    }
  };

  // Group trend data by context
  const contextData = [
    { context: 'Morning Arrival', sensoryLoad: 1.2, calmScore: 4.5 },
    { context: 'Reading Circle', sensoryLoad: 1.5, calmScore: 4.2 },
    { context: 'Gym Class', sensoryLoad: 3.8, calmScore: 2.1 },
    { context: 'Math / STEM', sensoryLoad: 2.4, calmScore: 3.5 },
    { context: 'Lunch / Cafeteria', sensoryLoad: 2.9, calmScore: 3.0 },
    { context: 'Art Studio', sensoryLoad: 1.8, calmScore: 4.0 },
    { context: 'Decompression Zone', sensoryLoad: 1.0, calmScore: 4.8 },
  ];

  // Sleep vs Sensory chart data
  const sleepChartData = sleepLogs.map((s) => ({
    date: s.date.slice(5),
    sleepHours: s.hoursSlept,
    sensorySpikes: s.hoursSlept < 7.5 ? 3 : 1,
  }));

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Dashboard Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-slate-900">Behavioral & Sensory Analytics</h2>
            <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-semibold border border-slate-200">
              IEP Tracking
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Data visualizations of emotional regulation, sensory loads, and sleep correlations for {student.name}.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            {(['7d', '14d', '30d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  timeRange === r
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export IEP Report</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Average Sleep</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-900">7.9 hrs</span>
            <span className="text-xs font-semibold text-emerald-600">↑ 0.5h this week</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Restful quality on 80% nights</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Sensory Regulation Rate</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-teal-700">88%</span>
            <span className="text-xs font-semibold text-emerald-600">Optimal</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Regulated after break room</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Sensory Overload Incidents</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-amber-600">2</span>
            <span className="text-xs font-semibold text-slate-500">This week</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Gym echo & Fire drill alarm</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">IEP Goal 3.2 Progress</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-indigo-700">92%</span>
            <span className="text-xs font-semibold text-indigo-600">On Track</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Self-advocates for headphones</p>
        </div>
      </div>

      {/* Visual Recharts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Sensory Load by Activity */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>Sensory Sensitivity Load by School Context</span>
            </h3>
            <span className="text-[11px] text-slate-500">Scale 1-4</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contextData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="context" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis domain={[0, 4]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="sensoryLoad" fill="#6366f1" radius={[6, 6, 0, 0]} name="Sensory Sensitivity" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Sleep Hours vs Sensory Spikes */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Moon className="w-4 h-4 text-amber-500" />
              <span>Nightly Sleep Duration vs. Classroom Sensory Spikes</span>
            </h3>
            <span className="text-[11px] text-slate-500">Past 5 Days</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sleepChartData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 12]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="sleepHours" stroke="#10b981" strokeWidth={3} name="Sleep Hours" />
                <Line type="monotone" dataKey="sensorySpikes" stroke="#f43f5e" strokeWidth={2} name="Sensory Spikes" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* IEP GOALS PROGRESS TRACKER */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Award className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900">Individualized Education Program (IEP) Goal Tracker</h3>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Goal 3.2: Self-Advocacy During Sensory Overload</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                92% Met
              </span>
            </div>
            <p className="text-xs text-slate-600">
              When sensory environment exceeds comfortable threshold, student will independently put on noise-canceling headphones or request break card in 4 out of 5 opportunities.
            </p>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[92%]" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Goal 4.1: Transition Following Visual Schedule Shifts</span>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-full border border-indigo-300">
                85% Met
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Student will review the visual schedule mirror upon arrival and transition smoothly between scheduled activities with under 2 minutes of verbal prompt.
            </p>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full w-[85%]" />
            </div>
          </div>
        </div>
      </div>

      {/* IEP REPORT EXPORT MODAL */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <FileText className="w-5 h-5 text-indigo-600" />
                <span>EquiLink IEP & Behavioral Report Summary</span>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div id="printable-iep-report" className="space-y-4 text-slate-800 text-xs sm:text-sm p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="border-b border-slate-200 pb-3 flex justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">{student.name}</h2>
                  <p className="text-xs text-slate-600">{student.grade} | {student.school}</p>
                  <p className="text-xs text-slate-600">Teacher: {student.primaryTeacher}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-teal-700 bg-teal-100 px-2.5 py-1 rounded-md">
                    EquiLink Verified Data
                  </span>
                  <p className="text-xs text-slate-500 mt-1">Generated: July 2026</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-1">Key Behavioral & Sensory Summary</h4>
                <p className="leading-relaxed">
                  Over the past evaluation period, {student.name} maintained a high level of emotional regulation when supported by the EquiLink visual schedule mirror and proactive sensory breaks prior to high-noise activities (Gym, Assembly).
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-1">Identified Environmental Triggers</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {student.sensoryTriggers.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-1">Recommended Accommodations</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Provide noise-canceling headphones 5 mins prior to Gym/Assembly.</li>
                  <li>Mirror classroom schedule shifts on home tablet immediately.</li>
                  <li>Offer 10-min dim light decompression session when sleep duration is under 7 hours.</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
              >
                Close
              </button>
              <button
                onClick={handlePrintReport}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Print / Save PDF</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
