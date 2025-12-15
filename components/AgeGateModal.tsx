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
    // Trigger animation after mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = () => {
    if (isChecked) {
      onVerify();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl transition-opacity duration-500">
      <div className={`bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-700 ${isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-8'}`}>
        
        <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                <span className="text-2xl font-black text-red-500">18+</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Age Verification Required</h1>
            <p className="text-slate-400 text-sm leading-relaxed">
                StrangerConnect facilitates unfiltered interactions with strangers. This platform is strictly for adults.
            </p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-5 mb-6 border border-white/5 hover:border-white/10 transition-colors">
            <label className="flex items-start gap-4 cursor-pointer group">
                <div className="relative flex items-center pt-1">
                    <input 
                        type="checkbox" 
                        className="peer sr-only"
                        checked={isChecked}
                        onChange={(e) => setIsChecked(e.target.checked)}
                    />
                    <div className="w-6 h-6 border-2 border-slate-500 rounded-md peer-checked:bg-primary peer-checked:border-primary transition-all relative shadow-sm">
                        <svg className="w-4 h-4 text-white absolute top-0.5 left-0.5 opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                </div>
                <div className="text-sm text-slate-300 group-hover:text-white transition-colors select-none leading-relaxed">
                    I confirm I am <strong>18 years or older</strong>. I agree to the <button onClick={(e) => { e.preventDefault(); onOpenRules(); }} className="text-primary hover:underline font-medium">Terms of Use</button>, <button onClick={(e) => { e.preventDefault(); onOpenRules(); }} className="text-primary hover:underline font-medium">Privacy Policy</button>, and Safety Guidelines.
                </div>
            </label>
        </div>

        <Button 
            onClick={handleEnter} 
            disabled={!isChecked}
            className={`w-full py-4 text-lg font-bold tracking-wide transition-all duration-300 ${isChecked ? 'opacity-100 shadow-lg shadow-primary/25' : 'opacity-50 grayscale cursor-not-allowed'}`}
        >
            Enter StrangerConnect
        </Button>
        
        <p className="mt-4 text-[10px] text-slate-600 text-center uppercase tracking-widest">
            Compliance • Safety • Anonymity
        </p>
      </div>
    </div>
  );
};