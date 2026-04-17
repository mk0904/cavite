"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Job,
  listenToAllJobs,
  applyToJob,
  Application,
  listenToApplications,
} from "@/lib/db";

type SortKey =
  | "newest"
  | "oldest"
  | "title-asc"
  | "company-asc"
  | "deadline-soonest"
  | "salary-high";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "newest listed" },
  { value: "oldest", label: "oldest listed" },
  { value: "title-asc", label: "title (a–z)" },
  { value: "company-asc", label: "company (a–z)" },
  { value: "deadline-soonest", label: "deadline (soonest)" },
  { value: "salary-high", label: "salary (high → low)" },
];

function jobPostedMs(job: Job): number {
  const c = job.createdAt as { toDate?: () => Date; seconds?: number } | undefined;
  if (!c) return 0;
  if (typeof c.toDate === "function") return c.toDate().getTime();
  if (typeof c.seconds === "number") return c.seconds * 1000;
  return 0;
}

function salarySortHint(s: string): number {
  const raw = s.replace(/,/g, "").toLowerCase();
  const m = raw.match(/(\d+(\.\d+)?)/);
  if (!m) return 0;
  let n = parseFloat(m[1]);
  if (/\bk\b/.test(raw)) n *= 1000;
  if (/\bm\b/.test(raw)) n *= 1e6;
  if (/\blpa\b|\binr\b|\brupees?\b/.test(raw)) n *= 1;
  return n;
}

function deadlineSortMs(d: string): number {
  const t = Date.parse(d);
  return Number.isNaN(t) ? Number.MAX_SAFE_INTEGER : t;
}

function normalize(s: string) {
  return s.trim().toLowerCase();
}

/** Tiny copy for “when this hit the wire” — matches institutional / gallery voice */
function postedLine(job: Job): string {
  const ms = jobPostedMs(job);
  if (!ms) return "sync pending";
  const posted = new Date(ms);
  const now = Date.now();
  const dayMs = 86_400_000;
  const diffDays = Math.floor((now - ms) / dayMs);
  if (diffDays <= 0) return "posted today";
  if (diffDays === 1) return "posted yesterday";
  if (diffDays < 7) return `posted ${diffDays}d ago`;
  const dateOpts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  if (posted.getFullYear() !== new Date().getFullYear()) dateOpts.year = "numeric";
  return `posted ${posted.toLocaleDateString("en-US", dateOpts).toLowerCase()}`;
}

function daysUntilDeadline(deadline: string): number | null {
  const t = Date.parse(deadline);
  if (Number.isNaN(t)) return null;
  return Math.ceil((t - Date.now()) / 86_400_000);
}

/** One visual system for every jobs toolbar control */
const TB_LABEL =
  "mb-1 block leading-tight text-[9px] font-black uppercase tracking-[0.12em] text-brand-teal dark:text-[#7ee8ec]";

const TB_SHELL =
  "rounded-xl border border-zinc-200/80 bg-white/90 transition-[border-color,box-shadow] focus-within:border-brand-teal focus-within:ring-2 focus-within:ring-brand-teal/15 dark:border-zinc-600/60 dark:bg-zinc-950/80 dark:focus-within:border-[#5ec4c9] dark:focus-within:ring-[#5ec4c9]/20";

type ToolboxOption = { value: string; label: string };

function ToolboxDropdown({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: ToolboxOption[];
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e: MouseEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={rootRef} className="min-w-0 w-full">
      <span id={`${id}-label`} className={TB_LABEL}>
        {label}
      </span>
      <div className="relative">
        <button
          type="button"
          id={id}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby={`${id}-label`}
          onClick={() => setOpen((o) => !o)}
          className={`flex h-10 w-full cursor-pointer items-center justify-between gap-2 pl-3 pr-2 text-left text-xs font-semibold text-zinc-900 outline-none transition-[border-color,box-shadow] focus-visible:border-brand-teal focus-visible:ring-2 focus-visible:ring-brand-teal/15 dark:text-zinc-100 dark:focus-visible:border-[#5ec4c9] dark:focus-visible:ring-[#5ec4c9]/20 ${TB_SHELL}`}
        >
          <span className="min-w-0 truncate">{selected?.label ?? value}</span>
          <span
            className={`material-symbols-outlined shrink-0 text-[18px] font-light text-brand-teal transition-transform dark:text-[#7ee8ec] ${open ? "rotate-180" : ""}`}
            aria-hidden
          >
            expand_more
          </span>
        </button>
        {open ? (
          <ul
            role="listbox"
            aria-labelledby={`${id}-label`}
            className="absolute left-0 right-0 top-full z-[80] mt-1 max-h-56 overflow-auto rounded-xl border border-zinc-200/90 bg-white/96 py-1 shadow-[0_14px_44px_-10px_rgba(0,123,128,0.22)] backdrop-blur-md dark:border-zinc-600/85 dark:bg-[#0f1416]/96 dark:shadow-[0_18px_50px_-8px_rgba(0,0,0,0.65),0_0_0_1px_rgba(94,196,201,0.08)]"
          >
            {options.map((opt) => {
              const active = opt.value === value;
              return (
                <li key={opt.value} role="none">
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center px-3 py-2.5 text-left text-xs font-semibold transition-colors ${
                      active
                        ? "bg-brand-teal/14 text-brand-teal dark:bg-[#5ec4c9]/14 dark:text-[#7ee8ec]"
                        : "text-zinc-800 hover:bg-brand-teal/10 hover:text-brand-teal dark:text-zinc-200 dark:hover:bg-[#5ec4c9]/12 dark:hover:text-[#a5f3f7]"
                    }`}
                  >
                    {opt.label}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

function ToolboxSearch({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="min-w-0 w-full">
      <label htmlFor="jobs-toolbox-search" className={TB_LABEL}>
        search
      </label>
      <div className={`relative flex items-stretch ${TB_SHELL}`}>
        <span className="pointer-events-none absolute left-2.5 top-1/2 z-[1] -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
          <span className="material-symbols-outlined text-[18px] font-light">search</span>
        </span>
        <input
          id="jobs-toolbox-search"
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-10 w-full min-w-0 border-0 bg-transparent py-0 pl-9 pr-9 text-xs font-semibold text-zinc-900 outline-none placeholder:font-medium placeholder:text-zinc-500 dark:text-zinc-100 dark:placeholder:text-zinc-500 sm:text-sm"
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-1.5 top-1/2 z-[1] flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            aria-label="Clear search"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        ) : null}
      </div>
    </div>
  );
}

function ToolboxLayoutToggle({
  layout,
  setLayout,
}: {
  layout: "grid" | "list";
  setLayout: (v: "grid" | "list") => void;
}) {
  return (
    <div className="min-w-0 w-full">
      <span className={TB_LABEL}>layout</span>
      <div className={`flex h-10 gap-0.5 p-0.5 ${TB_SHELL}`}>
        <button
          type="button"
          onClick={() => setLayout("grid")}
          className={`flex min-h-0 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg text-[10px] font-bold uppercase leading-none tracking-wide transition ${
            layout === "grid"
              ? "bg-white text-brand-teal shadow-sm dark:bg-zinc-800 dark:text-[#7ee8ec]"
              : "text-zinc-500 hover:bg-white/60 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-200"
          }`}
        >
          <span className="material-symbols-outlined flex h-7 w-7 shrink-0 items-center justify-center overflow-visible text-[20px] font-light leading-none">
            grid_view
          </span>
          <span className="truncate leading-none">grid</span>
        </button>
        <button
          type="button"
          onClick={() => setLayout("list")}
          className={`flex min-h-0 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg text-[10px] font-bold uppercase leading-none tracking-wide transition ${
            layout === "list"
              ? "bg-white text-brand-teal shadow-sm dark:bg-zinc-800 dark:text-[#7ee8ec]"
              : "text-zinc-500 hover:bg-white/60 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-200"
          }`}
        >
          <span className="material-symbols-outlined flex h-7 w-7 shrink-0 items-center justify-center overflow-visible text-[20px] font-light leading-none">
            view_list
          </span>
          <span className="truncate leading-none">list</span>
        </button>
      </div>
    </div>
  );
}

function JobPostingMeta({ job, className = "" }: { job: Job; className?: string }) {
  const d = daysUntilDeadline(job.deadline);
  let deadlineClass =
    "text-zinc-500 dark:text-zinc-500";
  let suffix: string | null = null;
  if (d === null) {
    suffix = null;
  } else if (d < 0) {
    deadlineClass = "text-zinc-400 dark:text-zinc-600";
    suffix = "elapsed";
  } else if (d === 0) {
    deadlineClass = "text-amber-700 dark:text-amber-400/95";
    suffix = "today";
  } else if (d <= 3) {
    deadlineClass = "text-amber-700 dark:text-amber-400/95";
    suffix = `${d}d left`;
  } else if (d <= 14) {
    deadlineClass = "text-zinc-600 dark:text-zinc-400";
    suffix = `${d}d left`;
  }

  return (
    <div
      className={`flex flex-wrap items-center gap-x-2 gap-y-0.5 ${className}`}
    >
      <span className="inline-flex items-center gap-1 text-[8px] font-bold uppercase tracking-[0.14em] text-brand-teal/90 dark:text-[#6fd9de]">
        <span className="material-symbols-outlined text-[13px] font-light opacity-85">
          schedule_send
        </span>
        {postedLine(job)}
      </span>
      <span className="select-none text-[8px] text-zinc-300 dark:text-zinc-600">
        ·
      </span>
      <span className={`text-[8px] font-bold uppercase tracking-[0.14em] ${deadlineClass}`}>
        apply by {job.deadline?.trim() || "—"}
        {suffix ? ` · ${suffix}` : null}
      </span>
      {job.postedBy?.trim() ? (
        <>
          <span className="select-none text-[8px] text-zinc-300 dark:text-zinc-600">
            ·
          </span>
          <span className="text-[7px] font-bold uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-500">
            src {job.postedBy.trim()}
          </span>
        </>
      ) : null}
    </div>
  );
}

export default function JobsPage() {
  const { profile, user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [myApps, setMyApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [includeClosed, setIncludeClosed] = useState(false);
  const [layout, setLayout] = useState<"grid" | "list">("grid");

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

  const jobTypes = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => {
      if (j.type?.trim()) set.add(j.type.trim());
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [jobs]);

  const jobLocations = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => {
      if (j.location?.trim()) set.add(j.location.trim());
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [jobs]);

  const typeOptions = useMemo<ToolboxOption[]>(
    () => [{ value: "all", label: "all types" }, ...jobTypes.map((t) => ({ value: t, label: t }))],
    [jobTypes]
  );

  const locationOptions = useMemo<ToolboxOption[]>(
    () => [
      { value: "all", label: "all locations" },
      ...jobLocations.map((loc) => ({ value: loc, label: loc })),
    ],
    [jobLocations]
  );

  const filteredSorted = useMemo(() => {
    let list = jobs.slice();

    if (!includeClosed) {
      list = list.filter((j) => j.status !== "closed");
    }

    const q = normalize(search);
    if (q) {
      list = list.filter((j) => {
        const hay = [
          j.title,
          j.company,
          j.location,
          j.type,
          j.description,
          j.salary,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });
    }

    if (typeFilter !== "all") {
      list = list.filter((j) => j.type?.trim() === typeFilter);
    }

    if (locationFilter !== "all") {
      list = list.filter((j) => j.location?.trim() === locationFilter);
    }

    const sorted = list.slice();
    switch (sortKey) {
      case "newest":
        sorted.sort((a, b) => jobPostedMs(b) - jobPostedMs(a));
        break;
      case "oldest":
        sorted.sort((a, b) => jobPostedMs(a) - jobPostedMs(b));
        break;
      case "title-asc":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "company-asc":
        sorted.sort((a, b) => a.company.localeCompare(b.company));
        break;
      case "deadline-soonest":
        sorted.sort((a, b) => deadlineSortMs(a.deadline) - deadlineSortMs(b.deadline));
        break;
      case "salary-high":
        sorted.sort((a, b) => salarySortHint(b.salary) - salarySortHint(a.salary));
        break;
      default:
        break;
    }

    return sorted;
  }, [jobs, search, sortKey, typeFilter, locationFilter, includeClosed]);

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
    return myApps.some((app) => app.jobId === jobId);
  };

  const openCount = useMemo(
    () => jobs.filter((j) => j.status !== "closed").length,
    [jobs]
  );

  const clearFilters = () => {
    setSearch("");
    setSortKey("newest");
    setTypeFilter("all");
    setLocationFilter("all");
    setIncludeClosed(false);
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    typeFilter !== "all" ||
    locationFilter !== "all" ||
    includeClosed ||
    sortKey !== "newest";

  return (
    <div className="w-full pb-32 pt-2">
      <div className="mb-8">
        <span className="mb-3 block text-[9px] font-bold lowercase tracking-[0.3em] text-brand-teal dark:text-[#7ee8ec]">
          structural database.
        </span>
        <h1 className="font-headline text-3xl font-bold leading-tight tracking-tighter text-zinc-900 dark:text-white">
          opportunity <br />
          <span className="text-brand-teal italic font-light lowercase dark:text-[#7ee8ec]">
            gallery.
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-sm font-light leading-relaxed text-zinc-600 dark:text-zinc-300">
          search, filter, and sort open roles. switch between grid and list to match how you
          actually browse.
        </p>
        <p className="mt-3 text-[8px] font-bold uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-500">
          relative posted · apply-by cues · live sync
        </p>
      </div>

      {loading ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-teal/10 border-t-brand-teal"></div>
          <p className="animate-pulse text-[8px] font-bold lowercase tracking-widest text-brand-teal dark:text-[#7ee8ec]">
            synchronizing gallery...
          </p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass-panel rounded-[2.5rem] border border-white/40 p-12 text-center shadow-sm dark:border-zinc-600/50">
          <span className="material-symbols-outlined mb-4 text-4xl font-light text-brand-teal/70 dark:text-[#5ecfd4]/90">
            architecture
          </span>
          <h3 className="font-headline text-xl font-bold lowercase text-zinc-900 dark:text-zinc-100">
            no openings synchronized.
          </h3>
          <p className="mt-2 font-label text-[9px] lowercase tracking-widest text-zinc-500 dark:text-zinc-400">
            check back as institutional verification proceeds.
          </p>
        </div>
      ) : (
        <>
          <div className="glass-panel relative mb-6 rounded-[2rem] border border-white/60 p-5 shadow-sm dark:border-zinc-600/50 dark:bg-zinc-900/35 sm:p-6">
            <div
              className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-teal/35 to-transparent dark:via-[#5ec4c9]/30"
              aria-hidden
            />
            <p className="mb-3 text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
              refine queue
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-12 xl:gap-x-4 xl:gap-y-4">
              <div className="sm:col-span-2 xl:col-span-5">
                <ToolboxSearch
                  value={search}
                  onChange={setSearch}
                  placeholder="role, company, location, keywords…"
                />
              </div>
              <div className="xl:col-span-4">
                <ToolboxDropdown
                  id="jobs-sort"
                  label="sort by"
                  value={sortKey}
                  onChange={(v) => setSortKey(v as SortKey)}
                  options={SORT_OPTIONS}
                />
              </div>
              <div className="xl:col-span-3">
                <ToolboxLayoutToggle layout={layout} setLayout={setLayout} />
              </div>
              <div className="xl:col-span-4">
                <ToolboxDropdown
                  id="jobs-type"
                  label="role type"
                  value={typeFilter}
                  onChange={setTypeFilter}
                  options={typeOptions}
                />
              </div>
              <div className="xl:col-span-4">
                <ToolboxDropdown
                  id="jobs-location"
                  label="location"
                  value={locationFilter}
                  onChange={setLocationFilter}
                  options={locationOptions}
                />
              </div>
              <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-end sm:justify-between xl:col-span-4 xl:justify-end xl:gap-4">
                <div className={`flex h-10 w-full min-w-0 items-center gap-2.5 px-3 sm:w-auto ${TB_SHELL}`}>
                  <input
                    id="jobs-include-closed"
                    type="checkbox"
                    checked={includeClosed}
                    onChange={(e) => setIncludeClosed(e.target.checked)}
                    className="h-4 w-4 shrink-0 rounded border-zinc-300 text-brand-teal focus:ring-brand-teal/30 dark:border-zinc-600 dark:bg-zinc-900"
                  />
                  <label
                    htmlFor="jobs-include-closed"
                    className="cursor-pointer text-[10px] font-bold uppercase leading-snug tracking-widest text-zinc-600 dark:text-zinc-400"
                  >
                    show closed roles
                  </label>
                </div>
                {hasActiveFilters ? (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className={`flex h-10 shrink-0 items-center justify-center px-4 text-[10px] font-bold uppercase tracking-widest text-brand-teal transition-colors hover:bg-zinc-50 dark:text-[#7ee8ec] dark:hover:bg-zinc-800/60 ${TB_SHELL}`}
                  >
                    reset filters
                  </button>
                ) : null}
              </div>
            </div>

            <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              showing{" "}
              <span className="text-zinc-800 dark:text-zinc-200">
                {filteredSorted.length}
              </span>{" "}
              of{" "}
              <span className="text-zinc-800 dark:text-zinc-200">{jobs.length}</span>{" "}
              roles
              {!includeClosed && openCount !== jobs.length ? (
                <>
                  {" "}
                  ·{" "}
                  <span className="text-brand-teal dark:text-[#7ee8ec]">
                    {openCount} open
                  </span>
                </>
              ) : null}
            </p>
          </div>

          {filteredSorted.length === 0 ? (
            <div className="glass-panel rounded-[2rem] border border-white/50 p-12 text-center dark:border-zinc-600/50">
              <span className="material-symbols-outlined mb-3 text-3xl font-light text-zinc-400 dark:text-zinc-500">
                filter_alt_off
              </span>
              <h3 className="font-headline text-lg font-bold lowercase text-zinc-900 dark:text-zinc-100">
                no roles match these filters.
              </h3>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                widen search or reset filters to see the full gallery.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-full border border-brand-teal/35 bg-brand-teal/10 px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-brand-teal transition-colors hover:bg-brand-teal hover:text-white dark:border-[#5ec4c9]/40 dark:text-[#7ee8ec] dark:hover:bg-[#5ec4c9] dark:hover:text-zinc-900"
              >
                reset filters
              </button>
            </div>
          ) : layout === "grid" ? (
            <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredSorted.map((job, i) => (
                <JobCard
                  key={job.id}
                  index={i}
                  job={job}
                  applied={hasApplied(job.id)}
                  applying={applying === job.id}
                  onApply={() => handleApply(job)}
                  variant="grid"
                />
              ))}
            </div>
          ) : (
            <div className="mb-12 flex flex-col gap-3">
              {filteredSorted.map((job, i) => (
                <JobCard
                  key={job.id}
                  index={i}
                  job={job}
                  applied={hasApplied(job.id)}
                  applying={applying === job.id}
                  onApply={() => handleApply(job)}
                  variant="list"
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function JobCard({
  job,
  applied,
  applying,
  onApply,
  variant,
  index = 0,
}: {
  job: Job;
  applied: boolean;
  applying: boolean;
  onApply: () => void;
  variant: "grid" | "list";
  index?: number;
}) {
  const closed = job.status === "closed";
  const enterDelay = Math.min(index, 14) * 42;

  if (variant === "list") {
    return (
      <div
        className={`glass-panel flex flex-col gap-4 rounded-2xl border border-white/60 border-l-2 border-l-brand-teal/20 p-5 shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 fill-mode-both hover:border-brand-teal/28 dark:border-zinc-600/50 dark:border-l-[#4a9ea3]/35 dark:bg-zinc-900/40 dark:hover:border-brand-teal/38 sm:flex-row sm:items-center sm:justify-between sm:gap-6 ${
          closed ? "opacity-75" : ""
        }`}
        style={{ animationDelay: `${enterDelay}ms`, animationDuration: "480ms" }}
      >
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-brand-teal/10 px-2.5 py-1 text-[8px] font-bold lowercase tracking-widest text-brand-teal dark:bg-brand-teal/20 dark:text-[#7ee8ec]">
              {job.type.toLowerCase()}
            </span>
            {closed ? (
              <span className="rounded-full bg-zinc-200/80 px-2.5 py-1 text-[8px] font-bold uppercase tracking-widest text-zinc-600 dark:bg-zinc-700/80 dark:text-zinc-300">
                closed
              </span>
            ) : null}
          </div>
          <h3 className="font-headline text-base font-bold lowercase leading-tight tracking-tight text-zinc-900 dark:text-zinc-50">
            {job.title}
          </h3>
          <p className="mt-1 text-[9px] font-bold lowercase tracking-widest text-zinc-500 dark:text-zinc-400">
            {job.company} • {job.location}
          </p>
          <JobPostingMeta job={job} className="mt-2.5" />
          <p className="mt-2 line-clamp-2 text-[12px] font-medium leading-relaxed text-zinc-600 dark:text-zinc-300">
            {job.description}
          </p>
          <div className="mt-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-800 dark:text-zinc-200">
              {job.salary}
            </p>
            <p className="mt-0.5 text-[7px] font-bold uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-500">
              compensation band
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
          {applied ? (
            <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200/60 bg-emerald-50/80 px-4 py-2.5 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-300 sm:min-w-[9rem]">
              <span className="material-symbols-outlined text-base">verified</span>
              <span className="text-[9px] font-bold lowercase tracking-widest">applied</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onApply}
              disabled={applying || closed}
              className="rounded-2xl bg-gradient-to-r from-brand-teal to-[#009097] px-5 py-2.5 text-[9px] font-bold lowercase tracking-widest text-white shadow-[0_6px_20px_rgba(0,123,128,0.35)] transition-all hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-[0_0_22px_rgba(0,123,128,0.4)]"
            >
              {closed ? "closed" : applying ? "syncing..." : "quick apply."}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`glass-panel group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/60 border-l-2 border-l-brand-teal/20 p-6 shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 fill-mode-both hover:translate-y-[-2px] hover:border-brand-teal/25 hover:shadow-md dark:border-zinc-600/50 dark:border-l-[#4a9ea3]/35 dark:bg-zinc-900/40 dark:hover:border-brand-teal/40 ${
        closed ? "opacity-75" : ""
      }`}
      style={{ animationDelay: `${enterDelay}ms`, animationDuration: "520ms" }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-brand-teal/15 via-brand-teal/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-[#5ec4c9]/25"
        aria-hidden
      />
      <div>
        <div className="mb-5 flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-teal/10 text-brand-teal transition-all group-hover:bg-brand-teal group-hover:text-white dark:bg-brand-teal/20 dark:text-[#7ee8ec]">
            <span className="material-symbols-outlined text-xl font-light">work</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="rounded-full bg-brand-teal/10 px-2.5 py-1 text-[8px] font-bold lowercase tracking-widest text-brand-teal dark:bg-brand-teal/20 dark:text-[#7ee8ec]">
              {job.type.toLowerCase()}
            </span>
            {closed ? (
              <span className="rounded-full bg-zinc-200/80 px-2 py-0.5 text-[7px] font-bold uppercase tracking-widest text-zinc-600 dark:bg-zinc-700/80 dark:text-zinc-300">
                closed
              </span>
            ) : null}
          </div>
        </div>
        <h3 className="mb-1 font-headline text-[17px] font-bold lowercase leading-tight tracking-tight text-zinc-900 transition-colors group-hover:text-brand-teal dark:text-zinc-50 dark:group-hover:text-[#7ee8ec]">
          {job.title}
        </h3>
        <p className="mb-2 text-[9px] font-bold lowercase tracking-widest text-zinc-500 dark:text-zinc-400">
          {job.company} • {job.location}
        </p>
        <JobPostingMeta job={job} className="mb-3" />
        <p className="mb-6 line-clamp-3 text-[13px] font-medium leading-relaxed text-zinc-600 dark:text-zinc-300">
          {job.description}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-zinc-200/80 pt-5 dark:border-zinc-600/60">
        <div className="min-w-0">
          <span className="font-headline text-sm font-bold lowercase text-zinc-900 dark:text-zinc-100">
            {job.salary}
          </span>
          <p className="mt-1 truncate text-[7px] font-bold uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-500">
            compensation band
          </p>
        </div>
        {applied ? (
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <span className="material-symbols-outlined text-base">verified</span>
            <span className="text-[9px] font-bold lowercase tracking-widest">applied</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={onApply}
            disabled={applying || closed}
            className="rounded-2xl bg-gradient-to-r from-brand-teal to-[#009097] px-5 py-2.5 text-[9px] font-bold lowercase tracking-widest text-white shadow-[0_6px_20px_rgba(0,123,128,0.35)] transition-all hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-[0_0_22px_rgba(0,123,128,0.4)]"
          >
            {closed ? "closed" : applying ? "syncing..." : "quick apply."}
          </button>
        )}
      </div>
    </div>
  );
}
