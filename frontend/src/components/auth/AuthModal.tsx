import React, { useState } from 'react';
import { api } from '@/services/api';
import { AuthResponse } from '@/types';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  X,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (authData: AuthResponse) => void;
  defaultMode?: 'login' | 'register';
}

export function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  defaultMode = 'login',
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let res: AuthResponse;
      if (mode === 'register') {
        if (!fullName.trim()) {
          throw new Error('Please enter your creator or channel name.');
        }
        res = await api.register(email.trim(), password, fullName.trim());
      } else {
        res = await api.login(email.trim(), password);
      }
      onSuccess(res);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#161616] border border-[#282828] rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#888888] hover:text-white p-1 rounded-xl hover:bg-[#222222] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-gradient-to-tr from-brand-red to-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-red-900/30">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">
            {mode === 'login' ? 'Sign In to TubeMerge' : 'Create Creator Account'}
          </h2>
          <p className="text-xs text-[#888888]">
            {mode === 'login'
              ? 'Access your cloud sync, multi-device license, and merge history.'
              : 'Start free with 3 merges/day or connect your Creator Pro license.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-[#101010] rounded-xl border border-[#222222] text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-[#222222] text-white shadow-sm'
                : 'text-[#777777] hover:text-[#AAAAAA]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-[#222222] text-white shadow-sm'
                : 'text-[#777777] hover:text-[#AAAAAA]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-xl flex items-start gap-2.5 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider">
                Channel / Creator Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Marques Brownlee"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#121212] border border-[#282828] text-xs text-white placeholder-[#555555] focus:outline-none focus:border-brand-red transition-colors"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creator@youtube.com"
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#121212] border border-[#282828] text-xs text-white placeholder-[#555555] focus:outline-none focus:border-brand-red transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 pl-10 pr-10 rounded-xl bg-[#121212] border border-[#282828] text-xs text-white placeholder-[#555555] focus:outline-none focus:border-brand-red transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#AAAAAA]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="default"
            size="default"
            loading={loading}
            icon={mode === 'register' ? Sparkles : Lock}
            className="w-full h-11 font-semibold text-xs rounded-xl mt-2"
          >
            {mode === 'register' ? 'Create Creator Account' : 'Sign In to Workstation'}
          </Button>
        </form>

        {/* Footer info */}
        <div className="text-center pt-2 border-t border-[#222222]">
          <p className="text-[11px] text-[#666666]">
            Protected by 2-device cryptographic node-locking & Supabase PostgreSQL cloud sync.
          </p>
        </div>
      </div>
    </div>
  );
}
