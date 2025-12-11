import React from 'react';
import { AdUnit } from './AdUnit';

interface MatchingScreenProps {
  onCancel: () => void;
}

export const MatchingScreen: React.FC<MatchingScreenProps> = ({ onCancel }) => {
  return (
    <div className="flex flex-col items-center min-h-full pt-16 bg-darker text-center px-4 py-12">
      <div className="flex-1 flex flex-col items-center justify-center w-full my-auto">
        
        {/* Mobile & Tablet Top Ad (Hidden on Desktop) */}
        <div className="w-full max-w-xs mb-8 block lg:hidden">
            <AdUnit label="Mobile/Tablet Top Ad" className="my-0" />
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
          <div className="relative w-32 h-32 rounded-full border-4 border-primary/30 flex items-center justify-center bg-slate-900 overflow-hidden p-4">
              <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full animate-pulse-fast">
                <defs>
                    <linearGradient id="match_grad_1" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                    <linearGradient id="match_grad_2" x1="40" y1="0" x2="100" y2="60" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                </defs>
                <path d="M5 30C5 16.2 16.2 5 30 5C43.8 5 55 16.2 55 30C55 43.8 43.8 55 30 55C26 55 22.5 54 19 52L5 57L9 45C6.5 40.5 5 35.5 5 30Z" fill="url(#match_grad_1)" />
                <path d="M45 30C45 16.2 56.2 5 70 5C83.8 5 95 16.2 95 30C95 35.5 93.5 40.5 91 45L95 57L81 52C77.5 54 74 55 70 55C56.2 55 45 43.8 45 30Z" fill="url(#match_grad_2)" fillOpacity="0.9" />
            </svg>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Looking for a stranger...</h2>
        <p className="text-slate-400 max-w-xs animate-pulse">
          Connecting you with someone random. Be nice!
        </p>

        <div className="mt-12 flex gap-1 justify-center">
          {[...Array(5)].map((_, i) => (
              <div 
                  key={i} 
                  className="w-1 h-8 bg-slate-700 rounded-full animate-[bounce_1s_infinite]"
                  style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
          ))}
        </div>

        <div className="mt-8 mb-4">
          <button 
              onClick={onCancel} 
              className="text-slate-500 hover:text-white transition-colors text-sm font-medium hover:underline decoration-slate-600 underline-offset-4"
          >
              Cancel Search
          </button>
        </div>
      </div>

      {/* Matching Screen Ad (Bottom - visible on all) */}
      <div className="w-full max-w-xs mt-8">
         <AdUnit label="Advertisement" className="my-0" />
      </div>
    </div>
  );
};