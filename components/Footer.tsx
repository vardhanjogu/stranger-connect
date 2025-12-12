import React from 'react';

interface FooterProps {
  onOpenRules: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenRules }) => {
  return (
    <div className="w-full flex flex-col items-center pt-4 pb-2 z-10 shrink-0">
         <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-500 font-medium">
              <button onClick={onOpenRules} className="hover:text-foreground transition-colors">About Us</button>
              <span className="opacity-30">•</span>
              <button onClick={onOpenRules} className="hover:text-foreground transition-colors">Safety</button>
              <span className="opacity-30">•</span>
              <button onClick={onOpenRules} className="hover:text-foreground transition-colors">Privacy</button>
         </div>
         <div className="text-xs text-slate-500 font-medium mt-2 mb-12">
            © 2025 StrangerConnect. All Rights Reserved.
         </div>
    </div>
  );
};