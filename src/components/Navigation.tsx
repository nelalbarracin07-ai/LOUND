import React from 'react';
import {
  Compass,
  Plus,
  Repeat,
  User,
  MessageCircle,
  Bell,
  Sparkles,
  Layers,
  Award,
  ShieldAlert,
  Flame
} from 'lucide-react';
import { User as UserType } from '../types';

export type NavTab = 'home' | 'explore' | 'post' | 'swap' | 'profile' | 'finder_hub';

interface NavigationProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  currentUser: UserType;
  unreadMessagesCount: number;
  unreadNotifsCount: number;
  onOpenMessages: () => void;
  onOpenNotifications: () => void;
  onOpenPremium: () => void;
  onOpenAdmin: () => void;
}

export const TopBar: React.FC<NavigationProps> = ({
  currentTab,
  onTabChange,
  currentUser,
  unreadMessagesCount,
  unreadNotifsCount,
  onOpenMessages,
  onOpenNotifications,
  onOpenPremium,
  onOpenAdmin
}) => {
  return (
    <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div
          onClick={() => onTabChange('home')}
          className="flex items-baseline gap-2.5 cursor-pointer shrink-0 select-none group"
        >
          <span className="text-xl font-black tracking-tight text-white group-hover:opacity-90 transition-opacity">
            LOUND
          </span>
          <span className="hidden sm:inline text-[11px] font-medium text-neutral-400 tracking-wide">
            Lost. Found. Reunited.
          </span>
        </div>

        {/* Center / Actions Zone */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Finder Community Quick Button */}
          <button
            onClick={() => onTabChange('finder_hub')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border ${
              currentTab === 'finder_hub'
                ? 'bg-white text-black border-white shadow-sm'
                : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:text-white hover:border-neutral-700'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Finder Hub ($ Rewards)</span>
            <span className="md:hidden">Rewards</span>
          </button>

          {/* Premium VIP status / Upgrade button */}
          {!currentUser.isPremium ? (
            <button
              onClick={onOpenPremium}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-[11px] font-extrabold uppercase rounded-full bg-neutral-900 border border-neutral-700 hover:border-white text-white transition-colors"
            >
              <Sparkles className="w-3 h-3 text-white" />
              <span>Premium $5</span>
            </button>
          ) : (
            <div
              onClick={onOpenPremium}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-full bg-white text-black cursor-pointer shadow"
            >
              <Sparkles className="w-3 h-3" />
              <span>VIP</span>
            </div>
          )}

          {/* Messages Trigger */}
          <button
            onClick={onOpenMessages}
            className="relative w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
            title="Messages"
          >
            <MessageCircle className="w-4 h-4" />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-black font-extrabold text-[9px] rounded-full flex items-center justify-center shadow">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          {/* Notifications Trigger */}
          <button
            onClick={onOpenNotifications}
            className="relative w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-black font-extrabold text-[9px] rounded-full flex items-center justify-center shadow">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* User Mini Avatar */}
          <div
            onClick={() => onTabChange('profile')}
            className="cursor-pointer pl-1 shrink-0"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-neutral-700 hover:border-white transition-colors"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export const BottomNav: React.FC<{
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenPostWizard: () => void;
}> = ({ currentTab, onTabChange, onOpenPostWizard }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-md border-t border-neutral-800 h-16 max-w-lg mx-auto sm:max-w-none">
      <div className="max-w-md mx-auto h-full grid grid-cols-5 items-center px-2">
        {/* 1. HOME */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentTab === 'home' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          <Flame className={`w-5 h-5 ${currentTab === 'home' ? 'fill-white' : ''}`} />
          <span className="text-[10px] font-bold tracking-tight mt-1">HOME</span>
        </button>

        {/* 2. EXPLORE */}
        <button
          onClick={() => onTabChange('explore')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentTab === 'explore' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          <Compass className={`w-5 h-5 ${currentTab === 'explore' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] font-bold tracking-tight mt-1">EXPLORE</span>
        </button>

        {/* 3. POST (+) Center Prominent Button */}
        <button
          onClick={onOpenPostWizard}
          className="flex flex-col items-center justify-center group"
          title="Publish Lost or Found Listing"
        >
          <div className="w-11 h-11 rounded-2xl bg-white text-black flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform active:scale-95">
            <Plus className="w-6 h-6 stroke-[3]" />
          </div>
          <span className="text-[9px] font-black tracking-tight text-white mt-0.5">POST</span>
        </button>

        {/* 4. SWAP */}
        <button
          onClick={() => onTabChange('swap')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentTab === 'swap' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          <Repeat className={`w-5 h-5 ${currentTab === 'swap' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] font-bold tracking-tight mt-1">SWAP</span>
        </button>

        {/* 5. PROFILE */}
        <button
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentTab === 'profile' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          <User className={`w-5 h-5 ${currentTab === 'profile' ? 'fill-white' : ''}`} />
          <span className="text-[10px] font-bold tracking-tight mt-1">PROFILE</span>
        </button>
      </div>
    </nav>
  );
};
