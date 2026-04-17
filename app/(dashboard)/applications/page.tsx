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
        <span className="mb-3 block text-[9px] font-bold lowercase tracking-[0.3em] text-brand-teal dark:text-[#7ee8ec]">
          pipeline telemetry.
        </span>
        <h1 className="font-headline text-3xl font-bold leading-tight tracking-tighter text-zinc-900 dark:text-white">
          application <br />
          <span className="text-brand-teal italic font-light lowercase dark:text-[#7ee8ec]">
            journey.
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-sm font-light leading-relaxed text-zinc-600 dark:text-zinc-300">
          track your structural progress across institutional opportunities.
        </p>
      </div>

      <div className="glass-panel rounded-[2.5rem] border border-white/60 p-6 shadow-sm dark:border-zinc-600/50 dark:bg-zinc-900/35">
        {loading ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-teal/20 border-t-brand-teal dark:border-brand-teal/30" />
            <p className="animate-pulse text-[8px] font-bold lowercase tracking-widest text-brand-teal dark:text-[#7ee8ec]">
              synchronizing journey...
            </p>
          </div>
        ) : apps.length === 0 ? (
          <div className="py-20 text-center">
            <h3 className="font-headline text-xl font-bold lowercase text-zinc-700 dark:text-zinc-200">
              no active journeys.
            </h3>
            <p className="mt-2 text-[10px] font-bold lowercase tracking-widest text-zinc-500 dark:text-zinc-400">
              initiate an application via the opportunity gallery.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {apps.map((app, i) => (
              <div
                key={app.id ?? `${app.jobId}-${i}`}
                className="group flex animate-in items-center gap-6 rounded-3xl border border-zinc-200/60 bg-white/40 p-6 transition-all slide-in-from-right-4 dark:border-zinc-600/45 dark:bg-zinc-900/50 dark:hover:border-brand-teal/30 dark:hover:bg-zinc-900/70"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-teal/10 text-brand-teal transition-all group-hover:rotate-2 group-hover:bg-brand-teal group-hover:text-white dark:bg-brand-teal/20 dark:text-[#7ee8ec]">
                  <span className="material-symbols-outlined text-2xl font-light">
                    layers
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-headline text-[15px] font-bold lowercase leading-tight tracking-tight text-zinc-900 dark:text-zinc-50">
                    {app.jobTitle}
                  </h4>
                  <p className="mt-2 text-[9px] font-bold lowercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    {app.companyName}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <span
                    className={`inline-block rounded-full border px-4 py-1.5 text-[9px] font-bold lowercase tracking-widest ${
                      app.status === "applied"
                        ? "border-blue-200/60 bg-blue-50/80 text-blue-700 dark:border-blue-400/40 dark:bg-blue-950/55 dark:text-blue-200"
                        : app.status === "shortlisted"
                          ? "border-amber-200/60 bg-amber-50/80 text-amber-800 dark:border-amber-400/40 dark:bg-amber-950/45 dark:text-amber-200"
                          : "border-emerald-200/60 bg-emerald-50/80 text-emerald-800 dark:border-emerald-400/40 dark:bg-emerald-950/45 dark:text-emerald-200"
                    }`}
                  >
                    {app.status}
                  </span>
                  <p className="mt-2 text-[9px] font-bold lowercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    {app.appliedAt
                      ?.toDate()
                      .toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      .toLowerCase() ?? "—"}
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
