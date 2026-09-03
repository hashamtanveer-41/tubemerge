import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  Key,
  Video,
  Cpu,
  RefreshCw,
  Search,
  Check,
  Copy,
  AlertCircle,
  Clock,
  PlusCircle,
  Trash2,
  Lock,
  Layers,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api';
import { AdminStats, AdminUser, AdminLicense, AdminUsageEvent } from '../types';
import { Button } from '@/components/ui/button';

interface AdminViewProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function AdminView({ showToast }: AdminViewProps) {
  const [activeTab, setActiveTab] = useState<'creators' | 'licenses' | 'billing'>('creators');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Data states
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [licenses, setLicenses] = useState<AdminLicense[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminUsageEvent[]>([]);

  // Filter & search states
  const [userSearch, setUserSearch] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Key Generator form state
  const [genTier, setGenTier] = useState('CREATOR_PRO');
  const [genMaxDevices, setGenMaxDevices] = useState(2);
  const [genUserEmail, setGenUserEmail] = useState('');
  const [generatingKey, setGeneratingKey] = useState(false);

  const fetchAllData = async () => {
    try {
      setRefreshing(true);
      const [statsData, usersData, licensesData, auditData] = await Promise.all([
        api.adminGetStats().catch(() => null),
        api.adminGetUsers(userSearch).catch(() => []),
        api.adminGetLicenses().catch(() => []),
        api.adminGetAuditLog(50).catch(() => []),
      ]);

      if (statsData) setStats(statsData);
      setUsers(usersData);
      setLicenses(licensesData);
      setAuditLogs(auditData);
    } catch (err: any) {
      showToast(err.message || 'Failed to refresh admin data', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [userSearch]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    showToast('Copied to clipboard!', 'info');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleUpdateTier = async (userId: string, currentTier: string) => {
    const nextTier = currentTier === 'COMMUNITY' ? 'CREATOR_PRO' : currentTier === 'CREATOR_PRO' ? 'LIFETIME' : 'COMMUNITY';
    try {
      await api.adminUpdateUserTier(userId, nextTier);
      showToast(`User upgraded to ${nextTier}`, 'success');
      fetchAllData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update user tier', 'error');
    }
  };

  const handleResetDevices = async (userId: string) => {
    if (!confirm('Clear all bound workstations for this user? They will be able to re-link machines.')) return;
    try {
      await api.adminResetDevices(userId);
      showToast('Bound workstations cleared successfully', 'success');
      fetchAllData();
    } catch (err: any) {
      showToast(err.message || 'Failed to reset workstations', 'error');
    }
  };

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratingKey(true);
    try {
      const newKey = await api.adminGenerateLicense({
        tier: genTier,
        max_devices: genMaxDevices,
        user_email: genUserEmail.trim() || undefined,
      });
      showToast(`Key generated: ${newKey.license_key}`, 'success');
      setGenUserEmail('');
      fetchAllData();
    } catch (err: any) {
      showToast(err.message || 'Failed to generate key', 'error');
    } finally {
      setGeneratingKey(false);
    }
  };

  const handleRevokeKey = async (licenseKey: string) => {
    if (!confirm(`Revoke license key ${licenseKey}? Bound workstations will lose access.`)) return;
    try {
      await api.adminRevokeLicense(licenseKey);
      showToast(`License ${licenseKey} revoked`, 'info');
      fetchAllData();
    } catch (err: any) {
      showToast(err.message || 'Failed to revoke license', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#1A0A0A] to-[#141414] border border-[#2D1616] p-6 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-red/15 border border-brand-red/30 flex items-center justify-center text-brand-red">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Administrator Console</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-brand-red text-white uppercase shadow-sm">
              Admin Portal
            </span>
          </div>
          <p className="text-xs text-[#888888]">
            Master controls for accounts, license key generation, node-lock device slots, and billing audits.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchAllData}
          loading={refreshing}
          icon={RefreshCw}
          className="shrink-0 text-xs border-[#333333] hover:border-white/40 hover:bg-[#202020]"
        >
          Refresh Telemetry
        </Button>
      </div>

      {/* Top 4 System Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="rounded-xl border border-[#262626] bg-[#161616] p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-[#777777] font-medium">Registered Creators</div>
            <div className="text-2xl font-bold text-white leading-tight">
              {stats?.total_users ?? '—'}
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-xl border border-[#262626] bg-[#161616] p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-[#777777] font-medium">Active Licenses</div>
            <div className="text-2xl font-bold text-white leading-tight">
              {stats?.active_licenses ?? '—'}
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-xl border border-[#262626] bg-[#161616] p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center text-brand-red shrink-0">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-[#777777] font-medium">Merges Processed</div>
            <div className="text-2xl font-bold text-white leading-tight">
              {stats?.total_merges ?? '—'}
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="rounded-xl border border-[#262626] bg-[#161616] p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-[#777777] font-medium">Bound Workstations</div>
            <div className="text-2xl font-bold text-white leading-tight">
              {stats?.active_workstations ?? '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#262626] gap-2">
        <button
          onClick={() => setActiveTab('creators')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'creators'
              ? 'border-brand-red text-white'
              : 'border-transparent text-[#777777] hover:text-[#CCCCCC]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Creators & Accounts ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('licenses')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'licenses'
              ? 'border-brand-red text-white'
              : 'border-transparent text-[#777777] hover:text-[#CCCCCC]'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>License Keys & Generator ({licenses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('billing')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'billing'
              ? 'border-brand-red text-white'
              : 'border-transparent text-[#777777] hover:text-[#CCCCCC]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Live Billing & Request Audit</span>
        </button>
      </div>

      {/* Tab 1: Creators & Accounts */}
      {activeTab === 'creators' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search creators by email, name, or handle..."
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#161616] border border-[#282828] text-xs text-white placeholder-[#666666] focus:outline-none focus:border-brand-red"
              />
            </div>
            <div className="text-xs text-[#666666]">
              Showing <span className="text-white font-medium">{users.length}</span> creators
            </div>
          </div>

          <div className="border border-[#262626] rounded-2xl bg-[#161616] overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1C1C1C] border-b border-[#262626] text-[#888888] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Creator / Account</th>
                    <th className="py-3.5 px-4">Subscription Tier</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Merges</th>
                    <th className="py-3.5 px-4">Workstations</th>
                    <th className="py-3.5 px-4">Joined</th>
                    <th className="py-3.5 px-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222222]">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-[#666666]">
                        No creators match your query.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} className="hover:bg-[#1D1D1D] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white">{u.full_name || 'Creator'}</div>
                          <div className="text-[11px] text-[#888888] font-mono">{u.email}</div>
                          <div className="text-[10px] text-[#555555]">{u.handle}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              u.tier === 'LIFETIME'
                                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                : u.tier === 'CREATOR_PRO' || u.tier === 'PRO'
                                ? 'bg-brand-red/15 text-brand-red border border-brand-red/30'
                                : 'bg-[#262626] text-[#AAAAAA] border border-[#333333]'
                            }`}
                          >
                            {u.tier}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                              u.role === 'admin'
                                ? 'bg-red-950/60 text-red-400 border border-red-800/40'
                                : 'bg-[#222222] text-[#888888]'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-white font-medium">
                          {u.merge_count}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <Cpu className="w-3.5 h-3.5 text-[#666666]" />
                            <span className="font-mono text-white">{u.active_devices_count}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-[#777777]">{u.created_at}</td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleUpdateTier(u.id, u.tier)}
                              className="px-2.5 py-1 rounded-lg bg-[#222222] hover:bg-[#2A2A2A] text-white text-[11px] font-medium border border-[#333333] transition-colors cursor-pointer"
                              title="Rotate through Community -> Pro -> Lifetime"
                            >
                              Cycle Tier
                            </button>
                            <button
                              onClick={() => handleResetDevices(u.id)}
                              className="px-2.5 py-1 rounded-lg bg-red-950/30 hover:bg-red-950/60 text-red-400 text-[11px] font-medium border border-red-900/30 transition-colors cursor-pointer"
                              title="Clear all bound hardware IDs for this creator"
                            >
                              Reset Slots
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Licenses & Key Generator */}
      {activeTab === 'licenses' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Key Generator Card */}
          <div className="rounded-2xl border border-[#2D1616] bg-gradient-to-br from-[#1A0D0D] to-[#161616] p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-brand-red" />
              <h3 className="text-base font-bold text-white">Generate Master License Key</h3>
            </div>
            <p className="text-xs text-[#888888]">
              Issue new cryptographic product keys for offline activations or direct creator binding.
            </p>

            <form onSubmit={handleGenerateKey} className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-[#AAAAAA] mb-1.5 uppercase tracking-wider">
                  Tier Entitlement
                </label>
                <select
                  value={genTier}
                  onChange={(e) => setGenTier(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#121212] border border-[#2E2E2E] text-xs text-white focus:outline-none focus:border-brand-red cursor-pointer"
                >
                  <option value="CREATOR_PRO">Creator Pro (Uncapped)</option>
                  <option value="LIFETIME">Lifetime Hero (Permanent)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#AAAAAA] mb-1.5 uppercase tracking-wider">
                  Max Workstations
                </label>
                <select
                  value={genMaxDevices}
                  onChange={(e) => setGenMaxDevices(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-xl bg-[#121212] border border-[#2E2E2E] text-xs text-white focus:outline-none focus:border-brand-red cursor-pointer"
                >
                  <option value={1}>1 Workstation</option>
                  <option value={2}>2 Workstations (Default)</option>
                  <option value={3}>3 Workstations</option>
                  <option value={5}>5 Workstations</option>
                  <option value={100}>100 Workstations (Enterprise)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#AAAAAA] mb-1.5 uppercase tracking-wider">
                  Assign User Email (Optional)
                </label>
                <input
                  type="email"
                  value={genUserEmail}
                  onChange={(e) => setGenUserEmail(e.target.value)}
                  placeholder="creator@email.com"
                  className="w-full h-10 px-3 rounded-xl bg-[#121212] border border-[#2E2E2E] text-xs text-white placeholder-[#555555] focus:outline-none focus:border-brand-red"
                />
              </div>

              <div className="flex items-end">
                <Button
                  type="submit"
                  variant="default"
                  size="default"
                  loading={generatingKey}
                  icon={Sparkles}
                  className="w-full h-10 font-semibold text-xs"
                >
                  Generate Key
                </Button>
              </div>
            </form>
          </div>

          {/* Licenses Inventory Table */}
          <div className="border border-[#262626] rounded-2xl bg-[#161616] overflow-hidden shadow-lg">
            <div className="p-4 border-b border-[#242424] flex items-center justify-between">
              <h4 className="text-sm font-bold text-white">Issued Product Licenses</h4>
              <span className="text-xs text-[#777777]">{licenses.length} keys total</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1C1C1C] border-b border-[#262626] text-[#888888] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">License Key</th>
                    <th className="py-3.5 px-4">Assigned Creator</th>
                    <th className="py-3.5 px-4">Tier</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Workstations Allocated</th>
                    <th className="py-3.5 px-4">Issued At</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222222]">
                  {licenses.map((lic) => (
                    <tr key={lic.id} className="hover:bg-[#1D1D1D] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-semibold text-white">
                        <div className="flex items-center gap-2">
                          <span>{lic.license_key}</span>
                          <button
                            onClick={() => handleCopy(lic.license_key)}
                            className="text-[#666666] hover:text-white transition-colors cursor-pointer"
                          >
                            {copiedKey === lic.license_key ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[#AAAAAA]">{lic.user_email || 'Unassigned'}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            lic.tier === 'LIFETIME'
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              : 'bg-brand-red/15 text-brand-red border border-brand-red/30'
                          }`}
                        >
                          {lic.tier}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            lic.status === 'active'
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                              : 'bg-red-950/60 text-red-400 border border-red-800/40'
                          }`}
                        >
                          {lic.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-white">
                          {lic.active_devices_count} / {lic.max_devices} slots
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#777777]">{lic.created_at}</td>
                      <td className="py-3.5 px-4 text-right">
                        {lic.status === 'active' && (
                          <button
                            onClick={() => handleRevokeKey(lic.license_key)}
                            className="px-2 py-1 rounded bg-red-950/30 hover:bg-red-950/60 text-red-400 text-[11px] font-medium border border-red-900/30 transition-colors cursor-pointer"
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Live Billing & Request Audit */}
      {activeTab === 'billing' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="rounded-2xl border border-[#282828] bg-[#161616] p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-xs text-[#888888]">
              <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Metered billing events stream directly from Supabase <code className="text-white font-mono">public.user_requests</code>.
              </span>
            </div>
            <div className="text-xs text-[#666666]">
              Audit window: <span className="text-white font-medium">Last 50 Jobs</span>
            </div>
          </div>

          <div className="border border-[#262626] rounded-2xl bg-[#161616] overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1C1C1C] border-b border-[#262626] text-[#888888] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Timestamp</th>
                    <th className="py-3.5 px-4">Creator Email</th>
                    <th className="py-3.5 px-4">Request Type</th>
                    <th className="py-3.5 px-4">Videos Merged</th>
                    <th className="py-3.5 px-4">Duration</th>
                    <th className="py-3.5 px-4">Workstation HWID</th>
                    <th className="py-3.5 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222222]">
                  {auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-[#666666]">
                        No billable merge requests recorded yet.
                      </td>
                    </tr>
                  ) : (
                    auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-[#1D1D1D] transition-colors">
                        <td className="py-3.5 px-4 text-[#AAAAAA] whitespace-nowrap">{log.created_at}</td>
                        <td className="py-3.5 px-4 font-medium text-white">{log.user_email}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#222222] text-amber-300">
                            {log.request_type}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-white">{log.video_count} clips</td>
                        <td className="py-3.5 px-4 font-mono text-[#888888]">
                          {log.duration_seconds > 0 ? `${Math.round(log.duration_seconds / 60)} min` : '< 1 min'}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[10px] text-[#666666]">
                          {log.hardware_id ? `${log.hardware_id.slice(0, 16)}…` : 'N/A'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
