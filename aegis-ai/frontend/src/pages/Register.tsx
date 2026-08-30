import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { ShieldCheck, User as UserIcon, Mail, Lock, Shield, Eye, EyeOff, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

interface RegisterProps {
  onSwitchToLogin: () => void;
}

const ROLES: { role: UserRole; label: string; desc: string }[] = [
  { role: 'Admin', label: 'Admin', desc: 'Full system administration & user access management' },
  { role: 'AI/ML Engineer', label: 'AI/ML Engineer', desc: 'Model deployment, performance & telemetry tracking' },
  { role: 'Governance Officer', label: 'Governance Officer', desc: 'Risk tier evaluation & policy compliance enforcement' },
  { role: 'Auditor', label: 'Auditor', desc: 'Independent audit log evaluation & exportable reports' },
];

export const Register: React.FC<RegisterProps> = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('AI/ML Engineer');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !role) {
      setErrorMessage('Please complete all registration fields.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      await register({ name, email, password, role });
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Email may already be registered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-main flex items-center justify-center p-4 select-none relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-indigo/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg relative z-10 my-8">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl border border-primary/20 mb-2 text-primary shadow-lg shadow-primary/10">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-text-main">
            AegisAI Governance
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Create an enterprise account to govern and audit AI models
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-surface border border-surface-border rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-text-main">Register Account</h2>
            <p className="text-xs text-text-dim mt-0.5">Select your specialized platform role for governance access.</p>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3 rounded-lg bg-status-critical/10 border border-status-critical/30 text-status-critical text-xs flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dr. Evelyn Carter"
                  required
                  className="w-full bg-background border border-surface-border rounded-lg pl-9 pr-4 py-2.5 text-xs text-text-main placeholder-text-dim focus:outline-none focus:border-primary transition-all duration-150"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="evelyn.carter@aegis.ai"
                  required
                  className="w-full bg-background border border-surface-border rounded-lg pl-9 pr-4 py-2.5 text-xs text-text-main placeholder-text-dim focus:outline-none focus:border-primary transition-all duration-150"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5">
                Secure Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  className="w-full bg-background border border-surface-border rounded-lg pl-9 pr-10 py-2.5 text-xs text-text-main placeholder-text-dim focus:outline-none focus:border-primary transition-all duration-150"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-main transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Platform Role Selection */}
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5">
                Platform User Role
              </label>
              <div className="relative mb-2">
                <Shield className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-dim pointer-events-none" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-background border border-surface-border rounded-lg pl-9 pr-4 py-2.5 text-xs text-text-main focus:outline-none focus:border-primary transition-all duration-150 cursor-pointer appearance-none"
                >
                  {ROLES.map((r) => (
                    <option key={r.role} value={r.role} className="bg-surface text-text-main">
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Role Context Helper */}
              <div className="p-3 bg-background/60 border border-surface-border rounded-lg text-[11px] text-text-dim">
                <span className="font-semibold text-text-main">{role}:</span>{' '}
                {ROLES.find((r) => r.role === role)?.desc}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 bg-primary hover:bg-primary-hover text-white font-medium py-2.5 rounded-lg text-xs transition-all duration-150 flex items-center justify-center gap-2 shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create AegisAI Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle to Login */}
          <div className="mt-6 text-center text-xs text-text-muted">
            Already registered?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-primary hover:underline font-semibold transition-colors"
            >
              Sign in here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
