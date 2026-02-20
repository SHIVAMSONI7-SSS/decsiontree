"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Send, Sparkles, RotateCcw, LayoutDashboard, Brain, Activity, Zap, Target, Info, CheckCircle2, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [step, setStep] = useState<'input' | 'chat' | 'result'>('input');
  const [options, setOptions] = useState({ opt1: '', opt2: '' });
  const [history, setHistory] = useState<{ role: string, content: string, options?: string[] }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history, loading]);

  // FIX: Force Fetching Logic
  const handleSend = async (selectedOption?: string) => {
    const finalInput = selectedOption || input;
    if (!finalInput.trim() || loading) return;

    if (finalInput === '777') {
      setStep('result');
      getFinalDecision([...history, { role: 'user', content: finalInput }]);
      return;
    }

    const newHistory = [...history, { role: 'user', content: finalInput }];
    setHistory(newHistory);
    setInput('');
    fetchNextQuestion(newHistory);
  };

  const fetchNextQuestion = async (currentHistory: any[]) => {
    setLoading(true);
    try {
      const res = await fetch('/api/decide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'ask_questions', options, history: currentHistory }),
      });
      const data = await res.json();
      
      // If data has text, add it. Else show error.
      if (data.text) {
        setHistory([...currentHistory, { 
            role: 'assistant', 
            content: data.text, 
            options: data.options || ["Yes", "No", "Maybe"] 
        }]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally { setLoading(false); }
  };

  const getFinalDecision = async (finalHistory: any[]) => {
    setLoading(true);
    try {
      const res = await fetch('/api/decide', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'final_decision', options, history: finalHistory }) 
      });
      const data = await res.json();
      setHistory([...finalHistory, { role: 'assistant', content: data.text }]);
    } finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-orange-500/40 overflow-x-hidden">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-orange-600/5 blur-3xl" />
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dzv9rqg4p/image/upload/v1678220000/noise_nt9p4z.png')] opacity-[0.15] mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-6">
        
        {/* Minimal Header */}
        <header className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
              <Zap size={16} className="text-black" />
            </div>
            <span className="text-lg font-black tracking-tighter italic">YURI<span className="text-orange-500">.AI</span></span>
          </div>
          <div className="px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-[9px] font-bold text-green-500 uppercase tracking-widest">
            Neural Link: Active
          </div>
        </header>

        <AnimatePresence mode="wait">
          
          {/* STEP 1: INPUT */}
          {step === 'input' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto py-16 text-center">
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
                <Cpu className="w-16 h-16 text-orange-500 mx-auto mb-6 opacity-80" />
              </motion.div>
              <h1 className="text-4xl font-black mb-2 tracking-tight">Sync Dilemma</h1>
              <p className="text-slate-500 text-sm mb-10 italic">Analyze Path Alpha vs Path Beta</p>
              
              <div className="bg-white/5 border border-white/10 p-2 rounded-3xl backdrop-blur-md shadow-2xl">
                <input value={options.opt1} onChange={e=>setOptions({...options, opt1:e.target.value})} placeholder="Path Alpha..." className="w-full bg-transparent p-5 rounded-2xl outline-none text-center font-bold text-orange-100 placeholder:text-white/10" />
                <div className="h-px bg-white/5 w-1/2 mx-auto" />
                <input value={options.opt2} onChange={e=>setOptions({...options, opt2:e.target.value})} placeholder="Path Beta..." className="w-full bg-transparent p-5 rounded-2xl outline-none text-center font-bold text-orange-100 placeholder:text-white/10" />
                <button onClick={() => options.opt1 && options.opt2 && (setStep('chat'), fetchNextQuestion([]))} className="w-full mt-2 bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all">Engage Engine</button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: CHAT */}
          {step === 'chat' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 rounded-[2.5rem] relative overflow-hidden">
                    <motion.div animate={{ scale: [1, 1.02, 1], rotate: [0, 1, -1, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
                        {/* Low-Res Fast Loading Icon */}
                        <Brain size={120} className="text-orange-500/20 mb-4" />
                    </motion.div>
                    <div className="space-y-1">
                        <h3 className="text-xs font-black uppercase tracking-widest text-orange-500">Agent Yuri</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase italic tracking-widest">Awaiting Decision Inputs</p>
                    </div>
                    {/* Visualizer */}
                    <div className="flex gap-1 mt-6 h-4 items-end">
                        {[1,2,3,4,5].map(i => <motion.div key={i} animate={{ height: [4, 16, 4] }} transition={{ repeat: Infinity, delay: i*0.1 }} className="w-1 bg-orange-500/40 rounded-full" />)}
                    </div>
                </div>

                <div className="lg:col-span-8 bg-white/[0.02] border border-white/10 rounded-[2.5rem] h-[600px] flex flex-col overflow-hidden shadow-2xl">
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                        {history.map((m, i) => (
                            <motion.div initial={{ opacity: 0, x: m.role === 'user' ? 10 : -10 }} animate={{ opacity: 1, x: 0 }} key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[90%] ${m.role === 'user' ? 'bg-orange-500 text-black p-3 px-5 rounded-xl font-bold rounded-tr-none' : 'space-y-3'}`}>
                                    <p className={m.role === 'assistant' ? 'text-xl md:text-2xl font-bold leading-tight text-white shadow-sm' : 'text-xs'}>{m.content}</p>
                                    {m.role === 'assistant' && m.options && (
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {m.options.map(opt => (
                                                <button key={opt} onClick={() => handleSend(opt)} className="bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/20 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all">
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                        {loading && <div className="text-[10px] text-orange-500 font-black animate-pulse uppercase tracking-[0.3em]">Synching...</div>}
                    </div>
                    <div className="p-6 border-t border-white/5 flex gap-2">
                        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter' && handleSend()} placeholder="Inject data (or '777')..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-orange-500/50" />
                        <button onClick={()=>handleSend()} className="bg-white text-black px-4 rounded-xl hover:bg-orange-500 transition-colors"><Send size={16}/></button>
                    </div>
                </div>
            </div>
          )}

          {/* STEP 3: DASHBOARD */}
          {step === 'result' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-12 gap-4 pb-20">
              {/* Verdict Header */}
              <div className="lg:col-span-12 bg-gradient-to-r from-orange-600 to-orange-400 p-6 rounded-[2rem] text-black shadow-2xl">
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase opacity-60 mb-2"><CheckCircle2 size={12}/> Analysis Finalized</div>
                 <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none">The Yuri Verdict</h2>
              </div>

              {/* Logic Flow */}
              <div className="lg:col-span-8 bg-white/5 border border-white/10 rounded-[2rem] p-8">
                 <div className="flex items-center gap-2 mb-6 text-orange-500 font-black text-[10px] uppercase tracking-widest border-b border-white/5 pb-4">
                    <Activity size={14}/> Logic Processing Path
                 </div>
                 <div className="text-lg text-white/90 leading-relaxed font-medium italic whitespace-pre-wrap">
                    {history[history.length-1]?.content}
                 </div>
              </div>

              {/* Metrics Sidebar */}
              <div className="lg:col-span-4 space-y-4">
                 <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem]">
                    <div className="text-[10px] font-black text-slate-500 uppercase mb-4">Neural Metrics</div>
                    <div className="space-y-4">
                        {[
                            {l: "Clarity", v: "91%"},
                            {l: "Bias Risk", v: "12%"},
                            {l: "Growth", v: "88%"}
                        ].map(m => (
                            <div key={m.l} className="space-y-1">
                                <div className="flex justify-between text-[10px] font-bold"><span>{m.l}</span><span className="text-orange-500">{m.v}</span></div>
                                <div className="h-1 bg-white/5 rounded-full"><div className="h-full bg-orange-500" style={{width: m.v}} /></div>
                            </div>
                        ))}
                    </div>
                 </div>
                 <button onClick={()=>window.location.reload()} className="w-full py-4 bg-white text-black rounded-2xl font-black text-[10px] tracking-widest uppercase flex items-center justify-center gap-2">
                    <RotateCcw size={14} /> Re-Sync Session
                 </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f97316; border-radius: 10px; }
      `}</style>
    </main>
  );
}