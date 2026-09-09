import React, { useState, useEffect, useCallback } from 'react';
import { useMergeApp } from '@/hooks/useMergeApp';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { DiscoveryView } from '@/views/DiscoveryView';
import { EmptyStateView } from '@/views/EmptyStateView';
import { HistoryView } from '@/views/HistoryView';
import { QueuesView } from '@/views/QueuesView';
import { ProgressSpotlight } from '@/components/merge/ProgressSpotlight';
import { SuccessModal } from '@/components/merge/SuccessModal';
import { FloatingActionBar } from '@/components/merge/FloatingActionBar';
import { Toast } from '@/components/ui/toast';
import { Spinner } from '@/components/ui/spinner';
import { NoInternetModal } from '@/components/updates/NoInternetModal';
import { ForceUpdateModal } from '@/components/updates/ForceUpdateModal';
import { UpdateBanner } from '@/components/updates/UpdateBanner';
import { checkForUpdates, UpdateCheckResult } from '@/services/api';
import { UpdateInfo } from '@/types';

// ---------------------------------------------------------------------------
// Startup check state machine
// ---------------------------------------------------------------------------
type StartupState =
  | 'checking'   // Running connectivity + update check
  | 'offline'    // No internet detected
  | 'update'     // Forced major update required
  | 'ready';     // All checks passed — show workspace

export function App() {
  const app = useMergeApp();

  const [startupState, setStartupState] = useState<StartupState>('checking');
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);

  // ── Run startup checks ─────────────────────────────────────────────────
  const runChecks = useCallback(async (): Promise<boolean> => {
    setStartupState('checking');

    // 1. If the operating system network adapter is offline, report offline immediately
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      setStartupState('offline');
      return false;
    }

    // 2. Query backend connectivity & update service
    const result: UpdateCheckResult = await checkForUpdates();

    // 3. If backend probe failed, verify whether browser itself can reach the web
    if (!result.online) {
      let browserOnline = false;
      try {
        await fetch('https://www.google.com/generate_204', {
          mode: 'no-cors',
          cache: 'no-store',
          signal: AbortSignal.timeout(2500),
        });
        browserOnline = true;
      } catch {
        // Probe failed, device is truly offline
      }

      if (!browserOnline) {
        setStartupState('offline');
        return false;
      }
    }

    const info = result.update_info;
    setUpdateInfo(info);

    if (info?.is_force_update) {
      setStartupState('update');
      return false;
    }

    setStartupState('ready');
    return true;
  }, []);

  useEffect(() => {
    runChecks();
  }, [runChecks]);

  // Callback for the NoInternetModal "Try Again" button
  const handleRetry = useCallback(async (): Promise<boolean> => {
    return runChecks();
  }, [runChecks]);

  // ── Startup screens ────────────────────────────────────────────────────
  if (startupState === 'checking') {
    return (
      <div className="fixed inset-0 bg-[#0A0A0A] flex flex-col items-center justify-center gap-4">
        <img
          src="/assets/logo.png"
          alt="TubeMerger"
          className="w-12 h-12 rounded-full object-cover opacity-70"
          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
        />
        <Spinner size="sm" variant="red" />
        <p className="text-[13px] text-[#444444]">Starting TubeMerger…</p>
      </div>
    );
  }

  if (startupState === 'offline') {
    return <NoInternetModal onRetry={handleRetry} />;
  }

  if (startupState === 'update' && updateInfo) {
    return <ForceUpdateModal updateInfo={updateInfo} />;
  }

  // ── Main workspace ─────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-theme-base text-content-primary font-sans">
      <Header
        onSearch={app.searchPlaylist}
        loading={app.fetching}
      />

      {/* Optional update banner for minor/patch updates */}
      {updateInfo?.update_available && !updateInfo.is_force_update && (
        <UpdateBanner updateInfo={updateInfo} />
      )}

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeTab={app.activeTab}
          onTabChange={app.setActiveTab}
          updateInfo={updateInfo}
        />

        <main className="flex-1 overflow-y-auto p-6 space-y-6 pb-32">
          {/* History */}
          {app.activeTab === 'history' && (
            <HistoryView
              onReMerge={(url) => { app.searchPlaylist(url); app.setActiveTab('merge'); }}
              onNavigateToMerge={() => app.setActiveTab('merge')}
            />
          )}

          {/* Queues */}
          {app.activeTab === 'queues' && (
            <QueuesView
              onStartMergeUrl={(url) => {
                if (app.isMerging) return;
                app.searchPlaylist(url);
                app.setActiveTab('merge');
              }}
              isMerging={app.isMerging}
              activeUrl={app.playlist?.webpage_url}
            />
          )}

          {/* Merge workspace */}
          {app.activeTab === 'merge' && (
            <>
              {app.isMerging && (
                app.progress ? (
                  <ProgressSpotlight
                    progress={app.progress}
                    selectedClips={app.selectedClips}
                    onCancel={app.cancelMerge}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-96 space-y-4">
                    <Spinner size="lg" variant="red" />
                    <div className="text-center space-y-1">
                      <p className="text-base font-semibold text-content-primary">Starting Merge Pipeline…</p>
                      <p className="text-xs text-content-muted">Allocating encoder processes and preparing workspace.</p>
                    </div>
                  </div>
                )
              )}

              {!app.isMerging && app.outputFile && (
                <SuccessModal outputFile={app.outputFile} onReset={app.reset} />
              )}

              {!app.isMerging && !app.outputFile && app.playlist && (
                <DiscoveryView
                  playlist={app.playlist}
                  selectedIndices={app.selectedIndices}
                  onToggle={app.toggleIndex}
                  onSelectAll={app.selectAll}
                  onDeselectAll={app.deselectAll}
                  mergeVideos={app.mergeVideos}
                  onToggleMergeVideos={app.setMergeVideos}
                  quality={app.quality}
                  onQualityChange={app.setQuality}
                />
              )}

              {!app.isMerging && !app.outputFile && !app.playlist && (
                <EmptyStateView />
              )}
            </>
          )}
        </main>
      </div>

      {app.showActionBar && (
        <FloatingActionBar
          selectedCount={app.selectedIndices.size}
          onMerge={app.startMerge}
          onClear={app.deselectAll}
          loading={app.isMerging}
          mergeVideos={app.mergeVideos}
        />
      )}

      <Toast toast={app.toast} onDismiss={app.dismissToast} />
    </div>
  );
}
