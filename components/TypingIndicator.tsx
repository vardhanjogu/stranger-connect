import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-1.5 px-6 py-4 glass rounded-[2rem] rounded-tl-sm w-fit h-12 shadow-sm animate-pulse">
      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-typing" style={{ animationDelay: '0ms' }}></div>
      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-typing" style={{ animationDelay: '200ms' }}></div>
      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-typing" style={{ animationDelay: '400ms' }}></div>
    </div>
  );
};