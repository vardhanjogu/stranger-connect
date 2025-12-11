import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ChatInterface } from './components/ChatInterface';
import { MatchingScreen } from './components/MatchingScreen';
import { Button } from './components/Button';
import { Modal } from './components/Modal';
import { RulesModal } from './components/RulesModal';
import { AdUnit } from './components/AdUnit';
import { AppState } from './types';
import { startNewChatSession, terminateSession } from './services/geminiService';

// Analytics global declaration
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  // Initialize with a random number between 1200 and 1800 to ensure it looks dynamic on refresh
  const [onlineCount, setOnlineCount] = useState(() => Math.floor(Math.random() * 600) + 1200);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  
  // Use a ref to track the timeout so we can cancel it
  const matchingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fake online count fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(prev => prev + Math.floor(Math.random() * 10) - 5);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Track Page Views/State Changes for Analytics
  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'screen_view', {
        screen_name: appState
      });
    }
  }, [appState]);

  // Handle ESC key to leave chat or close modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showRulesModal) {
            setShowRulesModal(false);
        } else if (showDisconnectModal) {
            setShowDisconnectModal(false);
        } else if (appState === AppState.CHAT) {
            setShowDisconnectModal(true);
        }
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [appState, showDisconnectModal, showRulesModal]);

  const handleStartMatching = async () => {
    setAppState(AppState.MATCHING);
    
    // Simulate finding a partner delay
    const delay = Math.floor(Math.random() * 2000) + 1500; // 1.5s - 3.5s
    
    try {
        startNewChatSession();
        
        // Clear any existing timeout
        if (matchingTimeoutRef.current) {
            clearTimeout(matchingTimeoutRef.current);
        }

        matchingTimeoutRef.current = setTimeout(() => {
            setAppState(AppState.CHAT);
        }, delay);

    } catch (e) {
        console.error("Initialization error:", e);
        setAppState(AppState.LANDING);
    }
  };

  const handleCancelMatching = () => {
    if (matchingTimeoutRef.current) {
        clearTimeout(matchingTimeoutRef.current);
        matchingTimeoutRef.current = null;
    }
    terminateSession();
    setAppState(AppState.LANDING);
  };

  const handleLeaveChat = () => {
    // Instead of window.confirm, show the custom modal
    setShowDisconnectModal(true);
  };

  const confirmDisconnect = () => {
    terminateSession();
    setAppState(AppState.LANDING);
    setShowDisconnectModal(false);
  };

  const handleLogoClick = () => {
    if (appState === AppState.CHAT) {
        setShowDisconnectModal(true);
    } else {
        handleCancelMatching();
    }
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-darker text-white overflow-hidden">
      <Header 
        appState={appState} 
        onLeaveChat={handleLeaveChat} 
        onLogoClick={handleLogoClick}
        onlineCount={onlineCount}
      />

      <Modal 
        isOpen={showDisconnectModal}
        title="Disconnect?"
        message="Are you sure you want to end this conversation? You will lose this chat history."
        onConfirm={confirmDisconnect}
        onCancel={() => setShowDisconnectModal(false)}
      />

      <RulesModal 
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Center Content */}
        <main className={`flex-1 relative flex flex-col w-full ${appState === AppState.CHAT ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          {appState === AppState.LANDING && (
            <div className="min-h-full flex flex-col items-center p-6 text-center animate-in fade-in zoom-in duration-300 pt-24 pb-6 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
              
              {/* Content Wrapper with safe centering (my-auto) */}
              <div className="flex flex-col items-center w-full max-w-3xl my-auto z-10">
                  <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">
                    Talk to <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Someone</span>
                  </h1>
                  
                  {/* Updated Text with wider container to prevent cutting off */}
                  <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto leading-relaxed px-4">
                    Connect anonymously with random strangers instantly. No login required. Just meaningful (or weird) conversations.
                  </p>

                  {/* Mobile & Tablet Ad Unit - High Visibility (Above Buttons) */}
                  <div className="w-full max-w-xs mb-6 block lg:hidden z-10">
                     <AdUnit label="Mobile/Tablet Partner Ad" />
                  </div>
                  
                  <div className="flex flex-col gap-4 w-full max-w-sm z-10">
                    <Button onClick={handleStartMatching} className="w-full text-lg py-4">
                      Start Chatting
                    </Button>
                    <p className="text-xs text-slate-500 text-center">
                        By clicking "Start Chatting", you agree to our <button onClick={() => setShowRulesModal(true)} className="underline hover:text-slate-300 transition-colors">Terms & Guidelines</button>.
                    </p>
                  </div>

                  {/* Feature Pills */}
                  <div className="mt-16 flex flex-wrap justify-center gap-4 text-sm font-medium text-slate-500">
                    <span className="bg-slate-900/50 border border-slate-800 px-4 py-2 rounded-full">
                      🔒 Anonymous
                    </span>
                    <span className="bg-slate-900/50 border border-slate-800 px-4 py-2 rounded-full">
                      ⚡ Instant Match
                    </span>
                    <span className="bg-slate-900/50 border border-slate-800 px-4 py-2 rounded-full">
                      🌍 Global
                    </span>
                  </div>

                  {/* Landing Page Ad (Bottom) */}
                  <div className="mt-12 w-full max-w-lg z-10">
                    <AdUnit label="Sponsored Partner" />
                  </div>
              </div>

              {/* Compliance Footer Links - Absolute Bottom */}
              <div className="mt-auto pt-8 z-10 w-full flex flex-col items-center">
                 <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-500 font-medium">
                      <button onClick={() => setShowRulesModal(true)} className="hover:text-white transition-colors">About Us</button>
                      <span className="opacity-30">•</span>
                      <button onClick={() => setShowRulesModal(true)} className="hover:text-white transition-colors">Safety</button>
                      <span className="opacity-30">•</span>
                      <button onClick={() => setShowRulesModal(true)} className="hover:text-white transition-colors">Privacy</button>
                      <span className="opacity-30">•</span>
                      <button onClick={() => setShowRulesModal(true)} className="hover:text-white transition-colors">Contact</button>
                 </div>
                 <div className="text-xs text-slate-500 font-medium mt-2">
                    © 2025 StrangerConnect. All Rights Reserved.
                 </div>
              </div>
            </div>
          )}

          {appState === AppState.MATCHING && (
            <MatchingScreen onCancel={handleCancelMatching} />
          )}

          {appState === AppState.CHAT && (
            <ChatInterface onEndChat={handleLeaveChat} onStartNewChat={handleStartMatching} />
          )}
        </main>

      </div>
    </div>
  );
};

export default App;