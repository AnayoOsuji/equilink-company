import React, { useState, useEffect, useRef } from 'react';
import { ScheduleItem, StudentProfile, MoodType } from '../types';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Sun, 
  BookOpen, 
  Dumbbell, 
  Feather, 
  Utensils, 
  Calculator, 
  Palette, 
  Bus,
  Heart,
  Smile,
  Zap,
  Play,
  Pause
} from 'lucide-react';

interface StudentVisualModeProps {
  student: StudentProfile;
  schedule: ScheduleItem[];
  onToggleComplete: (id: string) => void;
  onStudentMoodCheckIn: (mood: MoodType) => void;
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

export const StudentVisualMode: React.FC<StudentVisualModeProps> = ({
  student,
  schedule,
  onToggleComplete,
  onStudentMoodCheckIn,
}) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'calm_space'>('schedule');
  const [lastCheckInMood, setLastCheckInMood] = useState<MoodType | null>('calm');
  const [showMoodFeedback, setShowMoodFeedback] = useState(false);

  // Audio Rain Synthesizer state
  const [isPlayingRain, setIsPlayingRain] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  // Pop-it fidget grid state (6x6 array of popped states)
  const [popItGrid, setPopItGrid] = useState<boolean[]>(Array(36).fill(false));

  const togglePop = (index: number) => {
    setPopItGrid((prev) => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };

  const resetPopIt = () => {
    setPopItGrid(Array(36).fill(false));
  };

  // Web Audio Pink Noise Generator for calming rain sound
  const toggleRainAudio = () => {
    if (isPlayingRain) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setIsPlayingRain(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          output[i] *= 0.04; // low comfortable volume
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);

        whiteNoise.connect(gainNode);
        gainNode.connect(ctx.destination);
        whiteNoise.start();

        noiseNodeRef.current = whiteNoise;
        setIsPlayingRain(true);
      } catch (err) {
        console.error("Audio synth error:", err);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const handleMoodTap = (m: MoodType) => {
    setLastCheckInMood(m);
    onStudentMoodCheckIn(m);
    setShowMoodFeedback(true);
    setTimeout(() => setShowMoodFeedback(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Student Welcome Header Card */}
      <div className="bg-[#3F5A73] rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-lg overflow-hidden border-2 border-white/80 shrink-0">
            <img src={student.avatarUrl} alt={student.name} className="w-full h-full object-cover rounded-xl" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white">Hi {student.name}! 👋</h2>
            <p className="text-xs sm:text-sm font-bold text-slate-200">
              Welcome to your day! Here is your visual schedule.
            </p>
          </div>
        </div>

        {/* Big Navigation Buttons for Student */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-3 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all ${
              activeTab === 'schedule'
                ? 'bg-[#5B7A96] text-white scale-105'
                : 'bg-white/90 text-slate-900 hover:bg-white'
            }`}
          >
            📅 My Day Schedule
          </button>
          <button
            onClick={() => setActiveTab('calm_space')}
            className={`px-4 py-3 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all ${
              activeTab === 'calm_space'
                ? 'bg-[#8FA894] text-slate-950 scale-105'
                : 'bg-white/90 text-slate-900 hover:bg-white'
            }`}
          >
            🧘 Calm Down Corner
          </button>
        </div>
      </div>

      {/* QUICK MOOD CHECK-IN BAR */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-md space-y-3">
        <h3 className="text-sm font-black uppercase text-slate-700 tracking-wider flex items-center gap-2">
          <Smile className="w-5 h-5 text-[#5B7A96]" />
          <span>How are you feeling right now? (Tap one)</span>
        </h3>

        {showMoodFeedback && (
          <div className="bg-[#8FA894]/20 text-[#2C3238] p-3 rounded-2xl text-xs font-bold animate-bounce text-center border border-[#8FA894]/30">
            ✨ Great job checking in! Your teacher and family know how you feel!
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { type: 'calm', emoji: '😊', label: 'Calm & Ready', bg: 'bg-[#8FA894]/20 hover:bg-[#8FA894]/30 border-[#8FA894] text-[#2C3238]' },
            { type: 'happy', emoji: '😄', label: 'Happy & Proud', bg: 'bg-[#D9A15F]/20 hover:bg-[#D9A15F]/30 border-[#D9A15F] text-[#2C3238]' },
            { type: 'tired', emoji: '🥱', label: 'Tired / Low Energy', bg: 'bg-[#5B7A96]/20 hover:bg-[#5B7A96]/30 border-[#5B7A96] text-[#2C3238]' },
            { type: 'overwhelmed', emoji: '😫', label: 'Need Break ✋', bg: 'bg-[#C08B7A]/20 hover:bg-[#C08B7A]/30 border-[#C08B7A] text-[#2C3238]' },
          ].map((m) => (
            <button
              key={m.type}
              onClick={() => handleMoodTap(m.type as MoodType)}
              className={`p-4 rounded-2xl border-2 font-extrabold flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-sm ${m.bg}`}
            >
              <span className="text-3xl">{m.emoji}</span>
              <span className="text-xs">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: VISUAL SCHEDULE */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-base font-extrabold text-slate-900">Today's Step-by-Step Schedule</h3>
            <span className="text-xs font-bold text-slate-500">Tap checkmark when finished</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schedule.map((item, idx) => {
              const IconComp = ICON_MAP[item.iconName] || BookOpen;

              return (
                <div
                  key={item.id}
                  onClick={() => onToggleComplete(item.id)}
                  className={`p-5 rounded-3xl border-3 cursor-pointer transition-all flex items-center justify-between gap-4 ${
                    item.isCurrent
                      ? 'bg-[#D9A15F]/15 border-[#D9A15F] shadow-lg scale-102 ring-4 ring-[#D9A15F]/20'
                      : item.isCompleted
                      ? 'bg-slate-100/80 border-slate-200 opacity-60'
                      : 'bg-white border-slate-200 hover:border-[#5B7A96] shadow-sm'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    {/* Completion Check Icon */}
                    <div className="shrink-0">
                      {item.isCompleted ? (
                        <CheckCircle2 className="w-8 h-8 text-[#8FA894]" />
                      ) : (
                        <Circle className="w-8 h-8 text-slate-300 hover:text-slate-500" />
                      )}
                    </div>

                    {/* Icon visual */}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-extrabold shadow-md ${
                      item.category === 'classroom'
                        ? 'bg-[#3F5A73]'
                        : item.category === 'special'
                        ? 'bg-[#5B7A96]'
                        : item.category === 'break'
                        ? 'bg-[#8FA894]'
                        : 'bg-[#D9A15F]'
                    }`}>
                      <IconComp className="w-7 h-7" />
                    </div>

                    <div>
                      <span className="text-xs font-black text-slate-500 block">
                        {item.timeSlot}
                      </span>
                      <h4 className={`text-base font-black ${item.isCompleted ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                        {item.title}
                      </h4>
                      <span className="text-xs font-bold text-slate-600 block mt-0.5">
                        📍 {item.location}
                      </span>
                    </div>
                  </div>

                  {item.isCurrent && (
                    <span className="text-xs font-black bg-[#D9A15F] text-slate-950 px-3 py-1 rounded-full uppercase shrink-0 shadow-sm animate-pulse">
                      Now!
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: CALM DOWN CORNER */}
      {activeTab === 'calm_space' && (
        <div className="bg-[#2C3238] text-white rounded-3xl p-6 shadow-2xl border border-slate-700 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-700 pb-4">
            <div>
              <h3 className="text-xl font-black text-[#8FA894] flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-[#8FA894]" />
                <span>Sensory Decompression Space</span>
              </h3>
              <p className="text-xs text-slate-300">Take a quiet break, listen to rain sounds, or pop fidget squares.</p>
            </div>

            {/* Rain Sound Synthesizer Button */}
            <button
              onClick={toggleRainAudio}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm shadow-lg transition-all ${
                isPlayingRain
                  ? 'bg-[#8FA894] text-slate-950 animate-pulse'
                  : 'bg-slate-700 text-[#8FA894] hover:bg-slate-600'
              }`}
            >
              {isPlayingRain ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              <span>{isPlayingRain ? 'Pause Rain Sound' : 'Play Soothing Rain'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Guided Breathing Circle */}
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 flex flex-col items-center justify-center text-center space-y-4">
              <span className="text-xs font-bold text-[#8FA894] uppercase tracking-wider">
                Guided Deep Breathing
              </span>

              <div className="w-36 h-36 rounded-full bg-[#5B7A96] flex items-center justify-center text-white font-black text-sm shadow-xl shadow-[#5B7A96]/20 animate-pulse transition-all">
                <div className="w-28 h-28 rounded-full bg-[#2C3238]/90 flex flex-col items-center justify-center p-2 text-center">
                  <Heart className="w-6 h-6 text-[#8FA894] animate-ping mb-1" />
                  <span className="text-xs font-bold text-slate-200">Breathe In... Breathe Out...</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 max-w-xs">
                Slowly inhale through your nose for 4 seconds, then exhale smoothly through your mouth.
              </p>
            </div>

            {/* Pop-it Fidget Simulator */}
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Tactile Pop-It Fidget Pad
                </span>
                <button
                  onClick={resetPopIt}
                  className="text-[11px] font-bold text-slate-400 hover:text-white underline"
                >
                  Reset Bubbles
                </button>
              </div>

              <div className="grid grid-cols-6 gap-2 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                {popItGrid.map((popped, idx) => (
                  <button
                    key={idx}
                    onClick={() => togglePop(idx)}
                    className={`w-10 h-10 rounded-full font-bold text-xs transition-all active:scale-90 shadow-inner flex items-center justify-center ${
                      popped
                        ? 'bg-slate-800 text-slate-600 scale-90 border-2 border-slate-900'
                        : 'bg-gradient-to-tr from-amber-400 to-rose-400 text-slate-950 border-2 border-amber-300 shadow-md hover:scale-105'
                    }`}
                  >
                    {popped ? '•' : '○'}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
