"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { 
  listenToApplications, 
  listenToAllJobs, 
  listenToActivity, 
  Application, 
  Job, 
  Activity 
} from "@/lib/db";

export default function DashboardPage() {
  const { profile, user } = useAuth();
  const isAdmin = profile?.role === "admin";
  const firstName = profile?.name ? profile.name.split(" ")[0].toLowerCase() : "architect";

  const [apps, setApps] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Listen to relevant data in real-time
    const unsubApps = listenToApplications(user.uid, setApps);
    const unsubJobs = listenToAllJobs(setJobs);
    const unsubActivity = listenToActivity(setActivities);

    setLoading(false);

    return () => {
      unsubApps();
      unsubJobs();
      unsubActivity();
    };
  }, [user]);

  // Derived metrics
  const stats = isAdmin
    ? [
        { label: "active openings", value: jobs.filter(j => j.status === 'open').length.toString(), sub: "precisoin match", icon: "work", highlight: false },
        { label: "total applications", value: apps.length.toString(), sub: "cohort telemetry", icon: "analytics", highlight: false },
        { label: "institution yield", value: "94%", sub: "optimized", icon: "verified", highlight: true }
      ]
    : [
        { label: "active applications", value: apps.length.toString().padStart(2, '0'), sub: "+12% structural", icon: "architecture", highlight: false },
        { label: "shortlisted potential", value: apps.filter(a => a.status === 'shortlisted').length.toString().padStart(2, '0'), sub: "precision match", icon: "star_rate", highlight: false },
        { label: "finalized offers", value: apps.filter(a => a.status === 'offer' || a.status === 'placed').length.toString().padStart(2, '0'), sub: "placements", icon: "celebration", highlight: true }
      ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-brand-teal/20 border-t-brand-teal rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-widest text-brand-teal animate-pulse">synchronizing nexus telemetry...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex-grow flex flex-col">
      {/* hero welcome section */}
      <section className="mb-16 grid grid-cols-12 gap-8 items-end">
        <div className="col-span-12 lg:col-span-8">
          <span className="text-brand-teal font-extrabold tracking-[0.3em] uppercase text-[10px] mb-4 block animate-in fade-in slide-in-from-bottom-2">
            {isAdmin ? "administrative command center" : "active nexus session"}
          </span>
          <h1 className="text-6xl md:text-8xl font-black font-headline tracking-tighter leading-[0.9] text-on-surface animate-in fade-in slide-in-from-left-4 duration-700">
            welcome <br />
            <span className="text-brand-teal">back, {firstName}.</span>
          </h1>
          <p className="text-xl text-on-surface-variant mt-8 font-light max-w-xl leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {isAdmin 
              ? "your administrative telemetry is synchronized. systems are ready for institutional verification and placement mapping."
              : "your architectural career telemetry is synchronized. all structural systems are operational for the 2026 cohort."}
          </p>
        </div>
        <div className="col-span-12 lg:col-span-4 flex flex-col items-start lg:items-end group">
           <div className="glass-panel p-8 rounded-[2.5rem] border border-white/40 shadow-xl group-hover:shadow-2xl transition-all duration-500 w-full lg:w-auto min-w-[240px]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] font-black tracking-widest uppercase text-brand-teal text-nowrap">system status: operational</span>
              </div>
              <p className="text-[10px] font-bold text-on-surface-variant/60 tracking-widest uppercase mb-1">timestamp</p>
              <p className="text-lg font-black font-headline text-on-surface">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toLowerCase()}</p>
           </div>
        </div>
      </section>

      {/* high-fidelity bento grid */}
      <div className="grid grid-cols-12 gap-8 pb-32">
        
        {/* primary metric row */}
        {stats.map((stat, i) => (
          <div key={i} className="col-span-12 md:col-span-4 h-full">
            <div className={`glass-panel p-10 rounded-[3rem] border border-white/40 shadow-2xl h-full flex flex-col justify-between group hover:translate-y-[-4px] transition-all duration-500 ${stat.highlight ? 'bg-brand-teal text-white border-transparent shadow-brand-teal/20' : 'bg-white/30'}`}>
              <div className="flex justify-between items-start">
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-500 ${stat.highlight ? 'bg-white/10 text-white' : 'bg-brand-teal/10 text-brand-teal group-hover:bg-brand-teal group-hover:text-white'}`}>
                  <span className="material-symbols-outlined text-3xl">{stat.icon}</span>
                </div>
                <span className={`text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full ${stat.highlight ? 'bg-white/10 text-white' : 'bg-brand-teal/5 text-brand-teal'}`}>
                  {stat.sub}
                </span>
              </div>
              <div className="mt-12">
                <p className={`text-[10px] font-black tracking-[0.2em] uppercase ${stat.highlight ? 'text-white/60' : 'text-on-surface-variant/60'}`}>{stat.label}</p>
                <h3 className={`text-7xl font-black font-headline mt-2 tracking-tighter ${stat.highlight ? 'text-white' : 'text-on-surface'}`}>{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}

        {/* secondary content area */}
        <div className="col-span-12 lg:col-span-8">
          <div className="glass-panel p-12 rounded-[3.5rem] border border-white/40 shadow-3xl h-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
              <div>
                <h3 className="text-3xl font-black font-headline tracking-tight">{isAdmin ? "command telemetry" : "nexus telemetry"}</h3>
                <p className="text-xs text-on-surface-variant font-medium mt-1 uppercase tracking-widest">{isAdmin ? "global activity updates" : "real-time pipeline updates"}</p>
              </div>
              <Link 
                href={isAdmin ? "/admin/applications" : "/jobs"} 
                className="px-6 py-3 bg-white text-on-surface border border-outline-variant/30 rounded-full font-bold text-xs hover:bg-surface-container-low transition-all uppercase tracking-widest shadow-sm"
              >
                view all {isAdmin ? "records" : "opportunities"}
              </Link>
            </div>
            
            <div className="space-y-4">
              {activities.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40">awaiting structural events...</p>
                </div>
              ) : (
                activities.map((item, i) => (
                  <div key={i} className="flex items-center gap-6 p-6 rounded-[2rem] hover:bg-white/40 transition-all group backdrop-blur-sm border border-transparent hover:border-white animate-in fade-in slide-in-from-right-4" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="w-14 h-14 bg-surface-container-low rounded-2xl flex items-center justify-center text-on-surface-variant group-hover:scale-110 group-hover:bg-brand-teal group-hover:text-white transition-all">
                      <span className="material-symbols-outlined">{item.type === 'apply' ? 'person' : item.type === 'post' ? 'work' : 'verified'}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-extrabold text-lg text-on-surface">
                        {item.userName.toLowerCase()} <span className="text-on-surface-variant/60 font-medium">—</span> {item.message.toLowerCase()}
                      </h4>
                      <p className="text-xs text-on-surface-variant font-medium tracking-wide mt-0.5 uppercase tracking-wider opacity-70">
                        {item.type} telemetry logged
                      </p>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-outline-variant">
                      {item.timestamp?.toDate ? "just now" : "syncing..."}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8">
          {/* action glass card */}
          <div className="glass-dark p-10 rounded-[3rem] border border-white/10 shadow-3xl text-white relative overflow-hidden group h-full flex flex-col justify-between min-h-[400px]">
            <div>
              <h3 className="text-2xl font-black font-headline mb-8 relative z-10">{isAdmin ? "institutional control" : "upcoming structural"}</h3>
              <div className="space-y-6 relative z-10">
                <div className="asymmetric-border pl-6 py-1">
                  <span className="text-[9px] font-black tracking-widest text-brand-teal uppercase">oct 30</span>
                  <h5 className="text-xl font-black font-headline mt-1 tracking-tight">{isAdmin ? "audit deadline" : "ibm interview"}</h5>
                </div>
                <div className="asymmetric-border pl-6 py-1 opacity-60">
                  <span className="text-[9px] font-black tracking-widest text-white uppercase">nov 02</span>
                  <h5 className="text-xl font-black font-headline mt-1 tracking-tight">{isAdmin ? "placement check" : "spotify session"}</h5>
                </div>
              </div>
            </div>
            
            <Link 
              href={isAdmin ? "/jobs/new" : "/jobs"}
              className="relative z-10 w-full py-4 text-[10px] font-black tracking-[0.2em] text-center uppercase bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all mt-8"
            >
               {isAdmin ? "initiate new posting" : "discover opportunities"}
            </Link>

            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-teal/20 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
          </div>
        </div>

      </div>
    </div>
  );
}