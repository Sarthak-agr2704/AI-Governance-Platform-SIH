import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Loader2, Sparkles } from 'lucide-react';

interface LoginProps {
  onSwitchToRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    try {
      await login({ email, password });
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail: string, demoRoleName: string) => {
    setEmail(demoEmail);
    setPassword('DemoPass123!');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#050507] text-[#fafafa] flex items-center justify-center p-4 select-none relative overflow-hidden">
      {/* Background Decorative Gold Ambient Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#eab308]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#ca8a04]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-fadeIn">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3.5 bg-gradient-to-br from-[#fde047]/20 via-[#eab308]/20 to-[#ca8a04]/10 rounded-2xl border border-[#eab308]/40 mb-3 text-[#eab308] shadow-[0_0_20px_rgba(234,179,8,0.25)]">
            <ShieldCheck className="w-10 h-10 text-[#eab308]" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-gold-gradient">
            AegisAI
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1 font-mono uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#eab308]" />
            <span>Black & Gold Governance Command</span>
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#101016] border border-[#eab308]/30 rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-xl">
          <div className="mb-6">
            <h2 className="text-lg font-black text-[#fafafa]">Sign In to Command Center</h2>
            <p className="text-xs text-[#a1a1aa] mt-0.5">Enter credentials to access model registry & audit logs.</p>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444] text-xs flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-[#a1a1aa] mb-1.5 uppercase tracking-wider">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717a]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@aegis.ai"
                  required
                  className="w-full bg-[#050507] border border-[#22222d] rounded-xl pl-10 pr-4 py-3 text-xs text-[#fafafa] placeholder-[#71717a] focus:outline-none focus:border-[#eab308] transition-all duration-150 font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-[#a1a1aa] mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717a]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-[#050507] border border-[#22222d] rounded-xl pl-10 pr-10 py-3 text-xs text-[#fafafa] placeholder-[#71717a] focus:outline-none focus:border-[#eab308] transition-all duration-150 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-[#fafafa] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="gold-button-glow w-full mt-2 py-3 rounded-xl text-xs transition-all duration-150 flex items-center justify-center gap-2 border border-[#fde047] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Platform</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Pre-fill Section */}
          <div className="mt-6 pt-6 border-t border-[#22222d]">
            <div className="text-[11px] font-bold text-[#71717a] uppercase tracking-widest mb-2 text-center">
              Quick Role Presets
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('admin@aegis.ai', 'Admin')}
                className="bg-[#181822] hover:bg-[#222230] text-[#a1a1aa] hover:text-[#fafafa] text-[11px] py-2 px-3 rounded-xl border border-[#22222d] hover:border-[#eab308]/40 text-left transition-all"
              >
                <div className="font-black text-[#eab308]">Admin</div>
                <div className="text-[10px] text-[#71717a]">admin@aegis.ai</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('engineer@aegis.ai', 'AI/ML Engineer')}
                className="bg-[#181822] hover:bg-[#222230] text-[#a1a1aa] hover:text-[#fafafa] text-[11px] py-2 px-3 rounded-xl border border-[#22222d] hover:border-[#eab308]/40 text-left transition-all"
              >
                <div className="font-black text-[#eab308]">AI Lead</div>
                <div className="text-[10px] text-[#71717a]">engineer@aegis.ai</div>
              </button>
            </div>
          </div>

          {/* Toggle to Register */}
          <div className="mt-6 text-center text-xs text-[#a1a1aa]">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-[#eab308] hover:underline font-bold transition-colors"
            >
              Register here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
