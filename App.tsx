import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatInterface } from './components/ChatInterface';
import { MatchingScreen } from './components/MatchingScreen';
import { Footer } from './components/Footer';
import { Button } from './components/Button';
import { Modal } from './components/Modal';
import { RulesModal } from './components/RulesModal';
import { SettingsModal } from './components/SettingsModal';
import { AgeGateModal } from './components/AgeGateModal';
import { SEOContent } from './components/SEOContent';
import { AppState, UserSettings } from './types';
import { initializePeerSession, terminateSession } from './services/geminiService';
import { playSound, initAudio } from './services/soundService';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [onlineCount, setOnlineCount] = useState(1);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isAgeVerified, setIsAgeVerified] = useState<boolean>(false);
  const [showAgeGate, setShowAgeGate] = useState<boolean>(false);
  
  const [seoConfig, setSeoConfig] = useState({ 
    title: "Talk to Strangers", 
    sub: "No signup. No history. 100% anonymous chat.",
    h1: "Talk to Strangers Online"
  });

  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('stranger_settings');
    return saved ? JSON.parse(saved) : { theme: 'dark', notifications: true };
  });

  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

  useEffect(() => {
    const verified = localStorage.getItem('stranger_age_verified');
    if (verified === 'true') setIsAgeVerified(true);

    const path = window.location.pathname;
    if (path === '/talk-to-strangers-online') {
      setSeoConfig({ title: "Talk Online", sub: "Connect with the world. Instant, anonymous, global vibes.", h1: "StrangerConnect: Talk to Strangers Online" });
    } else if (path === '/anonymous-chat-no-signup') {
      setSeoConfig({ title: "No Signup Chat", sub: "Your privacy is a flex. Jump into a conversation with zero registration.", h1: "Anonymous Chat - No Signup Required" });
    } else if (path === '/lonely-talk-someone') {
      setSeoConfig({ title: "Need to Talk?", sub: "You're not alone. Share your thoughts with a stranger who's listening.", h1: "Feeling Lonely? Talk to Someone Randomly" });
    } else if (path === '/random-chat-india') {
      setSeoConfig({ title: "Random Chat India", sub: "Connecting with strangers across the subcontinent in real-time.", h1: "Random Chat India - Meet Indian Strangers" });
    } else if (path === '/anonymous-chat-at-night') {
      setSeoConfig({ title: "Midnight Vibe", sub: "For the night owls and overthinkers. Find a stranger to talk to at 2 AM.", h1: "Anonymous Chat at Night - Midnight Vibe" });
    }
    
    document.title = `${seoConfig.title} | StrangerConnect.site`;
  }, [seoConfig.title]);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ action: 'stats' })
        });
        const data = await res.json();
        if (typeof data.onlineCount === 'number') setOnlineCount(data.onlineCount);
      } catch (e) {}
    };
    fetchCount();
    const countInterval = setInterval(fetchCount, 5000);
    return () => clearInterval(countInterval);
  }, []);

  const handleChatConnect = () => {
    setAppState(AppState.CHAT);
    playSound('match');
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'match_success', { 'event_category': 'Engagement' });
    }
  };
  
  const handleChatMessage = (text: string) => {
    window.dispatchEvent(new CustomEvent('peer-message', { detail: text }));
  };
  
  const handleChatTyping = (isTyping: boolean) => {
    window.dispatchEvent(new CustomEvent('peer-typing', { detail: isTyping }));
  };
  
  const handleChatDisconnect = () => {
    window.dispatchEvent(new Event('peer-disconnect'));
  };

  const startMatchingProcess = () => {
    initAudio();
    setAppState(AppState.MATCHING);
    setErrorFeedback(null);
    initializePeerSession(handleChatConnect, handleChatMessage, handleChatTyping, handleChatDisconnect)
      .catch((err) => {
        setAppState(AppState.LANDING);
        playSound('error');
        setErrorFeedback("Vibe check failed. Try again?");
      });
  };

  const handleStartMatching = () => {
    if (!isAgeVerified) { setShowAgeGate(true); return; }
    startMatchingProcess();
  };

  return (
    <div className="h-screen h-[100dvh] w-full flex flex-col bg-background text-foreground overflow-hidden">
      {showAgeGate && (
        <AgeGateModal onVerify={() => {
          localStorage.setItem('stranger_age_verified', 'true');
          setIsAgeVerified(true);
          setShowAgeGate(false);
          startMatchingProcess();
        }} onOpenRules={() => setShowRulesModal(true)} />
      )}

      <Header 
        appState={appState} 
        onLeaveChat={() => setShowDisconnectModal(true)} 
        onLogoClick={() => setAppState(AppState.LANDING)}
        onlineCount={onlineCount}
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      <Modal 
        isOpen={showDisconnectModal}
        title="Ghost 'em?"
        message="Ready to vanish? This chat will be gone forever."
        onConfirm={() => {
            terminateSession();
            setAppState(AppState.LANDING);
            setShowDisconnectModal(false);
        }}
        onCancel={() => setShowDisconnectModal(false)}
      />

      <RulesModal isOpen={showRulesModal} onClose={() => setShowRulesModal(false)} />
      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} settings={userSettings} onSave={setUserSettings} />

      <main className={`flex-1 flex flex-col relative ${appState === AppState.LANDING ? 'overflow-y-auto' : 'overflow-hidden'}`}>
        {appState === AppState.LANDING && (
          <div className="w-full flex flex-col items-center">
            {/* Hero Section */}
            <div className="min-h-[90dvh] flex flex-col items-center justify-center p-6 text-center z-10 w-full relative">
              <div className="space-y-6 mb-12 animate-float">
                  <div className="inline-block bg-primary text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                      Live P2P Connection
                  </div>
                  <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.8] text-white">
                    {seoConfig.title.split(' ').map((word, i) => (
                      <React.Fragment key={i}>
                        {['Strangers', 'Online', 'Signup', 'Someone', 'India', 'Night'].includes(word) ? <span className="text-primary">{word}</span> : word}
                        {i === 0 ? <br/> : ' '}
                      </React.Fragment>
                    ))}
                    {seoConfig.title.split(' ').length === 2 && !seoConfig.title.includes('Talk') && <span className="text-primary">Strangers</span>}
                  </h1>
                  <p className="text-xl md:text-2xl font-bold text-white/50 max-w-lg mx-auto leading-relaxed">
                    {seoConfig.sub}
                  </p>
                  <h2 className="seo-content">{seoConfig.h1}</h2>
              </div>

              {errorFeedback && (
                <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-2 rounded-full text-xs font-black uppercase animate-shake">
                  {errorFeedback}
                </div>
              )}

              <div className="w-full max-w-sm space-y-8">
                <Button onClick={handleStartMatching} className="w-full text-4xl py-10 rounded-[3rem] shadow-[0_25px_80px_rgba(204,255,0,0.35)] animate-bounce-slow">
                  Start Chat
                </Button>
                
                <div className="flex items-center justify-center gap-6 opacity-30">
                  <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-black uppercase tracking-widest">Encrypted</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-white"></div>
                  <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-black uppercase tracking-widest">No Logs</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-white"></div>
                  <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-black uppercase tracking-widest">P2P</span>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 glass px-8 py-3 rounded-full flex items-center gap-4 border-white/5 shadow-2xl">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
                <span className="text-xs font-black uppercase tracking-widest text-white/70">
                  <span className="text-white">{onlineCount.toLocaleString()}</span> Live Now
                </span>
              </div>
            </div>

            {/* Week 2: Deep SEO Content Section */}
            <SEOContent path={window.location.pathname} />
            <Footer onOpenRules={() => setShowRulesModal(true)} />
          </div>
        )}

        {appState === AppState.MATCHING && (
          <MatchingScreen onCancel={() => { terminateSession(); setAppState(AppState.LANDING); }} onlineCount={onlineCount} />
        )}

        {appState === AppState.CHAT && (
          <ChatInterface onEndChat={() => setShowDisconnectModal(true)} onStartNewChat={startMatchingProcess} />
        )}
      </main>
    </div>
  );
};

export default App;