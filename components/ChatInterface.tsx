import React, { useState, useEffect, useRef } from 'react';
import { Message } from '../types';
import { sendMessageToStranger } from '../services/geminiService';
import { TypingIndicator } from './TypingIndicator';
import { Button } from './Button';
import { AdUnit } from './AdUnit';

interface ChatInterfaceProps {
  onEndChat: () => void;
  onStartNewChat: () => void;
}

// Simple beep/pop sound generator using Web Audio API (No assets needed)
const playMessageSound = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        
        const ctx = new AudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(500, ctx.currentTime); 
        oscillator.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.1);
    } catch (e) {
        // Silently fail if audio not allowed
    }
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onEndChat, onStartNewChat }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isStrangerTyping, setIsStrangerTyping] = useState(false);
  const [isChatActive, setIsChatActive] = useState(true); // Track if session is alive locally
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStrangerTyping]);

  // Handle auto-scroll and auto-focus on mount
  useEffect(() => {
    setMessages([{
      id: 'sys-1',
      role: 'model', 
      text: "You are now connected with a random stranger. Say hello!",
      timestamp: new Date(),
    }]);
    
    inputRef.current?.focus();

    // 50% Chance for Stranger to start the conversation
    const strangerStarts = Math.random() > 0.5;
    if (strangerStarts) {
      handleSystemTrigger("[SYSTEM_INITIATE]");
    }
  }, []);

  // Inactivity Timer Logic
  useEffect(() => {
    if (!isChatActive) return;

    // Clear existing timer
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);

    // Set new timer (e.g., 45 seconds of user silence)
    inactivityTimerRef.current = setTimeout(() => {
        // If user hasn't typed in 45s, poke the AI
        handleSystemTrigger("[SYSTEM_INACTIVITY]");
    }, 45000);

    return () => {
        if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [messages, isChatActive]); // Reset timer whenever messages change

  const handleSystemTrigger = async (trigger: string) => {
      setIsStrangerTyping(true);
      try {
          const responseText = await sendMessageToStranger(trigger);
          processResponse(responseText);
      } catch (e) {
          setIsStrangerTyping(false);
      }
  };

  const processResponse = (responseText: string) => {
      // Check for Disconnect Flag
      const isDisconnecting = responseText.startsWith("__DISCONNECT__::");
      const cleanText = isDisconnecting ? responseText.replace("__DISCONNECT__::", "") : responseText;

      // Calculate delays for realism
      const baseDelay = Math.random() * 1000 + 500;
      const typingTime = Math.min(cleanText.length * 40, 3000); 
      const totalDelay = baseDelay + typingTime;

      setTimeout(() => {
        // Play sound if tab is active (and user interacted)
        playMessageSound();

        // Show the message (even if it's the last one)
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'model',
          text: cleanText,
          timestamp: new Date()
        }]);
        
        setIsStrangerTyping(false);

        // If the stranger initiated a disconnect, trigger the system message shortly after
        if (isDisconnecting) {
            setIsChatActive(false); // Disable input
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    role: 'model',
                    text: "Stranger has disconnected.",
                    timestamp: new Date(),
                }]);
            }, 1000);
        }
      }, totalDelay);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || !isChatActive) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsStrangerTyping(true);

    try {
      const responseText = await sendMessageToStranger(userMsg.text);
      processResponse(responseText);
    } catch (error) {
      // Fallback for critical errors
      setIsStrangerTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "Stranger has disconnected.",
        timestamp: new Date(),
      }]);
      setIsChatActive(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto pt-16">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        
        {/* Chat Top Ad */}
        <AdUnit label="Support StrangerConnect" className="mb-6 opacity-80 hover:opacity-100 transition-opacity" />

        {messages.map((msg, index) => {
            const isMe = msg.role === 'user';
            const isSystem = msg.text === "You are now connected with a random stranger. Say hello!" || msg.text === "Stranger has disconnected.";
            
            if (isSystem) {
                return (
                    <div key={msg.id} className="flex justify-center my-4">
                        <span className="text-xs font-medium text-slate-500 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800">
                            {msg.text}
                        </span>
                    </div>
                );
            }

            return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div 
                        className={`max-w-[85%] md:max-w-[75%] px-4 py-2 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed break-words ${
                        isMe 
                            ? 'bg-primary text-white rounded-tr-sm' 
                            : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700'
                        }`}
                    >
                        {msg.text}
                    </div>
                </div>
            );
        })}
        {isStrangerTyping && (
           <div className="flex justify-start">
             <TypingIndicator />
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-darker/90 backdrop-blur border-t border-white/10 pb-safe">
        {isChatActive ? (
            <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a message..."
                    disabled={isStrangerTyping}
                    className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder-slate-500 disabled:opacity-50"
                />
                <Button 
                    type="submit" 
                    disabled={!inputText.trim() || isStrangerTyping}
                    className="!px-4 !py-3 rounded-full"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                    </svg>
                </Button>
            </form>
        ) : (
            <div className="flex gap-2">
                <Button onClick={onStartNewChat} className="w-full" variant="secondary">
                    Start New Chat
                </Button>
            </div>
        )}
        
        {isChatActive && (
            <div className="text-center mt-2">
                <button onClick={onEndChat} className="text-xs font-medium text-red-500 hover:text-red-400 transition-colors mt-1">
                    Stop this chat (ESC)
                </button>
            </div>
        )}
      </div>
    </div>
  );
};