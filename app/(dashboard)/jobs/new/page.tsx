"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createJob } from "@/lib/db";

export default function NewJobPage() {
  const router = useRouter();
  const { profile, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-time",
    salary: "",
    description: "",
    deadline: ""
  });

  if (profile?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="glass-panel p-12 rounded-[3rem] text-center border border-white/40 shadow-2xl">
          <h2 className="text-3xl font-black font-headline text-on-surface">access restricted.</h2>
          <p className="text-on-surface-variant mt-4 font-label uppercase tracking-widest text-xs">institutional authorization required.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      await createJob({
        ...formData,
        postedBy: user.uid
      });
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to create job posting. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="glass-panel p-16 rounded-[4rem] text-center border border-emerald-500/30 bg-emerald-50/10 shadow-2xl animate-in zoom-in-95">
          <span className="material-symbols-outlined text-7xl text-emerald-500 mb-6 animate-bounce">verified</span>
          <h2 className="text-4xl font-black font-headline text-on-surface">posting architectural.</h2>
          <p className="text-on-surface-variant mt-4 font-medium uppercase tracking-[0.2em] text-[10px]">job successfully synchronized to the cohort.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full pb-32">
      <div className="mb-12">
        <span className="text-brand-teal font-extrabold tracking-[0.3em] uppercase text-[10px] mb-4 block">command session</span>
        <h1 className="text-5xl md:text-7xl font-black font-headline tracking-tighter text-on-surface leading-none">
          job architecture <br />
          <span className="text-brand-teal">studio.</span>
        </h1>
      </div>

      <div className="glass-panel p-12 rounded-[3rem] border border-white/40 shadow-[0_32px_64px_rgba(0,123,128,0.12)]">
        <form onSubmit={handleSubmit} className="space-y-10 font-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* basic info */}
            <div className="space-y-1">
              <label className="text-[10px] font-black tracking-widest uppercase text-on-surface-variant/60 ml-4">role title</label>
              <input 
                required
                className="w-full bg-white/40 border border-outline-variant/30 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all outline-none font-medium"
                placeholder="e.g. senior software engineer"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black tracking-widest uppercase text-on-surface-variant/60 ml-4">company entity</label>
              <input 
                required
                className="w-full bg-white/40 border border-outline-variant/30 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all outline-none font-medium"
                placeholder="e.g. google / rishihood"
                value={formData.company}
                onChange={e => setFormData({...formData, company: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black tracking-widest uppercase text-on-surface-variant/60 ml-4">geographical nexus</label>
              <input 
                required
                className="w-full bg-white/40 border border-outline-variant/30 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all outline-none font-medium"
                placeholder="e.g. gurgaon, remote"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black tracking-widest uppercase text-on-surface-variant/60 ml-4">remuneration guide</label>
              <input 
                required
                className="w-full bg-white/40 border border-outline-variant/30 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all outline-none font-medium"
                placeholder="e.g. 12-18 LPA"
                value={formData.salary}
                onChange={e => setFormData({...formData, salary: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black tracking-widest uppercase text-on-surface-variant/60 ml-4">employment structural</label>
              <select 
                className="w-full bg-white/40 border border-outline-variant/30 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all outline-none font-medium appearance-none"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
              >
                <option>Full-time</option>
                <option>Internship</option>
                <option>Contract</option>
                <option>Research Fellow</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black tracking-widest uppercase text-on-surface-variant/60 ml-4">application deadline</label>
              <input 
                required
                type="date"
                className="w-full bg-white/40 border border-outline-variant/30 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all outline-none font-medium"
                value={formData.deadline}
                onChange={e => setFormData({...formData, deadline: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black tracking-widest uppercase text-on-surface-variant/60 ml-4">role description & requirements</label>
            <textarea 
              required
              rows={6}
              className="w-full bg-white/40 border border-outline-variant/30 rounded-3xl px-6 py-6 focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all outline-none font-medium resize-none shadow-inner"
              placeholder="describe the structural responsibilities and precision requirements..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-outline-variant/20">
            <button 
              type="button" 
              onClick={() => router.back()}
              className="px-10 py-4 text-xs font-black tracking-widest uppercase text-on-surface-variant hover:text-on-surface transition-all"
            >
              cancel
            </button>
            <button 
              disabled={loading}
              className="px-12 py-5 bg-brand-teal text-white rounded-full font-black text-xs tracking-widest uppercase shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-3"
            >
              {loading ? "synchronizing..." : "publish opening"}
              {!loading && <span className="material-symbols-outlined text-sm">send</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
