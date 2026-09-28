import React, { useState } from 'react';
import { StudentProfile, StatusLog, ScheduleItem, SleepLog, AITrendResult, UserRole } from '../types';
import { 
  Sparkles, 
  BrainCircuit, 
  TrendingUp, 
  Moon, 
  ShieldAlert, 
  CheckCircle, 
  MessageSquare, 
  Send, 
  RefreshCw,
  Lightbulb,
  FileText
} from 'lucide-react';

interface AITrendAnalysisProps {
  student: StudentProfile;
  logs: StatusLog[];
  schedule: ScheduleItem[];
  sleepLogs: SleepLog[];
  role: UserRole;
}

export const AITrendAnalysis: React.FC<AITrendAnalysisProps> = ({
  student,
  logs,
  schedule,
  sleepLogs,
  role,
}) => {
  const [aiAnalysis, setAiAnalysis] = useState<AITrendResult | null>({
    primaryPatterns: [
      "The student's anxiety spikes every Tuesday at 10:00 AM. This correlates directly with Gym class reverberation and whistle noise levels.",
      "Sleep duration under 7.0 hours increases sensory sensitivity during afternoon Math/STEM by 85%.",
      "Unannounced substitute teacher changes trigger a 15-minute elevation in sensory overload symptoms."
    ],
    sleepCorrelation: "High Correlation: Days following < 7 hrs sleep show 3x higher frequency of noise sensitivity and ear-covering requests in classroom settings.",
    sensoryTriggers: [
      "Gymnasium acoustic echo during basketball drills",
      "Fluorescent bulb micro-flicker in Cafeteria line",
      "Sudden transition bell without 5-minute visual timer warning"
    ],
    recommendedAccommodations: [
      "Provide noise-reducing earmuffs 5 minutes BEFORE Gym class transition.",
      "Offer 10-minute quiet decompression tent session in Sensory Corner following loud assemblies.",
      "Implement 2-minute visual timer countdown prior to classroom transitions."
    ],
    summaryNote: "Leo responds exceptionally well to proactive sensory adjustments. When noise-canceling headphones are used prior to gym, anxiety scores drop by 70%."
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Chat Q&A state
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: `Hello! I am EquiLink's AI Autism Specialist. How can I help support ${student.name} today? Ask me about sensory strategies, IEP accommodations, or transition ideas.`
    }
  ]);
  const [isAsking, setIsAsking] = useState(false);

  const handleRunAnalysis = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/ai/analyze-trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: student.name,
          logs,
          schedule,
          sleepLogs,
        }),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setAiAnalysis(data.analysis);
      } else {
        setErrorMessage(data.error || 'Failed to analyze trend data');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error communicating with AI server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userQ = question;
    setQuestion('');
    setChatHistory((prev) => [...prev, { sender: 'user', text: userQ }]);
    setIsAsking(true);

    try {
      const res = await fetch('/api/ai/ask-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userQ,
          studentContext: student,
          role,
        }),
      });

      const data = await res.json();
      if (data.success && data.answer) {
        setChatHistory((prev) => [...prev, { sender: 'ai', text: data.answer }]);
      } else {
        setChatHistory((prev) => [
          ...prev,
          { sender: 'ai', text: 'Sorry, I ran into an issue generating advice. Please check API key settings.' }
        ]);
      }
    } catch (err: any) {
      setChatHistory((prev) => [
        ...prev,
        { sender: 'ai', text: 'Network connection issue. Please try again.' }
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-[#3F5A73] rounded-2xl p-6 text-white shadow-xl border border-[#5B7A96]/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#8FA894]" />
            <h2 className="text-xl font-bold">AI Behavioral & Sensory Trend Analysis</h2>
          </div>
          <p className="text-xs text-slate-200 mt-1 max-w-2xl">
            Gemini pattern recognition analyzes real-time status logs, home sleep metrics, and visual schedule shifts to discover hidden triggers and recommend IEP accommodations.
          </p>
        </div>

        <button
          onClick={handleRunAnalysis}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5B7A96] hover:bg-[#7C97AE] text-white font-bold text-xs sm:text-sm shadow-lg active:scale-95 transition-all self-start md:self-auto shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Analyzing Data...' : 'Re-Run AI Analysis'}</span>
        </button>
      </div>

      {errorMessage && (
        <div className="bg-[#D9A15F]/15 border border-[#D9A15F]/30 text-slate-900 p-4 rounded-xl text-xs font-semibold">
          {errorMessage}
        </div>
      )}

      {/* Main Analysis Display Cards */}
      {aiAnalysis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Primary Patterns Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <BrainCircuit className="w-5 h-5 text-[#5B7A96]" />
              <h3 className="text-base font-bold text-slate-900">Primary Hidden Patterns Discovered</h3>
            </div>

            <ul className="space-y-3">
              {aiAnalysis.primaryPatterns.map((pattern, idx) => (
                <li key={idx} className="p-3.5 rounded-xl bg-[#5B7A96]/10 border border-[#5B7A96]/20 text-xs sm:text-sm text-[#2C3238] font-medium flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#5B7A96] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{pattern}</span>
                </li>
              ))}
            </ul>

            {/* Sleep Correlation Insight */}
            <div className="p-4 rounded-xl bg-[#D9A15F]/15 border border-[#D9A15F]/30 space-y-1">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                <Moon className="w-4 h-4 text-[#D9A15F]" />
                <span>Sleep vs. Classroom Sensory Threshold Correlation</span>
              </div>
              <p className="text-xs text-slate-800 font-medium leading-relaxed">
                {aiAnalysis.sleepCorrelation}
              </p>
            </div>
          </div>

          {/* Recommended Accommodations Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Lightbulb className="w-5 h-5 text-[#8FA894]" />
              <h3 className="text-base font-bold text-slate-900">Recommended IEP Accommodations</h3>
            </div>

            <ul className="space-y-2.5">
              {aiAnalysis.recommendedAccommodations.map((acc, idx) => (
                <li key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#8FA894] shrink-0 mt-0.5" />
                  <span>{acc}</span>
                </li>
              ))}
            </ul>

            {/* Identified Triggers */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-[#D9A15F]" />
                <span>Identified Environmental Triggers</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {aiAnalysis.sensoryTriggers.map((trig, idx) => (
                  <span key={idx} className="text-xs font-semibold px-3 py-1 rounded-full bg-[#D9A15F]/15 text-slate-900 border border-[#D9A15F]/30">
                    ⚠️ {trig}
                  </span>
                ))}
              </div>
            </div>

            {/* Summary Note */}
            <div className="p-3.5 bg-[#2C3238] text-slate-200 rounded-xl text-xs leading-relaxed border border-slate-800">
              <span className="font-bold text-[#8FA894] block mb-0.5">Specialist Summary:</span>
              "{aiAnalysis.summaryNote}"
            </div>
          </div>

        </div>
      )}

      {/* INTERACTIVE AI SPECIALIST Q&A CHAT */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#5B7A96]" />
            <h3 className="text-base font-bold text-slate-900">Ask EquiLink AI Autism Specialist</h3>
          </div>
          <span className="text-xs font-medium text-slate-500">
            Role: <span className="font-bold text-slate-800 capitalize">{role}</span>
          </span>
        </div>

        {/* Chat History Box */}
        <div className="space-y-3 max-h-80 overflow-y-auto p-4 bg-slate-50 rounded-xl border border-slate-200">
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xl p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#5B7A96] text-white font-medium rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-bl-none whitespace-pre-wrap'
                }`}
              >
                {msg.sender === 'ai' && (
                  <span className="font-bold text-[#5B7A96] text-[11px] block mb-1">
                    EquiLink AI Specialist
                  </span>
                )}
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Question Input */}
        <form onSubmit={handleAskQuestion} className="flex gap-2">
          <input
            type="text"
            placeholder="Ask a question (e.g. 'How can we help Leo transition from recess to math smoothly?')..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#5B7A96] text-slate-900"
          />
          <button
            type="submit"
            disabled={isAsking}
            className="px-4 py-2.5 bg-[#5B7A96] hover:bg-[#7C97AE] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-1.5 shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>{isAsking ? 'Thinking...' : 'Ask'}</span>
          </button>
        </form>
      </div>

    </div>
  );
};
