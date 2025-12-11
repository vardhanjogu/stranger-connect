import React from 'react';
import { AppState } from '../types';

interface HeaderProps {
  appState: AppState;
  onLeaveChat: () => void;
  onLogoClick: () => void;
  onlineCount: number;
}

export const Header: React.FC<HeaderProps> = ({ appState, onLeaveChat, onLogoClick, onlineCount }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-darker/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 z-50">
      <button 
        onClick={onLogoClick}
        className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none"
        aria-label="Go to Home"
      >
        {/* Custom SVG Logo to replace broken image link */}
        <div className="h-10 w-auto aspect-[1.8/1] relative">
            <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                <defs>
                    <linearGradient id="logo_grad_1" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                    <linearGradient id="logo_grad_2" x1="40" y1="0" x2="100" y2="60" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                </defs>
                {/* Left Bubble (Pink/Purple) */}
                <path d="M5 30C5 16.2 16.2 5 30 5C43.8 5 55 16.2 55 30C55 43.8 43.8 55 30 55C26 55 22.5 54 19 52L5 57L9 45C6.5 40.5 5 35.5 5 30Z" fill="url(#logo_grad_1)" />
                {/* Right Bubble (Indigo/Blue) - Intersecting */}
                <path d="M45 30C45 16.2 56.2 5 70 5C83.8 5 95 16.2 95 30C95 35.5 93.5 40.5 91 45L95 57L81 52C77.5 54 74 55 70 55C56.2 55 45 43.8 45 30Z" fill="url(#logo_grad_2)" fillOpacity="0.9" />
                {/* Connection Cutout for clarity */}
                <path d="M55 30C55 36.5 53 42.5 49.5 47.5C51.2 47.8 53.1 48 55 48C64.9 48 73 39.9 73 30C73 20.1 64.9 12 55 12C53.1 12 51.2 12.2 49.5 12.5C53 17.5 55 23.5 55 30Z" fill="white" fillOpacity="0.1" />
            </svg>
        </div>
        <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            StrangerConnect
        </span>
      </button>

      <div className="flex items-center gap-4">
        {appState === AppState.LANDING && (
           <div className="flex items-center gap-2 text-sm text-slate-400">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             {onlineCount.toLocaleString()} online now
           </div>
        )}
        
        {appState === AppState.CHAT && (
          <button 
            onClick={onLeaveChat}
            className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors px-3 py-1 rounded-full hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
          >
            Disconnect
          </button>
        )}
      </div>
    </header>
  );
};