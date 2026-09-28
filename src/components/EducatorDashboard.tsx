import React, { useState } from 'react';
import { 
  StudentProfile, 
  StatusLog, 
  IncidentAlert, 
  ScheduleItem, 
  SleepLog, 
  MoodType, 
  SensoryType 
} from '../types';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { 
  Activity, 
  Calendar, 
  Sparkles, 
  BarChart2, 
  ShieldAlert, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  CheckSquare, 
  Square, 
  Heart, 
  Volume2, 
  FileText, 
  ExternalLink,
  ChevronRight,
  Sun,
  Filter,
  Check,
  AlertCircle
} from 'lucide-react';

interface EducatorDashboardProps {
  student: StudentProfile;
  logs: StatusLog[];
  incidents: IncidentAlert[];
  schedule: ScheduleItem[];
  sleepLogs: SleepLog[];
  isDuskMode?: boolean;
  onOpenQuickLog: () => void;
  onOpenIncidentsModal: () => void;
  onAcknowledgeIncident: (incidentId: string) => void;
  onToggleScheduleComplete: (id: string) => void;
  onTriggerEmergencyIncident: (title: string, details: string, severity: 'mild' | 'moderate' | 'high') => void;
  onNavigateTab: (tab: 'feed' | 'schedule' | 'ai_trends' | 'analytics') => void;
  onAddLog: (logData: Omit<StatusLog, 'id' | 'timestamp'>) => void;
}

export const EducatorDashboard: React.FC<EducatorDashboardProps> = ({
  student,
  logs,
  incidents,
  schedule,
  sleepLogs,
  isDuskMode = false,
  onOpenQuickLog,
  onOpenIncidentsModal,
  onAcknowledgeIncident,
  onToggleScheduleComplete,
  onNavigateTab,
  onAddLog,
}) => {
  // Local quick-log state for fast classroom tapping
  const [fastMood, setFastMood] = useState<MoodType>('calm');
  const [fastSensory, setFastSensory] = useState<SensoryType>('low');
  const [fastContext, setFastContext] = useState<string>('Reading Circle');
  const [fastNotes, setFastNotes] = useState<string>('');
  const [isLoggedToast, setIsLoggedToast] = useState(false);

  // Filter for dashboard live feed widget
  const [feedFilter, setFeedFilter] = useState<'all' | 'school' | 'home' | 'incidents'>('all');

  // IEP Accommodations checklist state
  const [accommodationsState, setAccommodationsState] = useState<Record<string, boolean>>({
    'Noise-canceling headphones staged': true,
    'Weighted lap pad available': true,
    'Visual schedule mirror active': true,
    'Quiet tent decompression space ready': true,
    'Sensory fidget cube on student desk': false,
  });

  const toggleAccommodation = (key: string) => {
    setAccommodationsState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];

    onAddLog({
      date: dateStr,
      time: timeStr,
      mood: fastMood,
      energy: fastMood === 'tired' ? 'low' : fastMood === 'anxious' ? 'high' : 'moderate',
      sensory: fastSensory,
      contextTag: fastContext,
      loggedBy: student.primaryTeacher || 'Ms. Clara Davis',
      role: 'educator',
      notes: fastNotes || `Classroom telemetry logged during ${fastContext}.`,
      flaggedAsIncident: fastSensory === 'overloaded' || fastMood === 'overwhelmed',
    });

    setFastNotes('');
    setIsLoggedToast(true);
    setTimeout(() => setIsLoggedToast(false), 2500);
  };

  // Metrics calculations
  const unacknowledgedIncidents = incidents.filter((i) => !i.parentAcknowledged).length;
  const latestSleep = sleepLogs[0];
  const completedScheduleCount = schedule.filter((s) => s.isCompleted).length;
  const currentScheduleItem = schedule.find((s) => s.isCurrent) || schedule[0];

  // Sensory context load data for chart in grayscale palette
  const contextData = [
    { context: 'Arrival', sensoryLoad: 1.2, calmScore: 4.5 },
    { context: 'Reading', sensoryLoad: 1.4, calmScore: 4.2 },
    { context: 'Gym', sensoryLoad: 3.8, calmScore: 2.1 },
    { context: 'Math', sensoryLoad: 2.2, calmScore: 3.8 },
    { context: 'Lunch', sensoryLoad: 3.1, calmScore: 2.9 },
    { context: 'Art', sensoryLoad: 1.6, calmScore: 4.3 },
  ];

  // Filtered logs
  const filteredLogs = logs.filter((log) => {
    if (feedFilter === 'school') return log.role === 'educator';
    if (feedFilter === 'home') return log.role === 'parent';
    if (feedFilter === 'incidents') return log.flaggedAsIncident;
    return true;
  }).slice(0, 5);

  const getMoodEmoji = (mood: MoodType) => {
    switch (mood) {
      case 'calm': return '😊';
      case 'focused': return '🎯';
      case 'happy': return '😄';
      case 'anxious': return '😟';
      case 'overwhelmed': return '😫';
      case 'tired': return '🥱';
      default: return '🙂';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">

      {/* DASHBOARD HERO / EXECUTIVE STATUS BANNER IN SHADES OF GREY */}
      <section 
        aria-label="Student Executive Dossier"
        className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Left: Active Student Dossier */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={student.avatarUrl}
                alt={student.name}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-300 dark:border-slate-700 shadow-sm"
              />
              <span 
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-slate-900 dark:bg-slate-100 border-2 border-white dark:border-slate-900 rounded-full flex items-center justify-center" 
                title="Active Telemetry Synchronized"
              >
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
                  {student.name}
                </h1>
                <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-md">
                  {student.id.toUpperCase()}
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {student.grade} · {student.school}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span>Lead Educator: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{student.primaryTeacher}</strong></span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                <span>Guardian: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{student.parentName}</strong></span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-800 dark:text-slate-200" />
                  Continuous Home-School Sync
                </span>
              </div>
            </div>
          </div>

          {/* Right: Quick Action Controls with high-clarity monochrome styling */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenQuickLog}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Record Telemetry</span>
            </button>

            <button
              onClick={onOpenIncidentsModal}
              className="relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-all focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              <ShieldAlert className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              <span>Incident Center</span>
              {unacknowledgedIncidents > 0 && (
                <span className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                  {unacknowledgedIncidents}
                </span>
              )}
            </button>

            <button
              onClick={() => onNavigateTab('schedule')}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-all focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Schedule Mirror</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-all focus-visible:ring-2 focus-visible:ring-slate-400"
              title="Print Daily IEP Summary"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>

        </div>

        {/* Morning Home Continuity Hand-Off Banner */}
        {latestSleep && (
          <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
              <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                <Sun className="w-3.5 h-3.5" />
              </span>
              <span>
                <strong className="text-slate-900 dark:text-slate-100">Morning Hand-Off:</strong> Slept <strong className="text-slate-900 dark:text-slate-100">{latestSleep.hoursSlept} hrs</strong> ({latestSleep.sleepQuality.replace('_', ' ')}). Bedtime {latestSleep.bedtime}, wake {latestSleep.wakeTime}. {latestSleep.notes || 'Arrived alert and calm on morning bus.'}
              </span>
            </div>
            <button
              onClick={() => onNavigateTab('feed')}
              className="text-slate-800 dark:text-slate-200 font-bold hover:underline inline-flex items-center gap-1 shrink-0 transition-colors"
            >
              <span>View Parent Sync Note</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </section>

      {/* TOP 4 EXECUTIVE METRICS IN REFINED GREYSCALE HIERARCHY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Regulation Index */}
        <div className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2.5">
            <span className="font-bold uppercase tracking-wider text-[10px]">Regulation Status</span>
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 dark:bg-slate-100 ring-4 ring-slate-100 dark:ring-slate-800" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Optimal
            </span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              4.6 / 5.0
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Green Zone · Calm during seated classroom tasks.
          </p>
        </div>

        {/* Metric 2: Sensory Load Risk */}
        <div className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2.5">
            <span className="font-bold uppercase tracking-wider text-[10px]">Sensory Load</span>
            <Volume2 className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Low Risk
            </span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 font-mono">
              ~68 dB
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Acoustic baseline stable. Gym echo resolved with headphones.
          </p>
        </div>

        {/* Metric 3: Routine Progress */}
        <div className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2.5">
            <span className="font-bold uppercase tracking-wider text-[10px]">Routine Progress</span>
            <Calendar className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {completedScheduleCount}/{schedule.length}
            </span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              {Math.round((completedScheduleCount / (schedule.length || 1)) * 100)}%
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed truncate">
            Active: <strong className="text-slate-700 dark:text-slate-200 font-medium">{currentScheduleItem ? currentScheduleItem.title : 'Complete'}</strong>
          </p>
        </div>

        {/* Metric 4: Accommodations */}
        <div className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2.5">
            <span className="font-bold uppercase tracking-wider text-[10px]">IEP Accommodations</span>
            <CheckSquare className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {Object.values(accommodationsState).filter(Boolean).length}/{Object.keys(accommodationsState).length}
            </span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Active
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Goal 3.2: Self-advocacy for sensory space verified.
          </p>
        </div>

      </div>

      {/* FAST ONE-TAP CLASSROOM TELEMETRY BAR IN CRISP GREY */}
      <section 
        aria-label="Classroom One-Tap Status Check-In"
        className="rounded-2xl p-4 sm:p-5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs"
      >
        <form onSubmit={handleFastSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-900 dark:bg-slate-100" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Classroom One-Tap Status Check-In
              </h2>
            </div>
            {isLoggedToast && (
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-2.5 py-0.5 rounded-md flex items-center gap-1.5 animate-fadeIn">
                <Check className="w-3.5 h-3.5" /> Logged to continuity stream
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            
            {/* Mood selector segmented button group */}
            <div className="md:col-span-4 flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto shadow-2xs">
              {(['calm', 'focused', 'happy', 'anxious', 'overwhelmed', 'tired'] as MoodType[]).map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setFastMood(m)}
                  className={`flex-1 min-w-[36px] py-1.5 text-center rounded-lg text-xs transition-all ${
                    fastMood === m
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-750'
                  }`}
                  title={m}
                >
                  {getMoodEmoji(m)}
                </button>
              ))}
            </div>

            {/* Sensory level selector segmented group */}
            <div className="md:col-span-3 flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              {(['low', 'medium', 'high', 'overloaded'] as SensoryType[]).map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setFastSensory(s)}
                  className={`flex-1 py-1.5 text-center rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                    fastSensory === s
                      ? s === 'overloaded'
                        ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-black ring-1 ring-slate-400'
                        : 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 font-bold'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750'
                  }`}
                >
                  {s === 'overloaded' ? 'Max' : s}
                </button>
              ))}
            </div>

            {/* Context tag selection */}
            <div className="md:col-span-3">
              <select
                value={fastContext}
                onChange={(e) => setFastContext(e.target.value)}
                className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                <option value="Morning Arrival">Morning Arrival</option>
                <option value="Reading Circle">Reading Circle</option>
                <option value="Math / STEM">Math / STEM</option>
                <option value="Gym Class">Gym Class</option>
                <option value="Lunch / Cafeteria">Lunch / Cafeteria</option>
                <option value="Recess / Free Play">Recess / Free Play</option>
                <option value="Art Studio">Art Studio</option>
                <option value="Sensory Decompression Zone">Sensory Decompression Zone</option>
              </select>
            </div>

            {/* Submit button */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                <span>Record</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </form>
      </section>

      {/* MAIN TWO-COLUMN DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: 7 OF 12 COLS */}
        <div className="lg:col-span-7 space-y-6">

          {/* WIDGET 1: LIVE SENSORY & BEHAVIORAL FEED */}
          <div className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                  <Activity className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                  <span>Real-Time Continuity Stream</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Shared observations between classroom, home, and student tablet.
                </p>
              </div>

              {/* Feed filter segmented buttons in clean grey pill track */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                {(['all', 'school', 'home', 'incidents'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setFeedFilter(filter)}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all capitalize ${
                      feedFilter === filter
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* List of recent logs */}
            <div className="space-y-2.5">
              {filteredLogs.map((log) => {
                const isIncident = log.flaggedAsIncident;
                return (
                  <div
                    key={log.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isIncident
                        ? 'bg-slate-100/90 dark:bg-slate-800/80 border-slate-400 dark:border-slate-600'
                        : 'bg-slate-50/60 dark:bg-slate-850/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm">{getMoodEmoji(log.mood)}</span>
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100 capitalize">
                          {log.mood}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          · {log.contextTag}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                          log.sensory === 'overloaded'
                            ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold'
                            : log.sensory === 'high'
                            ? 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          Sensory: {log.sensory}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 dark:text-slate-400 shrink-0 font-mono">
                        {log.time}
                      </div>
                    </div>

                    {log.notes && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                        {log.notes}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400">
                      <span>Logged by: <strong className="text-slate-700 dark:text-slate-300">{log.loggedBy}</strong></span>
                      <span className="font-mono">{log.date}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                Showing {filteredLogs.length} of {logs.length} telemetry records
              </span>
              <button
                onClick={() => onNavigateTab('feed')}
                className="font-bold text-slate-900 dark:text-slate-100 hover:underline flex items-center gap-1 transition-colors"
              >
                <span>Open Full Stream Feed</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* WIDGET 2: CONTEXT SENSITIVITY LOAD MATRIX (CHART IN SHADES OF GREY) */}
          <div className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                  <span>Sensory Load vs Regulation Matrix</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Average sensory stimulation score compared to calm index across subjects.
                </p>
              </div>

              <button
                onClick={() => onNavigateTab('analytics')}
                className="text-xs font-bold text-slate-800 dark:text-slate-200 hover:underline"
              >
                Analytics
              </button>
            </div>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={contextData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    vertical={false} 
                    stroke={isDuskMode ? '#334155' : '#E2E8F0'} 
                  />
                  <XAxis 
                    dataKey="context" 
                    tick={{ fontSize: 11, fill: isDuskMode ? '#94A3B8' : '#64748B' }} 
                  />
                  <YAxis 
                    domain={[0, 5]} 
                    tick={{ fontSize: 11, fill: isDuskMode ? '#94A3B8' : '#64748B' }} 
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDuskMode ? '#0F172A' : '#FFFFFF',
                      borderColor: isDuskMode ? '#334155' : '#CBD5E1',
                      borderRadius: '12px',
                      fontSize: '11px',
                      color: isDuskMode ? '#F8FAFC' : '#0F172A',
                    }}
                  />
                  {/* High clarity contrast: Slate-800 for Sensory Load, Slate-400 for Calm Score */}
                  <Bar 
                    dataKey="sensoryLoad" 
                    name="Sensory Load (1-4)" 
                    fill={isDuskMode ? '#CBD5E1' : '#334155'} 
                    radius={[4, 4, 0, 0]} 
                  />
                  <Bar 
                    dataKey="calmScore" 
                    name="Calm Score (1-5)" 
                    fill={isDuskMode ? '#64748B' : '#94A3B8'} 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-6 mt-3 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-slate-700 dark:bg-slate-300" /> Sensory Load
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-slate-400 dark:bg-slate-600" /> Calm Score
              </span>
            </div>

          </div>

          {/* WIDGET 3: ACTIVE IEP ACCOMMODATIONS CHECKLIST */}
          <div className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                  <span>Classroom IEP Accommodations Checklist</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Mandated sensory and physical supports currently deployed in the classroom.
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-0.5 rounded-md">
                Section 504 / IEP
              </span>
            </div>

            <div className="space-y-2 mt-3">
              {Object.entries(accommodationsState).map(([item, isChecked]) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => toggleAccommodation(item)}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                    isChecked
                      ? 'bg-slate-50 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 shadow-2xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
                  }`}
                >
                  <span className="text-xs font-semibold flex items-center gap-2.5">
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-slate-900 dark:text-slate-100 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 dark:text-slate-600 shrink-0" />
                    )}
                    <span className={isChecked ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}>
                      {item}
                    </span>
                  </span>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    isChecked 
                      ? 'bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-100' 
                      : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
                  }`}>
                    {isChecked ? 'Active' : 'Standby'}
                  </span>
                </button>
              ))}
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3.5 leading-relaxed">
              {student.iepGoalsSummary}
            </p>
          </div>

        </div>

        {/* RIGHT COLUMN: 5 OF 12 COLS */}
        <div className="lg:col-span-5 space-y-6">

          {/* WIDGET 4: VISUAL SCHEDULE TIMELINE MIRROR */}
          <div className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                  <span>Today's Visual Routine</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Synced with student's classroom tablet.
                </p>
              </div>

              <button
                onClick={() => onNavigateTab('schedule')}
                className="text-xs font-bold text-slate-800 dark:text-slate-200 hover:underline"
              >
                Edit Routine
              </button>
            </div>

            <div className="space-y-2">
              {schedule.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                    item.isCurrent
                      ? 'border-slate-900 dark:border-slate-100 bg-slate-50 dark:bg-slate-800 shadow-xs'
                      : item.isCompleted
                      ? 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 opacity-70'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onToggleScheduleComplete(item.id)}
                      className="text-slate-700 dark:text-slate-300 hover:scale-110 transition-transform focus-visible:outline-none"
                      title={item.isCompleted ? 'Mark incomplete' : 'Mark complete'}
                    >
                      {item.isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-slate-800 dark:text-slate-200" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 dark:text-slate-600" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${
                          item.isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'
                        }`}>
                          {item.title}
                        </span>
                        {item.isCurrent && (
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.2 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded">
                            Now
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        {item.timeSlot} · {item.location}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 capitalize">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3.5 text-right">
              <button
                onClick={() => onNavigateTab('schedule')}
                className="text-xs font-bold text-slate-800 dark:text-slate-200 hover:underline inline-flex items-center gap-1"
              >
                <span>Open Visual Schedule Mirror</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

          </div>

          {/* WIDGET 5: AI TRANSITION PREDICTOR */}
          <div className="rounded-2xl p-5 bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  AI Transition Predictor
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">
                Gemini 2.5
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
                <strong className="text-slate-900 dark:text-slate-100 block mb-1">
                  Upcoming High-Stimulation Transition:
                </strong>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Lunch & Cafeteria (11:45 AM) presents historical sensory peak. Leo thrives when transitioning with noise-canceling headphones and sitting at the designated quiet perimeter table.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
                <strong className="text-slate-900 dark:text-slate-100 block mb-1">
                  Suggested Pre-emptive Accommodation:
                </strong>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Provide a 3-minute visual warning card at 11:42 AM before the class bell rings to prevent startle reflex.
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs">
              <button
                onClick={() => onNavigateTab('ai_trends')}
                className="font-bold text-slate-800 dark:text-slate-200 hover:underline inline-flex items-center gap-1"
              >
                <span>Explore Full Predictive AI Trends</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

          </div>

          {/* WIDGET 6: CALMING PREFERENCES & RAPID DECOMPRESSION PROTOCOL */}
          <div className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Heart className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <span>Calming & Decompression Protocol</span>
              </h3>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
              If sensory overload or anxiety escalates, initiate Leo's validated regulation sequence:
            </p>

            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {student.calmingPreferences.map((pref, idx) => (
                <li key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-900 dark:text-slate-100 shrink-0">{idx + 1}.</span>
                  <span>{pref}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={onOpenIncidentsModal}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-900 dark:text-slate-100 font-bold text-xs border border-slate-300 dark:border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <ShieldAlert className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <span>Open Emergency Decompression Protocol</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
