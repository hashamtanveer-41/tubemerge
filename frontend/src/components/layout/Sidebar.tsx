import React from 'react';
import { LayoutGrid, ListVideo, Clock, User, Download, Music, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAdmin?: boolean;
}

export function Sidebar({ activeTab, onTabChange, isAdmin = false }: SidebarProps) {
  const navItems = [
    { id: 'merge', label: 'Merge Playlists', icon: LayoutGrid },
    { id: 'queues', label: 'Merge Queues', icon: ListVideo },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'account', label: 'Account', icon: User },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin Console', icon: ShieldAlert, badge: 'ADMIN' }] : []),
  ];

  return (
    <aside className="w-56 bg-[#0F0F0F] border-r border-[#212121] flex flex-col justify-between py-4 px-2 shrink-0 select-none">
      {/* Primary Navigation */}
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer text-left',
                isActive
                  ? 'bg-[#212121] text-white border-l-4 border-[#FF0000] font-semibold pl-2.5'
                  : 'text-[#AAAAAA] hover:bg-[#181818] hover:text-white'
              )}
            >
              <div className="flex items-center space-x-3">
                <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-[#FF0000]' : item.id === 'admin' ? 'text-red-400' : 'text-[#888888]')} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] font-black tracking-wider bg-brand-red text-white px-1.5 py-0.5 rounded shadow-sm">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Upcoming Tools Section */}
      <div className="pt-4 border-t border-[#212121] px-2 space-y-2">
        <p className="text-[10px] uppercase font-bold tracking-wider text-[#666666]">
          Upcoming Tools
        </p>
        <div className="flex items-center space-x-2.5 text-xs text-[#777777] py-1.5 px-1">
          <Download className="w-3.5 h-3.5 text-[#555555]" />
          <span>Batch Downloader</span>
        </div>
        <div className="flex items-center space-x-2.5 text-xs text-[#777777] py-1.5 px-1">
          <Music className="w-3.5 h-3.5 text-[#555555]" />
          <span>Audio Ripper</span>
        </div>
      </div>
    </aside>
  );
}
