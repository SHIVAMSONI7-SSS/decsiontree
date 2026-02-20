"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Send, Sparkles, RotateCcw, LayoutDashboard, Brain, BarChart3, Fingerprint, Layers, Cpu } from "lucide-react";
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

  const handleSend = async (selectedOption?: string) => {
    const finalInput = selectedOption || input;
    if (!finalInput.trim() || loading) return;
    const newHistory = [...history, { role: 'user', content: finalInput }];
    setHistory(newHistory);
    setInput('');
    if (finalInput.toLowerCase().includes('dashboard') || newHistory.filter(m => m.role === 'user').length >= 7) {
      setStep('result');
      getFinalDecision(newHistory);
    } else {
      fetchNextQuestion(newHistory);
    }
  };

  const fetchNextQuestion = async (currentHistory: any[]) => {
    setLoading(true);
    try {
      const res = await fetch('/api/decide', {
        method: 'POST',
        body: JSON.stringify({ mode: 'ask_questions', options, history: currentHistory }),
      });
      const data = await res.json();
      setHistory([...currentHistory, { role: 'assistant', content: data.text, options: data.options }]);
    } finally { setLoading(false); }
  };

  const getFinalDecision = async (finalHistory: any[]) => {
    setLoading(true);
    const res = await fetch('/api/decide', { method: 'POST', body: JSON.stringify({ mode: 'final_decision', options, history: finalHistory }) });
    const data = await res.json();
    setHistory([...finalHistory, { role: 'assistant', content: data.text }]);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-white selection:bg-orange-500/30 selection:text-orange-200 font-sans overflow-x-hidden relative">
      
      {/* Background Orbs for SaaS Feel */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col items-center">
        
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-[0.2em] text-orange-400 mb-6 uppercase">
            <Fingerprint size={12} /> Neural Decision Engine v2.0
          </div>
          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent mb-4">
            Yuri <span className="italic font-serif font-light text-white/90">Intelligence.</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
            Eliminate cognitive bias with our recursive analysis probe. Let the logic win.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          
          {/* STEP 1: GLASSSMORPHIC INPUT */}
          {step === 'input' && (
            <motion.div key="input" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="w-full max-w-3xl">
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-12 shadow-2xl relative overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 tracking-widest uppercase ml-2">Objective A</label>
                    <input 
                      value={options.opt1} onChange={e=>setOptions({...options, opt1:e.target.value})}
                      placeholder="e.g. Scaling Startup"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm focus:border-orange-500/50 outline-none transition-all placeholder:text-white/10" 
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 tracking-widest uppercase ml-2">Objective B</label>
                    <input 
                      value={options.opt2} onChange={e=>setOptions({...options, opt2:e.target.value})}
                      placeholder="e.g. Corporate Growth"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm focus:border-orange-500/50 outline-none transition-all placeholder:text-white/10" 
                    />
                  </div>
                </div>
                <button 
                  onClick={() => options.opt1 && options.opt2 && setStep('chat')}
                  className="w-full mt-10 bg-white text-black py-5 rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-orange-500 hover:text-white transition-all shadow-xl shadow-white/5"
                >
                  Initialize Analysis Sequence
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: AGENTIC CHAT */}
          {step === 'chat' && (
            <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-3xl h-[600px] bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-[3rem] flex flex-col overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">Processing Variables</span>
                </div>
                <button onClick={()=>handleSend("Give me dashboard")} className="text-[10px] font-bold text-white/40 hover:text-white transition-colors">SKIP TO VERDICT →</button>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                {history.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-5 rounded-2xl text-[13px] leading-relaxed ${m.role === 'user' ? 'bg-white text-black rounded-tr-none' : 'bg-white/5 border border-white/10 text-white/80 rounded-tl-none'}`}>
                      {m.content}
                      {m.role === 'assistant' && m.options && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {m.options.map(opt => (
                            <button key={opt} onClick={() => handleSend(opt)} className="bg-white/10 hover:bg-orange-500 px-3 py-2 rounded-xl text-[10px] font-bold transition-all border border-white/5">{opt}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {loading && <div className="text-[10px] text-slate-500 flex items-center gap-2"><Cpu size={12} className="animate-spin" /> Yuri is synthesizing...</div>}
              </div>

              <div className="p-6 bg-black/40 backdrop-blur-md">
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-2 focus-within:border-white/20 transition-all">
                  <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter' && handleSend()} placeholder="Input your perspective..." className="flex-1 bg-transparent py-3 text-xs outline-none" />
                  <button onClick={()=>handleSend()} className="p-2 text-orange-500"><Send size={18}/></button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: ANALYTICS DASHBOARD */}
          {step === 'result' && (
            <motion.div key="result" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-6xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Main Card */}
                <div className="lg:col-span-8 bg-white/[0.02] border border-white/10 rounded-[3rem] p-10 shadow-2xl min-h-[600px] flex flex-col">
                  <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
                    <div className="p-4 bg-orange-500/20 text-orange-500 rounded-3xl"><LayoutDashboard size={28}/></div>
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight">Executive Summary</h2>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">Post-Neural Analysis Report</p>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto text-sm text-slate-300 leading-loose whitespace-pre-wrap font-medium pr-4 custom-scrollbar">
                    {loading ? "Crunching terabytes of user data..." : history[history.length-1]?.content}
                  </div>
                </div>

                {/* Sidebar Cards */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-white text-black p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Sparkles size={60} /></div>
                    <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-4">Final Verdict</h3>
                    <p className="text-xl font-bold leading-tight italic underline decoration-orange-500 underline-offset-4 decoration-4">Analysis suggests immediate pivot.</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-md">
                    <h3 className="text-[10px] font-black tracking-widest text-slate-500 uppercase mb-8 flex items-center gap-2">
                      <BarChart3 size={14}/> Bias Metrics
                    </h3>
                    <div className="space-y-6">
                      {['Emotional Bias', 'Risk Tolerance', 'Goal Alignment'].map((m, i) => (
                        <div key={m} className="space-y-2">
                          <div className="flex justify-between text-[10px] font-bold text-slate-400"><span>{m}</span><span className="text-white">{[15, 88, 92][i]}%</span></div>
                          <div className="h-[2px] bg-white/5 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${[15, 88, 92][i]}%` }} className="h-full bg-orange-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button onClick={()=>window.location.reload()} className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl font-bold text-[10px] tracking-widest uppercase hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                    <RotateCcw size={14}/> New Investigation
                  </button>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </main>
  );
}