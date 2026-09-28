import React, { useState } from 'react';
import { UserRole, MoodType, EnergyType, SensoryType, StatusLog, SleepLog } from '../types';
import { 
  X, 
  Send, 
  Moon, 
  CheckCircle2, 
  Sparkles,
  Tag,
  ShieldAlert,
  HeartHandshake
} from 'lucide-react';

interface QuickTapLoggerProps {
  isOpen: boolean;
  onClose: () => void;
  role: UserRole;
  studentName: string;
  onAddLog: (log: Omit<StatusLog, 'id' | 'timestamp'>) => void;
  onAddSleepLog: (sleep: Omit<SleepLog, 'id'>) => void;
}

/* Sensory-Safe Palette Mapping for Moods */
const MOOD_OPTIONS: { type: MoodType; emoji: string; label: string; bgClass: string; borderClass: string; textClass: string }[] = [
  { type: 'calm', emoji: '🌿', label: 'Calm (Regulated)', bgClass: 'bg-[#8FA894]/20', borderClass: 'border-[#8FA894]', textClass: 'text-[#2C3238]' },
  { type: 'focused', emoji: '📘', label: 'Focused', bgClass: 'bg-[#5B7A96]/20', borderClass: 'border-[#5B7A96]', textClass: 'text-[#2C3238]' },
  { type: 'happy', emoji: '✨', label: 'Happy', bgClass: 'bg-[#8FA894]/25', borderClass: 'border-[#8FA894]', textClass: 'text-[#2C3238]' },
  { type: 'anxious', emoji: '🌾', label: 'Anxious (Taupe)', bgClass: 'bg-[#B8AFA0]/30', borderClass: 'border-[#B8AFA0]', textClass: 'text-[#2C3238]' },
  { type: 'overwhelmed', emoji: '🍂', label: 'Elevated (Ochre)', bgClass: 'bg-[#D9A15F]/30', borderClass: 'border-[#D9A15F]', textClass: 'text-[#2C3238]' },
  { type: 'tired', emoji: '🕊️', label: 'Need Break (Terracotta)', bgClass: 'bg-[#C08B7A]/30', borderClass: 'border-[#C08B7A]', textClass: 'text-[#2C3238]' },
];

const ENERGY_OPTIONS: { type: EnergyType; label: string; icon: string }[] = [
  { type: 'low', label: 'Low Energy', icon: '🔋' },
  { type: 'moderate', label: 'Moderate', icon: '⚡' },
  { type: 'high', label: 'High Energy', icon: '🚀' },
];

const SENSORY_OPTIONS: { type: SensoryType; label: string; colorHex: string; textLabel: string }[] = [
  { type: 'low', label: 'Regulated / Calm', colorHex: '#8FA894', textLabel: 'Calm Sage' },
  { type: 'medium', label: 'Aware / Neutral', colorHex: '#B8AFA0', textLabel: 'Warm Taupe' },
  { type: 'high', label: 'Elevated Sensitivity', colorHex: '#D9A15F', textLabel: 'Muted Ochre' },
  { type: 'overloaded', label: 'Overloaded / Support Required', colorHex: '#C08B7A', textLabel: 'Dusty Terracotta' },
];

const CONTEXT_TAGS = [
  'Morning Arrival',
  'Reading Circle',
  'Gym Class',
  'Math / STEM',
  'Lunch & Recess',
  'Art & Music',
  'Decompression Zone',
  'Bus Ride',
  'Home Routine'
];

export const QuickTapLogger: React.FC<QuickTapLoggerProps> = ({
  isOpen,
  onClose,
  role,
  studentName,
  onAddLog,
  onAddSleepLog,
}) => {
  const [activeTab, setActiveTab] = useState<'status' | 'sleep'>('status');

  // Status Form state
  const [selectedMood, setSelectedMood] = useState<MoodType>('calm');
  const [selectedEnergy, setSelectedEnergy] = useState<EnergyType>('moderate');
  const [selectedSensory, setSelectedSensory] = useState<SensoryType>('low');
  const [contextTag, setContextTag] = useState<string>('Reading Circle');
  const [notes, setNotes] = useState<string>('');
  const [flaggedAsIncident, setFlaggedAsIncident] = useState<boolean>(false);

  // Sleep Form state
  const [hoursSlept, setHoursSlept] = useState<number>(8.5);
  const [sleepQuality, setSleepQuality] = useState<'restful' | 'restless' | 'frequent_wakes'>('restful');
  const [bedtime, setBedtime] = useState<string>('08:30 PM');
  const [wakeTime, setWakeTime] = useState<string>('07:00 AM');
  const [sleepNotes, setSleepNotes] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  if (!isOpen) return null;

  const handleSubmitStatus = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];

    const loggedByText = role === 'educator' 
      ? 'Ms. Clara Davis (Educator)' 
      : role === 'parent' 
      ? 'Sarah Chen (Parent)' 
      : `${studentName} (Student Visual Check-in)`;

    onAddLog({
      date: dateStr,
      time: timeStr,
      mood: selectedMood,
      energy: selectedEnergy,
      sensory: selectedSensory,
      contextTag,
      loggedBy: loggedByText,
      role,
      notes,
      flaggedAsIncident
    });

    setIsSubmitting(false);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      onClose();
    }, 900);
  };

  const handleSubmitSleep = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const dateStr = new Date().toISOString().split('T')[0];

    onAddSleepLog({
      date: dateStr,
      hoursSlept,
      sleepQuality,
      bedtime,
      wakeTime,
      notes: sleepNotes
    });

    setIsSubmitting(false);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E2228]/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-[#F4F1EC] text-[#2C3238] rounded-3xl shadow-2xl border border-[#DCD8D0] w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Sensory Header Bar */}
        <div className="bg-[#5B7A96] text-white p-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-[#8FA894]" />
              <h2 className="text-lg font-black text-white">Sensory-Safe Quick-Tap Log</h2>
            </div>
            <p className="text-xs text-slate-100 mt-0.5">
              Low-arousal check-in for {studentName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#DCD8D0] bg-[#E8E4DD] px-5 pt-3">
          <button
            onClick={() => setActiveTab('status')}
            className={`flex-1 py-2 text-xs font-bold border-b-2 text-center transition-all ${
              activeTab === 'status'
                ? 'border-[#5B7A96] text-[#5B7A96] bg-[#F4F1EC] rounded-t-xl shadow-xs'
                : 'border-transparent text-[#5C6570] hover:text-[#2C3238]'
            }`}
          >
            Mood & Sensory Check-In
          </button>
          {role === 'parent' && (
            <button
              onClick={() => setActiveTab('sleep')}
              className={`flex-1 py-2 text-xs font-bold border-b-2 text-center transition-all ${
                activeTab === 'sleep'
                  ? 'border-[#5B7A96] text-[#5B7A96] bg-[#F4F1EC] rounded-t-xl shadow-xs'
                  : 'border-transparent text-[#5C6570] hover:text-[#2C3238]'
              }`}
            >
              <Moon className="w-3.5 h-3.5 inline mr-1 text-[#5B7A96]" />
              Nightly Sleep Log
            </button>
          )}
        </div>

        {/* Success Toast */}
        {showSuccessToast && (
          <div className="bg-[#8FA894]/30 text-[#2C3238] p-4 border-b border-[#8FA894] flex items-center gap-2 text-xs font-extrabold">
            <CheckCircle2 className="w-4 h-4 text-[#8FA894]" />
            <span>Logged safely! Syncing with home & school teams...</span>
          </div>
        )}

        {/* STATUS FORM */}
        {activeTab === 'status' && (
          <form onSubmit={handleSubmitStatus} className="p-6 space-y-5">
            
            {/* 1. Mood Selection */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#5C6570] mb-2">
                1. Emotional State (Tap to select)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {MOOD_OPTIONS.map((item) => {
                  const isSelected = selectedMood === item.type;
                  return (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setSelectedMood(item.type)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                        isSelected
                          ? `${item.bgClass} ${item.borderClass} shadow-sm ring-2 ring-[#5B7A96]/20`
                          : 'bg-[#E8E4DD] border-[#DCD8D0] hover:border-[#B8AFA0]'
                      }`}
                    >
                      <span className="text-2xl mb-1">{item.emoji}</span>
                      <span className="text-[11px] font-bold text-[#2C3238]">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Energy Level */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#5C6570] mb-2">
                2. Energy Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ENERGY_OPTIONS.map((e) => {
                  const isSelected = selectedEnergy === e.type;
                  return (
                    <button
                      key={e.type}
                      type="button"
                      onClick={() => setSelectedEnergy(e.type)}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border-2 text-xs font-extrabold transition-all ${
                        isSelected
                          ? 'border-[#5B7A96] bg-[#5B7A96] text-white'
                          : 'border-[#DCD8D0] bg-[#E8E4DD] text-[#2C3238] hover:bg-[#DCD8D0]'
                      }`}
                    >
                      <span>{e.icon}</span>
                      <span>{e.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Sensory Threshold (Sage, Taupe, Ochre, Terracotta) */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#5C6570] mb-2">
                3. Sensory Threshold (Color + Icon + Label)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SENSORY_OPTIONS.map((s) => {
                  const isSelected = selectedSensory === s.type;
                  return (
                    <button
                      key={s.type}
                      type="button"
                      onClick={() => setSelectedSensory(s.type)}
                      className={`flex items-center justify-between p-3 rounded-2xl border-2 text-left transition-all ${
                        isSelected
                          ? 'border-[#5B7A96] bg-[#E8E4DD] shadow-sm ring-2 ring-[#5B7A96]/30'
                          : 'border-[#DCD8D0] bg-[#E8E4DD] text-[#2C3238] hover:border-[#B8AFA0]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span 
                          className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10"
                          style={{ backgroundColor: s.colorHex }}
                        />
                        <span className="text-xs font-bold text-[#2C3238]">{s.label}</span>
                      </div>
                      <span className="text-[10px] font-black uppercase text-[#5C6570]">
                        {s.textLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Context Tag */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#5C6570] mb-2 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-[#5B7A96]" />
                <span>4. Activity Context Tag</span>
              </label>
              <div className="flex flex-wrap gap-1.5 p-2 bg-[#E8E4DD] rounded-2xl border border-[#DCD8D0]">
                {CONTEXT_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setContextTag(tag)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      contextTag === tag
                        ? 'bg-[#5B7A96] text-white shadow-xs'
                        : 'bg-[#F4F1EC] text-[#2C3238] border border-[#DCD8D0] hover:bg-[#DCD8D0]'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Observations */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#5C6570] mb-1">
                Quick Observation Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Put on noise headphones during gym class..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#DCD8D0] bg-[#E8E4DD] text-[#2C3238] focus:outline-none focus:ring-2 focus:ring-[#5B7A96] font-medium"
              />
            </div>

            {/* Flag as Incident (Terracotta #C08B7A - NO SATURATED RED) */}
            <div className="bg-[#C08B7A]/20 border border-[#C08B7A]/50 p-3.5 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-5 h-5 text-[#C08B7A] shrink-0" />
                <div>
                  <span className="text-xs font-black text-[#2C3238] block">Flag for Team Support (Terracotta Alert)</span>
                  <span className="text-[11px] text-[#5C6570]">Triggers instant team notification & Gemini decompression steps</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={flaggedAsIncident}
                onChange={(e) => setFlaggedAsIncident(e.target.checked)}
                className="w-5 h-5 accent-[#C08B7A] rounded cursor-pointer"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#5B7A96] hover:bg-[#7C97AE] text-white font-black text-xs sm:text-sm rounded-2xl shadow-sm flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Submit & Sync Status</span>
            </button>
          </form>
        )}

        {/* SLEEP FORM */}
        {activeTab === 'sleep' && (
          <form onSubmit={handleSubmitSleep} className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#5C6570] mb-2">
                Hours Slept Last Night
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="4"
                  max="12"
                  step="0.5"
                  value={hoursSlept}
                  onChange={(e) => setHoursSlept(parseFloat(e.target.value))}
                  className="w-full accent-[#5B7A96]"
                />
                <span className="text-base font-black text-[#5B7A96] bg-[#E8E4DD] px-3 py-1 rounded-xl border border-[#DCD8D0]">
                  {hoursSlept} hrs
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#5C6570] mb-2">
                Sleep Quality
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'restful', label: 'Restful 🌿' },
                  { value: 'restless', label: 'Restless 🌾' },
                  { value: 'frequent_wakes', label: 'Woke Up 🍂' },
                ].map((q) => (
                  <button
                    key={q.value}
                    type="button"
                    onClick={() => setSleepQuality(q.value as any)}
                    className={`py-2.5 px-2 rounded-2xl border-2 text-xs font-extrabold transition-all ${
                      sleepQuality === q.value
                        ? 'border-[#5B7A96] bg-[#5B7A96] text-white'
                        : 'border-[#DCD8D0] bg-[#E8E4DD] text-[#2C3238] hover:bg-[#DCD8D0]'
                    }`}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#5C6570] mb-1">
                  Bedtime
                </label>
                <input
                  type="text"
                  value={bedtime}
                  onChange={(e) => setBedtime(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#DCD8D0] bg-[#E8E4DD] text-[#2C3238]"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#5C6570] mb-1">
                  Wake Up Time
                </label>
                <input
                  type="text"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#DCD8D0] bg-[#E8E4DD] text-[#2C3238]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#5C6570] mb-1">
                Sleep Notes
              </label>
              <input
                type="text"
                placeholder="e.g. Slept through night with weighted blanket..."
                value={sleepNotes}
                onChange={(e) => setSleepNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#DCD8D0] bg-[#E8E4DD] text-[#2C3238]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#5B7A96] hover:bg-[#7C97AE] text-white font-black text-xs sm:text-sm rounded-2xl shadow-sm flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <Moon className="w-4 h-4" />
              <span>Save Nightly Sleep Log</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
