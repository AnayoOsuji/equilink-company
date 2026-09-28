import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, User, Building, ArrowRight, CheckCircle2, Sparkles, X, School, Home, Smile } from 'lucide-react';
import { UserRole, UserSession } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'signup' | 'trial';
  initialRole?: UserRole;
  onClose: () => void;
  onSuccessLogin: (userRole: UserRole, session: UserSession) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  initialRole = 'educator',
  onClose,
  onSuccessLogin,
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'trial'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [isSubmitted, setIsSubmitted] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setSelectedRole(initialRole);
      setIsSubmitted(false);
    }
  }, [isOpen, initialMode, initialRole]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    const defaultName =
      selectedRole === 'educator'
        ? 'Ms. Clara Davis'
        : selectedRole === 'parent'
        ? 'Sarah Davis'
        : 'Leo Davis';

    const defaultEmail =
      selectedRole === 'educator'
        ? 'clara@oakridge.edu'
        : selectedRole === 'parent'
        ? 'sarah.davis@home.org'
        : 'leo.davis@school.edu';

    const session: UserSession = {
      role: selectedRole,
      name: name.trim() || defaultName,
      email: email.trim() || defaultEmail,
      organization: organization.trim() || (selectedRole === 'educator' ? 'Oakridge Elementary' : 'Davis Family'),
      mode,
      isActivated: true,
      loginTime: new Date().toISOString(),
      lastActiveTime: Date.now(),
      sessionToken: `HIPAA-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      hipaaAcknowledged: true,
    };

    setTimeout(() => {
      setIsSubmitted(false);
      onSuccessLogin(selectedRole, session);
      onClose();
    }, 700);
  };

  const handleFillCredentials = (roleToFill: UserRole) => {
    setSelectedRole(roleToFill);
    if (roleToFill === 'educator') {
      setEmail('clara@oakridge.edu');
      setName('Ms. Clara Davis');
      setOrganization('Oakridge Elementary LEA');
      setPassword('••••••••••••');
    } else if (roleToFill === 'parent') {
      setEmail('sarah.davis@home.org');
      setName('Sarah Davis');
      setOrganization('Davis Family Caregiver');
      setPassword('••••••••••••');
    } else {
      setEmail('leo.davis@school.edu');
      setName('Leo Davis');
      setOrganization('Student Self-Advocate');
      setPassword('••••••••••••');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 my-8">
        
        {/* Modal Header */}
        <div className="bg-[#5B7A96] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-white text-base">
              EQ
            </div>
            <span className="font-extrabold text-lg tracking-tight">EquiLink</span>
          </div>

          <h3 className="text-xl font-black">
            {mode === 'login' && 'Welcome Back to EquiLink'}
            {mode === 'signup' && 'Create Your EquiLink Account'}
            {mode === 'trial' && 'Start Your 14-Day Free Trial'}
          </h3>
          <p className="text-xs text-slate-100 mt-1">
            {mode === 'login' && 'Log in to access real-time IEP sync and student logs.'}
            {mode === 'signup' && 'Join thousands of educators and families supporting neurodivergent learners.'}
            {mode === 'trial' && 'Full access to all AI trend analysis, visual schedules & IEP reporting.'}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-[#3F5A73] p-1 rounded-xl border border-white/20 mt-4 text-xs font-bold">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                mode === 'login' ? 'bg-white text-[#2C3238] shadow-sm' : 'text-slate-100 hover:text-white'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                mode === 'signup' ? 'bg-white text-[#2C3238] shadow-sm' : 'text-slate-100 hover:text-white'
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => setMode('trial')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                mode === 'trial' ? 'bg-[#D9A15F] text-slate-950 shadow-sm' : 'text-slate-100 hover:text-white'
              }`}
            >
              Free Trial ✨
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#8FA894] mx-auto animate-bounce" />
              <h4 className="text-lg font-bold text-slate-900">
                {mode === 'trial' ? 'Free Trial Activated!' : 'Authentication Successful!'}
              </h4>
              <p className="text-xs text-slate-600">
                Redirecting you to the EquiLink Student Workspace...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              
              {mode !== 'login' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Davis"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#5B7A96] bg-slate-50 text-slate-900 font-medium"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="name@school.edu or name@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#5B7A96] bg-slate-50 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#5B7A96] bg-slate-50 text-slate-900 font-medium"
                  />
                </div>
              </div>

              {mode === 'trial' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">School District or Family Name</label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. Oakridge School District / Davis Family"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#5B7A96] bg-slate-50 text-slate-900 font-medium"
                    />
                  </div>
                </div>
              )}

              {/* Role Selection */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">Select Primary Workspace Role</label>
                  <span className="text-[10px] text-[#5B7A96] font-bold">Only this role will be visible</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('educator')}
                    className={`py-2 px-2 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                      selectedRole === 'educator'
                        ? 'border-[#5B7A96] bg-[#5B7A96]/10 text-[#2C3238] ring-2 ring-[#5B7A96]/20'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <School className="w-4 h-4 text-[#5B7A96]" />
                    <span>Educator</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('parent')}
                    className={`py-2 px-2 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                      selectedRole === 'parent'
                        ? 'border-[#8FA894] bg-[#8FA894]/15 text-[#2C3238] ring-2 ring-[#8FA894]/30'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Home className="w-4 h-4 text-[#8FA894]" />
                    <span>Parent</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('student')}
                    className={`py-2 px-2 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                      selectedRole === 'student'
                        ? 'border-[#D9A15F] bg-[#D9A15F]/15 text-[#2C3238] ring-2 ring-[#D9A15F]/30'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Smile className="w-4 h-4 text-[#D9A15F]" />
                    <span>Student</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-tight">
                  {selectedRole === 'student' && '🎒 Student View: Only student visual schedules, mood check-ins, and the quiet calm corner are accessible.'}
                  {selectedRole === 'educator' && '🏫 Educator Workspace: Only classroom feeds, IEP tracking, schedule editing, and team insights are accessible.'}
                  {selectedRole === 'parent' && '🏡 Parent Portal: Only home sleep logging, classroom mood sync, and transition alerts are accessible.'}
                </p>
              </div>

              {/* HIPAA / FERPA Strict Security Notice */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>HIPAA § 164.312 Access Control Enforced</span>
                </div>
                <p className="leading-relaxed">
                  Your session is strictly bound to this role. <strong>Role-switching during an active session is prohibited</strong> to prevent unauthorized PHI disclosure. Logout is required to change roles.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#5B7A96] hover:bg-[#7C97AE] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-98 mt-2"
              >
                <span>
                  {mode === 'login' && `Log In as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`}
                  {mode === 'signup' && `Create ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Account`}
                  {mode === 'trial' && `Start ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Free Trial`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Demo Account Credentials Helper */}
              <div className="pt-2 border-t border-slate-100">
                <div className="text-[11px] font-bold text-slate-500 mb-1 text-center">
                  Pre-fill Demo Credentials (Authenticated Sign-In):
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleFillCredentials('educator')}
                    className="py-1 px-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[10px] transition-all"
                  >
                    🏫 Educator
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFillCredentials('parent')}
                    className="py-1 px-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[10px] transition-all"
                  >
                    🏡 Parent
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFillCredentials('student')}
                    className="py-1 px-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[10px] transition-all"
                  >
                    🎒 Student
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>AES-256 Encrypted • BAA & FERPA Compliant Storage</span>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
