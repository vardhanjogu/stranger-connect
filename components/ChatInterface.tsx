import React, { useState, useEffect, useRef } from 'react';
import { Message } from '../types';
import { sendMessageToStranger, sendTypingStatus, sendSignal, terminateSession } from '../services/geminiService';
import { playSound } from '../services/soundService';
import { Button } from './Button';
import { AdUnit } from './AdUnit';
import { Modal } from './Modal';
import { TypingIndicator } from './TypingIndicator';

interface ChatInterfaceProps {
  onEndChat: () => void;
  onStartNewChat: () => void;
}

// Local Storage Key
const STORAGE_KEY = 'stranger_connect_history';

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onEndChat, onStartNewChat }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isChatActive, setIsChatActive] = useState(true);
  const [disconnectReason, setDisconnectReason] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<any>(null);
  
  // Inactivity Timer Refs
  const lastActivityRef = useRef<number>(Date.now());
  const timeoutTriggeredRef = useRef<boolean>(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 1. Load History on Mount
  useEffect(() => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
          try {
              const parsed = JSON.parse(stored);
              // Take last 10 messages
              const recent = parsed.slice(-10);
              // Convert stored timestamps back to Date objects
              const hydrated = recent.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
              
              // Only load if we have some reasonable history, else start fresh
              if (hydrated.length > 0) {
                  setMessages(hydrated);
              } else {
                  addSystemMessage("You are connected with a real stranger. Say hello!");
              }
          } catch (e) {
              console.error("Failed to parse chat history", e);
              addSystemMessage("You are connected with a real stranger. Say hello!");
          }
      } else {
          addSystemMessage("You are connected with a real stranger. Say hello!");
      }
      
      // Auto-focus input
      setTimeout(() => {
          inputRef.current?.focus();
      }, 100);
  }, []);

  // 2. Persist Messages
  useEffect(() => {
      if (messages.length > 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      }
      scrollToBottom();
  }, [messages, isTyping]);

  // 3. Clear Storage Helper
  const clearHistory = () => {
      localStorage.removeItem(STORAGE_KEY);
  };

  const addSystemMessage = (text: string) => {
      setMessages(prev => [...prev, {
          id: 'sys-' + Date.now(),
          role: 'model',
          text: text,
          timestamp: new Date()
      }]);
  };

  // Inactivity Check Interval (Auto-Disconnect)
  useEffect(() => {
    const intervalId = setInterval(() => {
        if (isChatActive && !timeoutTriggeredRef.current) {
            const idleTime = Date.now() - lastActivityRef.current;
            if (idleTime > 60000) { // 60 seconds of silence from BOTH sides
                handleTimeout();
            }
        }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isChatActive]);

  const handleTimeout = async () => {
      if (timeoutTriggeredRef.current) return;
      timeoutTriggeredRef.current = true;

      // Attempt to notify the other user before closing
      try {
          await sendSignal("TIMEOUT");
      } catch (e) {
          // Ignore errors
      }

      terminateSession();
      playSound('disconnect');
      setIsChatActive(false);
      clearHistory();
      setDisconnectReason("Connection timed out due to inactivity.");
      addSystemMessage("Connection timed out due to inactivity.");
  };

  useEffect(() => {
    // Listen for custom events dispatched by App.tsx (simple communication bridge)
    const handleIncomingMessage = (e: CustomEvent) => {
        const text = e.detail;

        if (text === "__TIMEOUT_SIGNAL__") {
            if (timeoutTriggeredRef.current) return;
            timeoutTriggeredRef.current = true;
            terminateSession();
            playSound('disconnect');
            setIsChatActive(false);
            clearHistory();
            setDisconnectReason("Connection timed out due to inactivity.");
            addSystemMessage("Connection timed out due to inactivity.");
            return;
        }

        // Reset activity timer
        lastActivityRef.current = Date.now();
        setIsTyping(false); // Stop typing animation immediately when message arrives

        playSound('incoming');
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'model', 
            text: text,
            timestamp: new Date()
        }]);
    };

    const handleIncomingTyping = (e: CustomEvent) => {
        const isPeerTyping = e.detail;
        setIsTyping(isPeerTyping);
        // Updating typing status also counts as activity to prevent timeout while someone is writing a long essay
        if (isPeerTyping) {
            lastActivityRef.current = Date.now(); 
        }
    };

    const handlePeerDisconnect = () => {
        if (timeoutTriggeredRef.current) return;

        playSound('disconnect');
        setIsChatActive(false);
        clearHistory();
        setDisconnectReason("Stranger has disconnected.");
        addSystemMessage("Stranger has disconnected.");
    };

    window.addEventListener('peer-message', handleIncomingMessage as EventListener);
    window.addEventListener('peer-typing', handleIncomingTyping as EventListener);
    window.addEventListener('peer-disconnect', handlePeerDisconnect as EventListener);

    return () => {
        window.removeEventListener('peer-message', handleIncomingMessage as EventListener);
        window.removeEventListener('peer-typing', handleIncomingTyping as EventListener);
        window.removeEventListener('peer-disconnect', handlePeerDisconnect as EventListener);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputText(e.target.value);
      
      // Debounce typing status
      if (isChatActive) {
          sendTypingStatus(true);
          
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          
          typingTimeoutRef.current = setTimeout(() => {
              sendTypingStatus(false);
          }, 2000);
      }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || !isChatActive) return;

    // Reset activity timer on sending
    lastActivityRef.current = Date.now();

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    playSound('outgoing');
    
    // Clear typing status immediately
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    sendTypingStatus(false);

    try {
      await sendMessageToStranger(userMsg.text);
    } catch (error) {
      console.error("Failed to send", error);
    }
  };

  const handleEndChat = () => {
      clearHistory();
      onEndChat();
  };

  const handleReportUser = () => {
      console.log("REPORT_ACTION: User reported conversation", {
          timestamp: new Date().toISOString(),
          messageCount: messages.length
      });
      setShowReportModal(false);
      alert("User reported. Thank you for helping keep StrangerConnect safe.");
      if (isChatActive) {
          handleEndChat();
      }
  };

  return (
    <>
      <Modal 
        isOpen={showReportModal}
        title="Report User"
        message="Are you sure you want to report this user? This will log the incident and disconnect you."
        onConfirm={handleReportUser}
        onCancel={() => setShowReportModal(false)}
      />

      <div className="flex flex-col flex-1 min-h-0 w-full max-w-3xl mx-auto pt-16">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          
          {/* Chat Top Ad */}
          <AdUnit label="Support StrangerConnect" className="mb-6 opacity-80 hover:opacity-100 transition-opacity" />

          {messages.map((msg, index) => {
              const isMe = msg.role === 'user';
              const isSystem = msg.text.includes("You are connected") || 
                              msg.text.includes("Stranger has disconnected") || 
                              msg.text.includes("Connection timed out");
              
              if (isSystem) {
                  return (
                      <div key={msg.id} className="flex justify-center my-4 animate-fade-in-up">
                          <span className="text-xs font-medium text-slate-500 bg-surface/80 px-3 py-1 rounded-full border border-border">
                              {msg.text}
                          </span>
                      </div>
                  );
              }

              return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                      <div 
                          className={`max-w-[85%] md:max-w-[75%] px-4 py-2 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed break-words ${
                          isMe 
                              ? 'bg-primary text-white rounded-tr-sm' 
                              : 'bg-surface text-foreground rounded-tl-sm border border-border'
                          }`}
                      >
                          {msg.text}
                      </div>
                  </div>
              );
          })}
          
          {/* Dynamic Typing Indicator Container */}
          {/* Changed transition-opacity to have a longer duration for smoothness */}
          <div className={`flex justify-start transition-all duration-500 ease-in-out transform ${isTyping ? 'opacity-100 translate-y-0 max-h-20' : 'opacity-0 translate-y-4 max-h-0 overflow-hidden'}`}>
             <TypingIndicator />
          </div>
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-background/90 backdrop-blur border-t border-border pb-[env(safe-area-inset-bottom,20px)]">
          {isChatActive ? (
              <div className="flex flex-col gap-2">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setShowReportModal(true)}
                        className="p-3 rounded-full bg-surface border border-border text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-colors"
                        title="Report User"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                            <line x1="4" y1="22" x2="4" y2="15"></line>
                        </svg>
                    </button>
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputText}
                        onChange={handleInputChange}
                        placeholder="Type a message..."
                        className="flex-1 bg-surface border border-border text-foreground rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder-slate-500 disabled:opacity-50"
                    />
                    <Button 
                        type="submit" 
                        disabled={!inputText.trim()}
                        className="!px-4 !py-3 rounded-full"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                        </svg>
                    </Button>
                </form>
                <div className="text-center">
                    <button onClick={handleEndChat} className="text-xs font-medium text-red-500 hover:text-red-400 transition-colors">
                        Stop this chat (ESC)
                    </button>
                </div>
              </div>
          ) : (
              <div className="flex flex-col gap-3 animate-fade-in-up">
                  {disconnectReason && (
                      <div className="text-center text-amber-500 font-medium text-sm bg-amber-500/10 py-2 rounded-lg border border-amber-500/20">
                          {disconnectReason}
                      </div>
                  )}
                  <Button onClick={onStartNewChat} className="w-full" variant="secondary">
                      Find New Stranger
                  </Button>
              </div>
          )}
        </div>
      </div>
    </>
  );
};