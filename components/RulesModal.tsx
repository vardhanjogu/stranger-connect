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
          <section className="bg-slate-800/30 p-4 rounded-xl border border-white/5">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="text-secondary">🛡️</span> Safety Guidelines & Anti-Scam Advisory
            </h3>
            <div className="text-sm space-y-4 text-slate-300 text-justify">
                <p>
                    Your safety is our absolute priority. While StrangerConnect is designed for fun, anonymous interactions, the internet can sometimes be a place where bad actors operate. Because our platform offers anonymity, it is crucial that you remain vigilant and informed about common risks. We have compiled a comprehensive guide below to help you navigate your conversations safely.
                </p>

                <h4 className="font-bold text-white mt-4">1. The Golden Rule of Anonymity</h4>
                <p>
                    <strong>Never reveal your true identity.</strong> This sounds simple, but it is easy to slip up. Do not share your full name, home address, workplace, school, phone number, email address, or social media handles. Even seemingly innocent details like "I live near the big mall in [City]" can be used to triangulate your location. Keep the conversation general. If someone asks for your socials to "continue the chat elsewhere," be extremely cautious. Moving off-platform removes the few protections we can offer.
                </p>

                <h4 className="font-bold text-white mt-4">2. Identifying Scams and Financial Fraud</h4>
                <p>
                    Scammers often follow predictable scripts. Be wary of any stranger who:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Claims to be in distress:</strong> A common tactic is the "damsel in distress" scam, where a user claims they are stuck in a foreign country, need emergency medical fees, or have run out of gas. They will ask for a small transfer via PayPal, CashApp, or crypto. <strong>This is always a lie.</strong></li>
                    <li><strong>Offers investment opportunities:</strong> If a stranger starts talking about how much money they made in crypto, forex, or a "secret" business venture, disconnect immediately. This is a "pig butchering" scam designed to steal your life savings.</li>
                    <li><strong>Blackmail (Sextortion):</strong> Never, under any circumstances, share intimate photos or engage in video acts with a stranger. Scammers often record these interactions and then threaten to send the footage to your family or employer unless you pay them. If you find yourself in this situation, <strong>do not pay</strong>—they will demand more. Cut contact and report it to authorities.</li>
                </ul>

                <h4 className="font-bold text-white mt-4">3. Emotional Manipulation and Grooming</h4>
                <p>
                    Predators often use "grooming" techniques to lower your guard. They might shower you with compliments (love bombing), claim to be your "soulmate" after 5 minutes, or pretend to share your exact niche interests to build false rapport. If a conversation feels too good to be true, or if the person is pushing boundaries faster than you are comfortable with, trust your gut. You owe this stranger nothing. You can disconnect at any time without guilt.
                </p>

                <h4 className="font-bold text-white mt-4">4. Cyber Hygiene and Technical Safety</h4>
                <p>
                    Do not click on links sent by strangers. A link can look innocent but lead to a phishing site designed to steal your passwords or IP loggers that reveal your approximate location. If a user asks you to download a file, a "better chat app," or a game, refuse. These files often contain malware or keyloggers. Keep your antivirus software updated and never accept file transfers.
                </p>

                <h4 className="font-bold text-white mt-4">5. What to Do If You Feel Unsafe</h4>
                <p>
                    If a conversation takes a turn that makes you uncomfortable—whether it's aggression, creepy questions, illegal topics, or hate speech—do not engage. Do not try to "teach them a lesson" or argue.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Disconnect Immediately:</strong> Press the ESC key or the "Stop Chat" button. You do not need to provide a reason or say goodbye. Your safety comes first.</li>
                    <li><strong>Report the User:</strong> Use the report flag icon within the chat interface. While we do not record conversations, reporting helps us identify patterns and ban malicious IPs from the platform.</li>
                    <li><strong>Protect Your Mental Health:</strong> You are here to have a good time. If someone is being toxic, delete the memory of them and move on to the next person. There are plenty of kind people in the world; don't let one bad apple spoil your experience.</li>
                    <li><strong>Seek Help:</strong> If you feel you are in immediate danger or have been a victim of a crime, contact your local authorities immediately.</li>
                </ul>
                <p className="italic opacity-80 mt-2">
                    By following these guidelines, you ensure that StrangerConnect remains a safe harbor for spontaneity and genuine human connection. Stay safe, stay anonymous, and have fun!
                </p>
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
                <li><strong>Prohibited Content:</strong> You agree not to distribute illegal, hateful, or sexually explicit content involving minors.</li>
                <li><strong>Disclaimer:</strong> Interactions are facilitated by P2P technology. The site owners accept no liability for the content of conversations.</li>
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