import React, { useState } from 'react';
import { Search, Settings, Bell } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Avatar } from '@/components/ui/avatar';

interface HeaderProps {
  onSearch: (url: string) => void;
  loading: boolean;
  onAccountClick?: () => void;
}

export function Header({ onSearch, loading, onAccountClick }: HeaderProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && !loading) {
      onSearch(url.trim());
    }
  };

  return (
    <header className="h-16 bg-theme-base border-b border-stroke-subtle px-6 flex items-center justify-between shrink-0 select-none">
      {/* Brand */}
      <div className="flex items-center space-x-3 w-64 shrink-0">
        <img
          src="/assets/logo.png"
          alt="TubeMerge"
          className="w-9 h-9 rounded-full object-cover border border-stroke-light shrink-0"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div>
          <h1 className="text-lg font-black tracking-tight leading-none text-content-primary">
            <span className="text-brand-red">T</span>ubeMerge
          </h1>
          <p className="text-[9px] uppercase tracking-widest text-content-secondary mt-0.5 font-medium">
            YouTube Playlist Merger
          </p>
        </div>
      </div>

      {/* URL Input Form */}
      <form onSubmit={handleSubmit} className="flex-1 max-w-2xl px-4">
        <div className="relative flex items-center w-full">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
            placeholder="Paste YouTube Playlist URL…"
            className="w-full h-10 pl-5 pr-14 rounded-full bg-theme-input border border-stroke-light text-sm text-content-primary placeholder-content-muted focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="absolute right-1.5 h-7 w-10 bg-theme-elevated hover:bg-theme-hover active:bg-theme-panel rounded-full flex items-center justify-center text-content-secondary hover:text-content-primary transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          >
            {loading ? <Spinner size="sm" variant="red" /> : <Search className="w-3.5 h-3.5" />}
          </button>
        </div>
      </form>

      {/* Clean Right Controls: Settings, Notifications, Profile Avatar (No Pill Buttons) */}
      <div className="flex items-center space-x-3 w-64 justify-end shrink-0">
        <button
          type="button"
          aria-label="Settings"
          className="w-9 h-9 rounded-full bg-theme-surface hover:bg-theme-hover border border-stroke-subtle flex items-center justify-center text-content-secondary hover:text-content-primary transition-colors cursor-pointer"
        >
          <Settings className="w-4 h-4" />
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="w-9 h-9 rounded-full bg-theme-surface hover:bg-theme-hover border border-stroke-subtle flex items-center justify-center text-content-secondary hover:text-content-primary transition-colors relative cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-brand-red absolute top-2 right-2 border-2 border-theme-base" />
        </button>

        <Avatar size="md" onClick={onAccountClick} title="Open Account & Profile" />
      </div>
    </header>
  );
}
