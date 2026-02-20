"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, Terminal, Hash, Sparkles, User } from 'lucide-react';

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Namaste! Main YURI hoon, Shivam ka AI assistant. Aaj kis baare mein baat karni hai?" }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/decide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Server error! Shivam ko report karo turant." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-[#0f172a] p-4 text-white shadow-md flex items-center justify-between px-6 lg:px-20">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 p-2 rounded-xl">
            <Terminal size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">YURI INTELLIGENCE</h1>
            <p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest">Shivam's Personal Brain</p>
          </div>
        </div>
        <div className="hidden md:block text-slate-400 text-xs font-mono">
          STATUS: ONLINE | MODEL: LLAMA-3.3
        </div>
      </header>

      {/* Chat Container */}
      <main className="flex-1 overflow-hidden flex flex-col items-center p-4">
        <div 
          ref={scrollRef}
          className="w-full max-w-3xl flex-1 overflow-y-auto space-y-6 py-8 px-2 scrollbar-hide"
        >
          {messages.map((msg, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={i} 
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                msg.role === 'user' ? 'bg-[#0f172a]' : 'bg-orange-500'
              }`}>
                {msg.role === 'user' ? <User size={16} className="text-white"/> : <Bot size={16} className="text-white"/>}
              </div>
              
              <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-[#0f172a] text-white rounded-tr-none' 
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
              }`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
          
          {loading && (
            <div className="flex gap-4 items-center">
              <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse flex items-center justify-center">
                <Sparkles size={16} className="text-slate-400" />
              </div>
              <div className="bg-slate-200/50 px-4 py-2 rounded-xl animate-pulse text-xs text-slate-500">
                Processing query...
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Input Area */}
      <footer className="p-6 bg-white border-t border-slate-200 flex justify-center">
        <div className="w-full max-w-3xl relative">
          <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-2 border border-slate-200 focus-within:ring-2 ring-orange-500/20 transition-all shadow-inner">
            <Hash size={18} className="text-slate-400" />
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me about Shivam's projects or skills..."
              className="flex-1 bg-transparent outline-none py-3 text-sm text-slate-700"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white p-2.5 rounded-xl transition-all shadow-lg shadow-orange-500/20"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-3">
            YURI can make mistakes. Shivam is the real genius here.
          </p>
        </div>
      </footer>
    </div>
  );
}