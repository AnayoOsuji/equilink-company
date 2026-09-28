import React, { useState } from 'react';
import { UserRole, StatusLog, IncidentAlert, StudentProfile } from '../types';
import { 
  BellRing, 
  ShieldAlert, 
  CheckCircle, 
  Clock, 
  User, 
  School, 
  Home, 
  Sparkles, 
  ArrowRight, 
  Plus, 
  Zap, 
  Tag, 
  HeartHandshake,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';

interface ContinuitySyncFeedProps {
  role: UserRole;
  student: StudentProfile;
  logs: StatusLog[];
  incidents: IncidentAlert[];
  onAcknowledgeIncident: (incidentId: string) => void;
  onToggleDecompressionStep: (incidentId: string, stepTitle: string) => void;
  onTriggerEmergencyIncident: (title: string, details: string, severity: 'mild' | 'moderate' | 'high') => void;
  onOpenQuickLog: () => void;
}

export const ContinuitySyncFeed: React.FC<ContinuitySyncFeedProps> = ({
  role,
  student,
  logs,
  incidents,
  onAcknowledgeIncident,
  onToggleDecompressionStep,
  onTriggerEmergencyIncident,
  onOpenQuickLog,
}) => {
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [incidentTitle, setIncidentTitle] = useState('Loud Noise Trigger in Cafeteria');
  const [incidentDetails, setIncidentDetails] = useState('Clattering tray noise created sensory overload. Leo covered ears and took 10 mins in quiet tent.');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'high'>('moderate');
  const [isSubmittingEmergency, setIsSubmittingEmergency] = useState(false);
  const [expandedIncidentId, setExpandedIncidentId] = useState<string | null>(incidents[0]?.id || null);

  const handleCreateEmergency = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingEmergency(true);
    await onTriggerEmergencyIncident(incidentTitle, incidentDetails, severity);
    setIsSubmittingEmergency(false);
    setShowEmergencyModal(false);
  };

  const getMoodBadge = (mood: string) => {
    switch (mood) {
      case 'calm': return { emoji: '😊', label: 'Calm', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'focused': return { emoji: '😐', label: 'Focused', bg: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'happy': return { emoji: '😄', label: 'Happy', bg: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'anxious': return { emoji: '😟', label: 'Anxious', bg: 'bg-orange-100 text-orange-800 border-orange-200' };
      case 'overwhelmed': return { emoji: '😫', label: 'Overwhelmed', bg: 'bg-rose-100 text-rose-800 border-rose-200' };
      case 'tired': return { emoji: '🥱', label: 'Tired', bg: 'bg-slate-100 text-slate-800 border-slate-200' };
      default: return { emoji: '🙂', label: mood, bg: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  const getSensoryBadge = (sensory: string) => {
    switch (sensory) {
      case 'low': return { label: 'Sensory Low', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'medium': return { label: 'Sensory Med', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'high': return { label: 'Sensory High', bg: 'bg-orange-50 text-orange-700 border-orange-200' };
      case 'overloaded': return { label: 'OVERLOADED', bg: 'bg-rose-600 text-white font-bold border-rose-700 animate-pulse' };
      default: return { label: sensory, bg: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Role Banner / Active Sync Callout */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-5 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400">
              <HeartHandshake className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-white">Continuity Sync Stream</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30">
              {role === 'educator' ? 'Classroom Tablet Active' : 'Parent Mobile Sync Active'}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Real-time status bridge between home and school. Any trigger or status logged in class instantly updates the parent phone with suggested decompression routines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Trigger Incident Button for Educators/Parents */}
          <button
            onClick={() => setShowEmergencyModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-600/30 active:scale-95 transition-all"
          >
            <ShieldAlert className="w-4 h-4 animate-bounce" />
            <span>Report Sensory Incident</span>
          </button>

          <button
            onClick={onOpenQuickLog}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs shadow-md active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tap Status</span>
          </button>
        </div>
      </div>

      {/* ACTIVE INCIDENTS & DECOMPRESSION SECTION */}
      {incidents.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <BellRing className="w-4 h-4 text-amber-500" />
              <span>Incident Alerts & Decompression Guides ({incidents.length})</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">Auto-generated via Gemini AI</span>
          </div>

          <div className="grid gap-4">
            {incidents.map((inc) => {
              const isExpanded = expandedIncidentId === inc.id;
              const isParentView = role === 'parent';

              return (
                <div
                  key={inc.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    inc.severity === 'high'
                      ? 'bg-rose-50/50 border-rose-200'
                      : 'bg-amber-50/50 border-amber-200'
                  }`}
                >
                  {/* Card Header Bar */}
                  <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 bg-white/60">
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-xl text-white font-bold shrink-0 ${
                        inc.severity === 'high' ? 'bg-rose-600' : 'bg-amber-500'
                      }`}>
                        <ShieldAlert className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-base font-bold text-slate-900">{inc.title}</h4>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                            inc.severity === 'high'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}>
                            {inc.severity} Severity
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {inc.time} ({inc.date})
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 mt-1">{inc.description}</p>
                        <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                          {inc.role === 'educator' ? <School className="w-3 h-3 text-indigo-600" /> : <Home className="w-3 h-3 text-teal-600" />}
                          <span>Logged by {inc.loggedBy}</span>
                        </p>
                      </div>
                    </div>

                    {/* Acknowledge Action */}
                    <div className="flex items-center gap-2 shrink-0">
                      {!inc.parentAcknowledged && isParentView && (
                        <button
                          onClick={() => onAcknowledgeIncident(inc.id)}
                          className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Acknowledge Notification</span>
                        </button>
                      )}

                      {inc.parentAcknowledged && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-xl">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Acknowledged by Parent</span>
                        </span>
                      )}

                      <button
                        onClick={() => setExpandedIncidentId(isExpanded ? null : inc.id)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded AI Decompression Guide */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 bg-white space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs sm:text-sm">
                          <Sparkles className="w-4 h-4 text-indigo-600" />
                          <span>AI Decompression Strategies for Home Transition</span>
                        </div>
                        <span className="text-[11px] text-indigo-600 font-medium">Gemini Behavioral Engine</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {inc.decompressionStrategies.map((strat, idx) => {
                          const isDone = inc.completedSteps?.includes(strat.title);

                          return (
                            <div
                              key={idx}
                              onClick={() => onToggleDecompressionStep(inc.id, strat.title)}
                              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                                isDone
                                  ? 'bg-emerald-50/80 border-emerald-300'
                                  : 'bg-slate-50 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="text-xs font-bold text-slate-900">{strat.title}</span>
                                <input
                                  type="checkbox"
                                  checked={!!isDone}
                                  onChange={() => {}} // handled by div click
                                  className="w-4 h-4 accent-teal-600 rounded cursor-pointer shrink-0 mt-0.5"
                                />
                              </div>
                              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{strat.action}</p>
                              <span className="inline-block mt-2 text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                                {strat.targetSensory}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CONTINUITY LOG STREAM */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>Real-Time Home & School Activity Logs</span>
            </h3>
            <p className="text-xs text-slate-500">Live feed updated by parents and educators without form friction</p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-200 px-2.5 py-1 rounded-lg self-start sm:self-auto">
            {logs.length} Logged Sessions
          </span>
        </div>

        {/* Log Entries Timeline List */}
        <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
          {logs.map((log) => {
            const moodInfo = getMoodBadge(log.mood);
            const sensoryInfo = getSensoryBadge(log.sensory);

            return (
              <div key={log.id} className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  
                  {/* Left Column: Emoji & Mood */}
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl shrink-0 shadow-xs">
                      {moodInfo.emoji}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${moodInfo.bg}`}>
                          Mood: {moodInfo.label}
                        </span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${sensoryInfo.bg}`}>
                          {sensoryInfo.label}
                        </span>
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                          {log.contextTag}
                        </span>
                      </div>

                      {log.notes && (
                        <p className="text-xs sm:text-sm text-slate-800 font-medium mt-1.5 leading-relaxed">
                          "{log.notes}"
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2">
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          {log.role === 'educator' ? <School className="w-3 h-3 text-indigo-600" /> : <Home className="w-3 h-3 text-teal-600" />}
                          {log.loggedBy}
                        </span>
                        <span>•</span>
                        <span>{log.time} ({log.date})</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Energy Badge */}
                  <div className="sm:text-right shrink-0">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                      Energy: <span className="uppercase font-bold text-indigo-900">{log.energy}</span>
                    </span>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* EMERGENCY INCIDENT REPORT MODAL */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4 animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-base">
                <ShieldAlert className="w-5 h-5 animate-pulse" />
                <span>Report Classroom / Home Sensory Trigger</span>
              </div>
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEmergency} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Incident Title
                </label>
                <input
                  type="text"
                  required
                  value={incidentTitle}
                  onChange={(e) => setIncidentTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Trigger Details / Context
                </label>
                <textarea
                  required
                  rows={3}
                  value={incidentDetails}
                  onChange={(e) => setIncidentDetails(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Severity Threshold
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['mild', 'moderate', 'high'] as const).map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setSeverity(sev)}
                      className={`py-2 text-xs font-bold rounded-xl border-2 uppercase transition-all ${
                        severity === sev
                          ? 'border-rose-600 bg-rose-50 text-rose-900 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-xl flex items-center gap-2 text-xs text-indigo-900">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Gemini AI will instantly analyze this trigger and generate custom decompression strategies for the parent.</span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEmergencyModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEmergency}
                  className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-1.5"
                >
                  {isSubmittingEmergency ? 'Generating AI Strategies...' : 'Send Alert & Sync'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
