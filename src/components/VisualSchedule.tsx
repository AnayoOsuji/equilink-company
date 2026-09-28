import React, { useState } from 'react';
import { ScheduleItem, UserRole } from '../types';
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Edit3, 
  Sparkles, 
  Sun, 
  BookOpen, 
  Dumbbell, 
  Feather, 
  Utensils, 
  Calculator, 
  Palette, 
  Bus,
  RefreshCw,
  Bell
} from 'lucide-react';

interface VisualScheduleProps {
  schedule: ScheduleItem[];
  role: UserRole;
  onToggleComplete: (id: string) => void;
  onUpdateScheduleItem: (updated: ScheduleItem) => void;
  onAddScheduleItem: (item: Omit<ScheduleItem, 'id' | 'isCompleted' | 'isCurrent'>) => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Sun: Sun,
  BookOpen: BookOpen,
  Dumbbell: Dumbbell,
  Feather: Feather,
  Utensils: Utensils,
  Calculator: Calculator,
  Palette: Palette,
  Bus: Bus,
};

export const VisualSchedule: React.FC<VisualScheduleProps> = ({
  schedule,
  role,
  onToggleComplete,
  onUpdateScheduleItem,
  onAddScheduleItem,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [timeSlot, setTimeSlot] = useState('02:00 PM');
  const [title, setTitle] = useState('Quiet Library Reading');
  const [location, setLocation] = useState('School Library');
  const [iconName, setIconName] = useState('BookOpen');
  const [category, setCategory] = useState<'classroom' | 'special' | 'break' | 'home_routine'>('classroom');
  const [isChanged, setIsChanged] = useState(true);
  const [changeNotice, setChangeNotice] = useState('Location moved to Courtyard');

  const changedItems = schedule.filter((s) => s.isChanged);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddScheduleItem({
      timeSlot,
      title,
      location,
      iconName,
      category,
      isChanged,
      changeNotice: isChanged ? changeNotice : undefined,
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Visual Schedule Header & Schedule Change Mirror Alert Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Visual Schedule Mirroring</h2>
              <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300">
                Home ↔ School Mirror
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Live synchronized routine to prevent surprise distress or transition anxiety.
            </p>
          </div>

          {(role === 'educator' || role === 'parent') && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add / Modify Routine</span>
            </button>
          )}
        </div>

        {/* Schedule Change Warning Banner if changes exist */}
        {changedItems.length > 0 && (
          <div className="bg-amber-50 border-2 border-amber-300/80 rounded-xl p-4 flex items-start gap-3 shadow-xs">
            <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
            </div>
            <div className="flex-1">
              <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-2">
                <span>Visual Schedule Change Notice ({changedItems.length})</span>
                <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-semibold">
                  Synced to Home Tablet
                </span>
              </h3>
              <ul className="mt-1.5 space-y-1">
                {changedItems.map((item) => (
                  <li key={item.id} className="text-xs text-amber-900 font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                    <strong>{item.timeSlot} - {item.title}:</strong> {item.changeNotice}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Visual Timeline Cards */}
      <div className="grid grid-cols-1 gap-3">
        {schedule.map((item, index) => {
          const IconComp = ICON_MAP[item.iconName] || BookOpen;

          return (
            <div
              key={item.id}
              className={`rounded-2xl border p-4 sm:p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                item.isCurrent
                  ? 'bg-gradient-to-r from-teal-50 via-white to-teal-50/30 border-2 border-teal-500 shadow-md ring-2 ring-teal-500/20'
                  : item.isCompleted
                  ? 'bg-slate-50/80 border-slate-200 opacity-75'
                  : 'bg-white border-slate-200 hover:border-indigo-200'
              }`}
            >
              <div className="flex items-start sm:items-center space-x-4">
                
                {/* Checkbox for Completion */}
                <button
                  onClick={() => onToggleComplete(item.id)}
                  className="mt-0.5 sm:mt-0 p-1 text-slate-400 hover:text-teal-600 transition-colors"
                >
                  {item.isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-300 hover:text-slate-400" />
                  )}
                </button>

                {/* Visual Category Icon */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-white font-bold shadow-sm ${
                  item.category === 'classroom'
                    ? 'bg-[#3F5A73]'
                    : item.category === 'special'
                    ? 'bg-[#5B7A96]'
                    : item.category === 'break'
                    ? 'bg-[#8FA894]'
                    : 'bg-[#D9A15F]'
                }`}>
                  <IconComp className="w-6 h-6" />
                </div>

                {/* Routine Info */}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {item.timeSlot}
                    </span>

                    {item.isCurrent && (
                      <span className="text-xs font-bold bg-teal-600 text-white px-2.5 py-0.5 rounded-full shadow-xs animate-pulse">
                        Active Now
                      </span>
                    )}

                    {item.isChanged && (
                      <span className="text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        Schedule Shift
                      </span>
                    )}
                  </div>

                  <h3 className={`text-base font-bold mt-1 ${item.isCompleted ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <span>📍 {item.location}</span>
                  </p>

                  {item.changeNotice && (
                    <p className="text-xs font-semibold text-amber-800 mt-1 bg-amber-50 p-1.5 rounded-lg border border-amber-200 inline-block">
                      Note: {item.changeNotice}
                    </p>
                  )}
                </div>

              </div>

              {/* Step indicator */}
              <div className="sm:text-right shrink-0 flex items-center gap-2 self-end sm:self-center">
                <span className="text-xs font-semibold text-slate-400">
                  Step #{index + 1}
                </span>
              </div>

            </div>
          );
        })}
      </div>

      {/* MODAL TO ADD OR MODIFY ROUTINE ITEM */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4 animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-base">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <span>Add / Mirror Schedule Event</span>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Time Slot
                  </label>
                  <input
                    type="text"
                    required
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Icon Symbol
                  </label>
                  <select
                    value={iconName}
                    onChange={(e) => setIconName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold text-slate-900"
                  >
                    <option value="Sun">Sun (Morning)</option>
                    <option value="BookOpen">Book (Reading/Class)</option>
                    <option value="Dumbbell">Gym / PE</option>
                    <option value="Feather">Sensory / Reset</option>
                    <option value="Utensils">Lunch / Meal</option>
                    <option value="Calculator">Math / Science</option>
                    <option value="Palette">Art / Crafts</option>
                    <option value="Bus">Bus / Transit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Activity Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Location / Room
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              {/* Flag as Schedule Shift Toggle */}
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900">Unscheduled Change Notice</span>
                  <input
                    type="checkbox"
                    checked={isChanged}
                    onChange={(e) => setIsChanged(e.target.checked)}
                    className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
                  />
                </div>
                {isChanged && (
                  <input
                    type="text"
                    placeholder="Reason (e.g. Substitute teacher, Gym moved indoors)"
                    value={changeNotice}
                    onChange={(e) => setChangeNotice(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-amber-300 bg-white text-amber-900"
                  />
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30"
                >
                  Add & Sync to Home
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
