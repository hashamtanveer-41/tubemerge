import React, { useState } from 'react';
import { UserProfile, LicenseInfo, UsageMetrics, ActiveDevice } from '@/types';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import {
  ArrowLeft,
  BadgeCheck,
  KeyRound,
  ShieldCheck,
  Activity,
  Cpu,
  Layers,
  Zap,
  Copy,
  Check,
  Sparkles,
  Calendar,
  Clock,
  Lock,
  X,
  LogOut,
  LogIn,
  ShieldAlert,
} from 'lucide-react';

interface ProfileViewProps {
  profile: UserProfile | null;
  license: LicenseInfo;
  usage: UsageMetrics;
  activeDevices?: ActiveDevice[];
  onActivateKey: (key: string) => Promise<boolean>;
  onDeactivateKey: () => Promise<boolean>;
  onDeactivateDevice?: (hwid: string) => Promise<void>;
  onSignInClick?: () => void;
  onSignOutClick?: () => void;
  onNavigateToAdmin?: () => void;
  onBackToMerge: () => void;
  showToast: (message: string, type: 'error' | 'success' | 'info') => void;
}

const ENABLE_ADMIN = import.meta.env.VITE_ENABLE_ADMIN === 'true';

export function ProfileView({
  profile,
  license,
  usage,
  activeDevices = [],
  onActivateKey,
  onDeactivateKey,
  onDeactivateDevice,
  onSignInClick,
  onSignOutClick,
  onNavigateToAdmin,
  onBackToMerge,
  showToast,
}: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'license' | 'usage'>('overview');
  const [licenseInput, setLicenseInput] = useState('');
  const [activating, setActivating] = useState(false);
  const [copiedHwid, setCopiedHwid] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const handleCheckout = async (planTier: string) => {
    if (!profile) {
      showToast('Please sign in or create an account first to link your purchase.', 'info');
      if (onSignInClick) onSignInClick();
      return;
    }

    setCheckoutLoading(planTier);
    try {
      const session = await api.createCheckoutSession(planTier);
      if (session.checkout_url) {
        if (session.checkout_url.includes('simulated=true')) {
          showToast(`Test Mode: Account upgraded to ${session.plan_tier}! Refreshing...`, 'success');
          setTimeout(() => {
            window.location.reload();
          }, 1200);
        } else {
          showToast('Opening secure Stripe checkout…', 'info');
          window.open(session.checkout_url, '_blank');
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to initialize checkout', 'error');
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleCopyHwid = () => {
    navigator.clipboard.writeText(license.hardware_id);
    setCopiedHwid(true);
    showToast('Hardware ID copied to clipboard', 'info');
    setTimeout(() => setCopiedHwid(false), 2000);
  };

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseInput.trim()) return;

    setActivating(true);
    try {
      const success = await onActivateKey(licenseInput.trim());
      if (success) {
        setLicenseInput('');
        showToast('License activated successfully!', 'success');
      } else {
        showToast('Invalid or expired license key.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Activation failed.', 'error');
    } finally {
      setActivating(false);
    }
  };

  const isAdmin = profile?.role === 'admin' || profile?.email === 'admin@tubemerger.com';
  const isPro =
    (license.status === 'active' &&
      (license.plan_tier === 'PRO' ||
       license.plan_tier === 'CREATOR_PRO' ||
       license.plan_tier === 'LIFETIME' ||
       license.plan_tier === 'STUDIO')) ||
    profile?.tier === 'LIFETIME' ||
    profile?.tier === 'CREATOR_PRO' ||
    isAdmin;
  const quotaPercent = Math.min(100, Math.round((usage.requests_today / usage.daily_quota) * 100));

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 select-none animate-in fade-in duration-150">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToMerge}
          className="inline-flex items-center gap-2 text-xs text-content-secondary hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Merging</span>
        </button>

        <span className="text-xs text-content-dim font-medium">
          Channel & Account Settings
        </span>
      </div>

      {/* YouTube-Style Channel Profile Header (Flat & Clean, Generated Banner Artwork) */}
      <div className="rounded-2xl border border-[#282828] bg-[#181818] overflow-hidden shadow-lg">
        {/* Colorful Generated Banner Artwork */}
        <div className="h-44 sm:h-52 w-full relative overflow-hidden bg-[#161616]">
          <img
            src="/assets/banner.jpg"
            alt="We build to make your life easier"
            className="w-full h-full object-cover"
          />
        </div>

        {/* User Profile Bar - Generous Gap & Spacing */}
        <div className="p-6 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            {/* Avatar & Identifiers with generous horizontal gap */}
            <div className="flex items-center gap-5 sm:gap-6">
              <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full border-2 border-[#303030] bg-[#242424] flex items-center justify-center text-white shrink-0 shadow-md relative overflow-hidden">
                <span className="text-2xl sm:text-3xl font-bold text-white">
                  {profile ? (profile.full_name || profile.name || 'C').charAt(0).toUpperCase() : 'G'}
                </span>
                {isPro && (
                  <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#181818] flex items-center justify-center text-white" title="Verified License">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
              </div>

              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate">
                    {profile ? (profile.full_name || profile.name) : 'Guest Creator'}
                  </h1>
                  {isPro && (
                    <span title="Active Entitlement" className="flex items-center shrink-0">
                      <BadgeCheck className="w-5 h-5 text-emerald-400" />
                    </span>
                  )}
                  {isAdmin && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-brand-red text-white uppercase shadow-sm">
                      ADMIN
                    </span>
                  )}
                  {!isAdmin && isPro && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase shadow-sm">
                      {profile?.tier === 'LIFETIME' || license.plan_tier === 'LIFETIME' ? 'LIFETIME' : 'PRO'}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#888888]">
                  <span>{profile ? profile.handle : '@guest.tubemerger'}</span>
                  <span className="text-[#555555]">·</span>
                  <span>{profile ? profile.email : 'Unregistered Workstation'}</span>
                  <span className="text-[#555555]">·</span>
                  <span className="flex items-center gap-1 text-[#666666]">
                    <Calendar className="w-3 h-3" />
                    Joined {profile ? profile.created_at : 'Sep 2026'}
                  </span>
                </div>
              </div>
            </div>

            {/* Header Actions: Admin Console, Upgrade, Sign Out, Sign In */}
            <div className="flex items-center gap-3 shrink-0">
              {ENABLE_ADMIN && isAdmin && onNavigateToAdmin && (
                <Button
                  size="default"
                  variant="default"
                  onClick={onNavigateToAdmin}
                  icon={ShieldAlert}
                  className="text-xs h-10 px-4 font-semibold bg-brand-red hover:bg-red-600 shadow-md shadow-red-950/40"
                >
                  Admin Console
                </Button>
              )}
              {isPro && !isAdmin && (
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{license.plan_tier === 'LIFETIME' || profile?.tier === 'LIFETIME' ? 'Lifetime Hero' : 'Creator Pro Active'}</span>
                </div>
              )}
              {!isPro && (
                <Button
                  size="default"
                  variant="default"
                  onClick={() => setActiveTab('license')}
                  icon={Sparkles}
                  className="text-xs h-10 px-5 font-semibold shadow-md shadow-red-950/30"
                >
                  Upgrade to Pro
                </Button>
              )}
              {profile ? (
                <Button
                  size="default"
                  variant="outline"
                  onClick={onSignOutClick}
                  icon={LogOut}
                  className="text-xs h-10 px-4 font-semibold border-[#333333] hover:border-red-500/50 hover:text-red-400"
                >
                  Sign Out
                </Button>
              ) : (
                <Button
                  size="default"
                  variant="outline"
                  onClick={onSignInClick}
                  icon={LogIn}
                  className="text-xs h-10 px-4 font-semibold border-blue-500/60 text-blue-400 hover:bg-blue-500/10"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>

          {/* Persistent YouTube-Style Navigation Tabs */}
          <div className="flex items-center gap-6 border-t border-[#242424] mt-6 pt-3">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2.5 text-sm font-medium transition-colors relative cursor-pointer ${
                activeTab === 'overview' ? 'text-white font-semibold' : 'text-[#888888] hover:text-white'
              }`}
            >
              Overview
              {activeTab === 'overview' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-red rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('license')}
              className={`pb-2.5 text-sm font-medium transition-colors relative cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'license' ? 'text-white font-semibold' : 'text-[#888888] hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              License & Plan
              {activeTab === 'license' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-red rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('usage')}
              className={`pb-2.5 text-sm font-medium transition-colors relative cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'usage' ? 'text-white font-semibold' : 'text-[#888888] hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              Usage Analytics
              {activeTab === 'usage' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-red rounded-full" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Unified YouTube Studio Stats Grid (Flat, Solid, No Odd Floating Cards) */}
          <div className="rounded-2xl border border-[#282828] bg-[#181818] p-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-[#282828]">
              {/* Stat 1 */}
              <div className="space-y-1 pr-4">
                <div className="flex items-center justify-between text-xs text-[#888888]">
                  <span>{usage.quota_period === 'week' ? 'Weekly Playlists' : 'Daily Requests'}</span>
                  <Activity className="w-3.5 h-3.5 text-brand-red" />
                </div>
                <div className="flex items-baseline gap-1.5 pt-1">
                  <span className="text-2xl font-bold text-white">{usage.requests_today}</span>
                  <span className="text-xs text-[#666666]">/ {usage.daily_quota} {usage.quota_period === 'week' ? 'this week' : 'today'}</span>
                </div>
                <div className="w-full bg-[#242424] rounded-full h-1 mt-2 overflow-hidden">
                  <div
                    className="bg-brand-red h-full rounded-full"
                    style={{ width: `${quotaPercent}%` }}
                  />
                </div>
              </div>

              {/* Stat 2 */}
              <div className="space-y-1 pt-4 md:pt-0 md:px-6">
                <div className="flex items-center justify-between text-xs text-[#888888]">
                  <span>Lifetime Merges</span>
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white pt-1">
                  {usage.total_lifetime_merges}
                </div>
                <p className="text-[11px] text-[#666666]">Completed jobs</p>
              </div>

              {/* Stat 3 */}
              <div className="space-y-1 pt-4 md:pt-0 md:px-6">
                <div className="flex items-center justify-between text-xs text-[#888888]">
                  <span>Video Rendered</span>
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-white pt-1">
                  {usage.total_minutes_processed}m
                </div>
                <p className="text-[11px] text-[#666666]">Total duration stitched</p>
              </div>

              {/* Stat 4 */}
              <div className="space-y-1 pt-4 md:pt-0 md:pl-6">
                <div className="flex items-center justify-between text-xs text-[#888888]">
                  <span>Canvas Resolution</span>
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-white pt-1">
                  {isPro ? '4K 60FPS' : '1080p'}
                </div>
                <p className="text-[11px] text-[#666666]">
                  {isPro ? 'Hardware accelerated' : 'Standard encoding'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: License & Plan */}
      {activeTab === 'license' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          {/* Buying & Plan Comparison (3 Tiers: Free, Pass, Lifetime Hero Offer) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Tier 1: Free Community */}
            <div className="rounded-2xl border border-[#333333] bg-[#1A1A1A] p-6 space-y-4 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start pb-3 border-b border-[#2A2A2A] mb-4">
                  <div>
                    <h4 className="text-base font-bold text-white">Free Community</h4>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-black text-white">$0</span>
                      <span className="text-xs text-[#888888]">/ forever</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-[#AAAAAA] bg-[#242424] border border-[#333333] px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>

                <ul className="space-y-3 text-xs">
                  <li className="flex items-center gap-2.5 text-[#E0E0E0]">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 stroke-[2.5]" />
                    <span>Automated chapter generation</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-[#888888]">
                    <X className="w-3.5 h-3.5 text-red-400 shrink-0 stroke-[2.5]" />
                    <span>3 playlists / week limit</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-[#888888]">
                    <X className="w-3.5 h-3.5 text-red-400 shrink-0 stroke-[2.5]" />
                    <span>1080p max resolution cap</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-[#888888]">
                    <X className="w-3.5 h-3.5 text-red-400 shrink-0 stroke-[2.5]" />
                    <span>Standard CPU encoding</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-[#888888]">
                    <X className="w-3.5 h-3.5 text-red-400 shrink-0 stroke-[2.5]" />
                    <span>Single-threaded engine</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-[#888888]">
                    <X className="w-3.5 h-3.5 text-red-400 shrink-0 stroke-[2.5]" />
                    <span>1 workstation limit</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-[#262626]">
                <span className="text-xs text-[#666666] block text-center font-medium">
                  Free Acquisition Tier
                </span>
              </div>
            </div>

            {/* Tier 2: Creator Pro (Pass) */}
            <div className="rounded-2xl border border-[#3A3A3A] bg-[#1E1E1E] p-6 space-y-4 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start pb-3 border-b border-[#2C2C2C] mb-4">
                  <div>
                    <h4 className="text-base font-bold text-white">Creator Pro (Pass)</h4>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-black text-white">$4.99</span>
                      <span className="text-xs text-[#AAAAAA]">/ mo or $29/yr</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-zinc-300 bg-[#2C2C2C] px-2 py-0.5 rounded-full">
                    Flex Pass
                  </span>
                </div>

                <ul className="space-y-3 text-xs">
                  <li className="flex items-center gap-2.5 text-white font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 stroke-[2.5]" />
                    <span>Automated chapter generation</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-white font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 stroke-[2.5]" />
                    <span>Unlimited daily merge requests</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-white font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 stroke-[2.5]" />
                    <span>4K 60FPS & 8K master rendering</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-white font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 stroke-[2.5]" />
                    <span>Hardware GPU acceleration</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-white font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 stroke-[2.5]" />
                    <span>Multi-threaded download engine</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-white font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 stroke-[2.5]" />
                    <span>2 authorized workstations</span>
                  </li>
                </ul>
              </div>

              {!isPro && (
                <div className="pt-4 border-t border-[#2A2A2A]">
                  <Button
                    variant="outline"
                    size="default"
                    loading={checkoutLoading === 'CREATOR_PRO_MONTHLY'}
                    onClick={() => handleCheckout('CREATOR_PRO_MONTHLY')}
                    className="w-full h-10 font-semibold text-xs border-[#404040] hover:border-white text-white"
                  >
                    Get Pro Pass - $9/mo
                  </Button>
                </div>
              )}
            </div>

            {/* Tier 3: Pro Lifetime (Hero Offer - Highest Converting) */}
            <div className="rounded-2xl border-2 border-brand-red bg-[#231718] p-6 space-y-4 shadow-2xl shadow-red-950/40 relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start pb-3 border-b border-brand-red/30 mb-4">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-brand-red" /> Pro Lifetime
                    </h4>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-black text-white">$49</span>
                      <span className="text-xs text-red-200/80 font-semibold">One-Time</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-black tracking-wide text-white bg-brand-red px-2.5 py-0.5 rounded-full shadow-sm uppercase">
                    Hero Offer
                  </span>
                </div>

                <ul className="space-y-3 text-xs">
                  <li className="flex items-center gap-2.5 text-white font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 stroke-[2.5]" />
                    <span>Pay once, own forever (No churn)</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-white font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 stroke-[2.5]" />
                    <span>Unlimited daily merges (Uncapped)</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-white font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 stroke-[2.5]" />
                    <span>4K 60FPS & 8K master rendering</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-white font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 stroke-[2.5]" />
                    <span>Full GPU acceleration (NVENC/QuickSync)</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-white font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 stroke-[2.5]" />
                    <span>Priority multi-threaded processing</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-white font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 stroke-[2.5]" />
                    <span>3 workstations + Lifetime updates</span>
                  </li>
                </ul>
              </div>

              {!isPro && (
                <div className="pt-4 border-t border-brand-red/20">
                  <Button
                    variant="default"
                    size="default"
                    loading={checkoutLoading === 'LIFETIME'}
                    onClick={() => handleCheckout('LIFETIME')}
                    icon={Sparkles}
                    className="w-full h-11 font-black text-xs shadow-lg shadow-red-950/50"
                  >
                    Unlock Lifetime Access - $49
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Connected Workstations (2-Device Node-Locking from Supabase) */}
          {activeDevices && activeDevices.length > 0 && (
            <div className="rounded-2xl border border-[#2E2E2E] bg-[#181818] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-brand-red" />
                  <span>Connected Workstations ({activeDevices.length} / 2 Slots Used)</span>
                </h4>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-2.5 py-0.5 rounded-full">
                  Supabase Node-Locked
                </span>
              </div>

              <div className="space-y-2">
                {activeDevices.map((dev) => (
                  <div
                    key={dev.hardware_id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#121212] border border-[#262626] text-xs"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{dev.device_name}</span>
                        {dev.is_current && (
                          <span className="text-[10px] bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                            Current Machine
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-mono text-[#666666] truncate max-w-md">
                        HWID: {dev.hardware_id} · Activated {dev.activated_at}
                      </p>
                    </div>

                    {!dev.is_current && onDeactivateDevice && (
                      <button
                        type="button"
                        onClick={() => onDeactivateDevice(dev.hardware_id)}
                        className="text-xs text-red-400 hover:text-red-300 font-semibold px-3 py-1.5 rounded-lg border border-red-900/40 hover:bg-red-950/40 transition-colors cursor-pointer self-start sm:self-auto"
                      >
                        Deactivate Slot
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* License Activation Form DOWN BELOW (Clean & Short) */}
          <div className="rounded-2xl border border-[#2E2E2E] bg-[#181818] p-5 space-y-3">
            <h4 className="text-sm font-semibold text-white">Activate Product Key</h4>
            <form onSubmit={handleActivate} className="flex flex-col sm:flex-row gap-3">
              <input
                id="licenseKeyInput"
                type="text"
                value={licenseInput}
                onChange={(e) => setLicenseInput(e.target.value.toUpperCase())}
                placeholder="TM-XXXX-XXXX-XXXX"
                disabled={activating}
                className="flex-1 h-11 px-4 rounded-xl bg-[#121212] border border-[#2E2E2E] text-sm text-white placeholder-[#555555] focus:outline-none focus:border-brand-red font-mono"
              />
              <Button
                type="submit"
                variant="default"
                size="default"
                loading={activating}
                disabled={!licenseInput.trim()}
                icon={ShieldCheck}
                className="h-11 px-6 font-semibold text-xs shrink-0"
              >
                Activate Key
              </Button>
            </form>
          </div>

          {/* Minimal Hardware ID Row at Bottom */}
          <div className="rounded-2xl border border-[#262626] bg-[#161616] p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[#888888] font-medium min-w-0">
              <Cpu className="w-4 h-4 shrink-0 text-[#666666]" />
              <span className="shrink-0">Hardware ID:</span>
              <span className="font-mono text-[#CCCCCC] truncate text-xs">{license.hardware_id}</span>
            </div>
            <button
              onClick={handleCopyHwid}
              className="inline-flex items-center gap-1.5 text-xs text-[#888888] hover:text-white transition-colors cursor-pointer shrink-0"
            >
              {copiedHwid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedHwid ? 'Copied' : 'Copy HWID'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Usage Analytics (Clean, Concise, No Doubt-Inducing Texts) */}
      {activeTab === 'usage' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="rounded-2xl border border-[#282828] bg-[#181818] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">
                {usage.quota_period === 'week' ? 'Weekly Playlist Limit (3 / Week)' : 'Daily Merging Limit'}
              </h3>
              <span className="text-xs text-[#777777]">
                Resets in {usage.quota_period === 'week' ? `${Math.max(1, Math.ceil(usage.quota_reset_in_hours / 24))} days` : `${usage.quota_reset_in_hours} hours`}
              </span>
            </div>

            {/* Quota Progress Meter */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#888888]">
                  {usage.quota_period === 'week' ? 'Playlists Merged This Week' : 'Requests Used Today'}
                </span>
                <span className="text-white font-semibold">
                  {usage.requests_today} / {usage.daily_quota} ({quotaPercent}%)
                </span>
              </div>
              <div className="w-full bg-[#121212] rounded-full h-2.5 overflow-hidden border border-[#242424]">
                <div
                  className="bg-brand-red h-full rounded-full transition-all duration-300"
                  style={{ width: `${quotaPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
