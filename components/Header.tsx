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
    onlineCount,
    onOpenSettings
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 z-50 transition-colors duration-500">
      <button 
        onClick={onLogoClick}
        className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none"
        aria-label="Go to Home"
      >
        {/* Custom SVG Logo */}
        <div className="h-10 w-auto aspect-[1.8/1] relative">
            <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                <defs>
                    <linearGradient id="logo_grad_1" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="var(--secondary-color)" />
                        <stop offset="100%" stopColor="var(--primary-color)" />
                    </linearGradient>
                    <linearGradient id="logo_grad_2" x1="40" y1="0" x2="100" y2="60" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="var(--primary-color)" />
                        <stop offset="100%" stopColor="var(--secondary-color)" />
                    </linearGradient>
                </defs>
                <path d="M5 30C5 16.2 16.2 5 30 5C43.8 5 55 16.2 55 30C55 43.8 43.8 55 30 55C26 55 22.5 54 19 52L5 57L9 45C6.5 40.5 5 35.5 5 30Z" fill="url(#logo_grad_1)" />
                <path d="M45 30C45 16.2 56.2 5 70 5C83.8 5 95 16.2 95 30C95 35.5 93.5 40.5 91 45L95 57L81 52C77.5 54 74 55 70 55C56.2 55 45 43.8 45 30Z" fill="url(#logo_grad_2)" fillOpacity="0.9" />
                <path d="M55 30C55 36.5 53 42.5 49.5 47.5C51.2 47.8 53.1 48 55 48C64.9 48 73 39.9 73 30C73 20.1 64.9 12 55 12C53.1 12 51.2 12.2 49.5 12.5C53 17.5 55 23.5 55 30Z" fill="var(--foreground)" fillOpacity="0.1" />
            </svg>
        </div>
        <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-slate-400">
            StrangerConnect
        </span>
      </button>

      <div className="flex items-center gap-4">
        {/* Settings Button */}
        <button 
            onClick={onOpenSettings} 
            className="p-2 rounded-full text-slate-400 hover:text-primary hover:bg-surface border border-transparent hover:border-border transition-all"
            aria-label="Settings"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.43.872.95 1.112 1.521.215.513.636.883 1.145.965.75.12 1.5.266 2.241.434.721.163 1.189.878 1.054 1.604a14.043 14.043 0 01-1.957 4.966c-.347.534-.99.782-1.564.555a23.736 23.736 0 00-2.096-.867" />
            </svg>
        </button>

        {appState === AppState.LANDING && (
           <div className="flex items-center gap-2 text-sm text-slate-400">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             {onlineCount.toLocaleString()} online
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