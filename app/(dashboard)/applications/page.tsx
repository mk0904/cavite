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
    <div className="w-full pb-32 pt-2">
      <div className="mb-12">
        <span className="text-brand-teal font-bold tracking-[0.3em] lowercase text-[9px] mb-3 block">pipeline telemetry.</span>
        <h1 className="text-3xl font-bold font-headline tracking-tighter text-on-surface leading-tight">
          application <br />
          <span className="text-brand-teal italic font-light lowercase">journey.</span>
        </h1>
        <p className="text-sm text-on-surface-variant mt-4 font-light max-w-2xl leading-relaxed">
          track your structural progress across institutional opportunities.
        </p>
      </div>

      <div className="glass-panel p-6 rounded-[2.5rem] border border-white shadow-sm bg-white/40">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-3 border-brand-teal/10 border-t-brand-teal rounded-full animate-spin"></div>
            <p className="text-[8px] font-bold lowercase tracking-widest text-brand-teal animate-pulse">synchronizing journey...</p>
          </div>
        ) : apps.length === 0 ? (
          <div className="py-20 text-center">
            <h3 className="text-xl font-bold font-headline text-on-surface/20 lowercase">no active journeys.</h3>
            <p className="text-[10px] font-bold lowercase tracking-widest text-on-surface-variant/40 mt-2">initiate an application via the opportunity gallery.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {apps.map((app, i) => (
              <div key={app.id} className="flex items-center gap-6 p-6 rounded-3xl hover:bg-white/60 border border-transparent hover:border-white transition-all group animate-in slide-in-from-right-4" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-12 h-12 bg-brand-teal/5 rounded-xl flex items-center justify-center text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-all transform group-hover:rotate-2">
                  <span className="material-symbols-outlined text-2xl font-light">layers</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-[15px] font-bold font-headline tracking-tight text-on-surface leading-none lowercase">{app.jobTitle}</h4>
                  <p className="text-[9px] font-bold tracking-widest lowercase text-on-surface-variant/40 mt-2">{app.companyName}</p>
                </div>
                <div className="text-right">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold lowercase tracking-widest ${
                    app.status === 'applied' ? 'bg-blue-50/50 text-blue-600/60 border border-blue-100/50' :
                    app.status === 'shortlisted' ? 'bg-amber-50/50 text-amber-600/60 border border-amber-100/50' :
                    'bg-emerald-50/50 text-emerald-600/60 border border-emerald-100/50'
                  }`}>
                    {app.status}
                  </span>
                  <p className="text-[9px] font-bold text-on-surface-variant/20 lowercase tracking-widest mt-2">
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
