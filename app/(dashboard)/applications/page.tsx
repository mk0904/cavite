"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Application, listenToApplications } from "@/lib/db";

export default function ApplicationsPage() {
  const { user } = useAuth();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsub = listenToApplications(user.uid, (data) => {
      setApps(data);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  return (
    <div className="w-full pb-32">
      <div className="mb-16">
        <span className="text-brand-teal font-extrabold tracking-[0.3em] uppercase text-[10px] mb-4 block">pipeline telemetry</span>
        <h1 className="text-5xl md:text-7xl font-black font-headline tracking-tighter text-on-surface leading-none">
          application <br />
          <span className="text-brand-teal">journey.</span>
        </h1>
        <p className="text-xl text-on-surface-variant mt-8 font-light max-w-2xl leading-relaxed">
          track your structural progress across institutional opportunities.
        </p>
      </div>

      <div className="glass-panel p-12 rounded-[3.5rem] border border-white/40 shadow-3xl overflow-hidden">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-3 border-brand-teal/20 border-t-brand-teal rounded-full animate-spin"></div>
            <p className="text-[9px] font-black uppercase tracking-widest text-brand-teal animate-pulse">synchronizing journey...</p>
          </div>
        ) : apps.length === 0 ? (
          <div className="py-20 text-center">
            <h3 className="text-2xl font-black font-headline text-on-surface/40">no active journeys.</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 mt-2">initiate an application via the opportunity gallery.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {apps.map((app, i) => (
              <div key={app.id} className="flex items-center gap-8 p-8 rounded-[2.5rem] hover:bg-white/40 border border-transparent hover:border-white transition-all group animate-in slide-in-from-right-4" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-16 h-16 bg-brand-teal/5 rounded-2xl flex items-center justify-center text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-all transform group-hover:rotate-3">
                  <span className="material-symbols-outlined text-3xl">architecture</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-black font-headline tracking-tight text-on-surface leading-none">{app.jobTitle.toLowerCase()}</h4>
                  <p className="text-[10px] font-black tracking-widest uppercase text-on-surface-variant/60 mt-2">{app.companyName.toLowerCase()}</p>
                </div>
                <div className="text-right">
                  <span className={`px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase ${
                    app.status === 'applied' ? 'bg-blue-50 text-blue-600' :
                    app.status === 'shortlisted' ? 'bg-amber-50 text-amber-600' :
                    'bg-emerald-50 text-emerald-600'
                  }`}>
                    {app.status}
                  </span>
                  <p className="text-[9px] font-bold text-outline-variant uppercase tracking-widest mt-2">
                    {app.appliedAt?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toLowerCase()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
