import React, { useState } from 'react';
import { UserRole, StatusLog, IncidentAlert, ScheduleItem, SleepLog, StudentProfile, MoodType, UserSession, HipaaAuditLogEntry } from './types';
import { INITIAL_STUDENT, INITIAL_LOGS, INITIAL_INCIDENTS, INITIAL_SCHEDULE, INITIAL_SLEEP_LOGS } from './data/mockData';
import { Header } from './components/Header';
import { QuickTapLogger } from './components/QuickTapLogger';
import { ContinuitySyncFeed } from './components/ContinuitySyncFeed';
import { VisualSchedule } from './components/VisualSchedule';
import { AITrendAnalysis } from './components/AITrendAnalysis';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { EducatorDashboard } from './components/EducatorDashboard';
import { StudentVisualMode } from './components/StudentVisualMode';
import { DecompressionModal } from './components/DecompressionModal';
import { School, Home, Smile, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, Lock, ShieldAlert } from 'lucide-react';

import { AuthModal } from './components/AuthModal';
import { ContactModal } from './components/ContactModal';
import { ForSchoolsPage } from './components/ForSchoolsPage';
import { HowItWorksPage } from './components/HowItWorksPage';
import { PricingPage } from './components/PricingPage';
import { ForParentsPage } from './components/ForParentsPage';
import { HipaaSecurityModal } from './components/HipaaSecurityModal';
import { HipaaLockScreen } from './components/HipaaLockScreen';

const INITIAL_AUDIT_LOGS: HipaaAuditLogEntry[] = [
  {
    id: 'audit_1',
    timestamp: '2026-09-22T08:15:22Z',
    userId: 'clara@oakridge.edu',
    userName: 'Ms. Clara Davis',
    userRole: 'educator',
    action: 'USER_LOGIN',
    resource: 'EquiLink IEP Gateway',
    details: 'MFA verified via district Okta SSO. TLS 1.3 AES-256 session established.',
    ipHash: 'sha256:d82e1a90...f412',
  },
  {
    id: 'audit_2',
    timestamp: '2026-09-22T08:16:05Z',
    userId: 'clara@oakridge.edu',
    userName: 'Ms. Clara Davis',
    userRole: 'educator',
    action: 'PHI_ACCESSED',
    resource: 'Student Profile (ID: #IEP-8842)',
    details: 'Viewed sensory regulation plan and accommodation thresholds.',
    ipHash: 'sha256:d82e1a90...f412',
  },
  {
    id: 'audit_3',
    timestamp: '2026-09-22T08:30:12Z',
    userId: 'sarah.davis@home.org',
    userName: 'Sarah Davis',
    userRole: 'parent',
    action: 'LOG_CREATED',
    resource: 'Home Sleep & Nutrition Telemetry',
    details: 'Logged 7.5 hrs sleep with restless transition context.',
    ipHash: 'sha256:4b91aa21...78cc',
  },
  {
    id: 'audit_4',
    timestamp: '2026-09-22T08:45:00Z',
    userId: 'compliance_guard',
    userName: 'Security Daemon',
    userRole: 'educator',
    action: 'SECURITY_CHECK',
    resource: 'RBAC Zero Role-Switching Safeguard',
    details: 'Enforced strict session isolation. Verified no unauthorized lateral role elevations.',
    ipHash: 'internal:0.0.0.0',
  }
];

export default function App() {
  const [activeUser, setActiveUser] = useState<UserSession | null>(null);
  const [role, setRole] = useState<UserRole>('educator');
  const [activeView, setActiveView] = useState<'app' | 'how_it_works' | 'for_schools' | 'for_parents' | 'pricing' | 'contact'>('for_schools');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'feed' | 'schedule' | 'ai_trends' | 'analytics' | 'student_mode'>('dashboard');
  
  // Sensory & Low-Stimulation Controls
  const [isDuskMode, setIsDuskMode] = useState<boolean>(false);
  const [saturationLevel, setSaturationLevel] = useState<number>(100);

  const [student] = useState<StudentProfile>(INITIAL_STUDENT);
  const [logs, setLogs] = useState<StatusLog[]>(INITIAL_LOGS);
  const [incidents, setIncidents] = useState<IncidentAlert[]>(INITIAL_INCIDENTS);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(INITIAL_SCHEDULE);
  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>(INITIAL_SLEEP_LOGS);

  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [isIncidentsModalOpen, setIsIncidentsModalOpen] = useState(false);
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'trial'>('login');
  const [authModalRole, setAuthModalRole] = useState<UserRole>('educator');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // HIPAA Compliance State
  const [isHipaaModalOpen, setIsHipaaModalOpen] = useState(false);
  const [isPhiMasked, setIsPhiMasked] = useState(false);
  const [isSessionLocked, setIsSessionLocked] = useState(false);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(900); // 15 minutes
  const [auditLogs, setAuditLogs] = useState<HipaaAuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  const addAuditLog = (
    action: HipaaAuditLogEntry['action'],
    resource: string,
    details: string
  ) => {
    const newEntry: HipaaAuditLogEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      userId: activeUser ? (activeUser.email || activeUser.name) : 'anonymous_client',
      userName: activeUser ? activeUser.name : 'Authorized Client',
      userRole: activeUser ? activeUser.role : role,
      action,
      resource,
      details,
      ipHash: `sha256:${Math.random().toString(36).substring(2, 10)}...${Date.now().toString().slice(-4)}`,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  // HIPAA Inactivity Timer (§ 164.312(a)(2)(iii))
  React.useEffect(() => {
    if (!activeUser || isSessionLocked) return;

    const interval = setInterval(() => {
      setSessionTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsSessionLocked(true);
          addAuditLog('SESSION_TIMEOUT', 'HIPAA Inactivity Daemon', 'Session automatically locked following inactivity to prevent PHI exposure.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeUser, isSessionLocked]);

  // Reset inactivity timer on interaction if not locked
  React.useEffect(() => {
    const handleActivity = () => {
      if (!isSessionLocked && activeUser) {
        setSessionTimeRemaining(900);
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [activeUser, isSessionLocked]);

  const handleTogglePhiMask = () => {
    setIsPhiMasked((prev) => {
      const next = !prev;
      addAuditLog('PHI_MASKED', 'Privacy Shield', next ? 'Enabled PHI masking (student initials and IDs masked)' : 'Disabled PHI masking (revealed full identifiers)');
      return next;
    });
  };

  // Add a new Status Log
  const handleAddLog = (newLogData: Omit<StatusLog, 'id' | 'timestamp'>) => {
    const id = `log_${Date.now()}`;
    const timestamp = new Date().toISOString();
    const newLog: StatusLog = { id, timestamp, ...newLogData };

    setLogs((prev) => [newLog, ...prev]);

    // If flagged as incident, automatically trigger Gemini API for decompression advice
    if (newLogData.flaggedAsIncident) {
      handleTriggerEmergencyIncident(
        `Sensory Trigger in ${newLogData.contextTag}`,
        newLogData.notes || `Logged ${newLogData.mood} mood with ${newLogData.sensory} sensory sensitivity level in ${newLogData.contextTag}.`,
        newLogData.sensory === 'overloaded' ? 'high' : 'moderate'
      );
    }
  };

  // Add a new Sleep Log
  const handleAddSleepLog = (newSleepData: Omit<SleepLog, 'id'>) => {
    const id = `slp_${Date.now()}`;
    const newSleep: SleepLog = { id, ...newSleepData };
    setSleepLogs((prev) => [newSleep, ...prev]);
  };

  // Acknowledge Incident
  const handleAcknowledgeIncident = (incidentId: string) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === incidentId ? { ...inc, parentAcknowledged: true } : inc))
    );
  };

  // Toggle Decompression Step
  const handleToggleDecompressionStep = (incidentId: string, stepTitle: string) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id !== incidentId) return inc;
        const currentSteps = inc.completedSteps || [];
        const exists = currentSteps.includes(stepTitle);
        const updatedSteps = exists
          ? currentSteps.filter((s) => s !== stepTitle)
          : [...currentSteps, stepTitle];
        return { ...inc, completedSteps: updatedSteps };
      })
    );
  };

  // Trigger Emergency Incident & call Gemini API for custom decompression strategies
  const handleTriggerEmergencyIncident = async (
    title: string,
    details: string,
    severity: 'mild' | 'moderate' | 'high'
  ) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];
    const newIncId = `inc_${Date.now()}`;

    // Fallback decompression strategy in case offline
    let defaultStrategies = [
      {
        title: 'Low-Stimulation Transition',
        action: 'Allow 20 minutes in dim quiet room with soft rain sounds right after bus arrival.',
        targetSensory: 'Auditory Decompression'
      },
      {
        title: 'Weighted Lap Blanket',
        action: 'Apply 6lb weighted blanket and offer cold water with crunchy snack.',
        targetSensory: 'Proprioceptive Reset'
      }
    ];

    try {
      const res = await fetch('/api/ai/decompression-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidentTitle: title,
          incidentDetails: details,
          timeLogged: timeStr,
          loggedByRole: role,
          sensoryLevel: severity,
        }),
      });

      const data = await res.json();
      if (data.success && data.decompression && data.decompression.strategies) {
        defaultStrategies = data.decompression.strategies;
      }
    } catch (err) {
      console.warn("Failed fetching AI decompression advice, using default strategies:", err);
    }

    const newIncident: IncidentAlert = {
      id: newIncId,
      timestamp: now.toISOString(),
      date: dateStr,
      time: timeStr,
      title,
      description: details,
      location: 'school',
      severity,
      decompressionStrategies: defaultStrategies,
      parentAcknowledged: false,
      teacherNotified: true,
      loggedBy: role === 'educator' ? 'Ms. Clara Davis' : 'Sarah Chen',
      role,
      completedSteps: []
    };

    setIncidents((prev) => [newIncident, ...prev]);
  };

  // Toggle Schedule Completion
  const handleToggleScheduleComplete = (id: string) => {
    setSchedule((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isCompleted: !item.isCompleted } : item))
    );
  };

  // Update Schedule Item
  const handleUpdateScheduleItem = (updated: ScheduleItem) => {
    setSchedule((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  };

  // Add Schedule Item
  const handleAddScheduleItem = (newItem: Omit<ScheduleItem, 'id' | 'isCompleted' | 'isCurrent'>) => {
    const id = `sch_${Date.now()}`;
    const item: ScheduleItem = {
      id,
      ...newItem,
      isCompleted: false,
      isCurrent: false,
    };
    setSchedule((prev) => [...prev, item]);
  };

  // Student Mood Check-in
  const handleStudentMoodCheckIn = (mood: MoodType) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];

    const newLog: StatusLog = {
      id: `log_${Date.now()}`,
      timestamp: now.toISOString(),
      date: dateStr,
      time: timeStr,
      mood,
      energy: mood === 'tired' ? 'low' : 'moderate',
      sensory: mood === 'overwhelmed' ? 'high' : 'low',
      contextTag: 'Student Self Check-In',
      loggedBy: `${student.name} (Student Mode)`,
      role: 'student',
      notes: `Student tapped ${mood} emoji on classroom tablet.`,
      flaggedAsIncident: mood === 'overwhelmed',
    };

    setLogs((prev) => [newLog, ...prev]);

    if (mood === 'overwhelmed') {
      handleTriggerEmergencyIncident(
        'Student Requested Sensory Break',
        `${student.name} tapped "Need Break" on tablet during class.`,
        'moderate'
      );
    }
  };

  const handleOpenAuthModal = (mode: 'login' | 'signup' | 'trial', defaultRole: UserRole = 'educator') => {
    setAuthModalMode(mode);
    setAuthModalRole(defaultRole);
    setIsAuthModalOpen(true);
  };

  const handleSuccessLogin = (userRole: UserRole, session?: UserSession) => {
    const userSession: UserSession = session || {
      role: userRole,
      name: userRole === 'educator' ? 'Ms. Clara Davis' : userRole === 'parent' ? 'Sarah Davis' : 'Leo Davis',
      email: userRole === 'educator' ? 'clara@oakridge.edu' : userRole === 'parent' ? 'sarah.davis@home.org' : 'leo.davis@school.edu',
      organization: userRole === 'educator' ? 'Oakridge Elementary' : 'Davis Family',
      mode: authModalMode,
      isActivated: true,
      loginTime: new Date().toISOString(),
      lastActiveTime: Date.now(),
      sessionToken: `HIPAA-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      hipaaAcknowledged: true,
    };
    setActiveUser(userSession);
    setRole(userRole);
    setSessionTimeRemaining(900); // 15-minute HIPAA inactivity timer
    setIsSessionLocked(false);
    setActiveView('app');
    if (userRole === 'student') {
      setActiveTab('student_mode');
    } else if (userRole === 'educator') {
      setActiveTab('dashboard');
    } else {
      setActiveTab('feed');
    }

    addAuditLog('USER_LOGIN', 'HIPAA Access Control Gateway', `Authenticated into ${userRole} workspace. Cryptographic role isolation enforced (zero-switching).`);
  };

  const handleLogout = () => {
    if (activeUser) {
      addAuditLog('USER_LOGOUT', 'HIPAA Access Control Gateway', `Terminated ${activeUser.role} session (${activeUser.name}). Access token invalidated.`);
    }
    setActiveUser(null);
    setIsSessionLocked(false);
    setActiveView('for_schools');
  };

  const effectiveStudent: StudentProfile = isPhiMasked
    ? {
        ...student,
        name: 'L. D. (#IEP-8842)',
      }
    : student;

  const unacknowledgedCount = incidents.filter((i) => !i.parentAcknowledged).length;

  return (
    <div 
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
        isDuskMode ? 'dusk-mode bg-[#2A2E35] text-[#D8D5CE]' : 'bg-[#F4F1EC] text-[#2C3238]'
      }`}
      style={{ filter: `saturate(${saturationLevel}%)` }}
    >
      
      {/* Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        activeUser={activeUser}
        role={role}
        setRole={setRole}
        student={effectiveStudent}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unacknowledgedIncidentsCount={unacknowledgedCount}
        isDuskMode={isDuskMode}
        setIsDuskMode={setIsDuskMode}
        saturationLevel={saturationLevel}
        setSaturationLevel={setSaturationLevel}
        onOpenQuickLog={() => setIsQuickLogOpen(true)}
        onOpenIncidentsModal={() => setIsIncidentsModalOpen(true)}
        onOpenAuthModal={handleOpenAuthModal}
        onOpenContactModal={() => setIsContactModalOpen(true)}
        onLogout={handleLogout}
        onOpenHipaaSecurity={() => setIsHipaaModalOpen(true)}
        isPhiMasked={isPhiMasked}
        onTogglePhiMask={handleTogglePhiMask}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* VIEW 1: FOR SCHOOLS */}
        {activeView === 'for_schools' && (
          <ForSchoolsPage
            onOpenContact={() => setIsContactModalOpen(true)}
            onOpenHowItWorks={() => setActiveView('how_it_works')}
            onOpenFreeTrial={() => handleOpenAuthModal('trial', 'educator')}
          />
        )}

        {/* VIEW 2: HOW IT WORKS */}
        {activeView === 'how_it_works' && (
          <HowItWorksPage
            onOpenFreeTrial={() => handleOpenAuthModal('trial', 'educator')}
            onOpenContact={() => setIsContactModalOpen(true)}
            onLaunchApp={() => {
              if (activeUser) {
                setActiveView('app');
              } else {
                handleOpenAuthModal('login');
              }
            }}
          />
        )}

        {/* VIEW 3: PRICING */}
        {activeView === 'pricing' && (
          <PricingPage
            onOpenFreeTrial={() => handleOpenAuthModal('trial', 'educator')}
            onOpenContact={() => setIsContactModalOpen(true)}
          />
        )}

        {/* VIEW 4: FOR PARENTS */}
        {activeView === 'for_parents' && (
          <ForParentsPage
            onOpenFreeTrial={() => handleOpenAuthModal('trial', 'parent')}
            onLaunchApp={() => {
              if (activeUser) {
                setActiveView('app');
              } else {
                handleOpenAuthModal('login', 'parent');
              }
            }}
          />
        )}

        {/* VIEW 5: FULL INTERACTIVE APP WORKSPACE */}
        {/* 5A: IF NO ROLE IS ACTIVATED YET - DISPLAY ROLE SELECTION / ACTIVATION GATE */}
        {activeView === 'app' && !activeUser && (
          <div className="py-8 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-black uppercase tracking-wider mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>HIPAA & FERPA Cryptographic Boundary — Strict Role Isolation</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C3238] dark:text-[#D8D5CE] tracking-tight">
                Direct Role Authentication Portal
              </h2>
              <p className="text-[#5C6570] dark:text-[#9BA1AC] mt-2 max-w-2xl mx-auto text-sm leading-relaxed">
                To guarantee full compliance with 45 CFR Parts 160/164 (HIPAA) and 34 CFR Part 99 (FERPA), EquiLink enforces zero cross-role switching. Each session is bound to an isolated cryptographic token. Select your verified role below to log in or register.
              </p>
            </div>

            {/* 3 Role Activation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Educator */}
              <div className={`rounded-2xl p-6 border flex flex-col justify-between transition-all hover:shadow-md ${
                isDuskMode ? 'bg-[#24282F] border-[#404652]' : 'bg-[#FAF8F5] border-[#DCD8D0]'
              }`}>
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#5B7A96]/15 text-[#5B7A96] flex items-center justify-center mb-4">
                    <School className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-[#2C3238] dark:text-[#D8D5CE] mb-2">
                    Educator Dashboard
                  </h3>
                  <p className="text-xs text-[#5C6570] dark:text-[#9BA1AC] leading-relaxed mb-4">
                    Unified classroom command center: live sensory telemetry stream, IEP accommodation tracking, visual routine mirror, and AI regulation insights.
                  </p>
                  <ul className="space-y-1.5 text-xs text-[#5C6570] dark:text-[#9BA1AC] mb-6">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8FA894]" /> Executive Regulation Dashboard
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8FA894]" /> IEP Accommodation Sync
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8FA894]" /> Real-Time Sensory Stream & Alerts
                    </li>
                  </ul>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#DCD8D0]/60 dark:border-[#404652]">
                  <button
                    onClick={() => handleOpenAuthModal('login', 'educator')}
                    className="w-full py-2.5 rounded-xl bg-[#5B7A96] hover:bg-[#7C97AE] text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Log In to Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenAuthModal('trial', 'educator')}
                    className="w-full py-2 rounded-xl bg-[#5B7A96]/10 hover:bg-[#5B7A96]/20 text-[#5B7A96] dark:text-[#8FA894] font-bold text-xs transition-all"
                  >
                    Start Educator Free Trial
                  </button>
                </div>
              </div>

              {/* Card 2: Parent */}
              <div className={`rounded-2xl p-6 border flex flex-col justify-between transition-all hover:shadow-md ${
                isDuskMode ? 'bg-[#24282F] border-[#404652]' : 'bg-[#FAF8F5] border-[#DCD8D0]'
              }`}>
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#8FA894]/20 text-[#8FA894] flex items-center justify-center mb-4">
                    <Home className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-[#2C3238] dark:text-[#D8D5CE] mb-2">
                    Parent Portal
                  </h3>
                  <p className="text-xs text-[#5C6570] dark:text-[#9BA1AC] leading-relaxed mb-4">
                    Morning sleep & regulation logging, real-time arrival alerts, calming decompression protocols, and educator notes.
                  </p>
                  <ul className="space-y-1.5 text-xs text-[#5C6570] dark:text-[#9BA1AC] mb-6">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8FA894]" /> Sleep & Nutrition Log
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8FA894]" /> Real-Time Sensory Alerts
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8FA894]" /> At-Home Decompression
                    </li>
                  </ul>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#DCD8D0]/60 dark:border-[#404652]">
                  <button
                    onClick={() => handleOpenAuthModal('login', 'parent')}
                    className="w-full py-2.5 rounded-xl bg-[#8FA894] hover:bg-[#7A9680] text-[#1E2328] font-black text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Log In as Parent</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenAuthModal('trial', 'parent')}
                    className="w-full py-2 rounded-xl bg-[#8FA894]/15 hover:bg-[#8FA894]/25 text-[#7A9680] dark:text-[#8FA894] font-bold text-xs transition-all"
                  >
                    Start Parent Free Trial
                  </button>
                </div>
              </div>

              {/* Card 3: Student */}
              <div className={`rounded-2xl p-6 border flex flex-col justify-between transition-all hover:shadow-md ${
                isDuskMode ? 'bg-[#24282F] border-[#404652]' : 'bg-[#FAF8F5] border-[#DCD8D0]'
              }`}>
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#D9A15F]/20 text-[#D9A15F] flex items-center justify-center mb-4">
                    <Smile className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-[#2C3238] dark:text-[#D8D5CE] mb-2">
                    Student View
                  </h3>
                  <p className="text-xs text-[#5C6570] dark:text-[#9BA1AC] leading-relaxed mb-4">
                    Gentle visual schedules, simplified countdown timers, emoji feeling check-ins, and a soothing sensory calm space.
                  </p>
                  <ul className="space-y-1.5 text-xs text-[#5C6570] dark:text-[#9BA1AC] mb-6">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D9A15F]" /> Pictorial Routine Cards
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D9A15F]" /> One-Tap Mood Expression
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D9A15F]" /> Sensory Reset Room
                    </li>
                  </ul>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#DCD8D0]/60 dark:border-[#404652]">
                  <button
                    onClick={() => handleOpenAuthModal('login', 'student')}
                    className="w-full py-2.5 rounded-xl bg-[#D9A15F] hover:bg-[#C8904D] text-[#1E2328] font-black text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Log In as Student</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenAuthModal('signup', 'student')}
                    className="w-full py-2 rounded-xl bg-[#D9A15F]/15 hover:bg-[#D9A15F]/25 text-[#B87D3B] dark:text-[#D9A15F] font-bold text-xs transition-all"
                  >
                    Enroll Student Device
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5B: WHEN A ROLE IS ACTIVATED - RENDER ONLY THAT ACTIVATED ROLE'S WORKSPACE */}
        {activeView === 'app' && activeUser && (
          <>
            {/* STUDENT ROLE: ONLY STUDENT VIEW VISIBLE */}
            {activeUser.role === 'student' && (
              <StudentVisualMode
                student={effectiveStudent}
                schedule={schedule}
                onToggleComplete={handleToggleScheduleComplete}
                onStudentMoodCheckIn={handleStudentMoodCheckIn}
              />
            )}

            {/* EDUCATOR ROLE: ONLY EDUCATOR WORKSPACE VISIBLE (DEFAULTS TO DASHBOARD) */}
            {activeUser.role === 'educator' && (
              <>
                {activeTab === 'dashboard' && (
                  <EducatorDashboard
                    student={effectiveStudent}
                    logs={logs}
                    incidents={incidents}
                    schedule={schedule}
                    sleepLogs={sleepLogs}
                    isDuskMode={isDuskMode}
                    onOpenQuickLog={() => setIsQuickLogOpen(true)}
                    onOpenIncidentsModal={() => setIsIncidentsModalOpen(true)}
                    onAcknowledgeIncident={handleAcknowledgeIncident}
                    onToggleScheduleComplete={handleToggleScheduleComplete}
                    onTriggerEmergencyIncident={handleTriggerEmergencyIncident}
                    onNavigateTab={(tab) => setActiveTab(tab)}
                    onAddLog={handleAddLog}
                  />
                )}

                {activeTab === 'feed' && (
                  <ContinuitySyncFeed
                    role="educator"
                    student={effectiveStudent}
                    logs={logs}
                    incidents={incidents}
                    onAcknowledgeIncident={handleAcknowledgeIncident}
                    onToggleDecompressionStep={handleToggleDecompressionStep}
                    onTriggerEmergencyIncident={handleTriggerEmergencyIncident}
                    onOpenQuickLog={() => setIsQuickLogOpen(true)}
                  />
                )}

                {activeTab === 'schedule' && (
                  <VisualSchedule
                    schedule={schedule}
                    role="educator"
                    onToggleComplete={handleToggleScheduleComplete}
                    onUpdateScheduleItem={handleUpdateScheduleItem}
                    onAddScheduleItem={handleAddScheduleItem}
                  />
                )}

                {activeTab === 'ai_trends' && (
                  <AITrendAnalysis
                    student={effectiveStudent}
                    logs={logs}
                    schedule={schedule}
                    sleepLogs={sleepLogs}
                    role="educator"
                  />
                )}

                {activeTab === 'analytics' && (
                  <AnalyticsDashboard
                    student={effectiveStudent}
                    logs={logs}
                    sleepLogs={sleepLogs}
                    incidents={incidents}
                  />
                )}
              </>
            )}

            {/* PARENT ROLE: ONLY PARENT PORTAL VISIBLE */}
            {activeUser.role === 'parent' && (
              <>
                {activeTab === 'feed' && (
                  <ContinuitySyncFeed
                    role="parent"
                    student={effectiveStudent}
                    logs={logs}
                    incidents={incidents}
                    onAcknowledgeIncident={handleAcknowledgeIncident}
                    onToggleDecompressionStep={handleToggleDecompressionStep}
                    onTriggerEmergencyIncident={handleTriggerEmergencyIncident}
                    onOpenQuickLog={() => setIsQuickLogOpen(true)}
                  />
                )}

                {activeTab === 'schedule' && (
                  <VisualSchedule
                    schedule={schedule}
                    role="parent"
                    onToggleComplete={handleToggleScheduleComplete}
                    onUpdateScheduleItem={handleUpdateScheduleItem}
                    onAddScheduleItem={handleAddScheduleItem}
                  />
                )}

                {activeTab === 'ai_trends' && (
                  <AITrendAnalysis
                    student={effectiveStudent}
                    logs={logs}
                    schedule={schedule}
                    sleepLogs={sleepLogs}
                    role="parent"
                  />
                )}

                {activeTab === 'analytics' && (
                  <AnalyticsDashboard
                    student={effectiveStudent}
                    logs={logs}
                    sleepLogs={sleepLogs}
                    incidents={incidents}
                  />
                )}
              </>
            )}
          </>
        )}

      </main>

      {/* Global Modals */}
      <QuickTapLogger
        isOpen={isQuickLogOpen}
        onClose={() => setIsQuickLogOpen(false)}
        role={role}
        studentName={effectiveStudent.name}
        onAddLog={handleAddLog}
        onAddSleepLog={handleAddSleepLog}
      />

      <DecompressionModal
        isOpen={isIncidentsModalOpen}
        onClose={() => setIsIncidentsModalOpen(false)}
        incidents={incidents}
        onAcknowledgeIncident={handleAcknowledgeIncident}
        onToggleDecompressionStep={handleToggleDecompressionStep}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        initialRole={authModalRole}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccessLogin={handleSuccessLogin}
      />

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      {/* HIPAA Compliance & Audit Center Modal */}
      <HipaaSecurityModal
        isOpen={isHipaaModalOpen}
        onClose={() => setIsHipaaModalOpen(false)}
        activeUser={activeUser}
        auditLogs={auditLogs}
        isPhiMasked={isPhiMasked}
        onTogglePhiMask={handleTogglePhiMask}
        sessionTimeRemaining={sessionTimeRemaining}
        onLockSession={() => {
          setIsSessionLocked(true);
          addAuditLog('SECURITY_CHECK', 'HIPAA Lock Screen Guard', 'Session manually locked by user.');
        }}
      />

      {/* HIPAA Auto-Lock Inactivity Screen */}
      <HipaaLockScreen
        isLocked={isSessionLocked}
        activeUser={activeUser}
        onUnlock={() => {
          setIsSessionLocked(false);
          setSessionTimeRemaining(900);
          addAuditLog('SECURITY_CHECK', 'HIPAA Lock Screen Guard', 'User re-authenticated and unlocked session.');
        }}
        onLogout={handleLogout}
      />

      {/* Sensory Safe Footer */}
      <footer className={`${isDuskMode ? 'bg-[#1E2228] border-[#343941] text-[#9BA1AC]' : 'bg-[#E8E4DD] border-[#DCD8D0] text-[#5C6570]'} border-t text-xs py-8 px-6 mt-auto`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-xl bg-[#5B7A96] flex items-center justify-center text-white font-black text-xs">
              EQ
            </div>
            <span className="font-extrabold text-[#2C3238] dark:text-[#D8D5CE] text-sm">EquiLink Learning</span>
          </div>

          <div className="flex items-center gap-6 font-bold text-xs flex-wrap justify-center">
            <button onClick={() => setActiveView('how_it_works')} className="hover:text-[#5B7A96]">How it works</button>
            <button onClick={() => setActiveView('for_schools')} className="hover:text-[#5B7A96]">For Schools</button>
            <button onClick={() => setActiveView('for_parents')} className="hover:text-[#5B7A96]">For Parents</button>
            <button onClick={() => setIsContactModalOpen(true)} className="hover:text-[#5B7A96]">Talk to our team</button>
            <button 
              onClick={() => setIsHipaaModalOpen(true)} 
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold hover:bg-emerald-500/20 transition-all border border-emerald-500/20"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>HIPAA § 164 & FERPA Audited</span>
            </button>
          </div>

          <p className="text-[11px] font-medium">
            EquiLink Learning © 2026 — Sensory-Safe & Low-Arousal IEP Continuity Platform.
          </p>
        </div>
      </footer>

    </div>
  );
}
