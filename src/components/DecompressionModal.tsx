import React from 'react';
import { IncidentAlert } from '../types';
import { Bell, ShieldAlert, CheckCircle, Sparkles, X, Clock } from 'lucide-react';

interface DecompressionModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidents: IncidentAlert[];
  onAcknowledgeIncident: (id: string) => void;
  onToggleDecompressionStep: (id: string, stepTitle: string) => void;
}

export const DecompressionModal: React.FC<DecompressionModalProps> = ({
  isOpen,
  onClose,
  incidents,
  onAcknowledgeIncident,
  onToggleDecompressionStep,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 my-8">
        
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold">Continuity Alerts & Decompression Center</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {incidents.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <p className="font-bold text-slate-800">No active incidents or unacknowledged alerts!</p>
              <p className="text-xs text-slate-500 mt-1">Student status is synced and regulated.</p>
            </div>
          ) : (
            incidents.map((inc) => (
              <div key={inc.id} className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{inc.title}</h3>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {inc.time} ({inc.date}) • Logged by {inc.loggedBy}
                      </span>
                    </div>
                  </div>

                  {!inc.parentAcknowledged ? (
                    <button
                      onClick={() => onAcknowledgeIncident(inc.id)}
                      className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm"
                    >
                      Acknowledge
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg">
                      ✓ Acknowledged
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-700">{inc.description}</p>

                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-indigo-900 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Suggested Decompression Steps:
                  </span>
                  <div className="space-y-1.5">
                    {inc.decompressionStrategies.map((strat, i) => {
                      const isDone = inc.completedSteps?.includes(strat.title);
                      return (
                        <div
                          key={i}
                          onClick={() => onToggleDecompressionStep(inc.id, strat.title)}
                          className="flex items-start gap-2 text-xs p-2 rounded-lg bg-slate-50 hover:bg-indigo-50/50 cursor-pointer border border-slate-200"
                        >
                          <input
                            type="checkbox"
                            checked={!!isDone}
                            onChange={() => {}}
                            className="w-4 h-4 accent-teal-600 rounded cursor-pointer mt-0.5"
                          />
                          <div>
                            <span className="font-bold text-slate-900">{strat.title}: </span>
                            <span className="text-slate-700">{strat.action}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
