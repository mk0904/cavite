"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useDashboardTheme } from "@/context/DashboardThemeContext";
import {
  listenToApplications,
  listenToAllJobs,
  listenToActivity,
  type Application,
  type Job,
  type Activity,
} from "@/lib/db";

function activityBuckets(activities: Activity[], days: number): number[] {
  const buckets = Array(days).fill(0);
  const now = Date.now();
  for (const a of activities) {
    let t: Date;
    try {
      const ts = a.timestamp;
      t =
        ts && typeof ts.toDate === "function"
          ? ts.toDate()
          : new Date(ts?.seconds ? ts.seconds * 1000 : now);
    } catch {
      continue;
    }
    const diff = Math.floor((now - t.getTime()) / 86400000);
    if (diff >= 0 && diff < days) buckets[days - 1 - diff] += 1;
  }
  return buckets;
}

function Sparkline({
  values,
  isDark,
}: {
  values: number[];
  isDark: boolean;
}) {
  const max = Math.max(1, ...values);
  const w = 200;
  const h = 48;
  const pad = 4;
  const pts = values.map((v, i) => {
    const x = pad + (i * (w - pad * 2)) / Math.max(1, values.length - 1);
    const y = h - pad - (v / max) * (h - pad * 2);
    return `${x},${y}`;
  });
  const d = `M ${pts.join(" L ")}`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="h-12 w-full"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            stopColor={isDark ? "rgb(0, 123, 128)" : "rgb(0, 123, 128)"}
            stopOpacity="0.35"
          />
          <stop offset="100%" stopColor="rgb(0, 123, 128)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`${d} L ${w - pad},${h} L ${pad},${h} Z`}
        fill="url(#spark-fill)"
        className="opacity-90"
      />
      <path
        d={d}
        fill="none"
        stroke="rgb(0, 123, 128)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="drop-shadow-[0_0_6px_rgba(0,123,128,0.5)]"
      />
    </svg>
  );
}

export default function DashboardPage() {
  const { profile, user } = useAuth();
  const { theme } = useDashboardTheme();
  const isDark = theme === "dark";
  const isAdmin = profile?.role === "admin";
  const firstName = profile?.name
    ? profile.name.split(" ")[0].toLowerCase()
    : "architect";

  const [apps, setApps] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsubApps = listenToApplications(user.uid, setApps);
    const unsubJobs = listenToAllJobs(setJobs);
    const unsubActivity = listenToActivity(setActivities);
    const t = window.setTimeout(() => setLoading(false), 0);
    return () => {
      window.clearTimeout(t);
      unsubApps();
      unsubJobs();
      unsubActivity();
    };
  }, [user]);

  const stats = isAdmin
    ? [
        {
          label: "openings",
          value: jobs.filter((j) => j.status === "open").length.toString(),
          sub: "market",
          icon: "work",
        },
        {
          label: "apps",
          value: apps.length.toString(),
          sub: "telemetry",
          icon: "analytics",
        },
        { label: "yield", value: "94%", sub: "optimal", icon: "verified" },
      ]
    : [
        {
          label: "pursuits",
          value: apps.length.toString(),
          sub: "active",
          icon: "architecture",
        },
        {
          label: "shortlists",
          value: apps
            .filter((a) => a.status === "shortlisted")
            .length.toString(),
          sub: "precision",
          icon: "star_rate",
        },
        {
          label: "offers",
          value: apps
            .filter((a) => a.status === "offer" || a.status === "placed")
            .length.toString(),
          sub: "final",
          icon: "celebration",
        },
      ];

  const sparkValues = useMemo(
    () => activityBuckets(activities, 7),
    [activities]
  );

  const todayLabel = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const glassPanel = isDark
    ? "rounded-[1.75rem] border border-white/[0.08] bg-white/[0.04] shadow-[0_8px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl"
    : "rounded-[1.75rem] border border-white/70 bg-white/55 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl";

  const glassInset = isDark
    ? "rounded-2xl border border-white/[0.06] bg-black/25"
    : "rounded-2xl border border-slate-200/60 bg-white/40";

  const muted = isDark ? "text-white/45" : "text-slate-500";
  const heading = isDark ? "text-white" : "text-slate-900";

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div
          className={`h-9 w-9 animate-spin rounded-full border-2 border-brand-teal/25 border-t-brand-teal ${
            isDark ? "shadow-[0_0_20px_rgba(0,123,128,0.4)]" : ""
          }`}
        />
        <p className="animate-pulse text-[8px] font-black uppercase tracking-widest text-brand-teal">
          synchronizing telemetry…
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6 pb-8">
      {/* Top bar */}
      <header
        className={`flex flex-col gap-4 rounded-[1.75rem] border px-5 py-4 md:flex-row md:items-center md:justify-between ${
          isDark
            ? "border-white/[0.08] bg-white/[0.04] backdrop-blur-xl"
            : "border-white/70 bg-white/50 backdrop-blur-xl"
        }`}
      >
        <div>
          <div
            className={`mb-1 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${muted}`}
          >
            <span>home</span>
            <span className="opacity-40">/</span>
            <span className="text-brand-teal">dashboard</span>
            <span className="opacity-40">/</span>
            <span>{todayLabel}</span>
          </div>
          <p className={`text-lg font-semibold tracking-tight md:text-xl ${heading}`}>
            keep your pursuit stack{" "}
            <span className="bg-gradient-to-r from-brand-teal to-cyan-400 bg-clip-text text-transparent">
              calm & visible
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <div className="flex -space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-[10px] font-bold ${
                  isDark
                    ? "border-[#050708] bg-white/10 text-white/70"
                    : "border-white bg-slate-200/90 text-slate-600"
                }`}
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
            <button
              type="button"
              className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-brand-teal transition-all hover:scale-105 ${
                isDark
                  ? "border-[#050708] bg-brand-teal/20 shadow-[0_0_16px_rgba(0,123,128,0.35)]"
                  : "border-white bg-brand-teal/10 shadow-md"
              }`}
              aria-label="add"
            >
              <span className="material-symbols-outlined text-lg">add</span>
            </button>
          </div>
          <div
            className={`mx-1 hidden h-8 w-px md:block ${isDark ? "bg-white/10" : "bg-slate-200"}`}
          />
          <button
            type="button"
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
              isDark
                ? "border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                : "border-slate-200/80 bg-white/80 text-slate-500 hover:bg-white"
            }`}
            aria-label="search"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>
          <button
            type="button"
            className={`relative flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
              isDark
                ? "border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                : "border-slate-200/80 bg-white/80 text-slate-500 hover:bg-white"
            }`}
            aria-label="notifications"
          >
            <span className="material-symbols-outlined text-[22px]">
              notifications
            </span>
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500 dark:border-[#050708]" />
          </button>
          <div
            className={`flex h-10 w-10 overflow-hidden rounded-full border-2 ${
              isDark ? "border-white/20" : "border-white shadow-md"
            }`}
          >
            {profile?.photoURL ? (
              <img
                src={profile.photoURL}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-brand-teal/15 text-brand-teal">
                <span className="material-symbols-outlined text-xl">person</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero + chips */}
      <div className="px-1">
        <h1
          className={`font-headline text-3xl font-bold leading-tight tracking-tighter md:text-4xl ${heading}`}
        >
          welcome,{" "}
          <span className="font-light italic text-brand-teal">{firstName}.</span>
        </h1>
        <p className={`mt-2 max-w-2xl text-sm font-light leading-relaxed ${muted}`}>
          your live applications, market signals, and recent pulse — same data as
          before, now in a glass workspace that respects light and dark.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {["all", "active", "shortlisted", "offers"].map((chip, i) => (
            <button
              key={chip}
              type="button"
              className={`rounded-full border px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-all ${
                i === 0
                  ? isDark
                    ? "border-brand-teal/40 bg-brand-teal/15 text-brand-teal shadow-[0_0_18px_rgba(0,123,128,0.25)]"
                    : "border-brand-teal/30 bg-brand-teal/10 text-brand-teal shadow-sm"
                  : isDark
                    ? "border-white/10 bg-white/[0.03] text-white/45 hover:border-white/20 hover:text-white/80"
                    : "border-slate-200/80 bg-white/40 text-slate-500 hover:bg-white/70"
              }`}
            >
              {chip}
            </button>
          ))}
          <Link
            href="/jobs"
            className={`ml-auto inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] font-bold lowercase tracking-wide text-white shadow-[0_0_24px_rgba(0,123,128,0.45)] transition-all hover:scale-[1.02] hover:shadow-[0_0_32px_rgba(0,123,128,0.55)] ${
              isDark
                ? "bg-gradient-to-r from-brand-teal to-cyan-500"
                : "bg-gradient-to-r from-brand-teal to-[#009199]"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            browse market
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`${glassPanel} group flex items-center justify-between p-5 transition-transform hover:-translate-y-0.5`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                  isDark
                    ? "bg-brand-teal/15 text-brand-teal shadow-[0_0_20px_rgba(0,123,128,0.2)]"
                    : "bg-brand-teal/10 text-brand-teal"
                }`}
              >
                <span className="material-symbols-outlined text-2xl">
                  {stat.icon}
                </span>
              </div>
              <div>
                <p className={`text-[9px] font-bold uppercase tracking-wider ${muted}`}>
                  {stat.label}
                </p>
                <p className={`font-headline text-2xl font-bold ${heading}`}>
                  {stat.value}
                </p>
              </div>
            </div>
            <span className="text-[8px] font-bold uppercase tracking-widest text-brand-teal/50">
              {stat.sub}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Main pipeline */}
        <section className={`lg:col-span-8 ${glassPanel} flex flex-col p-6 md:p-8`}>
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className={`font-headline text-base font-bold lowercase ${heading}`}>
                active pursuit pipelines.
              </h2>
              <p className={`mt-1 text-[9px] font-bold uppercase tracking-widest ${muted}`}>
                real-time documentation status
              </p>
            </div>
            <Link
              href="/jobs"
              className={`inline-flex items-center gap-2 self-start rounded-full border px-4 py-2 text-[9px] font-bold uppercase tracking-widest text-brand-teal transition-all hover:shadow-[0_0_16px_rgba(0,123,128,0.25)] ${
                isDark
                  ? "border-brand-teal/30 bg-brand-teal/10"
                  : "border-brand-teal/25 bg-brand-teal/5"
              }`}
            >
              market gallery
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="min-h-[320px] space-y-2 pr-1">
            {apps.length === 0 ? (
              <div
                className={`flex min-h-[280px] flex-col items-center justify-center border border-dashed p-8 ${glassInset}`}
              >
                <span className="material-symbols-outlined mb-3 text-4xl text-brand-teal/30">
                  layers
                </span>
                <p className={`text-[10px] font-bold uppercase tracking-[0.35em] ${muted}`}>
                  awaiting structural sync — explore the market
                </p>
              </div>
            ) : (
              apps.map((app, i) => {
                const featured = i === 0;
                const applied = app.appliedAt?.toDate?.()
                  ? app.appliedAt.toDate()
                  : null;
                const dateStr = applied
                  ? applied.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  : "—";

                const featTitle = featured && isDark ? "text-white" : heading;
                const featSub =
                  featured && isDark ? "text-white/70" : muted;
                const featMeta =
                  featured && isDark ? "text-white/60" : muted;
                const featIconBox =
                  featured && isDark
                    ? "bg-white/20 text-white shadow-inner"
                    : featured
                      ? "bg-brand-teal/20 text-brand-teal shadow-inner"
                      : isDark
                        ? "bg-white/8 text-white/80"
                        : "bg-slate-100 text-slate-600";

                return (
                  <div
                    key={i}
                    className={`flex flex-col gap-4 p-4 transition-all sm:flex-row sm:items-center ${
                      featured
                        ? isDark
                          ? "rounded-2xl border border-brand-teal/30 bg-gradient-to-br from-brand-teal/25 via-brand-teal/10 to-transparent shadow-[0_0_32px_rgba(0,123,128,0.15)]"
                          : "rounded-2xl border border-brand-teal/25 bg-gradient-to-br from-brand-teal/15 via-white/40 to-white/20 shadow-[0_12px_40px_rgba(0,123,128,0.12)]"
                        : `rounded-2xl border border-transparent ${
                            isDark
                              ? "hover:border-white/10 hover:bg-white/[0.04]"
                              : "hover:border-slate-200/80 hover:bg-white/50"
                          }`
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${featIconBox}`}
                    >
                      <span className="material-symbols-outlined text-xl">layers</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3
                        className={`text-[12px] font-bold lowercase tracking-tight ${featTitle}`}
                      >
                        {app.jobTitle.toLowerCase()}
                      </h3>
                      <p
                        className={`mt-0.5 text-[9px] font-semibold uppercase tracking-widest ${featSub}`}
                      >
                        {app.companyName.toLowerCase()}
                      </p>
                      {featured && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[8px] font-bold uppercase tracking-wider ${
                              isDark
                                ? "bg-black/30 text-white/80"
                                : "bg-white/80 text-slate-700 ring-1 ring-slate-200/60"
                            }`}
                          >
                            priority lane
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-1 text-[8px] font-bold uppercase tracking-wider ${
                              isDark
                                ? "bg-black/30 text-white/80"
                                : "bg-white/80 text-slate-700 ring-1 ring-slate-200/60"
                            }`}
                          >
                            {app.status}
                          </span>
                        </div>
                      )}
                      {featured && (
                        <div className="mt-4">
                          <div
                            className={`mb-1 flex justify-between text-[8px] font-bold uppercase tracking-wider ${featMeta}`}
                          >
                            <span>momentum</span>
                            <span>72%</span>
                          </div>
                          <div
                            className={`h-2 overflow-hidden rounded-full ${
                              isDark ? "bg-black/40" : "bg-slate-200/80"
                            }`}
                          >
                            <div
                              className="h-full w-[72%] rounded-full bg-gradient-to-r from-brand-teal to-cyan-400"
                              style={{
                                backgroundImage: isDark
                                  ? "linear-gradient(135deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)"
                                  : undefined,
                                backgroundSize: "8px 8px",
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-row items-center gap-3 sm:flex-col sm:items-end">
                      <div
                        className={`rounded-full border px-3 py-1 ${
                          app.status === "offer"
                            ? isDark
                              ? "border-emerald-400/30 bg-emerald-500/15"
                              : "border-emerald-200 bg-emerald-50"
                            : isDark
                              ? "border-brand-teal/25 bg-brand-teal/10"
                              : "border-brand-teal/15 bg-brand-teal/5"
                        }`}
                      >
                        <span
                          className={`text-[8px] font-bold uppercase tracking-widest ${
                            app.status === "offer"
                              ? "text-emerald-400"
                              : "text-brand-teal/80"
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>
                      <span
                        className={`text-[9px] font-bold tracking-tighter ${
                          featured && isDark ? "text-white/50" : muted
                        }`}
                      >
                        {dateStr}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Right rail */}
        <aside className="flex flex-col gap-4 lg:col-span-4">
          <div
            className={`${glassPanel} overflow-hidden p-5 ${
              isDark
                ? "bg-gradient-to-br from-brand-teal/20 via-white/[0.04] to-transparent"
                : "bg-gradient-to-br from-brand-teal/12 via-white/50 to-white/30"
            }`}
          >
            <p className={`text-[10px] font-bold uppercase tracking-widest ${muted}`}>
              latest pulse
            </p>
            <p className={`mt-3 text-sm font-medium leading-relaxed ${heading}`}>
              {activities[0]?.message || "no feed events yet — your timeline will fill as you apply."}
            </p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className={`text-[9px] font-bold uppercase tracking-wider ${muted}`}>
                {activities[0]?.userName ? `via ${activities[0].userName}` : "cavite"}
              </span>
              <button
                type="button"
                className={`rounded-full px-4 py-2 text-[9px] font-bold uppercase tracking-wider text-white shadow-[0_0_16px_rgba(0,123,128,0.35)] ${
                  isDark
                    ? "bg-white/15 hover:bg-white/25"
                    : "bg-brand-teal hover:bg-brand-teal/90"
                }`}
              >
                ok
              </button>
            </div>
          </div>

          <div className={`${glassPanel} p-5`}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${muted}`}>
                  portfolio files
                </p>
                <p className={`mt-1 text-sm font-semibold ${heading}`}>resumes & exports</p>
              </div>
              <Link
                href="/resumes"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-teal/15 text-brand-teal transition-all hover:bg-brand-teal/25"
                aria-label="resumes"
              >
                <span className="material-symbols-outlined">description</span>
              </Link>
            </div>
            <div
              className={`mt-4 flex min-h-[100px] flex-col items-center justify-center rounded-2xl border border-dashed py-6 ${glassInset}`}
            >
              <span className={`text-[10px] font-bold uppercase tracking-widest ${muted}`}>
                sync documents from studio
              </span>
              <div className="mt-3 flex gap-2 opacity-50">
                {["article", "palette", "stylus_note"].map((icon) => (
                  <span key={icon} className="material-symbols-outlined text-xl">
                    {icon}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={`${glassPanel} p-5`}>
            <div className="flex items-center justify-between gap-2">
              <p className={`text-[10px] font-bold uppercase tracking-widest ${muted}`}>
                activity (7d)
              </p>
              <button
                type="button"
                className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-brand-teal ${
                  isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white/60"
                }`}
              >
                report
                <span className="material-symbols-outlined text-sm">arrow_outward</span>
              </button>
            </div>
            <div className="mt-2">
              <Sparkline values={sparkValues} isDark={isDark} />
            </div>
            <p className={`mt-2 text-[9px] font-medium ${muted}`}>
              {activities.length} events in your recent window
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
