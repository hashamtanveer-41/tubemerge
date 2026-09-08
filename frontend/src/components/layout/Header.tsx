import React, { useState } from 'react';
import { Search, Github } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

const GITHUB_URL = 'https://github.com/hashamtanveer-41/tubemerge';

interface HeaderProps {
  onSearch: (url: string) => void;
  loading: boolean;
}

export function Header({ onSearch, loading }: HeaderProps) {
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
          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
        />
        <div>
          <h1 className="text-lg font-black tracking-tight leading-none text-content-primary">
            <span className="text-brand-red">T</span>ubeMerge
          </h1>
          <p className="text-[9px] uppercase tracking-widest text-content-secondary mt-0.5 font-medium">
            Free & Open Source
          </p>
        </div>
      </div>

      {/* URL Input */}
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

      {/* GitHub Star button — replaces auth/sign-in */}
      <div className="flex items-center justify-end w-64 shrink-0">
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 h-9 px-4 rounded-full bg-[#1A1A1A] hover:bg-[#252525] border border-[#333333] hover:border-[#555555] text-[#AAAAAA] hover:text-white text-xs font-semibold transition-all"
        >
          <Github className="w-3.5 h-3.5" />
          <span>⭐ Star on GitHub</span>
        </a>
      </div>
    </header>
  );
}
