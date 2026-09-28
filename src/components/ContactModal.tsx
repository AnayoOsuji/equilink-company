import React, { useState } from 'react';
import { Mail, Phone, Building2, Send, CheckCircle, Sparkles, X, MessageSquare, ShieldCheck } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'District Administrator',
    districtName: '',
    studentsCount: '100-500',
    message: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 my-8">
        
        {/* Header */}
        <div className="bg-[#5B7A96] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-6 h-6 text-[#8FA894]" />
            <h3 className="text-xl font-black">Talk to the EquiLink Team</h3>
          </div>
          <p className="text-xs text-slate-100">
            Get in touch for custom school district pricing, FERPA/COPPA compliance audits, or live IEP platform walkthroughs.
          </p>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <CheckCircle className="w-14 h-14 text-[#8FA894] mx-auto animate-bounce" />
              <h4 className="text-xl font-black text-slate-900">Message Received!</h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Thank you for reaching out! One of our district IEP specialists will contact you at <span className="font-bold text-slate-800">{formData.email}</span> within 2 hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-6 py-2.5 rounded-full bg-[#5B7A96] hover:bg-[#7C97AE] text-white font-bold text-xs shadow-md"
              >
                Return to EquiLink
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Dr. Amanda Vance"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#5B7A96] bg-slate-50 text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Work Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="a.vance@district.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#5B7A96] bg-slate-50 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#5B7A96] bg-slate-50 text-slate-900 font-medium"
                  >
                    <option value="District Administrator">District Administrator</option>
                    <option value="Special Education Director">Special Education Director</option>
                    <option value="Special Educator">Special Educator</option>
                    <option value="Parent / Guardian">Parent / Guardian</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">School / District Name</label>
                  <input
                    type="text"
                    placeholder="Oakridge Unified District"
                    value={formData.districtName}
                    onChange={(e) => setFormData({ ...formData, districtName: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#5B7A96] bg-slate-50 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">How can we support your team?</label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your student needs, IEP tracking goals, or rostering requests..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#5B7A96] bg-slate-50 text-slate-900 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#5B7A96] hover:bg-[#7C97AE] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span>Submit Request to Our Team</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>DPA available • FERPA & COPPA compliant data policy</span>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
