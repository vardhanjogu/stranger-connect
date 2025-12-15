import React from 'react';
import { Button } from './Button';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose, title = "Information & Guidelines" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-darker/90 backdrop-blur-md animate-in fade-in duration-200">
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
          
          {/* About Us */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="text-primary">✦</span> About Us
            </h3>
            <p className="text-sm mb-3">
              StrangerConnect is a spontaneous social discovery platform designed to alleviate digital loneliness. In an era where social media is curated and static, we bring back the thrill of the accidental encounter. Our mission is to connect people from different walks of life for fleeting, meaningful, or just plain fun conversations without the barrier of registration or profiles.
            </p>
          </section>

          {/* Safety Guidelines (Expanded) */}
          <section className="bg-slate-800/30 p-5 rounded-xl border border-white/5 shadow-inner">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-secondary">🛡️</span> Safety Guidelines & Anti-Scam Advisory
            </h3>
            <div className="text-sm space-y-5 text-slate-300 text-justify">
                <p>
                    <strong>PLEASE READ CAREFULLY:</strong> Your safety is our absolute priority. While StrangerConnect facilitates anonymous interactions, anonymity is not a shield against all online dangers. Bad actors often use anonymous platforms to prey on the unsuspecting. Below is a comprehensive guide to identifying threats and protecting yourself.
                </p>

                <div>
                    <h4 className="font-bold text-white text-base mb-2">1. The Golden Rule: Total Anonymity</h4>
                    <p>
                        Never reveal your true identity. This goes beyond just your name. Do not share your home address, workplace, school, phone number, email address, or social media handles (Instagram, Snapchat, WhatsApp). Even small details like "I live near the stadium in [City]" can be used to triangulate your location. 
                    </p>
                    <p className="mt-2 text-amber-400/90 font-medium">
                        ⚠️ Warning: If a stranger asks to move the conversation to another app (like Telegram or WhatsApp) within the first few minutes, this is a major red flag. They are trying to remove you from our platform's safety protections.
                    </p>
                </div>

                <div>
                    <h4 className="font-bold text-white text-base mb-2">2. Identifying Common Scams</h4>
                    <p className="mb-2">Scammers follow predictable scripts. Be vigilant against these common tactics:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            <strong className="text-indigo-300">The "Pig Butchering" Scam (Crypto/Investment):</strong> 
                            A user may casually mention they are "analyzing charts" or made a lot of money recently in cryptocurrency, forex, or gold. They will try to build a friendship or romance over days (grooming) before subtly suggesting you invest on a fake platform they control. <strong>Rule:</strong> Never take financial advice from a stranger.
                        </li>
                        <li>
                            <strong className="text-indigo-300">The "Damsel in Distress":</strong> 
                            A user claims they are stuck in a foreign country, their car broke down, or they need emergency medical money. They will ask for a small transfer via PayPal, CashApp, or Gift Cards. <strong>Rule:</strong> Never send money to anyone you haven't met in person.
                        </li>
                        <li>
                            <strong className="text-indigo-300">Sextortion (Blackmail):</strong> 
                            A user may aggressively push for a video call or ask for explicit photos/videos. If you comply, they will record the interaction and immediately threaten to send the footage to your family, friends, or employer unless you pay them. <strong>Rule:</strong> Never share intimate content. If you are targeted, <strong>do not pay</strong>—they will never stop demanding money. Block them and report to authorities.
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-white text-base mb-2">3. Cyber Security & Phishing</h4>
                    <p>
                        Do not click on links sent by strangers. A link can look innocent (e.g., "Check out my photo") but lead to a site that steals your IP address (location) or mimics a login page to steal your passwords. Never accept file downloads, as they may contain Remote Access Trojans (RATs) that give hackers control of your device.
                    </p>
                </div>

                <div>
                    <h4 className="font-bold text-white text-base mb-2">4. Emotional Manipulation</h4>
                    <p>
                        Be wary of "Love Bombing"—when a stranger showers you with excessive compliments, claims you are "soulmates," or moves the relationship forward at an unnatural speed. This is a common tactic used by predators and scammers to lower your defenses. Real connections take time to build.
                    </p>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                    <h4 className="font-bold text-red-200 text-base mb-2">5. What To Do If You Feel Unsafe</h4>
                    <ul className="list-disc pl-5 space-y-2 text-slate-300">
                        <li><strong>Disconnect Immediately:</strong> You do not owe anyone an explanation or a "goodbye." If your gut tells you something is wrong, press the disconnect button or ESC key instantly.</li>
                        <li><strong>Report the User:</strong> Use the flag/report icon in the chat. While we do not record chats, reporting helps us ban malicious IP addresses.</li>
                        <li><strong>Do Not Engage:</strong> Do not try to argue with trolls or scammers. It only feeds their behavior.</li>
                        <li><strong>Seek Help:</strong> If you believe you are in immediate danger or have been a victim of a crime, contact your local law enforcement immediately.</li>
                    </ul>
                </div>
            </div>
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
                <li><strong>Prohibited Content:</strong> You agree not to distribute illegal, hateful, violent, or sexually explicit content involving minors.</li>
                <li><strong>Disclaimer:</strong> Interactions are facilitated by P2P technology. The site owners accept no liability for the content of conversations or the actions of users.</li>
            </ul>
          </section>

          {/* Privacy Policy */}
           <section>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="text-secondary">2.</span> Privacy Policy
            </h3>
             <ul className="list-disc pl-5 space-y-2 text-sm">
                <li><strong>Data Collection:</strong> We collect anonymous technical data (IP, device type) to ensure site security and performance. We do not store chat logs on our servers.</li>
                <li><strong>Cookies:</strong> We use cookies, including the <strong>Google DoubleClick DART cookie</strong>, to serve ads based on your visit to this site and other sites on the Internet.</li>
                <li><strong>Opt-Out:</strong> You may visit <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noreferrer" className="text-primary hover:underline">Google Ad Settings</a> to opt out of the use of cookies for interest-based advertising.</li>
            </ul>
          </section>

          {/* Contact Us */}
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
        <div className="p-6 border-t border-white/5 bg-slate-900 rounded-b-2xl sticky bottom-0 backdrop-blur-xl">
          <Button onClick={onClose} className="w-full">
            I Understand & Agree
          </Button>
        </div>

      </div>
    </div>
  );
};