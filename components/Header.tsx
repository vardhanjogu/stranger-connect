import React from 'react';
import { AppState } from '../types';

interface HeaderProps {
  appState: AppState;
  onLeaveChat: () => void;
  onLogoClick: () => void;
  onlineCount: number;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
    appState, 
    onLeaveChat, 
    onLogoClick, 
    onOpenSettings
}) => {
  const isLanding = appState === AppState.LANDING;

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl h-16 glass rounded-full flex items-center justify-between px-6 z-50 transition-all duration-500">
      <button 
        onClick={onLogoClick}
        className="flex items-center gap-3 active:scale-90 transition-transform"
      >
        <div className="w-8 h-8 bg-primary rounded-lg rotate-12 flex items-center justify-center">
            <div className="w-4 h-4 bg-black rounded-sm"></div>
        </div>
        <span className="text-lg font-black uppercase italic tracking-tighter text-white">
            SC
        </span>
      </button>

      <div className="flex items-center gap-4">
        {!isLanding && (
            <button 
                onClick={onOpenSettings} 
                className="p-2 text-white/50 hover:text-white transition-colors"
                aria-label="Settings"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
            </button>
        )}
        
        {appState === AppState.CHAT && (
          <button 
            onClick={onLeaveChat}
            className="bg-red-500/10 text-red-500 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-red-500/20 active:scale-90 transition-transform"
          >
            Ghost
          </button>
        )}
      </div>
    </header>
  );
};