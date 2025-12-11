import React from 'react';
import { Button } from './Button';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-darker/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center sticky top-0 bg-slate-900 rounded-t-2xl z-10">
          <h2 className="text-2xl font-bold text-white tracking-tight">Information & Guidelines</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-8 scrollbar-hide text-slate-300 leading-relaxed">
          
          {/* About Us (Mandatory for AdSense Trust) */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="text-primary">✦</span> About Us
            </h3>
            <p className="text-sm mb-3">
              StrangerConnect is a spontaneous social discovery platform designed to alleviate digital loneliness. In an era where social media is curated and static, we bring back the thrill of the accidental encounter. Our mission is to connect people from different walks of life for fleeting, meaningful, or just plain fun conversations without the barrier of registration or profiles.
            </p>
          </section>

          {/* Safety Guidelines (Mandatory Content) */}
          <section className="bg-slate-800/30 p-4 rounded-xl border border-white/5">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="text-secondary">🛡️</span> Safety Guidelines
            </h3>
            <p className="text-sm mb-2 font-medium text-slate-200">How to stay safe while chatting:</p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-slate-400">
                <li><strong>Protect Your Identity:</strong> Never share your full name, address, phone number, or financial information with a stranger.</li>
                <li><strong>Be Skeptical:</strong> If a user claims to be a celebrity or asks for money, they are lying. Disconnect immediately.</li>
                <li><strong>No Bullying:</strong> We have a zero-tolerance policy for harassment. If you encounter abuse, please disconnect.</li>
                <li><strong>Digital Footprint:</strong> Remember that while we don't store logs, screenshots can be taken by the other party. Act accordingly.</li>
            </ul>
          </section>

          {/* Terms of Use */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="text-primary">1.</span> Terms of Use
            </h3>
            <p className="text-sm mb-3">
              By accessing StrangerConnect, you agree to be bound by these Terms of Use.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
                <li><strong>Age Restriction:</strong> You must be at least 18 years old to use this service.</li>
                <li><strong>Prohibited Content:</strong> You agree not to distribute illegal, hateful, or sexually explicit content involving minors.</li>
                <li><strong>Disclaimer:</strong> Interactions are simulated or facilitated by AI. The site owners accept no liability for the content of conversations.</li>
            </ul>
          </section>

          {/* Privacy Policy */}
           <section>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="text-secondary">2.</span> Privacy Policy
            </h3>
             <ul className="list-disc pl-5 space-y-2 text-sm">
                <li><strong>Data Collection:</strong> We collect anonymous technical data (IP, device type) to ensure site security and performance.</li>
                <li><strong>Cookies:</strong> We use cookies, including the <strong>Google DoubleClick DART cookie</strong>, to serve ads based on your visit to this site and other sites on the Internet.</li>
                <li><strong>Opt-Out:</strong> You may visit <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noreferrer" className="text-primary hover:underline">Google Ad Settings</a> to opt out of the use of cookies for interest-based advertising.</li>
            </ul>
          </section>

          {/* Contact Us (Mandatory for AdSense) */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="text-primary">✉️</span> Contact Us
            </h3>
            <p className="text-sm">
                Have questions, business inquiries, or need to report a bug?
            </p>
            <p className="text-sm mt-2 font-mono text-slate-400">
                Email: contact@strangerconnect.com
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-slate-900 rounded-b-2xl sticky bottom-0">
          <Button onClick={onClose} className="w-full">
            I Understand & Agree
          </Button>
        </div>

      </div>
    </div>
  );
};