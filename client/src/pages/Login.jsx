import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Shield, UserCheck, AlertCircle, KeyRound, Check } from 'lucide-react';
import Modal from '../components/Modal';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@swachhta.gov.in');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const quickRoles = [
    {
      role: 'Admin',
      email: 'admin@swachhta.gov.in',
      desc: 'Full System Control',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      role: 'Inspector',
      email: 'inspector@swachhta.gov.in',
      desc: 'Conduct Audits',
      badge: 'bg-blue-100 text-blue-800 border-blue-300',
    },
    {
      role: 'Facility Manager',
      email: 'manager@swachhta.gov.in',
      desc: 'Submit Corrective Actions',
      badge: 'bg-amber-100 text-amber-800 border-amber-300',
    },
  ];

  const handleQuickSelect = (roleEmail) => {
    setEmail(roleEmail);
    setPassword('password123');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotSuccess(true);
  };

  return (
    <div>
      {error && (
        <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-xs text-rose-700 font-medium">
          <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Role Quick Selector */}
      <div className="mb-6">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          Demo Account Selector
        </p>
        <div className="grid grid-cols-3 gap-2">
          {quickRoles.map((item) => (
            <button
              type="button"
              key={item.role}
              onClick={() => handleQuickSelect(item.email)}
              className={`p-2.5 text-left rounded-xl border transition-all ${
                email === item.email
                  ? 'bg-emerald-50 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className={`inline-block px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded ${item.badge}`}>
                {item.role}
              </span>
              <p className="text-[11px] font-semibold text-slate-700 truncate mt-1">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@swachhta.gov.in"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
            />
            Remember me
          </label>
          <button
            type="button"
            onClick={() => {
              setShowForgotModal(true);
              setForgotSuccess(false);
            }}
            className="font-semibold text-emerald-600 hover:text-emerald-800"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-900/20 transition-all duration-200 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <UserCheck className="w-4 h-4" />
              Sign in to Dashboard
            </>
          )}
        </button>
      </form>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Reset Password"
        maxWidth="max-w-md"
      >
        {forgotSuccess ? (
          <div className="text-center py-4 space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Instructions Sent</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              If an account exists for <span className="font-semibold">{resetEmail}</span>, password reset instructions have been dispatched.
            </p>
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Enter your registered government or institutional email address below. We will send a secure password reset link.
            </p>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="your.name@swachhta.gov.in"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
              >
                Send Reset Link
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Login;
