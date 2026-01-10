import React from 'react';

interface FooterProps {
  onOpenRules: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenRules }) => {
  return (
    <footer className="w-full flex flex-col items-center pt-8 pb-10 z-10 shrink-0 bg-transparent relative">
         <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-6">
              <a href="/talk-to-strangers-online" className="hover:text-primary transition-colors">Global Chat</a>
              <a href="/random-chat-india" className="hover:text-primary transition-colors">Chat India</a>
              <a href="/anonymous-chat-at-night" className="hover:text-primary transition-colors">Midnight Vibe</a>
              <button onClick={onOpenRules} className="hover:text-primary transition-colors focus:outline-none">Privacy</button>
              <button onClick={onOpenRules} className="hover:text-primary transition-colors focus:outline-none">Safety</button>
         </div>

         <div className="flex flex-col items-center text-center px-6">
            <p className="text-[9px] text-white/20 font-black uppercase tracking-widest max-w-md leading-relaxed">
              The #1 Anonymous P2P Chatting App. 18+ Only. <br className="hidden sm:block" />
              Ghosting is allowed. Vibes are mandatory.
            </p>
            <div className="mt-4 text-[10px] text-primary/50 font-black italic uppercase tracking-[0.4em]">
               STRANGERCONNECT.SITE // 2025
            </div>
         </div>
    </footer>
  );
};