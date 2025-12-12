import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ChatInterface } from './components/ChatInterface';
import { MatchingScreen } from './components/MatchingScreen';
import { Footer } from './components/Footer';
import { Button } from './components/Button';
import { Modal } from './components/Modal';
import { RulesModal } from './components/RulesModal';
import { SettingsModal } from './components/SettingsModal';
import { AdUnit } from './components/AdUnit';
import { AppState, UserSettings } from './types';
import { initializePeerSession, terminateSession } from './services/geminiService';
import { playSound, initAudio } from './services/soundService';

// Analytics global declaration
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
  
  // Ref for the main scrollable container
  const mainRef = useRef<HTMLElement>(null);

  // User Preferences / Settings
  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    // Try to load from localStorage
    const saved = localStorage.getItem('stranger_settings');
    return saved ? JSON.parse(saved) : { theme: 'dark', notifications: true };
  });

  // Error Feedback
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);
  
  // Parallax State
  const [scrollY, setScrollY] = useState(0);

  // Apply Theme Effect
  useEffect(() => {
    // Remove all known theme classes
    document.body.classList.remove('theme-light', 'theme-midnight', 'theme-forest');
    
    // Apply selected theme (if not dark, which is default)
    if (userSettings.theme !== 'dark') {
      document.body.classList.add(`theme-${userSettings.theme}`);
    }
    
    // Save settings
    localStorage.setItem('stranger_settings', JSON.stringify(userSettings));
  }, [userSettings]);

  // Fetch Real Online Count
  useEffect(() => {
    const fetchCount = async () => {
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ action: 'stats' })
            });
            const data = await res.json();
            if (typeof data.onlineCount === 'number') {
                setOnlineCount(data.onlineCount);
            }
        } catch (e) {
            // Silently fail
        }
    };
    
    // Initial fetch
    fetchCount();

    const interval = setInterval(fetchCount, 5000);
    return () => clearInterval(interval);
  }, []);

  // Track Page Views
  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'screen_view', {
        screen_name: appState
      });
    }
  }, [appState]);

  // Scroll Listener for Parallax (Optimized & Fixed for Scroll Container)
  useEffect(() => {
      const el = mainRef.current;
      if (!el || appState !== AppState.LANDING) return;

      let ticking = false;
      const handleScroll = () => {
          if (!ticking) {
              window.requestAnimationFrame(() => {
                  if (el) {
                      setScrollY(el.scrollTop);
                  }
                  ticking = false;
              });
              ticking = true;
          }
      };
      
      el.addEventListener('scroll', handleScroll, { passive: true });
      return () => el.removeEventListener('scroll', handleScroll);
  }, [appState]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showRulesModal) setShowRulesModal(false);
        else if (showSettingsModal) setShowSettingsModal(false);
        else if (showDisconnectModal) setShowDisconnectModal(false);
        else if (appState === AppState.CHAT) setShowDisconnectModal(true);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [appState, showDisconnectModal, showRulesModal, showSettingsModal]);

  // Unified Event Handlers for Chat (Used by both P2P and AI)
  const handleChatConnect = () => {
      setAppState(AppState.CHAT);
      playSound('match');
  };
  
  const handleChatMessage = (text: string) => {
      const event = new CustomEvent('peer-message', { detail: text });
      window.dispatchEvent(event);
  };
  
  const handleChatTyping = (isTyping: boolean) => {
      const event = new CustomEvent('peer-typing', { detail: isTyping });
      window.dispatchEvent(event);
  };
  
  const handleChatDisconnect = () => {
      const event = new Event('peer-disconnect');
      window.dispatchEvent(event);
  };

  const handleStartMatching = () => {
    // CRITICAL: Initialize audio context on user gesture to ensure sounds play on iOS/Mobile
    initAudio();

    setAppState(AppState.MATCHING);
    setErrorFeedback(null);
    
    // Initialize P2P connection
    initializePeerSession(
        handleChatConnect,
        handleChatMessage,
        handleChatTyping,
        handleChatDisconnect
    ).catch((err) => {
        console.error("Failed to start session:", err);
        setAppState(AppState.LANDING);
        playSound('error');
        
        let msg = "We couldn't match you with anyone right now. Please try again.";
        const errStr = err.message || "";
        
        if (errStr.includes("timed out")) {
          msg = "Connection timed out. This is often due to a firewall or unstable internet. Please check your network and try again.";
        } else if (errStr.includes("unavailable") || errStr.includes("500") || errStr.includes("502")) {
          msg = "Our matchmaking server is currently experiencing high traffic or maintenance. Please wait a moment and try again.";
        } else if (errStr.includes("browser")) {
          msg = "Your browser does not support the required WebRTC features. Please try Chrome, Firefox, or Safari.";
        }
        
        setErrorFeedback(msg);
    });
  };

  const handleCancelMatching = () => {
    terminateSession();
    setAppState(AppState.LANDING);
  };

  const handleLeaveChat = () => {
    setShowDisconnectModal(true);
  };

  const confirmDisconnect = () => {
    terminateSession();
    playSound('disconnect');
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
    <div className="h-screen h-[100dvh] w-full flex flex-col bg-background text-foreground overflow-hidden transition-colors duration-500">
      <Header 
        appState={appState} 
        onLeaveChat={handleLeaveChat} 
        onLogoClick={handleLogoClick}
        onlineCount={onlineCount}
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      <Modal 
        isOpen={showDisconnectModal}
        title="Disconnect?"
        message="Are you sure you want to end this conversation?"
        onConfirm={confirmDisconnect}
        onCancel={() => setShowDisconnectModal(false)}
      />

      <RulesModal 
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        settings={userSettings}
        onSave={setUserSettings}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex overflow-hidden flex-col">
        
        {/* Center Content */}
        <main 
            ref={mainRef}
            className={`flex-1 relative flex flex-col w-full overflow-x-hidden ${appState === AppState.CHAT ? 'overflow-hidden' : 'overflow-y-auto'}`}
        >
          {appState === AppState.LANDING && (
            <div className="flex-1 flex flex-col items-center p-6 text-center animate-in fade-in zoom-in duration-300 pt-24 relative">
              
              {/* Parallax Background Blob */}
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-primary/20 via-purple-500/10 to-secondary/20 rounded-full blur-[120px] pointer-events-none transition-transform duration-100 ease-out will-change-transform"
                style={{ 
                    transform: `translate(-50%, calc(-50% + ${scrollY * 0.4}px))` 
                }}
              ></div>
              
              <div className="flex flex-col items-center w-full max-w-3xl my-auto z-10">
                  <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter drop-shadow-lg text-foreground">
                    Talk to <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Someone</span>
                  </h1>
                  
                  <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto leading-relaxed px-4 shadow-black drop-shadow-md">
                    Connect with REAL strangers instantly. No login required.
                  </p>

                  {/* Error Feedback Banner */}
                  {errorFeedback && (
                      <div className="w-full max-w-md bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm font-medium animate-bounce-slow flex flex-col gap-1">
                          <span className="flex items-center justify-center gap-2 font-bold">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                            Connection Failed
                          </span>
                          <span className="opacity-90">{errorFeedback}</span>
                      </div>
                  )}

                  <div className="w-full max-w-xs mb-6 block lg:hidden z-10">
                     <AdUnit label="Mobile/Tablet Partner Ad" />
                  </div>
                  
                  <div className="flex flex-col gap-4 w-full max-w-sm z-10">
                    <Button onClick={handleStartMatching} className="w-full text-lg py-4 shadow-xl shadow-primary/20">
                      Start Chatting
                    </Button>
                    <p className="text-xs text-slate-500 text-center">
                        By clicking "Start Chatting", you agree to our <button onClick={() => setShowRulesModal(true)} className="underline hover:text-foreground transition-colors">Terms & Guidelines</button>.
                    </p>
                  </div>

                  <div className="mt-16 flex flex-wrap justify-center gap-4 text-sm font-medium text-slate-500">
                    <span className="bg-surface/50 border border-border px-4 py-2 rounded-full backdrop-blur-sm">
                      🔒 Anonymous
                    </span>
                    <span className="bg-surface/50 border border-border px-4 py-2 rounded-full backdrop-blur-sm">
                      ⚡ P2P Connection
                    </span>
                    <span className="bg-surface/50 border border-border px-4 py-2 rounded-full backdrop-blur-sm">
                      🌍 Real Users
                    </span>
                  </div>

                  <div className="mt-12 w-full max-w-lg z-10">
                    <AdUnit label="Sponsored Partner" />
                  </div>
              </div>
            </div>
          )}

          {appState === AppState.MATCHING && (
            <MatchingScreen 
                onCancel={handleCancelMatching} 
                onlineCount={onlineCount} 
            />
          )}

          {appState === AppState.CHAT && (
            <ChatInterface onEndChat={handleLeaveChat} onStartNewChat={handleStartMatching} />
          )}

          {/* Footer for all pages */}
          <Footer onOpenRules={() => setShowRulesModal(true)} />

        </main>
      </div>
    </div>
  );
};

export default App;