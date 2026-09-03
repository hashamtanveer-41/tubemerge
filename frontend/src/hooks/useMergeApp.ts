import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Playlist, HealthStatus, ProgressEvent, UserProfile, LicenseInfo, UsageMetrics } from '@/types';
import { ToastData } from '@/components/ui/toast';

export function useMergeApp() {
  const [activeTab, setActiveTab] = useState('merge');
  const [health, setHealth] = useState<HealthStatus | null>(null);

  const [fetching, setFetching] = useState(false);
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState<ToastData | null>(null);

  const [isMerging, setIsMerging] = useState(false);
  const [progress, setProgress] = useState<ProgressEvent | null>(null);
  const [outputFile, setOutputFile] = useState<string | null>(null);

  // Profile, License & Usage Telemetry State
  const [profile, setProfile] = useState<UserProfile>({
    id: 'usr_creator_01',
    name: 'TubeMerge Creator',
    email: 'creator@videoplaylistmerger.com',
    handle: '@creator.tubemerge',
    created_at: 'Sep 2026',
  });

  const [license, setLicense] = useState<LicenseInfo>({
    status: 'active',
    plan_tier: 'PRO',
    license_key: 'TM-PRO-8842-7719-2026',
    expires_at: 'Lifetime License',
    hardware_id: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    max_devices: 3,
    active_devices: 1,
  });

  const [usage, setUsage] = useState<UsageMetrics>({
    requests_today: 4,
    daily_quota: 100,
    total_lifetime_merges: 18,
    total_minutes_processed: 142,
    quota_reset_in_hours: 14,
  });

  useEffect(() => {
    api.getHealth().then(setHealth).catch(() => {});
    api.getLicenseStatus().then(setLicense).catch(() => {});
    api.getAccountUsage().then(setUsage).catch(() => {});
    api.getUserProfile().then(setProfile).catch(() => {});
  }, []);

  const showToast = (message: string, type: 'error' | 'success' | 'info' = 'error') => {
    setToast({ message, type });
  };

  const dismissToast = () => {
    setToast(null);
  };

  const recordRequest = () => {
    setUsage((prev) => ({
      ...prev,
      requests_today: prev.requests_today + 1,
    }));
  };

  const searchPlaylist = async (url: string) => {
    setFetching(true);
    setToast(null);
    setOutputFile(null);
    setProgress(null);
    recordRequest();

    try {
      const data = await api.fetchPlaylist(url);
      setPlaylist(data);
      setSelectedIndices(new Set(data.entries.map((_, i) => i)));
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch playlist.', 'error');
    } finally {
      setFetching(false);
    }
  };

  const toggleIndex = (index: number) => {
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const selectAll = () => {
    if (!playlist) return;
    setSelectedIndices(new Set(playlist.entries.map((_, i) => i)));
  };

  const deselectAll = () => {
    setSelectedIndices(new Set());
  };

  const startMerge = async () => {
    if (!playlist || selectedIndices.size === 0) return;

    const sortedClips = Array.from(selectedIndices)
      .sort((a, b) => a - b)
      .map((i) => playlist.entries[i])
      .filter(Boolean);

    setIsMerging(true);
    setToast(null);
    recordRequest();

    setProgress({
      status: 'fetching',
      current_item: 1,
      total_items: sortedClips.length,
      current_video_title: sortedClips[0]?.title || 'Preparing merge pipeline…',
      overall_percent: 0,
      message: 'Initializing merge pipeline…',
    });

    try {
      await api.startMerge({
        url: playlist.webpage_url,
        selected_indices: Array.from(selectedIndices).sort((a, b) => a - b),
      });

      const disconnect = api.connectProgress(
        (event) => {
          setProgress(event);
          if (event.status === 'done') {
            setIsMerging(false);
            if (event.output_file) {
              setOutputFile(event.output_file);
              setUsage((prev) => ({
                ...prev,
                total_lifetime_merges: prev.total_lifetime_merges + 1,
              }));
              showToast('Merge completed successfully!', 'success');
            }
            disconnect();
          } else if (event.status === 'error' || event.status === 'cancelled') {
            setIsMerging(false);
            if (event.error) {
              showToast(event.error, 'error');
            }
            disconnect();
          }
        },
        () => setIsMerging(false)
      );
    } catch (err: any) {
      setIsMerging(false);
      showToast(err.message || 'Failed to start merge pipeline.', 'error');
    }
  };

  const cancelMerge = async () => {
    await api.cancelMerge();
    setIsMerging(false);
    setProgress(null);
    showToast('Merge cancelled.', 'info');
  };

  const activateLicense = async (key: string): Promise<boolean> => {
    try {
      const updated = await api.activateLicense(key);
      setLicense(updated);
      const updatedUsage = await api.getAccountUsage();
      setUsage(updatedUsage);
      return true;
    } catch {
      return false;
    }
  };

  const deactivateLicense = async (): Promise<boolean> => {
    try {
      const updated = await api.deactivateLicense();
      setLicense(updated);
      const updatedUsage = await api.getAccountUsage();
      setUsage(updatedUsage);
      return true;
    } catch {
      return false;
    }
  };

  const reset = () => {
    setPlaylist(null);
    setSelectedIndices(new Set());
    setProgress(null);
    setOutputFile(null);
    setToast(null);
  };

  const selectedClips = playlist
    ? Array.from(selectedIndices)
        .sort((a, b) => a - b)
        .map((i) => playlist.entries[i])
        .filter(Boolean)
    : [];

  const showActionBar = !isMerging && !outputFile && Boolean(playlist) && activeTab === 'merge';

  return {
    activeTab,
    setActiveTab,
    health,
    fetching,
    playlist,
    selectedIndices,
    toast,
    showToast,
    dismissToast,
    isMerging,
    progress,
    outputFile,
    selectedClips,
    showActionBar,
    profile,
    license,
    usage,
    activateLicense,
    deactivateLicense,
    searchPlaylist,
    toggleIndex,
    selectAll,
    deselectAll,
    startMerge,
    cancelMerge,
    reset,
  };
}
