"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Job, listenToAllJobs, applyToJob, Application, listenToApplications } from "@/lib/db";

export default function JobsPage() {
  const { profile, user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [myApps, setMyApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);

  useEffect(() => {
    const unsubJobs = listenToAllJobs((data) => {
      setJobs(data);
      setLoading(false);
    });

    let unsubApps: () => void = () => {};
    if (user) {
      unsubApps = listenToApplications(user.uid, (data) => {
        setMyApps(data);
      });
    }

    return () => {
      unsubJobs();
      unsubApps();
    };
  }, [user]);

  const handleApply = async (job: Job) => {
    if (!user || !profile || !job.id) return;
    setApplying(job.id);
    try {
      await applyToJob(user.uid, profile.name, job);
    } catch (err) {
      console.error(err);
      alert("Application failed. See console.");
    } finally {
      setApplying(null);
    }
  };

  const hasApplied = (jobId?: string) => {
    return myApps.some(app => app.jobId === jobId);
  };

  return (
    <div className="w-full pb-32">
      <div className="mb-16">
        <span className="text-brand-teal font-extrabold tracking-[0.3em] uppercase text-[10px] mb-4 block">structural database</span>
        <h1 className="text-5xl md:text-7xl font-black font-headline tracking-tighter text-on-surface leading-none">
          opportunity <br />
          <span className="text-brand-teal">gallery.</span>
        </h1>
        <p className="text-xl text-on-surface-variant mt-8 font-light max-w-2xl leading-relaxed">
          discover architectural roles curated for the 2026 cohort. precision matching for institutional excellence.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <div className="w-12 h-12 border-4 border-brand-teal/20 border-t-brand-teal rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-brand-teal animate-pulse">synchronizing gallery...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass-panel p-16 rounded-[4rem] text-center border border-white/40 shadow-xl">
           <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-4 font-light">architecture</span>
           <h3 className="text-2xl font-black font-headline text-on-surface">no openings synchronized.</h3>
           <p className="text-on-surface-variant mt-2 font-label uppercase text-[10px] tracking-widest">check back as institutional verification proceeds.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {jobs.map((job) => (
            <div key={job.id} className="glass-panel p-8 rounded-[2.5rem] border border-white/40 shadow-xl hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-500 flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-brand-teal/10 rounded-2xl flex items-center justify-center text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-all duration-500">
                    <span className="material-symbols-outlined text-3xl font-light">work</span>
                  </div>
                  <span className="text-[9px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full bg-brand-teal/5 text-brand-teal">
                    {job.type}
                  </span>
                </div>
                <h3 className="text-2xl font-black font-headline text-on-surface tracking-tight leading-tight mb-1 group-hover:text-brand-teal transition-colors">{job.title.toLowerCase()}</h3>
                <p className="text-[10px] font-black tracking-widest uppercase text-on-surface-variant/60 mb-6">{job.company.toLowerCase()} • {job.location.toLowerCase()}</p>
                <p className="text-sm text-on-surface-variant/80 font-medium leading-relaxed mb-8 line-clamp-3">
                  {job.description}
                </p>
              </div>

              <div className="pt-6 border-t border-outline-variant/20 flex items-center justify-between mt-auto">
                <span className="text-lg font-black font-headline text-on-surface">{job.salary.toLowerCase()}</span>
                {hasApplied(job.id) ? (
                  <div className="flex items-center gap-2 text-emerald-600">
                    <span className="material-symbols-outlined text-lg">verified</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">applied</span>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleApply(job)}
                    disabled={applying === job.id}
                    className="px-6 py-3 bg-brand-teal text-white rounded-full font-black text-[10px] tracking-widest uppercase shadow-lg shadow-brand-teal/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {applying === job.id ? "syncing..." : "quick apply"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
