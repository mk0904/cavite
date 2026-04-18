"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <div className={`${theme === 'dark' ? 'dark bg-[#050708]' : 'bg-background'} text-on-surface selection:bg-brand-teal/30 selection:text-brand-teal min-h-screen font-body transition-colors duration-1000 lowercase`}>
      {/* floating navigation */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4 flex justify-center ${
          scrolled ? "top-2" : "top-4"
        }`}
      >
        <nav className={`flex items-center gap-8 px-6 py-2.5 rounded-full border border-white/10 ${theme === 'dark' ? 'bg-black/40' : 'bg-white/40'} backdrop-blur-xl transition-all duration-500 ${
          scrolled ? "shadow-2xl shadow-brand-teal/10 scale-95" : ""
        }`}>
          <div className={`text-xl font-bold tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-on-surface'} pr-4 border-r border-white/10`}>
            cavite.
          </div>
          <div className="hidden md:flex gap-6 items-center">
            <a href="#" className={`${theme === 'dark' ? 'text-white/60 hover:text-white' : 'text-on-surface/60 hover:text-on-surface'} transition-colors text-sm font-medium`}>about us</a>
            <a href="#" className={`${theme === 'dark' ? 'text-white/60 hover:text-white' : 'text-on-surface/60 hover:text-on-surface'} transition-colors text-sm font-medium`}>results</a>
            <a href="#" className={`${theme === 'dark' ? 'text-white/60 hover:text-white' : 'text-on-surface/60 hover:text-on-surface'} transition-colors text-sm font-medium`}>services</a>
            <a href="#" className={`${theme === 'dark' ? 'text-white/60 hover:text-white' : 'text-on-surface/60 hover:text-on-surface'} transition-colors text-sm font-medium`}>process</a>
            <a href="#" className={`${theme === 'dark' ? 'text-white/60 hover:text-white' : 'text-on-surface/60 hover:text-on-surface'} transition-colors text-sm font-medium`}>faqs</a>
          </div>
          <div className="flex items-center gap-4 pl-4 border-l border-white/10">
            {/* theme toggle */}
            <button 
              onClick={toggleTheme}
              className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
                theme === 'dark' ? 'text-white hover:bg-white/10' : 'text-on-surface hover:bg-black/5'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

              <Link href="/sign-up">
                <button className="px-5 py-2 text-xs font-bold bg-brand-teal text-white rounded-full hover:brightness-110 transition-all active:scale-95">
                  book a call
                </button>
              </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* hero section */}
        <section className="relative pt-44 pb-32 px-6 flex flex-col items-center text-center overflow-hidden">
          {/* background glows - more vibrant in light mode */}
          <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] teal-glow ${theme === 'dark' ? 'opacity-40' : 'opacity-60'} -z-10 animate-pulse`}></div>
          
          <h1 className={`text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] ${theme === 'dark' ? 'text-white' : 'text-slate-900'} max-w-4xl mb-8`}>
            ready to <span className="font-serif italic font-light text-brand-teal">scale</span> your <br />
            professional infrastructure?
          </h1>

          <p className={`text-lg md:text-xl ${theme === 'dark' ? 'text-white/50' : 'text-slate-500'} max-w-2xl leading-relaxed mb-12 font-light`}>
            if you want to achieve structural career growth with institutional excellence <br className="hidden md:block" />
            and high-fidelity placement, then you're in the right place.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/sign-up">
              <button className="px-8 py-4 bg-brand-teal text-white rounded-full font-bold text-lg hover:brightness-110 transition-all shadow-2xl shadow-brand-teal/20">
                book a call
              </button>
            </Link>
            <button className={`px-8 py-4 ${theme === 'dark' ? 'bg-white/5 text-white border-white/10' : 'bg-white text-slate-900 border-slate-200 shadow-lg shadow-slate-200'} border rounded-full font-bold text-lg hover:opacity-80 transition-all`}>
              learn more
            </button>
          </div>

          <div className={`mt-24 relative w-full max-w-5xl aspect-[16/10] rounded-3xl overflow-hidden border ${
            theme === 'dark' 
              ? 'border-white/5 bg-black/40' 
              : 'border-brand-teal/10 bg-white/60 shadow-[0_32px_64px_-16px_rgba(0,123,128,0.12)]'
          } backdrop-blur-2xl group transition-all duration-1000`}>
            {/* dynamic glow */}
            <div className={`absolute top-0 right-0 w-[400px] h-[400px] teal-glow ${theme === 'dark' ? 'opacity-10' : 'opacity-20'} -z-0`}></div>
            
            <div className="flex h-full relative z-10">
              {/* dashboard sidebar mockup */}
              <div className={`w-16 h-full border-r ${theme === 'dark' ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-slate-50/50'} flex flex-col items-center py-6 gap-6`}>
                <div className="w-8 h-8 rounded-lg bg-brand-teal mb-4 flex items-center justify-center text-white shadow-lg shadow-brand-teal/20">
                  <span className="material-symbols-outlined text-[20px]">architecture</span>
                </div>
                {['dashboard', 'resume', 'speed', 'analytics', 'settings'].map((icon, i) => (
                  <div key={i} className={`w-10 h-10 rounded-xl flex items-center justify-center ${i === 0 ? (theme === 'dark' ? 'bg-white/10 text-white' : 'bg-brand-teal/5 text-brand-teal shadow-inner shadow-brand-teal/10') : (theme === 'dark' ? 'text-white/20' : 'text-slate-300')} hover:scale-105 transition-all`}>
                    <span className="material-symbols-outlined text-[20px]">{icon}</span>
                  </div>
                ))}
              </div>

              {/* main dashboard content mockup */}
              <div className="flex-1 p-8 flex flex-col gap-8 overflow-hidden text-left">
                {/* top bar */}
                <div className="flex justify-between items-center text-left">
                  <div className="flex flex-col gap-1">
                    <div className={`text-[10px] font-bold ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'} uppercase tracking-[0.2em]`}>cavite_nexus_v1</div>
                    <div className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} tracking-tighter`}>placement_velocity_telemetry</div>
                  </div>
                  <div className={`flex gap-3 px-4 py-2 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-brand-teal/5 border-brand-teal/10'} rounded-full border`}>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mt-1 gap-1"></div>
                    <span className={`text-[10px] font-bold ${theme === 'dark' ? 'text-white/40' : 'text-brand-teal'} uppercase tracking-widest`}>network_active_94.2%</span>
                  </div>
                </div>

                {/* metrics metrics */}
                <div className="grid grid-cols-3 gap-6">
                  {[
                    { label: 'structural_score', val: '98', trend: '+2.4%', color: 'text-brand-teal' },
                    { label: 'placement_eta', val: '14D', trend: 'OPTIMIZED', color: theme === 'dark' ? 'text-white' : 'text-slate-900' },
                    { label: 'ats_fidelity', val: 'HIGH', trend: 'STRUCTURAL', color: 'text-green-500' }
                  ].map((m, i) => (
                    <div key={i} className={`p-5 rounded-2xl ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-lg shadow-slate-200/50'} border flex flex-col gap-2`}>
                      <span className={`text-[9px] font-bold ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'} uppercase tracking-widest`}>{m.label}</span>
                      <div className="flex items-end justify-between">
                        <span className={`text-2xl font-black tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{m.val}</span>
                        <span className={`text-[9px] font-bold ${m.color}`}>{m.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* table pipeline mockup */}
                <div className={`flex-1 rounded-2xl ${theme === 'dark' ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50/30 border-slate-100/50'} border p-6 flex flex-col gap-6 overflow-hidden`}>
                   <div className="flex justify-between items-center pb-4 border-b border-white/5">
                      <span className={`text-[10px] font-bold ${theme === 'dark' ? 'text-white/40' : 'text-slate-400'} uppercase tracking-widest`}>active_pipeline</span>
                      <div className="flex gap-2">
                        <div className="w-4 h-1 bg-brand-teal rounded-full"></div>
                        <div className="w-4 h-1 bg-white/10 rounded-full"></div>
                      </div>
                   </div>
                   <div className="space-y-4">
                      {[
                        { company: 'STUDIO_X', role: 'PRINCIPAL ARCHITECT', progress: 85, status: 'offered' },
                        { company: 'LINEAR_DESIGN', role: 'SENIOR BIM ENGINEER', progress: 62, status: 'interview' },
                        { company: 'VERTEX_HQ', role: 'PROJECT LEAD', progress: 41, status: 'applied' }
                      ].map((item, i) => (
                        <div key={i} className={`flex items-center gap-6 p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:shadow-lg hover:shadow-brand-teal/5'} border border-transparent transition-all`}>
                          <div className={`w-8 h-8 rounded-full ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'} flex items-center justify-center text-[10px] font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>{item.company[0]}</div>
                          <div className="flex-1 text-left">
                            <div className={`text-[10px] font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{item.role}</div>
                            <div className={`text-[9px] ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'} font-medium`}>{item.company}</div>
                          </div>
                          <div className="flex flex-col gap-1 items-end w-32">
                             <div className="flex justify-between w-full text-[8px] font-bold uppercase tracking-widest mb-1">
                                <span className={theme === 'dark' ? 'text-white/40' : 'text-slate-400'}>fidelity</span>
                                <span className="text-brand-teal">{item.progress}%</span>
                             </div>
                             <div className={`w-full h-1 ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'} rounded-full overflow-hidden`}>
                                <div className="h-full bg-brand-teal rounded-full" style={{ width: `${item.progress}%` }}></div>
                             </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full ${theme === 'dark' ? 'bg-white/5 border-white/5 text-white/40' : 'bg-brand-teal/5 border-brand-teal/10 text-brand-teal'} border text-[8px] font-bold uppercase tracking-widest`}>
                            {item.status}
                          </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>

            {/* overlay glassy card for bottom gradient fix */}
            <div className={`absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t ${theme === 'dark' ? 'from-[#050708]' : 'from-white'} to-transparent z-20`}></div>
          </div>
        </section>

        {/* logo cloud */}
        <section className={`py-20 border-y ${theme === 'dark' ? 'border-white/5 bg-white/[0.02]' : 'border-black/5 bg-black/[0.02]'}`}>
          <div className="max-w-7xl mx-auto px-6">
            <p className={`text-center ${theme === 'dark' ? 'text-white/30' : 'text-on-surface/30'} font-bold text-[10px] tracking-[0.3em] uppercase mb-12`}>
              you're in good hands:
            </p>
            <div className={`flex flex-wrap justify-center items-center gap-x-16 gap-y-10 opacity-40 grayscale ${theme === 'dark' ? '' : 'invert'}`}>
              <div className="text-2xl font-black tracking-tighter text-white">STUDIO_X</div>
              <div className="text-2xl font-light italic font-serif text-white underline decoration-brand-teal underline-offset-4">LINEAR</div>
              <div className="text-2xl font-bold tracking-[0.2em] text-white">FOUNDRY</div>
              <div className="text-2xl font-medium text-white italic">VERTEX</div>
              <div className="text-2xl font-extrabold tracking-tighter text-white uppercase">NOVA</div>
            </div>
          </div>
        </section>

        {/* comparison section */}
        <section className="py-40 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-24">
             <span className={`px-4 py-1 ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white/40' : 'bg-black/5 border-black/5 text-on-surface/40'} border rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 inline-block`}>comparison</span>
             <h2 className={`text-5xl md:text-6xl font-bold tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-on-surface'} max-w-2xl mx-auto leading-tight`}>
               but, why would you <br /> want to work <span className="font-serif italic font-light text-brand-teal">with us?</span>
             </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* other agencies */}
            <div className={`p-10 rounded-[2rem] ${theme === 'dark' ? 'bg-white/[0.02] border-white/5' : 'bg-black/[0.02] border-black/5'} border flex flex-col h-full`}>
              <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white/40' : 'text-on-surface/40'} mb-10`}>other agencies</h3>
              <ul className="space-y-6 flex-1">
                {[
                  "reactive communication",
                  "single channel approach",
                  "copy paste growth strategies",
                  "lack of research on your industry",
                  "outsourced to junior talent"
                ].map((item, i) => (
                  <li key={i} className={`flex items-center gap-4 ${theme === 'dark' ? 'text-white/30' : 'text-on-surface/30'} font-light`}>
                    <span className="text-red-500/50">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* cavite */}
            <div className={`relative p-10 rounded-[2rem] ${theme === 'dark' ? 'bg-brand-teal/5 border-brand-teal/20' : 'bg-brand-teal/[0.02] border-brand-teal/30'} border flex flex-col h-full overflow-hidden group`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
              <div className="flex items-center gap-3 mb-10">
                <div className="w-8 h-8 rounded-lg bg-brand-teal flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-xl">architecture</span>
                </div>
                <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-on-surface'}`}>cavite</h3>
              </div>
              <ul className="space-y-6 flex-1">
                {[
                  "constant, proactive communication",
                  "omni channel placement ecosystem",
                  "tailored best-fit solutions",
                  "provides industry specific expertise",
                  "experts with 10+ years of experience"
                ].map((item, i) => (
                  <li key={i} className={`flex items-center gap-4 ${theme === 'dark' ? 'text-white' : 'text-on-surface'} font-medium`}>
                    <span className="text-brand-teal text-lg">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="absolute bottom-[-20px] right-[-20px] w-64 h-64 teal-glow opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            </div>
          </div>
        </section>

        {/* features - the glass pipeline */}
        <section className={`py-40 px-6 ${theme === 'dark' ? 'bg-white/[0.01]' : 'bg-teal-50/20'} relative overflow-hidden`}>
          <div className={`absolute top-0 right-0 w-[600px] h-[600px] teal-glow ${theme === 'dark' ? 'opacity-10' : 'opacity-30'} -z-0`}></div>
          
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
            <div>
              <span className="text-brand-teal font-bold tracking-[0.3em] uppercase text-[10px] mb-8 block">transparency first</span>
              <h2 className={`text-5xl md:text-6xl font-bold tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-10 leading-[0.95]`}>
                the glass <br /> <span className="font-serif italic font-light">pipeline.</span>
              </h2>
              <p className={`text-xl ${theme === 'dark' ? 'text-white/50' : 'text-slate-500'} leading-relaxed mb-12 font-light`}>
                eliminating the 'black box' of recruitment. experience real-time telemetry of your application status within our architectural framework.
              </p>
              <div className="space-y-6">
                <div className={`flex gap-6 p-6 rounded-2xl ${
                  theme === 'dark' 
                    ? 'bg-white/5 border-white/5' 
                    : 'bg-white shadow-2xl shadow-brand-teal/5 border border-brand-teal/10'
                } border hover:border-brand-teal/30 transition-all duration-500 group`}>
                  <div className="w-12 h-12 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-all">
                    <span className="material-symbols-outlined">speed</span>
                  </div>
                  <div>
                    <h4 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-2`}>live tracking</h4>
                    <p className={`${theme === 'dark' ? 'text-white/40' : 'text-slate-400'} text-sm font-light leading-relaxed`}>instant updates from 'applied' to 'offer' with high-fidelity stage details.</p>
                  </div>
                </div>
                <div className={`flex gap-6 p-6 rounded-2xl ${
                  theme === 'dark' 
                    ? 'bg-white/5 border-white/5' 
                    : 'bg-white shadow-2xl shadow-brand-teal/5 border border-brand-teal/10'
                } border hover:border-brand-teal/30 transition-all duration-500 group`}>
                  <div className="w-12 h-12 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-all">
                    <span className="material-symbols-outlined">analytics</span>
                  </div>
                  <div>
                    <h4 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-2`}>structural feedback</h4>
                    <p className={`${theme === 'dark' ? 'text-white/40' : 'text-slate-400'} text-sm font-light leading-relaxed`}>our pipeline ensures every candidate receives structural feedback within 48 hours.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className={`absolute inset-0 teal-glow ${theme === 'dark' ? 'opacity-20' : 'opacity-40'} -z-0`}></div>
              <div className={`relative z-10 p-2 ${
                theme === 'dark' 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-white shadow-[0_48px_80px_-16px_rgba(0,123,128,0.15)] border border-brand-teal/20'
              } border rounded-[3rem] backdrop-blur-2xl`}>
                <div className={`${theme === 'dark' ? 'bg-[#050708]' : 'bg-[#FDFEFF]'} rounded-[2.5rem] p-10 overflow-hidden border ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                  <div className="flex items-center justify-between mb-10">
                    <div className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-black tracking-tighter text-sm uppercase`}>live_pulse.v1</div>
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 shadow-sm shadow-red-500/10"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 shadow-sm shadow-yellow-500/10"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 shadow-sm shadow-green-500/10"></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { role: "senior designer @ studio_x", status: "success", color: "bg-green-500" },
                      { role: "bim specialist @ linear", status: "in review", color: "bg-brand-teal" },
                      { role: "project architect @ vertex", status: "pending", color: theme === 'dark' ? "bg-white/10" : "bg-slate-200" }
                    ].map((item, i) => (
                      <div key={i} className={`p-5 rounded-2xl ${
                        theme === 'dark' 
                          ? 'bg-white/5 border-white/5 hover:bg-white/[0.08]' 
                          : 'bg-white border-slate-100 shadow-lg shadow-slate-200/40 hover:shadow-brand-teal/5 transition-all duration-500'
                      } border flex items-center justify-between group`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-2 h-2 rounded-full ${item.color} ${item.status === 'in review' ? 'animate-pulse shadow-glow' : ''}`}></div>
                          <span className={`${theme === 'dark' ? 'text-white' : 'text-slate-800'} font-bold text-sm tracking-tight`}>{item.role}</span>
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${
                          item.status === 'success' 
                            ? 'text-green-500' 
                            : (theme === 'dark' ? 'text-white/40' : 'text-slate-400')
                        }`}>{item.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* features - placement ecosystem */}
        <section className={`py-40 px-6 ${theme === 'dark' ? 'bg-[#050708]' : 'bg-white'} relative overflow-hidden`}>
           <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] teal-glow ${theme === 'dark' ? 'opacity-10' : 'opacity-20'} -z-0`}></div>
           
           <div className="max-w-7xl mx-auto relative z-10 text-center">
              <span className="text-brand-teal font-bold tracking-[0.3em] uppercase text-[10px] mb-8 block">scale faster</span>
              <h2 className={`text-5xl md:text-6xl font-bold tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-24 leading-[0.95]`}>
                omni channel <br /> <span className="font-serif italic font-light">placement ecosystem.</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { title: "global talent pool", icon: "public", desc: "Access the top 1% of architectural talent globally, vetted for technical and structural excellence." },
                  { title: "automated matching", icon: "auto_awesome", desc: "Our proprietary NEXUS engine matches talent with institutional culture and project requirements." },
                  { title: "predictive analytics", icon: "query_stats", desc: "data-driven placement velocity forecasting to ensure structural project stability." }
                ].map((feature, i) => (
                  <div key={i} className={`p-10 rounded-[2.5rem] ${
                    theme === 'dark' 
                      ? 'bg-white/[0.02] border-white/5' 
                      : 'bg-white shadow-2xl shadow-brand-teal/5 border border-brand-teal/10'
                  } border flex flex-col items-center group hover:-translate-y-2 transition-all duration-500`}>
                    <div className="w-16 h-16 rounded-2xl bg-brand-teal/5 flex items-center justify-center text-brand-teal mb-8 group-hover:bg-brand-teal group-hover:text-white transition-all shadow-inner shadow-brand-teal/10">
                      <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
                    </div>
                    <h4 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-4 tracking-tighter`}>{feature.title}</h4>
                    <p className={`text-sm ${theme === 'dark' ? 'text-white/40' : 'text-slate-500'} font-light leading-relaxed`}>{feature.desc}</p>
                  </div>
                ))}
              </div>
           </div>
        </section>

        {/* redesigned cta - structural shift */}
        <section className={`py-40 px-6 ${theme === 'dark' ? 'bg-white/[0.01]' : 'bg-brand-teal/5'} relative overflow-hidden`}>
           <div className="absolute inset-0 bg-brand-teal/5 backdrop-blur-3xl -z-10 rotate-12 scale-150"></div>
           <div className="max-w-4xl mx-auto text-center relative z-10">
              <h2 className={`text-6xl md:text-8xl font-black tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-12 italic leading-[0.85]`}>
                 the next <br /> structural shift <br /> is <span className="text-brand-teal">yours.</span>
              </h2>
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-16 group">
                <Link href="/sign-up">
                  <button className="px-12 py-6 bg-brand-teal text-white rounded-full font-black text-xl hover:scale-105 transition-all shadow-2xl shadow-brand-teal/40 uppercase tracking-tighter">
                    secure nexus access
                  </button>
                </Link>
                <div className="flex flex-col items-start">
                   <div className="flex -space-x-3 mb-2">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-slate-200 overflow-hidden shadow-lg">
                        <img src={`https://i.pravatar.cc/100?u=${i+50}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                   </div>
                   <div className={`text-[10px] font-bold ${theme === 'dark' ? 'text-white/40' : 'text-slate-500'} uppercase tracking-[0.2em]`}>94+ current applicants in pipeline</div>
                </div>
              </div>
           </div>
        </section>

        {/* ecosystem section */}
        <section className="py-40 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
            <div className="max-w-2xl">
              <span className="text-brand-teal font-bold tracking-[0.3em] uppercase text-[10px] mb-8 block">comprehensive ecosystem</span>
              <h2 className={`text-5xl md:text-7xl font-bold tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-on-surface'} leading-none`}>
                foundational <br /> <span className="font-serif italic font-light">engineering.</span>
              </h2>
            </div>
            <p className={`${theme === 'dark' ? 'text-white/40' : 'text-on-surface/40'} max-w-sm mb-4 font-light leading-relaxed italic`}>
              "we don't just build careers; we architect the infrastructure they stand on."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className={`group p-8 rounded-[2rem] ${theme === 'dark' ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]' : 'bg-black/[0.02] border-black/5 hover:bg-black/[0.04]'} border hover:border-brand-teal/30 transition-all aspect-square flex flex-col justify-between`}>
              <div className="w-14 h-14 rounded-2xl bg-brand-teal/10 flex items-center justify-center text-brand-teal group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">resume</span>
              </div>
              <div>
                <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-on-surface'} mb-4`}>resume blueprinting</h3>
                <p className={`${theme === 'dark' ? 'text-white/40' : 'text-on-surface/40'} font-light text-sm line-clamp-3`}>using our proprietary structural logic, your narrative is reconstructed for maximum institutional impact.</p>
              </div>
            </div>
            <div className={`group p-8 rounded-[2rem] ${theme === 'dark' ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]' : 'bg-black/[0.02] border-black/5 hover:bg-black/[0.04]'} border hover:border-brand-teal/30 transition-all aspect-square flex flex-col justify-between`}>
              <div className="w-14 h-14 rounded-2xl bg-brand-teal/10 flex items-center justify-center text-brand-teal group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">psychology</span>
              </div>
              <div>
                <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-on-surface'} mb-4`}>structural interviews</h3>
                <p className={`${theme === 'dark' ? 'text-white/40' : 'text-on-surface/40'} font-light text-sm line-clamp-3`}>simulated environments that mirror the intensity of high-tier firms. every session is recorded and analyzed with precision.</p>
              </div>
            </div>
             <div className="group p-8 rounded-[2rem] bg-brand-teal text-white aspect-square flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <div className="w-14 h-14 rounded-2xl bg-white text-brand-teal flex items-center justify-center group-hover:scale-110 transition-transform relative z-10">
                  <span className="material-symbols-outlined text-3xl">bolt</span>
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4">accelerated nexus</h3>
                  <p className="text-white/80 font-medium text-sm">join the next cohort of professionals redefining excellence through structural placement.</p>
                  <button className="mt-6 flex items-center gap-2 text-sm font-bold tracking-widest uppercase">
                    explore intake <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
            </div>
          </div>
        </section>

        {/* faq section */}
        <section className="py-40 px-6 max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className={`text-4xl font-bold tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-on-surface'}`}>frequently asked questions</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: "how do you tailor strategies for different careers?", a: "our architectural framework scales across industries while maintaining structural integrity." },
              { q: "what's unique about the cavite approach?", a: "we focus on the infrastructure of your professional identity, not just the surface-level resume." },
              { q: "how long does the placement process typically take?", a: "our average velocity is 94% within 90 days for qualified cohorts." }
            ].map((faq, i) => (
              <details key={i} className={`group p-6 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/5 hover:border-white/10' : 'bg-black/5 border-black/5 hover:border-black/10'} transition-all cursor-pointer`}>
                <summary className={`flex items-center justify-between ${theme === 'dark' ? 'text-white' : 'text-on-surface'} font-bold list-none`}>
                  {faq.q}
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <p className={`mt-4 ${theme === 'dark' ? 'text-white/50' : 'text-on-surface/50'} font-light leading-relaxed`}>
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* final cta */}
        <section className="py-40 px-6">
          <div className="max-w-5xl mx-auto relative p-20 rounded-[4rem] bg-brand-teal text-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
            
            <div className="relative z-10">
              <h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-10 leading-none">
                ready to build <br /> <span className="font-serif italic font-light">the future?</span>
              </h2>
              <p className="text-xl text-white/80 max-w-xl mx-auto mb-16 font-light">
                join the next cohort of professionals who are redefining institutional excellence through structural placement.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Link href="/sign-up">
                  <button className="px-12 py-6 bg-white text-brand-teal rounded-full font-bold text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl">
                    book a call
                  </button>
                </Link>
                <button className="px-12 py-6 bg-white/10 text-white border border-white/20 rounded-full font-bold text-xl hover:bg-white/20 transition-all backdrop-blur-md">
                   view portal
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* footer */}
      <footer className={`py-20 px-6 border-t ${theme === 'dark' ? 'border-white/5 bg-[#050708]' : 'border-black/5 bg-background'} relative overflow-hidden transition-colors duration-1000`}>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[300px] teal-glow opacity-20 -z-0"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-1">
              <div className={`text-2xl font-bold tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-on-surface'} mb-6`}>cavite.</div>
              <p className={`${theme === 'dark' ? 'text-white/30' : 'text-on-surface/30'} text-[10px] font-bold tracking-widest leading-loose uppercase italic`}>
                architectural modernism <br /> applied to the career cycle.
              </p>
            </div>
            <div>
               <h6 className={`text-[10px] uppercase tracking-[0.3em] font-bold ${theme === 'dark' ? 'text-white/20' : 'text-on-surface/20'} mb-8`}>navigation</h6>
               <ul className="space-y-4">
                 <li><a href="#" className={`${theme === 'dark' ? 'text-white/40 hover:text-white' : 'text-on-surface/40 hover:text-on-surface'} transition-colors text-[10px] font-bold uppercase tracking-widest`}>portfolios</a></li>
                 <li><a href="#" className={`${theme === 'dark' ? 'text-white/40 hover:text-white' : 'text-on-surface/40 hover:text-on-surface'} transition-colors text-[10px] font-bold uppercase tracking-widest`}>placements</a></li>
                 <li><a href="#" className={`${theme === 'dark' ? 'text-white/40 hover:text-white' : 'text-on-surface/40 hover:text-on-surface'} transition-colors text-[10px] font-bold uppercase tracking-widest`}>privacy</a></li>
               </ul>
            </div>
            <div>
               <h6 className={`text-[10px] uppercase tracking-[0.3em] font-bold ${theme === 'dark' ? 'text-white/20' : 'text-on-surface/20'} mb-8`}>social</h6>
               <ul className="space-y-4">
                 <li><a href="#" className={`${theme === 'dark' ? 'text-white/40 hover:text-white' : 'text-on-surface/40 hover:text-on-surface'} transition-colors text-[10px] font-bold uppercase tracking-widest`}>linkedin</a></li>
                 <li><a href="#" className={`${theme === 'dark' ? 'text-white/40 hover:text-white' : 'text-on-surface/40 hover:text-on-surface'} transition-colors text-[10px] font-bold uppercase tracking-widest`}>twitter</a></li>
                 <li><a href="#" className={`${theme === 'dark' ? 'text-white/40 hover:text-white' : 'text-on-surface/40 hover:text-on-surface'} transition-colors text-[10px] font-bold uppercase tracking-widest`}>instagram</a></li>
               </ul>
            </div>
            <div>
               <h6 className={`text-[10px] uppercase tracking-[0.3em] font-bold ${theme === 'dark' ? 'text-white/20' : 'text-on-surface/20'} mb-8`}>subscribe</h6>
               <div className={`flex border-b ${theme === 'dark' ? 'border-white/10' : 'border-black/10'} py-2`}>
                 <input type="email" placeholder="email@address.com" className={`bg-transparent border-none text-[10px] font-bold tracking-widest ${theme === 'dark' ? 'text-white' : 'text-on-surface'} placeholder:${theme === 'dark' ? 'text-white/20' : 'text-on-surface/20'} focus:ring-0 w-full`} />
                 <button className="text-brand-teal text-[10px] font-bold uppercase tracking-widest">join</button>
               </div>
            </div>
          </div>
          <div className={`pt-10 border-t ${theme === 'dark' ? 'border-white/5' : 'border-black/5'} flex flex-col md:flex-row justify-between items-center gap-6`}>
            <p className={`text-[10px] font-bold ${theme === 'dark' ? 'text-white/20' : 'text-on-surface/20'} uppercase tracking-[0.2em]`}>© 2024 cavite placement portal.</p>
            <div className={`flex gap-8 text-[10px] font-bold ${theme === 'dark' ? 'text-white/20' : 'text-on-surface/20'} uppercase tracking-[0.2em]`}>
               <a href="#">terms</a>
               <a href="#">architecture</a>
               <a href="#">careers</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
