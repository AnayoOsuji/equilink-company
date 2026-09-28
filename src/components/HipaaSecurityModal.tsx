import React, { useState } from 'react';
import { ShieldCheck, Lock, Eye, EyeOff, FileText, Download, Clock, AlertTriangle, X, CheckCircle, Server, KeyRound, UserCheck } from 'lucide-react';
import { HipaaAuditLogEntry, UserSession } from '../types';

interface HipaaSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeUser: UserSession | null;
  auditLogs: HipaaAuditLogEntry[];
  isPhiMasked: boolean;
  onTogglePhiMask: () => void;
  sessionTimeRemaining: number; // in seconds
  onLockSession: () => void;
}

export const HipaaSecurityModal: React.FC<HipaaSecurityModalProps> = ({
  isOpen,
  onClose,
  activeUser,
  auditLogs,
  isPhiMasked,
  onTogglePhiMask,
  sessionTimeRemaining,
  onLockSession,
}) => {
  const [activeTab, setActiveTab] = useState<'safeguards' | 'audit_trail' | 'baa'>('safeguards');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const minutes = Math.floor(sessionTimeRemaining / 60);
  const seconds = sessionTimeRemaining % 60;

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportLogs = () => {
    const jsonStr = JSON.stringify(auditLogs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hipaa_audit_trail_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] dark:bg-[#1E2328] rounded-3xl border border-[#DCD8D0] dark:border-[#383F4A] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#DCD8D0] dark:border-[#383F4A] bg-[#2C3238] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">HIPAA & FERPA Compliance Center</h2>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Enforced
                </span>
              </div>
              <p className="text-xs text-slate-300">
                45 CFR Parts 160 & 164 Subparts A, C & E • Zero Role-Switching Safeguard Active
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Status Bar: Session Guard & Privacy Shield */}
        <div className="px-6 py-3 bg-[#EFECE6] dark:bg-[#252B33] border-b border-[#DCD8D0] dark:border-[#383F4A] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
              <Clock className="w-4 h-4 text-[#5B7A96]" />
              <span>Inactivity Auto-Logoff:</span>
              <span className={`font-mono font-bold px-2 py-0.5 rounded ${sessionTimeRemaining < 120 ? 'bg-rose-100 text-rose-700 font-black' : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'}`}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>

            <div className="h-4 w-px bg-slate-300 dark:bg-slate-600 hidden sm:block" />

            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
              <span>Session:</span>
              <strong className="font-mono text-[11px] text-slate-900 dark:text-slate-100">{activeUser ? activeUser.sessionToken.slice(0, 16) + '...' : 'ANONYMOUS'}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* PHI Masking Toggle */}
            <button
              onClick={onTogglePhiMask}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                isPhiMasked
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-slate-50'
              }`}
              title="Mask student name and health identifiers to prevent open-classroom shoulder surfing"
            >
              {isPhiMasked ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{isPhiMasked ? 'PHI Masked (Shield ON)' : 'Mask PHI (Classroom Mode)'}</span>
            </button>

            {/* Lock Session Immediately */}
            <button
              onClick={() => {
                onClose();
                onLockSession();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#C08B7A] hover:bg-[#B07A69] text-white transition-all shadow-xs"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Screen Now</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-[#DCD8D0] dark:border-[#383F4A]">
          <button
            onClick={() => setActiveTab('safeguards')}
            className={`pb-2.5 px-2 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'safeguards'
                ? 'border-[#5B7A96] text-[#5B7A96] dark:text-[#8FA894]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Technical & Physical Safeguards
          </button>
          <button
            onClick={() => setActiveTab('audit_trail')}
            className={`pb-2.5 px-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'audit_trail'
                ? 'border-[#5B7A96] text-[#5B7A96] dark:text-[#8FA894]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>Immutable Audit Trail</span>
            <span className="bg-[#5B7A96]/10 text-[#5B7A96] dark:text-[#8FA894] px-1.5 py-0.2 rounded-full text-[10px] font-black">
              {auditLogs.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('baa')}
            className={`pb-2.5 px-2 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'baa'
                ? 'border-[#5B7A96] text-[#5B7A96] dark:text-[#8FA894]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            BAA & FERPA Agreement
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-700 dark:text-slate-300 text-xs">
          {activeTab === 'safeguards' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-sm">Strict Zero Role-Switching Enforcement (§ 164.312(a)(1))</p>
                  <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">
                    To comply with HIPAA Access Control mandates, active sessions are bound exclusively to the authenticated user and authorized role.
                    <strong> Arbitrary role switching without complete session termination and re-authentication is strictly forbidden.</strong> To access another role, you must log out.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Safeguard 1: Access Control */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#252B33] border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-2 font-bold text-slate-900 dark:text-white text-sm">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span>Role-Based Access Control (RBAC)</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                    Educator, Parent, and Student portals operate in isolated cryptographic boundaries. Users access only the minimum necessary ePHI relevant to their care role.
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" /> 45 CFR § 164.312(a)(1) Compliant
                  </div>
                </div>

                {/* Safeguard 2: Inactivity Logoff */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#252B33] border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-2 font-bold text-slate-900 dark:text-white text-sm">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>Automatic Session Inactivity Logoff</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                    Sessions automatically lock following inactivity to prevent unauthorized physical terminal access in school or clinic spaces.
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" /> 45 CFR § 164.312(a)(2)(iii) Compliant
                  </div>
                </div>

                {/* Safeguard 3: Transmission Encryption */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#252B33] border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-2 font-bold text-slate-900 dark:text-white text-sm">
                    <Server className="w-4 h-4 text-emerald-600" />
                    <span>End-to-End ePHI Transmission Security</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                    All student health telemetry, sensory logs, and IEP accommodations are encrypted using TLS 1.3 in transit and AES-256 at rest.
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" /> 45 CFR § 164.312(e)(1) Compliant
                  </div>
                </div>

                {/* Safeguard 4: Audit Controls */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#252B33] border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-2 font-bold text-slate-900 dark:text-white text-sm">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>Audit Logs & Access Monitoring</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                    Every access, modification, export, and incident alert acknowledgement is stamped with an immutable user identifier and cryptographic hash.
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" /> 45 CFR § 164.312(b) Compliant
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit_trail' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter by action, user, or resource..."
                  className="px-3 py-2 rounded-xl bg-white dark:bg-[#252B33] border border-slate-300 dark:border-slate-600 text-xs w-full sm:w-72"
                />
                <button
                  onClick={handleExportLogs}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#5B7A96] hover:bg-[#7C97AE] text-white font-bold text-xs transition-all shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Accounting of Disclosures</span>
                </button>
              </div>

              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
                <div className="max-h-72 overflow-y-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700 sticky top-0">
                      <tr>
                        <th className="px-3 py-2">Timestamp (UTC)</th>
                        <th className="px-3 py-2">Action</th>
                        <th className="px-3 py-2">User / Role</th>
                        <th className="px-3 py-2">Resource</th>
                        <th className="px-3 py-2">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                      {filteredLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="px-3 py-2 whitespace-nowrap text-slate-500">{log.timestamp}</td>
                          <td className="px-3 py-2 font-bold text-slate-800 dark:text-slate-200">
                            <span className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-[10px]">
                              {log.action}
                            </span>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap font-sans font-medium text-slate-700 dark:text-slate-300">
                            {log.userName} ({log.userRole})
                          </td>
                          <td className="px-3 py-2 font-sans text-slate-600 dark:text-slate-400">{log.resource}</td>
                          <td className="px-3 py-2 font-sans text-slate-500 text-[10px]">{log.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'baa' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-[#252B33] border border-slate-200 dark:border-slate-700 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Standard Business Associate Agreement (BAA) Readiness</span>
                </h3>
                <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                  EquiLink executes standard Business Associate Agreements with participating public school districts, charter local educational agencies (LEAs), and behavioral healthcare providers in compliance with 45 CFR § 164.502(e) and § 164.504(e).
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                    <strong className="block text-slate-800 dark:text-slate-200 mb-1">HIPAA Security Officer:</strong>
                    <span>compliance@equilink.org • 24/7 Security Hotline</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                    <strong className="block text-slate-800 dark:text-slate-200 mb-1">Breach Notification Rule:</strong>
                    <span>Mandatory notification within 24 hours of suspected ePHI compromise (45 CFR §§ 164.400-414).</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#DCD8D0] dark:border-[#383F4A] bg-[#FAF8F5] dark:bg-[#1E2328] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Strict Role Bound Session • No Role Hopping Permitted</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-bold transition-all text-slate-800 dark:text-slate-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
