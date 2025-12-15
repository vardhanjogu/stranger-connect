import React from 'react';
import { Button } from './Button';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose, title = "Legal & Safety Information" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-darker/95 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center sticky top-0 bg-slate-900 rounded-t-2xl z-10">
          <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-8 scrollbar-hide text-slate-300 leading-relaxed">
          
          {/* CRITICAL SAFETY RULES */}
          <section className="bg-red-500/5 border border-red-500/20 p-5 rounded-xl">
            <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2 uppercase tracking-wide">
               ⚠️ Zero Tolerance Policy
            </h3>
            <p className="text-sm mb-4 text-slate-300">
                To protect our community and ensure compliance with international law, the following activities result in an <strong>immediate permanent ban</strong> and potential reporting to authorities:
            </p>
            <ul className="space-y-3 text-sm font-medium text-white">
                <li className="flex items-start gap-3">
                    <span className="text-red-500 mt-0.5">✕</span>
                    <span><strong>Sexual Content:</strong> Nudity, pornography, sexual solicitation, or "sexting" is strictly prohibited.</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="text-red-500 mt-0.5">✕</span>
                    <span><strong>Harassment & Hate Speech:</strong> Bullying, racism, threats, or abuse of any kind will not be tolerated.</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="text-red-500 mt-0.5">✕</span>
                    <span><strong>Illegal Activity:</strong> Promotion of drugs, weapons, fraud, or any illegal acts.</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="text-red-500 mt-0.5">✕</span>
                    <span><strong>Minors:</strong> Users under 18 are not permitted. Soliciting minors is a crime and will be reported to the National Center for Missing & Exploited Children (NCMEC).</span>
                </li>
            </ul>
          </section>

          {/* Privacy Policy (Compliance) */}
           <section>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="text-secondary">🔒</span> Privacy & Data Logging Policy
            </h3>
            <p className="text-sm mb-3">
                We value your privacy, but we must also ensure safety. Here is exactly what we track:
            </p>
             <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>
                    <strong>What we log:</strong> We record IP addresses, connection timestamps, and device identifiers (User-Agent) for security and anti-abuse purposes.
                </li>
                <li>
                    <strong>Chat Content:</strong> Chats are primarily Peer-to-Peer (P2P). However, chats may be <strong>moderated or logged</strong> via automated systems or if a user report is triggered, to prevent illegal activity and ensure safety.
                </li>
                <li>
                    <strong>Data Retention:</strong> Security logs (IPs) are retained for a limited period to enforce bans and assist law enforcement if required by a valid legal process.
                </li>
                <li>
                    <strong>Cookies:</strong> We use cookies for analytics and ads (Google AdSense/Analytics). You can opt-out via <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noreferrer" className="text-primary hover:underline">Google Ad Settings</a>.
                </li>
            </ul>
          </section>

          {/* Safety Advice */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="text-primary">🛡️</span> User Safety Guide
            </h3>
            <div className="text-sm space-y-4 text-slate-300">
                <p>
                    <strong>Anonymity is not a shield.</strong> Bad actors exist. Protect yourself:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Never share PII:</strong> No real names, addresses, phone numbers, or social handles.</li>
                    <li><strong>Scam Alert:</strong> Anyone asking for money (crypto, gift cards) is a scammer. Block them.</li>
                    <li><strong>Sextortion Warning:</strong> Never send intimate images. Scammers record video calls to blackmail victims.</li>
                    <li><strong>Report:</strong> If you feel unsafe, use the Report button. We take every report seriously.</li>
                </ul>
            </div>
          </section>

          {/* Contact */}
          <section className="border-t border-white/5 pt-4">
             <p className="text-xs text-slate-500">
                For legal inquiries or to report a violation: <br/>
                <span className="text-slate-300 font-mono">contact@strangerconnect.com</span>
             </p>
          </section>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-slate-900 rounded-b-2xl sticky bottom-0 backdrop-blur-xl">
          <Button onClick={onClose} className="w-full">
            I Acknowledge & Agree
          </Button>
        </div>

      </div>
    </div>
  );
};