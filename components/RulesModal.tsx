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
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-darker/95 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center sticky top-0 bg-slate-900 rounded-t-2xl z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-10 scrollbar-hide text-slate-300 leading-relaxed">
          
          {/* TERMS OF SERVICE */}
          <section id="terms">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-primary">⚖️</span> Terms of Service
            </h3>
            <div className="text-sm space-y-4">
                <p>By using StrangerConnect, you agree to the following terms:</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>You must be at least <strong>18 years of age</strong> to use this service.</li>
                    <li>You are solely responsible for your interactions and any content you transmit.</li>
                    <li>You agree not to use the service for illegal purposes, harassment, or distribution of prohibited content.</li>
                    <li>StrangerConnect provides the service "as-is" and is not liable for any user behavior or technical failures.</li>
                    <li>Violation of these terms will result in an immediate and permanent ban.</li>
                </ul>
            </div>
          </section>

          {/* PRIVACY POLICY */}
          <section id="privacy">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-secondary">🔒</span> Privacy Policy
            </h3>
            <div className="text-sm space-y-4">
                <p>Your privacy is our priority. We operate under a strict <strong>No-Storage</strong> policy for conversations.</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Ephemeral Data:</strong> Chat messages are sent Peer-to-Peer and are deleted from your memory once the session ends. They are never stored on our servers.</li>
                    <li><strong>Security Logs:</strong> We log IP addresses and device signatures temporarily solely to prevent spam, abuse, and illegal activity. This data is pruned regularly.</li>
                    <li><strong>Third Parties:</strong> We use Google Analytics and Microsoft Clarity to understand site performance. No personal chat data is ever shared with these providers.</li>
                    <li><strong>Cookie Use:</strong> We use essential cookies to maintain your theme preferences and session state.</li>
                </ul>
            </div>
          </section>

          {/* CRITICAL SAFETY RULES */}
          <section className="bg-red-500/5 border border-red-500/20 p-5 rounded-xl">
            <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2 uppercase tracking-wide">
               ⚠️ Zero Tolerance Safety Policy
            </h3>
            <ul className="space-y-3 text-sm font-medium text-white">
                <li className="flex items-start gap-3">
                    <span className="text-red-500 mt-0.5">✕</span>
                    <span><strong>No Sexual Content:</strong> Nudity, pornography, or sexual solicitation is strictly prohibited.</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="text-red-500 mt-0.5">✕</span>
                    <span><strong>No Harassment:</strong> Hate speech, bullying, or threats will be reported.</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="text-red-500 mt-0.5">✕</span>
                    <span><strong>No Illegal Activity:</strong> Fraud, drug solicitation, or minor exploitation.</span>
                </li>
            </ul>
          </section>

          {/* Contact */}
          <section className="border-t border-white/5 pt-6">
             <p className="text-xs text-slate-500">
                Contact our safety team: <br/>
                <span className="text-slate-300 font-mono">legal@strangerconnect.com</span>
             </p>
          </section>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-slate-900 rounded-b-2xl sticky bottom-0 backdrop-blur-xl">
          <Button onClick={onClose} className="w-full">
            Acknowledge & Agree
          </Button>
        </div>

      </div>
    </div>
  );
};