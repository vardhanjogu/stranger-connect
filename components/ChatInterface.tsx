import React, { useState, useEffect, useRef } from 'react';
import { Message } from '../types';
import { sendMessageToStranger, sendTypingStatus, terminateSession } from '../services/geminiService';
import { playSound } from '../services/soundService';
import { Button } from './Button';
import { AdUnit } from './AdUnit';
import { Modal } from './Modal';
import { TypingIndicator } from './TypingIndicator';

interface ChatInterfaceProps {
  onEndChat: () => void;
  onStartNewChat: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onEndChat, onStartNewChat }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isChatActive, setIsChatActive] = useState(true);
  const [disconnectReason, setDisconnectReason] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    addSystemMessage("Matched with a stranger. Say hey.");
    setTimeout(() => inputRef.current?.focus(), 500);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const addSystemMessage = (text: string) => {
    setMessages(prev => [...prev, {
      id: 'sys-' + Date.now() + Math.random(),
      role: 'model',
      text: text,
      timestamp: new Date()
    }]);
  };

  useEffect(() => {
    const handleIncomingMessage = (e: CustomEvent) => {
      if (e.detail === "__TIMEOUT_SIGNAL__") { handlePeerDisconnect(); return; }
      setIsTyping(false);
      playSound('incoming');
      setMessages(prev => [...prev, {
        id: 'msg-' + Date.now(),
        role: 'model',
        text: e.detail,
        timestamp: new Date()
      }]);
    };

    const handleIncomingTyping = (e: CustomEvent) => setIsTyping(e.detail);
    const handlePeerDisconnect = () => {
      setIsChatActive(false);
      setDisconnectReason("They ghosted.");
      addSystemMessage("Session closed.");
      playSound('disconnect');
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

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || !isChatActive) return;
    const text = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { id: 'me-' + Date.now(), role: 'user', text, timestamp: new Date() }]);
    playSound('outgoing');
    sendTypingStatus(false);
    sendMessageToStranger(text);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'StrangerConnect',
      text: 'Talking to someone random on StrangerConnect. Join me?',
      url: window.location.origin,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        if (typeof window.gtag === 'function') window.gtag('event', 'share_native');
      } catch (err) {}
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'share_link_copied');
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full w-full max-w-2xl mx-auto pt-28 px-4 pb-6">
      <Modal 
        isOpen={showReportModal}
        title="Report for safety?"
        message="This blocks the user and sends an incident report. Conversation ends now."
        onConfirm={() => {
            if (typeof window.gtag === 'function') window.gtag('event', 'user_report');
            setShowReportModal(false);
            onEndChat();
        }}
        onCancel={() => setShowReportModal(false)}
      />

      <div className="flex-1 overflow-y-auto space-y-6 pb-4 scrollbar-hide">
        {messages.map((msg) => {
          const isMe = msg.role === 'user';
          const isSystem = msg.id.startsWith('sys-');
          
          if (isSystem) return (
            <div key={msg.id} className="flex justify-center my-10">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 px-8 py-2 border-y border-white/5">
                {msg.text}
              </span>
            </div>
          );

          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
              <div className={`px-6 py-4 rounded-[2rem] text-lg font-bold max-w-[85%] ${
                isMe ? 'bg-primary text-black rounded-tr-sm' : 'glass text-white rounded-tl-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          );
        })}
        {isTyping && <div className="flex justify-start"><TypingIndicator /></div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4">
        {isChatActive ? (
          <form onSubmit={handleSendMessage} className="flex gap-3 glass p-2 rounded-[2.5rem] shadow-2xl">
            <button
              type="button"
              onClick={() => setShowReportModal(true)}
              className="w-12 h-12 flex items-center justify-center text-white/30 hover:text-red-500 transition-colors"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
            </button>
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                sendTypingStatus(e.target.value.length > 0);
              }}
              placeholder="Vibe check..."
              className="flex-1 bg-transparent border-none text-white px-4 py-3 text-lg focus:outline-none placeholder:text-white/20"
            />
            <button 
              type="submit" 
              disabled={!inputText.trim()}
              className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-black disabled:opacity-20 active:scale-90 transition-transform"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></svg>
            </button>
          </form>
        ) : (
          <div className="space-y-4 animate-in fade-in zoom-in duration-300">
            {/* Week 4: Monetization on End-of-Chat */}
            <AdUnit className="mb-4" />

            <div className="p-8 glass rounded-[3rem] text-center space-y-6">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter text-white/40">{disconnectReason}</h3>
                
                {/* Week 3: Viral Loop Refined */}
                <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/5 space-y-6">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-white/30">Did they pass the vibe check? Share the link.</p>
                    
                    <div className="flex gap-3">
                        <button 
                            onClick={handleShare}
                            className="flex-1 py-4 bg-primary text-black rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                            Invite
                        </button>
                        <button 
                            onClick={() => window.open(`https://wa.me/?text=Vibe%20check%20with%20strangers%20on%20${window.location.origin}`)}
                            className="w-14 py-4 bg-green-500 text-white rounded-2xl flex items-center justify-center"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                        </button>
                    </div>
                </div>

                <Button onClick={onStartNewChat} className="w-full text-3xl py-10 rounded-[2.5rem]">
                    New Stranger
                </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};