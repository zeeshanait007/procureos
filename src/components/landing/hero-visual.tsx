"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShieldAlert, FileText, Database, Sparkles, Server } from "lucide-react";

export function HeroVisual() {
  return (
    <div className="relative w-full h-[500px] flex items-center justify-center">
      {/* Central Hub */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, type: "spring", bounce: 0.4 }}
        className="absolute z-20"
      >
        <div className="w-48 h-48 rounded-full border border-indigo-500/30 bg-slate-950/50 backdrop-blur-xl flex flex-col items-center justify-center relative shadow-[0_0_80px_rgba(99,102,241,0.2)]">
          <div className="absolute inset-0 rounded-full border border-indigo-400/20 animate-[spin_10s_linear_infinite]" />
          <div className="absolute inset-2 rounded-full border border-emerald-400/20 animate-[spin_15s_linear_infinite_reverse]" />
          <Server className="w-12 h-12 text-indigo-400 mb-2" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Procoryx Engine</span>
        </div>
      </motion.div>

      {/* Floating Card 1: Compliance Shield */}
      <motion.div
        initial={{ y: 50, x: -50, opacity: 0 }}
        animate={{ y: -60, x: -180, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute z-30"
      >
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-4 shadow-2xl flex items-center gap-4 w-64"
        >
          <div className="bg-emerald-500/20 p-2 rounded-lg">
            <ShieldAlert className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200">Compliance Check</h4>
            <p className="text-xs text-emerald-400">100% Passed</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Card 2: AI Tender Assembly */}
      <motion.div
        initial={{ y: 100, x: 50, opacity: 0 }}
        animate={{ y: 80, x: 160, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute z-30"
      >
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-4 shadow-2xl flex items-center gap-4 w-64"
        >
          <div className="bg-indigo-500/20 p-2 rounded-lg">
            <FileText className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200">AI Tender Assembly</h4>
            <p className="text-xs text-indigo-400">Drafting SOW...</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Card 3: Spend Analytics */}
      <motion.div
        initial={{ y: -100, x: 0, opacity: 0 }}
        animate={{ y: -140, x: 80, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="absolute z-10"
      >
        <motion.div 
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-4 shadow-2xl flex items-center gap-4 w-64"
        >
          <div className="bg-blue-500/20 p-2 rounded-lg">
            <Database className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200">Cost Benchmarking</h4>
            <p className="text-xs text-blue-400">Cost variance: -12%</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Card 4: AI Agent */}
      <motion.div
        initial={{ y: 100, x: -100, opacity: 0 }}
        animate={{ y: 120, x: -120, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="absolute z-10"
      >
        <motion.div 
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-2xl flex items-center gap-3 w-56"
        >
          <div className="bg-fuchsia-500/20 p-2 rounded-lg">
            <Sparkles className="w-5 h-5 text-fuchsia-400" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-200">Requirement Intelligence</h4>
            <p className="text-[10px] text-fuchsia-400">Collaborative Agent Active</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Decorative connecting lines */}
      <svg className="absolute inset-0 w-full h-full z-0 opacity-20 pointer-events-none">
        <defs>
          <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
        <path d="M 300 250 Q 200 100 150 150" fill="none" stroke="url(#line-gradient)" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_20s_linear_infinite]" />
        <path d="M 300 250 Q 400 400 450 350" fill="none" stroke="url(#line-gradient)" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_20s_linear_infinite]" />
        <path d="M 300 250 Q 200 400 150 350" fill="none" stroke="url(#line-gradient)" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_20s_linear_infinite]" />
      </svg>
    </div>
  );
}
