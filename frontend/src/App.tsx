import React, { Suspense } from 'react';
import { useMergeApp } from '@/hooks/useMergeApp';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { DiscoveryView } from '@/views/DiscoveryView';
import { EmptyStateView } from '@/views/EmptyStateView';
import { ProfileView } from '@/views/ProfileView';
import { HistoryView } from '@/views/HistoryView';
import { QueuesView } from '@/views/QueuesView';
import { ProgressSpotlight } from '@/components/merge/ProgressSpotlight';
import { SuccessModal } from '@/components/merge/SuccessModal';
import { FloatingActionBar } from '@/components/merge/FloatingActionBar';
import { AuthModal } from '@/components/auth/AuthModal';
import { Toast } from '@/components/ui/toast';
import { Spinner } from '@/components/ui/spinner';

// Compile-time feature flag: completely stripped in client release builds
const ENABLE_ADMIN = import.meta.env.VITE_ENABLE_ADMIN === 'true';

const AdminView = ENABLE_ADMIN
  ? React.lazy(() => import('@/views/AdminView').then((m) => ({ default: m.AdminView })))
  : null;

export function App() {
  const app = useMergeApp();

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-theme-base text-content-primary font-sans">
      <Header
        onSearch={app.searchPlaylist}
        loading={app.fetching}
        user={app.profile}
        onSignInClick={() => app.setIsAuthModalOpen(true)}
        onAccountClick={() => app.setActiveTab('account')}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeTab={app.activeTab}
          onTabChange={app.setActiveTab}
          isAdmin={ENABLE_ADMIN && (app.profile?.role === 'admin' || app.profile?.email === 'admin@tubemerge.com')}
        />

        <main className="flex-1 overflow-y-auto p-6 space-y-6 pb-32">
          {/* Account Profile View */}
          {app.activeTab === 'account' && (
            <ProfileView
              profile={app.profile}
              license={app.license}
              usage={app.usage}
              activeDevices={app.activeDevices}
              onActivateKey={app.activateLicense}
              onDeactivateKey={app.deactivateLicense}
              onDeactivateDevice={app.handleDeactivateDevice}
              onSignInClick={() => app.setIsAuthModalOpen(true)}
              onSignOutClick={app.handleLogout}
              onNavigateToAdmin={() => app.setActiveTab('admin')}
              onBackToMerge={() => app.setActiveTab('merge')}
              showToast={app.showToast}
            />
          )}

          {/* Merge History View */}
          {app.activeTab === 'history' && (
            <HistoryView
              onReMerge={(url) => {
                app.searchPlaylist(url);
                app.setActiveTab('merge');
              }}
              onNavigateToMerge={() => app.setActiveTab('merge')}
            />
          )}

          {/* Merge Queues View */}
          {app.activeTab === 'queues' && (
            <QueuesView
              onStartMergeUrl={(url) => {
                app.searchPlaylist(url);
                app.setActiveTab('merge');
              }}
            />
          )}

          {/* Administrator Console View (Exempt from client distribution) */}
          {ENABLE_ADMIN && AdminView && app.activeTab === 'admin' && (app.profile?.role === 'admin' || app.profile?.email === 'admin@tubemerge.com') && (
            <Suspense fallback={<div className="p-8 text-center text-xs text-[#888888]">Loading Admin Portal…</div>}>
              <AdminView showToast={app.showToast} />
            </Suspense>
          )}

          {/* Merge Pipeline Workspace Views */}
          {app.activeTab === 'merge' && (
            <>
              {app.isMerging && (
                app.progress ? (
                  <ProgressSpotlight progress={app.progress} selectedClips={app.selectedClips} onCancel={app.cancelMerge} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-96 space-y-4 animate-in fade-in duration-150">
                    <Spinner size="lg" variant="red" />
                    <div className="text-center space-y-1">
                      <p className="text-base font-semibold text-content-primary">
                        Starting Merge Pipeline…
                      </p>
                      <p className="text-xs text-content-muted">
                        Allocating encoder processes and preparing workspace.
                      </p>
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
                />
              )}

              {!app.isMerging && !app.outputFile && !app.playlist && (
                <EmptyStateView
                  fetching={app.fetching}
                  onSearch={app.searchPlaylist}
                  onUpgradeClick={() => app.setActiveTab('account')}
                />
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
        />
      )}

      {/* Floating Modern Toast Notification */}
      <Toast toast={app.toast} onDismiss={app.dismissToast} />

      {/* Supabase Cloud Authentication Modal */}
      <AuthModal
        isOpen={app.isAuthModalOpen}
        onClose={() => app.setIsAuthModalOpen(false)}
        onSuccess={app.onAuthSuccess}
      />
    </div>
  );
}
