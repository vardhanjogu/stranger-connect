import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-1.5 px-4 py-4 bg-surface rounded-2xl rounded-tl-sm w-fit h-10 shadow-sm border border-border animate-pulse-slow">
      <div className="w-2 h-2 bg-slate-400 rounded-full animate-typing" style={{ animationDelay: '0ms' }}></div>
      <div className="w-2 h-2 bg-slate-400 rounded-full animate-typing" style={{ animationDelay: '200ms' }}></div>
      <div className="w-2 h-2 bg-slate-400 rounded-full animate-typing" style={{ animationDelay: '400ms' }}></div>
    </div>
  );
};