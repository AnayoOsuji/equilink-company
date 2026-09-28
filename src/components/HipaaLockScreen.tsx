import React, { useState } from 'react';
import { Lock, ShieldCheck, ArrowRight, LogOut, KeyRound, AlertCircle } from 'lucide-react';
import { UserSession } from '../types';

interface HipaaLockScreenProps {
  isLocked: boolean;
  activeUser: UserSession | null;
  onUnlock: () => void;
  onLogout: () => void;
}

export const HipaaLockScreen: React.FC<HipaaLockScreenProps> = ({
  isLocked,
  activeUser,
  onUnlock,
  onLogout,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isLocked || !activeUser) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter your password or PIN to unlock your HIPAA session.');
      return;
    }
    setError('');
    setPassword('');
    onUnlock();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E2328]/95 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-[#2C3238] border border-[#3F5A73] rounded-3xl p-8 text-center text-white shadow-2xl relative overflow-hidden">
        {/* Subtle Top Indicator */}
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 rounded-full py-1 px-3 w-max mx-auto mb-6">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>HIPAA § 164.312 Auto-Logoff Protection</span>
        </div>

        {/* Lock Graphic */}
        <div className="w-16 h-16 rounded-2xl bg-[#5B7A96]/20 border border-[#5B7A96]/40 flex items-center justify-center mx-auto mb-4 text-[#8FA894]">
          <Lock className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-black mb-1 tracking-tight">Session Protected</h2>
        <p className="text-xs text-slate-300 mb-6 leading-relaxed">
          Screen locked to safeguard Protected Health Information (PHI). Enter your password or PIN to resume this authenticated session.
        </p>

        {/* Locked User Info (No role switching permitted) */}
        <div className="p-3 rounded-2xl bg-[#1E2328] border border-slate-700 mb-6 flex items-center justify-between text-left">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
              activeUser.role === 'student' ? 'bg-[#D9A15F] text-[#1E2328]' :
              activeUser.role === 'parent' ? 'bg-[#8FA894] text-[#1E2328]' :
              'bg-[#5B7A96] text-white'
            }`}>
              {activeUser.role === 'student' ? '🎒' : activeUser.role === 'educator' ? '🏫' : '🏡'}
            </div>
            <div>
              <div className="text-xs font-bold text-white">{activeUser.name}</div>
              <div className="text-[11px] text-[#8FA894] font-semibold capitalize">
                {activeUser.role} Session • Locked
              </div>
            </div>
          </div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 bg-slate-800 px-2 py-1 rounded">
            RBAC Locked
          </span>
        </div>

        {/* Unlock Form */}
        <form onSubmit={handleUnlock} className="space-y-4">
          <div className="text-left">
            <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-[#5B7A96]" />
              <span>Password or Security PIN</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password..."
              autoFocus
              className="w-full px-4 py-2.5 rounded-xl bg-[#1E2328] border border-slate-600 focus:border-[#5B7A96] text-white text-xs outline-none focus:ring-2 focus:ring-[#5B7A96]/30 transition-all"
            />
            {error && (
              <div className="flex items-center gap-1 text-[11px] text-rose-400 mt-1.5 font-medium">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-[#5B7A96] hover:bg-[#7C97AE] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Unlock Session</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Bottom Termination Link */}
        <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
          <span className="text-[11px]">Need to change accounts?</span>
          <button
            onClick={onLogout}
            className="flex items-center gap-1 text-[#C08B7A] hover:text-[#D9A15F] font-bold text-xs transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Terminate & Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
