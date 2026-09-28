import React, { useState } from 'react';
import { UserRole, StudentProfile, UserSession } from '../types';
import { 
  Globe, 
  ChevronDown, 
  School, 
  Home, 
  Smile, 
  Bell, 
  PlusCircle, 
  Sparkles,
  BarChart2,
  Calendar,
  Activity,
  Moon,
  Sun,
  Sliders,
  ShieldAlert,
  SlidersHorizontal,
  LogOut,
  UserCheck,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  LayoutDashboard
} from 'lucide-react';

interface HeaderProps {
  activeView: 'app' | 'how_it_works' | 'for_schools' | 'for_parents' | 'pricing' | 'contact';
  setActiveView: (view: 'app' | 'how_it_works' | 'for_schools' | 'for_parents' | 'pricing' | 'contact') => void;
  activeUser: UserSession | null;
  role: UserRole;
  setRole: (role: UserRole) => void;
  student: StudentProfile;
  activeTab: 'dashboard' | 'feed' | 'schedule' | 'ai_trends' | 'analytics' | 'student_mode';
  setActiveTab: (tab: 'dashboard' | 'feed' | 'schedule' | 'ai_trends' | 'analytics' | 'student_mode') => void;
  unacknowledgedIncidentsCount: number;
  isDuskMode: boolean;
  setIsDuskMode: (dusk: boolean) => void;
  saturationLevel: number;
  setSaturationLevel: (sat: number) => void;
  onOpenQuickLog: () => void;
  onOpenIncidentsModal: () => void;
  onOpenAuthModal: (mode: 'login' | 'signup' | 'trial', defaultRole?: UserRole) => void;
  onOpenContactModal: () => void;
  onLogout: () => void;
  onOpenHipaaSecurity: () => void;
  isPhiMasked: boolean;
  onTogglePhiMask: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  activeUser,
  role,
  setRole,
  student,
  activeTab,
  setActiveTab,
  unacknowledgedIncidentsCount,
  isDuskMode,
  setIsDuskMode,
  saturationLevel,
  setSaturationLevel,
  onOpenQuickLog,
  onOpenIncidentsModal,
  onOpenAuthModal,
  onOpenContactModal,
  onLogout,
  onOpenHipaaSecurity,
  isPhiMasked,
  onTogglePhiMask,
}) => {
  const [language, setLanguage] = useState<'EN' | 'ES' | 'FR'>('EN');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showSensoryControl, setShowSensoryControl] = useState(false);

  return (
    <header className={`${isDuskMode ? 'bg-[#24282F] text-[#D8D5CE] border-[#404652]' : 'bg-[#F4F1EC] text-[#2C3238] border-[#DCD8D0]'} border-b sticky top-0 z-40 transition-colors duration-300`}>
      
      {/* Sensory & Low-Stimulation Top Control Bar */}
      <div className={`${isDuskMode ? 'bg-[#1E2228] border-[#343941] text-[#9BA1AC]' : 'bg-[#E8E4DD] border-[#DCD8D0] text-[#5C6570]'} px-4 sm:px-8 py-1.5 border-b text-[11px] font-medium flex items-center justify-between gap-3`}>
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#5B7A96] text-white">
            Sensory-Safe Certified
          </span>
        </div>

        <div className="flex items-center gap-3">
          
          {/* Saturation Control Popover Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowSensoryControl(!showSensoryControl)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold transition-all ${
                saturationLevel < 100
                  ? 'bg-[#5B7A96] text-white'
                  : isDuskMode ? 'hover:bg-[#343941] text-[#D8D5CE]' : 'hover:bg-[#DCD8D0] text-[#2C3238]'
              }`}
              title="Adjust visual saturation for sensitive days"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Saturation: {saturationLevel}%</span>
            </button>

            {showSensoryControl && (
              <div className={`absolute right-0 mt-2 p-3.5 rounded-2xl border shadow-xl w-64 z-50 ${
                isDuskMode ? 'bg-[#24282F] border-[#404652] text-[#D8D5CE]' : 'bg-white border-[#DCD8D0] text-[#2C3238]'
              }`}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>Palette Saturation</span>
                    <span className="text-[#5B7A96] font-extrabold">{saturationLevel}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    step="10"
                    value={saturationLevel}
                    onChange={(e) => setSaturationLevel(Number(e.target.value))}
                    className="w-full accent-[#5B7A96] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#5C6570] font-semibold">
                    <span>20% (Ultra Low)</span>
                    <span>60% (Calm)</span>
                    <span>100% (Standard)</span>
                  </div>
                  <p className="text-[10px] text-[#5C6570] pt-1 leading-tight">
                    Desaturates colors across the entire workspace for extra sensory relief.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Dusk Mode (Low-Stimulation Dark Mode) Toggle */}
          <button
            onClick={() => setIsDuskMode(!isDuskMode)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
              isDuskMode 
                ? 'bg-[#5B7A96] text-white' 
                : 'bg-[#DCD8D0] text-[#2C3238] hover:bg-[#B8AFA0]'
            }`}
          >
            {isDuskMode ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span>Dusk Mode (Active)</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[#5B7A96]" />
                <span>Dusk Mode</span>
              </>
            )}
          </button>

        </div>
      </div>

      {/* Primary Top Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo */}
        <div 
          onClick={() => setActiveView('for_schools')}
          className="flex items-center space-x-2.5 cursor-pointer shrink-0"
        >
          <div className="w-9 h-9 rounded-2xl bg-[#5B7A96] flex items-center justify-center text-white shadow-sm">
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8FA894]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#D9A15F]" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className={`text-xl font-black tracking-tight leading-none ${isDuskMode ? 'text-[#D8D5CE]' : 'text-[#2C3238]'}`}>
              EquiLink
            </span>
            <span className="text-[9px] font-black tracking-widest text-[#5B7A96] uppercase leading-none mt-0.5">
              SENSORY LEARNING
            </span>
          </div>
        </div>

        {/* Center: Main Navigation Links (Centered) */}
        <nav className="hidden lg:flex items-center justify-center space-x-6 sm:space-x-8 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveView('how_it_works')}
            className={`transition-colors hover:text-[#5B7A96] ${
              activeView === 'how_it_works' ? 'text-[#5B7A96] font-bold border-b-2 border-[#5B7A96] pb-1' : ''
            }`}
          >
            How it works
          </button>

          <button
            onClick={() => setActiveView('for_parents')}
            className={`transition-colors hover:text-[#5B7A96] ${
              activeView === 'for_parents' ? 'text-[#5B7A96] font-bold border-b-2 border-[#5B7A96] pb-1' : ''
            }`}
          >
            For Parents
          </button>

          <button
            onClick={() => setActiveView('for_schools')}
            className={`transition-colors hover:text-[#5B7A96] ${
              activeView === 'for_schools' ? 'text-[#5B7A96] font-bold border-b-2 border-[#5B7A96] pb-1' : ''
            }`}
          >
            For Schools
          </button>

          <button
            onClick={onOpenContactModal}
            className="transition-colors hover:text-[#5B7A96]"
          >
            Contact
          </button>
        </nav>

        {/* Right Side Action Buttons */}
        <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">
          
          {/* Language Selector Dropdown */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className={`flex items-center gap-1 text-xs font-bold px-2 py-1.5 rounded-lg transition-all ${
                isDuskMode ? 'hover:bg-[#343941] text-[#D8D5CE]' : 'hover:bg-[#E8E4DD] text-[#2C3238]'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-[#5B7A96]" />
              <span>{language}</span>
              <ChevronDown className="w-3 h-3 text-[#5C6570]" />
            </button>

            {showLangMenu && (
              <div className={`absolute right-0 mt-1 border rounded-xl shadow-lg p-1.5 w-24 text-xs font-bold space-y-0.5 z-50 ${
                isDuskMode ? 'bg-[#24282F] border-[#404652] text-[#D8D5CE]' : 'bg-white border-[#DCD8D0] text-[#2C3238]'
              }`}>
                <button
                  onClick={() => { setLanguage('EN'); setShowLangMenu(false); }}
                  className="w-full text-left px-2 py-1 rounded-lg hover:bg-[#5B7A96]/10 hover:text-[#5B7A96]"
                >
                  🌐 English
                </button>
                <button
                  onClick={() => { setLanguage('ES'); setShowLangMenu(false); }}
                  className="w-full text-left px-2 py-1 rounded-lg hover:bg-[#5B7A96]/10 hover:text-[#5B7A96]"
                >
                  🌐 Español
                </button>
                <button
                  onClick={() => { setLanguage('FR'); setShowLangMenu(false); }}
                  className="w-full text-left px-2 py-1 rounded-lg hover:bg-[#5B7A96]/10 hover:text-[#5B7A96]"
                >
                  🌐 Français
                </button>
              </div>
            )}
          </div>

          {/* Right Top Auth Actions: Dynamic based on whether a role is activated */}
          {!activeUser ? (
            <>
              {/* Log in Button */}
              <button
                onClick={() => onOpenAuthModal('login')}
                className="text-xs sm:text-sm font-bold hover:text-[#5B7A96] px-2 py-1.5 transition-colors"
              >
                Log in
              </button>

              {/* Sign Up Button */}
              <button
                onClick={() => onOpenAuthModal('signup')}
                className="hidden md:inline-block text-xs sm:text-sm font-bold hover:text-[#5B7A96] px-2 py-1.5 transition-colors"
              >
                Sign Up
              </button>

              {/* Start Free Trial Button (Muted Slate Blue Pill) */}
              <button
                onClick={() => onOpenAuthModal('trial')}
                className="bg-[#5B7A96] hover:bg-[#7C97AE] text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-sm active:scale-98 transition-all"
              >
                Start Free Trial
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2.5">
              {/* PHI Mask Quick Toggle */}
              <button
                onClick={onTogglePhiMask}
                className={`p-1.5 rounded-xl border transition-all ${
                  isPhiMasked
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                    : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-200/50'
                }`}
                title={isPhiMasked ? 'PHI Masking Active (Student name & health identifiers masked)' : 'Mask PHI to comply with Minimum Necessary Rule'}
              >
                {isPhiMasked ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>

              {/* Active User Badge (Session strictly bound to role) */}
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[#5B7A96]/10 border border-[#5B7A96]/20">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shadow-xs ${
                  activeUser.role === 'student' ? 'bg-[#D9A15F] text-[#1E2328]' :
                  activeUser.role === 'parent' ? 'bg-[#8FA894] text-[#1E2328]' :
                  'bg-[#5B7A96] text-white'
                }`}>
                  {activeUser.role === 'student' ? '🎒' : activeUser.role === 'educator' ? '🏫' : '🏡'}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className={`text-xs font-extrabold leading-tight ${isDuskMode ? 'text-[#D8D5CE]' : 'text-[#2C3238]'}`}>
                    {activeUser.name}
                  </span>
                  <span className="text-[10px] font-bold uppercase text-[#5B7A96] leading-none mt-0.5 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    <span>{activeUser.role} Session</span>
                  </span>
                </div>
              </div>

              {/* Log Out Button (The only valid way to terminate access) */}
              <button
                onClick={onLogout}
                className="flex items-center gap-1 text-xs font-bold text-[#5C6570] hover:text-[#2C3238] dark:hover:text-white px-2.5 py-1.5 rounded-full border border-[#DCD8D0] dark:border-[#404652] transition-colors"
                title="End session and log out"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Sub-Header: Interactive Workspace Role Controls - ONLY VISIBLE WHEN A ROLE IS ACTIVATED */}
      {activeUser && (
        <div className={`${isDuskMode ? 'bg-[#1E2228] border-[#343941] text-[#D8D5CE]' : 'bg-[#3F5A73] text-white border-[#3F5A73]'} px-4 sm:px-8 py-2 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs border-t transition-all animate-in fade-in`}>
          
          {/* Left: Role Context & Student Info with HIPAA PHI masking support */}
          <div className="flex items-center space-x-3 flex-wrap gap-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-[#5B7A96] text-white px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#8FA894] animate-pulse" />
              {activeUser.role === 'student' && 'Student Workspace'}
              {activeUser.role === 'educator' && 'Educator IEP Workspace'}
              {activeUser.role === 'parent' && 'Parent Family Portal'}
            </span>
            <span className="font-medium hidden sm:inline">
              {activeUser.role === 'student' && (
                <>Welcome back, <strong>{activeUser.name}</strong> • Grade 3 ({student.school})</>
              )}
              {activeUser.role === 'educator' && (
                <>Active Student: <strong>{isPhiMasked ? 'L. D. (#IEP-8842)' : student.name}</strong> ({student.grade})</>
              )}
              {activeUser.role === 'parent' && (
                <>Student: <strong>{isPhiMasked ? 'L. D. (#IEP-8842)' : student.name}</strong> • Connected with {student.primaryTeacher}</>
              )}
            </span>
            {activeView !== 'app' && (
              <button
                onClick={() => setActiveView('app')}
                className="text-[#D9A15F] font-extrabold underline hover:text-white ml-2"
              >
                Open Interactive Hub →
              </button>
            )}
          </div>

          {/* Center: THE ACTIVATED ROLE SECTION - STRICT HIPAA ROLE-BOUND BADGE (NO SWITCHING OPTION) */}
          <div className={`flex items-center gap-2 p-1 px-2.5 rounded-xl border ${isDuskMode ? 'bg-[#2A2E35] border-[#404652]' : 'bg-[#354A5E] border-[#5B7A96]'}`}>
            <span className="text-[10px] font-bold text-[#B8AFA0] px-1 uppercase tracking-wider">
              Active Role:
            </span>

            {/* ONLY EDUCATOR ROLE VISIBLE WHEN LOGGED IN AS EDUCATOR */}
            {activeUser.role === 'educator' && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold bg-[#5B7A96] text-white shadow-xs">
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Educator Dashboard</span>
                <span className="ml-1 text-[9px] bg-white/20 px-1.5 py-0.2 rounded-full uppercase tracking-wider font-extrabold">Active</span>
              </div>
            )}

            {/* ONLY PARENT ROLE VISIBLE WHEN LOGGED IN AS PARENT */}
            {activeUser.role === 'parent' && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold bg-[#8FA894] text-[#1E2328] shadow-xs">
                <Home className="w-3.5 h-3.5" />
                <span>Parent</span>
                <span className="ml-1 text-[9px] bg-black/20 px-1.5 py-0.2 rounded-full uppercase tracking-wider font-extrabold">Active</span>
              </div>
            )}

            {/* ONLY STUDENT ROLE VISIBLE WHEN LOGGED IN AS STUDENT */}
            {activeUser.role === 'student' && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold bg-[#D9A15F] text-[#1E2328] shadow-xs">
                <Smile className="w-3.5 h-3.5" />
                <span>Student View</span>
                <span className="ml-1 text-[9px] bg-black/20 px-1.5 py-0.2 rounded-full uppercase tracking-wider font-extrabold">Active</span>
              </div>
            )}

            {/* Security Lock Badge - No Switching Permitted */}
            <div
              className="flex items-center gap-1 text-[10px] text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-md font-mono"
              title="Access Control: Session is cryptographically bound to this role. Switching roles is strictly prohibited."
            >
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>RBAC Bound</span>
            </div>
          </div>

          {/* Right: Quick Action Modals Trigger (Role-Tailored) */}
          <div className="flex items-center gap-2">
            {activeUser.role === 'educator' && (
              <>
                <button
                  onClick={onOpenIncidentsModal}
                  className={`relative p-1.5 rounded-lg border flex items-center gap-1 px-2.5 font-bold ${
                    isDuskMode ? 'bg-[#2A2E35] border-[#404652] text-[#D8D5CE]' : 'bg-[#354A5E] border-[#5B7A96] text-white'
                  }`}
                  title="Continuity Alerts"
                >
                  <ShieldAlert className="w-4 h-4 text-[#C08B7A]" />
                  <span>Alerts</span>
                  {unacknowledgedIncidentsCount > 0 && (
                    <span className="bg-[#C08B7A] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                      {unacknowledgedIncidentsCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={onOpenQuickLog}
                  className="flex items-center gap-1.5 bg-[#8FA894] hover:bg-[#7A9680] text-[#1E2328] font-black text-[11px] px-3 py-1.5 rounded-lg shadow-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Quick-Tap Log</span>
                </button>
              </>
            )}

            {activeUser.role === 'parent' && (
              <>
                <button
                  onClick={onOpenIncidentsModal}
                  className={`relative p-1.5 rounded-lg border flex items-center gap-1 px-2.5 font-bold ${
                    isDuskMode ? 'bg-[#2A2E35] border-[#404652] text-[#D8D5CE]' : 'bg-[#354A5E] border-[#5B7A96] text-white'
                  }`}
                  title="Decompression & Sensory Alerts"
                >
                  <ShieldAlert className="w-4 h-4 text-[#C08B7A]" />
                  <span>Alerts</span>
                  {unacknowledgedIncidentsCount > 0 && (
                    <span className="bg-[#C08B7A] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                      {unacknowledgedIncidentsCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={onOpenQuickLog}
                  className="flex items-center gap-1.5 bg-[#8FA894] hover:bg-[#7A9680] text-[#1E2328] font-black text-[11px] px-3 py-1.5 rounded-lg shadow-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Log Sleep / Morning Check</span>
                </button>
              </>
            )}

            {activeUser.role === 'student' && (
              <span className="text-[11px] font-bold text-[#D9A15F] bg-[#D9A15F]/15 px-2.5 py-1 rounded-lg border border-[#D9A15F]/30 flex items-center gap-1">
                <span>🌱 Sensory-Calm Mode</span>
              </span>
            )}

            <button
              onClick={onLogout}
              className="text-[11px] font-bold text-[#D8D5CE] hover:text-white px-2 py-1 rounded-lg border border-white/20 hover:bg-white/10 transition-all ml-1"
              title="Log out"
            >
              Log Out
            </button>
          </div>

        </div>
      )}

      {/* Tertiary Nav Tabs (Shown inside app view only for non-students when a role is activated) */}
      {activeView === 'app' && activeUser && activeUser.role !== 'student' && (
        <div className={`${isDuskMode ? 'bg-[#2A2E35] border-[#404652]' : 'bg-[#E8E4DD] border-[#DCD8D0]'} border-b px-4 sm:px-8 py-1.5 overflow-x-auto flex items-center space-x-1`}>
          {activeUser.role === 'educator' && (
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-[#5B7A96] text-white shadow-xs'
                  : 'text-[#5C6570] hover:text-[#2C3238] dark:text-[#9BA1AC] dark:hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Educator Dashboard</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('feed')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'feed'
                ? 'bg-[#5B7A96] text-white shadow-xs'
                : 'text-[#5C6570] hover:text-[#2C3238] dark:text-[#9BA1AC] dark:hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Continuity Sync Feed</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'schedule'
                ? 'bg-[#5B7A96] text-white shadow-xs'
                : 'text-[#5C6570] hover:text-[#2C3238] dark:text-[#9BA1AC] dark:hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Visual Schedule Mirror</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_trends')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'ai_trends'
                ? 'bg-[#5B7A96] text-white shadow-xs'
                : 'text-[#5C6570] hover:text-[#2C3238] dark:text-[#9BA1AC] dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Trend Analysis</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'analytics'
                ? 'bg-[#5B7A96] text-white shadow-xs'
                : 'text-[#5C6570] hover:text-[#2C3238] dark:text-[#9BA1AC] dark:hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Behavioral Analytics</span>
          </button>
        </div>
      )}

    </header>
  );
};
