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
    <div className="w-full pb-32 pt-2">
      <div className="mb-12">
        <span className="text-brand-teal font-bold tracking-[0.3em] lowercase text-[9px] mb-3 block">structural database.</span>
        <h1 className="text-3xl font-bold font-headline tracking-tighter text-on-surface leading-tight">
          opportunity <br />
          <span className="text-brand-teal italic font-light lowercase">gallery.</span>
        </h1>
        <p className="text-sm text-on-surface-variant mt-4 font-light max-w-2xl leading-relaxed">
          discover architectural roles curated for the 2026 cohort. precision matching for institutional excellence.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <div className="w-8 h-8 border-3 border-brand-teal/10 border-t-brand-teal rounded-full animate-spin"></div>
          <p className="text-[8px] font-bold lowercase tracking-widest text-brand-teal animate-pulse">synchronizing gallery...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass-panel p-12 rounded-[2.5rem] text-center border border-white/40 shadow-sm bg-white/20">
           <span className="material-symbols-outlined text-4xl text-on-surface-variant/20 mb-4 font-light">architecture</span>
           <h3 className="text-xl font-bold font-headline text-on-surface lowercase">no openings synchronized.</h3>
           <p className="text-on-surface-variant/40 mt-2 font-label lowercase text-[9px] tracking-widest opacity-60">check back as institutional verification proceeds.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {jobs.map((job) => (
            <div key={job.id} className="glass-panel p-6 rounded-3xl border border-white shadow-sm hover:translate-y-[-2px] transition-all duration-300 flex flex-col justify-between group bg-white/40">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-10 h-10 bg-brand-teal/5 rounded-xl flex items-center justify-center text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-all">
                    <span className="material-symbols-outlined text-xl font-light">work</span>
                  </div>
                  <span className="text-[8px] font-bold tracking-widest lowercase px-2.5 py-1 rounded-full bg-brand-teal/5 text-brand-teal">
                    {job.type.toLowerCase()}
                  </span>
                </div>
                <h3 className="text-[17px] font-bold font-headline text-on-surface tracking-tight leading-tight mb-1 group-hover:text-brand-teal transition-colors lowercase">{job.title}</h3>
                <p className="text-[9px] font-bold tracking-widest lowercase text-on-surface-variant/40 mb-4">{job.company} • {job.location}</p>
                <p className="text-[13px] text-on-surface-variant/60 font-medium leading-relaxed mb-6 line-clamp-3">
                  {job.description}
                </p>
              </div>

              <div className="pt-5 border-t border-outline-variant/10 flex items-center justify-between mt-auto">
                <span className="text-sm font-bold font-headline text-on-surface lowercase">{job.salary}</span>
                {hasApplied(job.id) ? (
                   <div className="flex items-center gap-2 text-emerald-600/60">
                     <span className="material-symbols-outlined text-base">verified</span>
                     <span className="text-[9px] font-bold lowercase tracking-widest">applied</span>
                   </div>
                ) : (
                   <button 
                    onClick={() => handleApply(job)}
                    disabled={applying === job.id}
                    className="px-5 py-2.5 bg-on-surface text-white rounded-2xl font-bold text-[9px] tracking-widest lowercase shadow-sm hover:bg-brand-teal transition-all disabled:opacity-50"
                  >
                    {applying === job.id ? "syncing..." : "quick apply."}
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
