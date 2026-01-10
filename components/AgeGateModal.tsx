import React, { useState, useEffect } from 'react';
import { Button } from './Button';

interface AgeGateModalProps {
  onVerify: () => void;
  onOpenRules: () => void;
}

export const AgeGateModal: React.FC<AgeGateModalProps> = ({ onVerify, onOpenRules }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
    >
      <div className={`bg-slate-950 border border-white/10 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl transform transition-all duration-500 ${isVisible ? 'scale-100' : 'scale-95'}`}>
        
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20 shadow-lg">
            <span className="text-3xl font-black text-red-500">18+</span>
          </div>
          <h1 id="age-gate-title" className="text-2xl font-bold text-white mb-3">Identity Check</h1>
          <p className="text-slate-400 text-sm leading-relaxed px-4">
            By entering, you confirm you are of legal age. No sexual harassment or illegal content allowed.
          </p>
        </div>

        <div 
          className="bg-white/5 rounded-xl p-5 mb-8 border border-white/5 hover:bg-white/[0.08] transition-all cursor-pointer group select-none" 
          onClick={() => setIsChecked(!isChecked)}
        >
          <div className="flex items-start gap-4">
            <div className="relative flex items-center pt-1">
              <input type="checkbox" className="peer sr-only" checked={isChecked} readOnly />
              <div className="w-6 h-6 border-2 border-slate-600 rounded-md peer-checked:bg-primary peer-checked:border-primary transition-all relative">
                <svg className={`w-4 h-4 text-white absolute top-0.5 left-0.5 transition-opacity duration-200 ${isChecked ? 'opacity-100' : 'opacity-0'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>
            <div className="text-sm text-slate-300 group-hover:text-white transition-colors leading-relaxed">
              I am <strong>18 years or older</strong>. I agree to the 
              <button onClick={(e) => { e.stopPropagation(); onOpenRules(); }} className="text-primary hover:underline px-1 font-bold">Privacy Policy</button> 
              and rules.
            </div>
          </div>
        </div>

        <Button 
          onClick={() => isChecked && onVerify()} 
          disabled={!isChecked}
          className={`w-full py-4 text-lg font-black transition-all duration-300 ${isChecked ? 'shadow-[0_0_30px_rgba(99,102,241,0.4)]' : 'opacity-50 grayscale'}`}
          aria-disabled={!isChecked}
        >
          Confirm & Enter
        </Button>
      </div>
    </div>
  );
};
