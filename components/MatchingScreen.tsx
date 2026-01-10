import React, { useState, useEffect } from 'react';
import { Button } from './Button';

interface MatchingScreenProps {
  onCancel: () => void;
  onlineCount: number;
}

export const MatchingScreen: React.FC<MatchingScreenProps> = ({ onCancel, onlineCount }) => {
  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full bg-background relative overflow-hidden">
      {/* Scanner Beam Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent h-[100px] w-full animate-scan opacity-30 z-0"></div>
      
      <div className="z-10 flex flex-col items-center">
        <div className="relative w-48 h-48 mb-12">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="relative w-full h-full rounded-full border-4 border-primary/10 glass flex items-center justify-center p-8 overflow-hidden group">
                 <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
                 <svg viewBox="0 0 100 100" className="w-full h-full text-primary animate-spin" style={{ animationDuration: '4s' }}>
                    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="10 20" />
                 </svg>
                 <div className="absolute font-black text-6xl text-primary drop-shadow-[0_0_15px_rgba(204,255,0,0.5)] italic">?</div>
            </div>
        </div>

        <div className="text-center space-y-4">
            <h2 className="text-5xl font-black italic uppercase tracking-tighter">Matching...</h2>
            <div className="flex gap-2 justify-center">
                <div className="w-3 h-3 bg-primary rounded-full animate-ping"></div>
                <div className="w-3 h-3 bg-primary rounded-full animate-ping [animation-delay:0.2s]"></div>
                <div className="w-3 h-3 bg-primary rounded-full animate-ping [animation-delay:0.4s]"></div>
            </div>
            <p className="text-white/30 text-xs font-black uppercase tracking-[0.3em] pt-8">
                Searching among <span className="text-white">{onlineCount}</span> live nodes
            </p>
        </div>

        <button 
            onClick={onCancel} 
            className="mt-16 text-white/30 hover:text-white transition-colors text-xs font-black uppercase tracking-widest border-b border-white/10 pb-1"
        >
            Bail Out
        </button>
      </div>
    </div>
  );
};