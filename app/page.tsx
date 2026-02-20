"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Send, RotateCcw, LayoutDashboard, Brain, Activity, Zap, Target, CheckCircle2, Cpu } from "lucide-react";
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
      if (data.text) {
        setHistory([...currentHistory, { 
            role: 'assistant', 
            content: data.text, 
            options: data.options || ["Yes", "No", "Maybe"] 
        }]);
      }
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
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
    <main className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-slate-200 overflow-x-hidden">
      
      {/* Subtle Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-slate-200/50 to-transparent blur-3xl opacity-50" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Yuri<span className="text-slate-400">.ai</span></span>
          </div>
          <div className="px-4 py-1.5 rounded-full border border-slate-200 bg-white shadow-sm text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Neural Sync: Online
          </div>
        </header>

        <AnimatePresence mode="wait">
          
          {/* STEP 1: MINIMAL INPUT */}
          {step === 'input' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto py-20">
              <div className="text-center mb-12">
                <h1 className="text-5xl font-bold tracking-tight text-slate-900 mb-4">Strategic Choice.</h1>
                <p className="text-slate-500">Input your trajectories for deep-link analysis.</p>
              </div>
              <div className="bg-white border border-slate-200 p-3 rounded-[2rem] shadow-xl shadow-slate-200/50">
                <input value={options.opt1} onChange={e=>setOptions({...options, opt1:e.target.value})} placeholder="Option Alpha" className="w-full bg-slate-50 p-6 rounded-2xl outline-none border border-transparent focus:border-slate-200 transition-all font-semibold" />
                <div className="text-center py-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Analysis Void</div>
                <input value={options.opt2} onChange={e=>setOptions({...options, opt2:e.target.value})} placeholder="Option Beta" className="w-full bg-slate-50 p-6 rounded-2xl outline-none border border-transparent focus:border-slate-200 transition-all font-semibold" />
                <button onClick={() => options.opt1 && options.opt2 && (setStep('chat'), fetchNextQuestion([]))} className="w-full mt-4 bg-slate-900 text-white py-5 rounded-2xl font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20">Analyze Now</button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: CLEAN CHAT */}
          {step === 'chat' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4 p-8 bg-white border border-slate-200 rounded-[2.5rem] text-center shadow-sm">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
                        <Brain size={80} className="text-slate-200 mx-auto mb-6" />
                    </motion.div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Decision Agent</h3>
                    <p className="text-sm font-medium mt-2">Processing {options.opt1} vs {options.opt2}</p>
                    <div className="mt-8 flex justify-center gap-1">
                        {[1,2,3].map(i => <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, delay: i*0.2 }} className="w-1.5 h-1.5 bg-slate-900 rounded-full" />)}
                    </div>
                </div>

                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-[3rem] h-[650px] flex flex-col overflow-hidden shadow-2xl relative">
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar bg-[#ffffff]">
                        {history.map((m, i) => (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] ${m.role === 'user' ? 'bg-slate-900 text-white p-4 px-6 rounded-2xl rounded-tr-none' : 'space-y-4'}`}>
                                    <p className={m.role === 'assistant' ? 'text-2xl font-bold text-slate-900 leading-tight' : 'text-sm font-medium'}>{m.content}</p>
                                    {m.role === 'assistant' && m.options && (
                                        <div className="flex flex-wrap gap-2 pt-4">
                                            {m.options.map(opt => (
                                                <button key={opt} onClick={() => handleSend(opt)} className="bg-slate-50 border border-slate-200 hover:bg-slate-900 hover:text-white px-5 py-3 rounded-xl text-[11px] font-bold uppercase transition-all shadow-sm">
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex gap-4">
                        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter' && handleSend()} placeholder="Type answer or '777'..." className="flex-1 bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm outline-none focus:ring-2 ring-slate-900/5 transition-all" />
                        <button onClick={()=>handleSend()} className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-slate-800 transition-all shadow-md"><Send size={20}/></button>
                    </div>
                </div>
            </div>
          )}

          {/* STEP 3: CLEAN DASHBOARD */}
          {step === 'result' && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 pb-20">
              <div className="bg-slate-900 p-10 rounded-[3rem] text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl">
                 <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2">Final Conclusion</div>
                    <h2 className="text-4xl font-bold tracking-tight">The Logical Path</h2>
                 </div>
                 <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-md text-center min-w-[150px]">
                    <div className="text-[10px] font-bold uppercase opacity-60 mb-1">Confidence</div>
                    <div className="text-4xl font-black">94%</div>
                 </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm">
                    <div className="flex items-center gap-2 mb-8 text-slate-400 font-bold text-[10px] uppercase tracking-widest border-b border-slate-50 pb-4">
                        <Activity size={14}/> Core Synthesis
                    </div>
                    <div className="text-xl text-slate-800 leading-relaxed font-medium whitespace-pre-wrap">
                        {history[history.length-1]?.content}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Neural Metrics</h3>
                        <div className="space-y-6">
                            {[{l: "Logical Fit", v: "91%"}, {l: "Risk Buffer", v: "84%"}, {l: "Scalability", v: "76%"}].map(m => (
                                <div key={m.l} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-bold"><span>{m.l}</span><span>{m.v}</span></div>
                                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-slate-900" style={{width: m.v}} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button onClick={()=>window.location.reload()} className="w-full py-5 bg-slate-100 text-slate-900 rounded-2xl font-bold text-[10px] tracking-widest uppercase hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                        <RotateCcw size={14} /> Reset Analysis
                    </button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </main>
  );
}