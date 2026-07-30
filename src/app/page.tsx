"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Bot, Target, ShieldCheck, PieChart, Activity, Zap, Server, Code, Users, Sparkles } from "lucide-react";
import { HeroVisual } from "@/components/landing/hero-visual";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30 selection:text-indigo-200 font-sans overflow-x-hidden">
      {/* Background gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-900/10 blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Procoryx Logo" width={32} height={32} className="object-contain" />
            <span className="text-xl font-bold text-white tracking-wide">Procoryx</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <Link href="#platform" className="hover:text-white transition-colors">Platform</Link>
            <Link href="#solutions" className="hover:text-white transition-colors">Solutions</Link>
            <Link href="#security" className="hover:text-white transition-colors">Security</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden md:block">
              Sign In
            </Link>
            <Link 
              href="/dashboard" 
              className="px-4 py-2 text-sm font-medium bg-white text-slate-950 rounded-lg hover:bg-slate-100 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center gap-2 group"
            >
              Enter Platform <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-32 pb-20 px-6">
        <motion.div 
          style={{ opacity, scale }}
          className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold tracking-wide uppercase"
            >
              <Sparkles className="w-3 h-3" /> Agentic Procurement Automation
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]"
            >
              The Intelligent <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
                Procurement OS.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-lg md:text-xl text-slate-400 max-w-xl leading-relaxed"
            >
              Orchestrate your end-to-end procurement process with AI agents purposely built for Procurement. From requirement intelligence to AI tender assembly, execute billions in spend with zero compliance breaches.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link 
                href="/dashboard" 
                className="px-6 py-3.5 text-base font-medium bg-white text-slate-950 rounded-xl hover:bg-slate-100 transition-colors shadow-xl flex items-center justify-center gap-2 group"
              >
                Start Orchestrating <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="#demo" 
                className="px-6 py-3.5 text-base font-medium bg-slate-900 border border-slate-800 text-white rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                Request Demo
              </Link>
            </motion.div>
          </div>

          <div className="relative h-[600px] hidden lg:block">
            <HeroVisual />
          </div>
        </motion.div>
      </main>



      {/* Bento Grid Features */}
      <section id="platform" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">One secure platform. <br/>Unlimited autonomous agents.</h2>
            <p className="text-slate-400 text-lg">Deploy AI agents purposely built for procurement. They operate independently within your predefined boundaries, retrieving data, drafting contracts, and managing risk.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Generative Intake */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 overflow-hidden relative group hover:border-indigo-500/30 transition-colors"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] group-hover:bg-indigo-500/20 transition-colors" />
              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
                  <Bot className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Requirement Intelligence</h3>
                <p className="text-slate-400 max-w-md leading-relaxed">
                  Guided buying experiences that delight stakeholders. The AI Copilot translates raw business problems into perfectly structured technical, commercial, and security requirements in seconds.
                </p>
              </div>
            </motion.div>

            {/* Spend Analytics */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 overflow-hidden relative group hover:border-blue-500/30 transition-colors"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] group-hover:bg-blue-500/20 transition-colors" />
              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                  <PieChart className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Cost & Market Benchmarking</h3>
                <p className="text-slate-400 leading-relaxed">
                  Cost benchmarking and market availability intelligence derived instantly from historical POs and third-party data.
                </p>
              </div>
            </motion.div>

            {/* Autonomous Sourcing */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 overflow-hidden relative group hover:border-fuchsia-500/30 transition-colors"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/10 blur-[100px] group-hover:bg-fuchsia-500/20 transition-colors" />
              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 bg-fuchsia-500/20 rounded-xl flex items-center justify-center border border-fuchsia-500/30">
                  <Code className="w-6 h-6 text-fuchsia-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">AI Tender Assembly</h3>
                <p className="text-slate-400 leading-relaxed">
                  Run sourcing events on auto-pilot. Automatically draft comprehensive Scopes of Work (SOW) and SLA terms tailored to the exact requirements.
                </p>
              </div>
            </motion.div>

            {/* Compliance Shield */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.3 }}
              className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 overflow-hidden relative group hover:border-emerald-500/30 transition-colors"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] group-hover:bg-emerald-500/20 transition-colors" />
              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Intelligent Compliance Review</h3>
                <p className="text-slate-400 max-w-md leading-relaxed">
                  Ambient agents operate in the background, autonomously flagging legal risks, missing clauses, and governance breaches before anything goes live. Keep humans in the loop with responsible AI.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="relative z-10 border-t border-white/5 bg-slate-900/50 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="text-center pt-8 md:pt-0">
              <div className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 tracking-tighter mb-4">10x</div>
              <h4 className="text-lg font-semibold text-white mb-2">Faster Execution</h4>
              <p className="text-slate-400 max-w-xs mx-auto">Automate tactical tasks to compress cycle times from months to days.</p>
            </div>
            <div className="text-center pt-8 md:pt-0">
              <div className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 tracking-tighter mb-4">100%</div>
              <h4 className="text-lg font-semibold text-white mb-2">Policy Enforcement</h4>
              <p className="text-slate-400 max-w-xs mx-auto">Zero compliance breaches with OpenFGA authorization and AI auditing.</p>
            </div>
            <div className="text-center pt-8 md:pt-0">
              <div className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 tracking-tighter mb-4">30%</div>
              <h4 className="text-lg font-semibold text-white mb-2">Cost Reduction</h4>
              <p className="text-slate-400 max-w-xs mx-auto">Identify savings opportunities across messy tail spend on autopilot.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 bg-slate-950 pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <Image src="/logo.png" alt="Procoryx Logo" width={32} height={32} className="object-contain" />
                <span className="text-xl font-bold text-white tracking-wide">Procoryx</span>
              </div>
              <p className="text-slate-400 max-w-sm">
                The glue that connects your systems & data. Procoryx delivers AI agents purposely built for modern procurement teams.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-white mb-4">Platform</h5>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><Link href="#" className="hover:text-indigo-400 transition-colors">Cost & Market Benchmarking</Link></li>
                <li><Link href="#" className="hover:text-indigo-400 transition-colors">Requirement Intelligence</Link></li>
                <li><Link href="#" className="hover:text-indigo-400 transition-colors">AI Tender Assembly</Link></li>
                <li><Link href="#" className="hover:text-indigo-400 transition-colors">Pre-Qualification & Evaluation</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-white mb-4">Trust</h5>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><Link href="#" className="hover:text-indigo-400 transition-colors">Data Residency</Link></li>
                <li><Link href="#" className="hover:text-indigo-400 transition-colors">Encryption</Link></li>
                <li><Link href="#" className="hover:text-indigo-400 transition-colors">OpenFGA Authorization</Link></li>
                <li><Link href="#" className="hover:text-indigo-400 transition-colors">Compliance Center</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} Procoryx Inc. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
