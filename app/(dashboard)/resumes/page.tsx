"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Resume, listenToUserResumes, createResume } from "@/lib/db";
import { generateLatex } from "@/lib/latex-generator";

function resumeMatchesRoleSearch(resume: Resume, rawQuery: string): boolean {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return true;

  if (resume.title.toLowerCase().includes(q)) return true;

  const summary = resume.sections.basics.summary?.toLowerCase() ?? "";
  if (summary.includes(q)) return true;

  for (const exp of resume.sections.experience) {
    if (exp.role?.toLowerCase().includes(q)) return true;
    if (exp.company?.toLowerCase().includes(q)) return true;
    if (exp.domain?.toLowerCase().includes(q)) return true;
  }

  for (const p of resume.sections.projects) {
    if (p.title?.toLowerCase().includes(q)) return true;
  }

  for (const c of resume.sections.coCurricular ?? []) {
    if (c.role?.toLowerCase().includes(q)) return true;
    if (c.organization?.toLowerCase().includes(q)) return true;
  }

  return false;
}

export default function ResumesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [roleSearch, setRoleSearch] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createSections, setCreateSections] = useState<
    Resume["sections"] | undefined
  >(undefined);
  const [newDocTitle, setNewDocTitle] = useState("");

  const filteredResumes = useMemo(
    () => resumes.filter((r) => resumeMatchesRoleSearch(r, roleSearch)),
    [resumes, roleSearch]
  );

  useEffect(() => {
    if (!user) return;
    const unsub = listenToUserResumes(user.uid, (data) => {
      setResumes(data);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const defaultBlankTitle = useCallback(
    () => `structural resume v${resumes.length + 1}`,
    [resumes.length]
  );

  const openNewBlueprintModal = () => {
    setCreateSections(undefined);
    setNewDocTitle(defaultBlankTitle());
    setCreateModalOpen(true);
  };

  const openDuplicateModal = (source: Resume) => {
    setCreateSections(source.sections);
    setNewDocTitle(`${source.title} (copy)`);
    setCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setCreateModalOpen(false);
    setCreateSections(undefined);
    setNewDocTitle("");
  };

  const confirmCreate = async () => {
    if (!user) return;
    const trimmed = newDocTitle.trim();
    const title = trimmed || defaultBlankTitle();
    setCreating(true);
    try {
      const docRef = await createResume(user.uid, title, createSections);
      closeCreateModal();
      router.push(`/resumes/${docRef.id}`);
    } catch (err) {
      console.error(err);
      alert("Verification failed. See console.");
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    if (!createModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCreateModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [createModalOpen]);

  const copyLatex = (resume: Resume) => {
    const latex = generateLatex(resume);
    navigator.clipboard.writeText(latex);
    alert("Structural LaTeX code copied to clipboard!");
  };

  return (
    <div className="w-full pb-32 max-w-5xl pt-2">
      <div className="mb-10">
        <h1 className="font-headline text-3xl font-bold leading-tight tracking-tighter text-on-surface dark:text-white">
          the resume{" "}
          <span className="text-brand-teal italic font-light lowercase dark:text-[#5ee4e8]">
            studio.
          </span>
        </h1>
        <p className="mt-0 max-w-2xl text-sm font-light leading-relaxed text-on-surface-variant dark:text-zinc-400">
          build high-fidelity, latex-inspired career documents. precision-engineered
          for institution-grade verification.
        </p>

        <div className="relative mt-8 max-w-md">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-zinc-500">
            <span className="material-symbols-outlined text-[20px] font-light">
              manage_search
            </span>
          </span>
          <input
            type="search"
            value={roleSearch}
            onChange={(e) => setRoleSearch(e.target.value)}
            placeholder="search by role, company, or document title…"
            autoComplete="off"
            className="h-12 w-full rounded-2xl border border-outline-variant/25 bg-white/80 pl-12 pr-11 text-sm font-semibold text-on-surface shadow-sm outline-none transition-all placeholder:font-normal placeholder:text-on-surface-variant/70 focus:border-brand-teal/50 focus:ring-2 focus:ring-brand-teal/15 dark:border-zinc-500/45 dark:bg-zinc-900/80 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-[#5ec4c9]/55 dark:focus:ring-[#5ec4c9]/20"
            aria-label="Search resumes by role or title"
          />
          {roleSearch ? (
            <button
              type="button"
              onClick={() => setRoleSearch("")}
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-on-surface/[0.06] hover:text-brand-teal dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-[#7af0f4]"
              aria-label="Clear search"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Blueprint Hub (Primary Action) */}
        <button 
          onClick={openNewBlueprintModal}
          disabled={creating}
          className="group relative flex h-[200px] flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-outline-variant/25 bg-transparent transition-all duration-500 hover:bg-brand-teal/[0.06] dark:border-zinc-500/55 dark:hover:border-brand-teal/70 dark:hover:bg-brand-teal/10"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-teal/10 text-brand-teal shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:bg-brand-teal group-hover:text-white dark:bg-brand-teal/20 dark:text-[#7af0f4] dark:group-hover:text-white">
            <span className="material-symbols-outlined text-2xl">{creating ? "sync" : "add_notes"}</span>
          </div>
          <div className="mt-5 px-4 text-center">
             <h3 className="font-headline text-[13px] font-bold lowercase tracking-tight text-on-surface dark:text-white">
               initiate blueprint.
             </h3>
             <p className="mt-1.5 text-[8px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-zinc-400">
               create document architecture
             </p>
          </div>
        </button>

        {/* 2. Resume Gallery (Structural Capsules) */}
        {!loading &&
          filteredResumes.length === 0 &&
          resumes.length > 0 &&
          roleSearch.trim() !== "" && (
            <div className="col-span-full rounded-3xl border border-outline-variant/20 bg-white/80 px-6 py-14 text-center dark:border-zinc-600/45 dark:bg-[#121a1d]/95">
              <p className="font-headline text-base font-bold lowercase text-on-surface dark:text-zinc-200">
                no resumes match “{roleSearch.trim()}”.
              </p>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-zinc-500">
                try another role, company, or title — or clear the search.
              </p>
              <button
                type="button"
                onClick={() => setRoleSearch("")}
                className="mt-6 rounded-full border border-brand-teal/35 bg-brand-teal/10 px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-brand-teal transition-colors hover:bg-brand-teal hover:text-white dark:border-[#5ec4c9]/40 dark:bg-brand-teal/15 dark:text-[#7ee8ec] dark:hover:bg-[#5ec4c9] dark:hover:text-zinc-900"
              >
                clear search
              </button>
            </div>
          )}

        {!loading && filteredResumes.map((resume) => {
          // Calculate structural density
          const expCount = resume.sections.experience.length;
          const projCount = resume.sections.projects.length;
          const skillCount = resume.sections.skills.length;
          
          return (
            <div 
              key={resume.id}
              className="group relative flex h-[200px] flex-col rounded-3xl border border-outline-variant/20 bg-white/90 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-brand-teal/35 dark:border-zinc-500/45 dark:bg-[#121a1d]/95 dark:shadow-[0_8px_32px_rgba(0,0,0,0.45)] dark:hover:border-brand-teal/55"
            >
              <Link href={`/resumes/${resume.id}`} className="flex-1">
                <div className="mb-4 flex items-start justify-between">
                   <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-on-surface/[0.06] text-zinc-600 transition-all group-hover:bg-brand-teal/15 group-hover:text-brand-teal dark:bg-white/10 dark:text-zinc-300 dark:group-hover:text-[#7af0f4]">
                      <span className="material-symbols-outlined text-lg font-light">description</span>
                   </div>
                   <div className="flex translate-x-1 items-center gap-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                      <button 
                        onClick={(e) => { e.preventDefault(); copyLatex(resume); }}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-outline-variant/15 bg-surface text-on-surface-variant transition-all hover:border-brand-teal/30 hover:text-brand-teal dark:border-zinc-500/50 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:text-[#7af0f4]"
                      >
                        <span className="material-symbols-outlined text-[14px]">code</span>
                      </button>
                      <button 
                        onClick={(e) => { e.preventDefault(); openDuplicateModal(resume); }}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-outline-variant/15 bg-surface text-on-surface-variant transition-all hover:border-brand-teal/30 hover:text-brand-teal dark:border-zinc-500/50 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:text-[#7af0f4]"
                      >
                        <span className="material-symbols-outlined text-[14px]">content_copy</span>
                      </button>
                   </div>
                </div>

                <h3 className="line-clamp-1 font-headline text-[13px] font-bold lowercase tracking-tight text-on-surface transition-colors group-hover:text-brand-teal dark:text-white dark:group-hover:text-[#7af0f4]">
                  {resume.title}
                </h3>
                
                {/* Structural Analysis (Compact) */}
                <div className="mt-4 grid grid-cols-3 gap-1">
                   <div className="flex flex-col gap-0.5">
                      <span className="text-[8px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-zinc-500">
                        exp
                      </span>
                      <span className="text-[11px] font-bold tabular-nums text-on-surface dark:text-zinc-100">
                        {expCount}
                      </span>
                   </div>
                   <div className="flex flex-col gap-0.5">
                      <span className="text-[8px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-zinc-500">
                        proj
                      </span>
                      <span className="text-[11px] font-bold tabular-nums text-on-surface dark:text-zinc-100">
                        {projCount}
                      </span>
                   </div>
                   <div className="flex flex-col gap-0.5">
                      <span className="text-[8px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-zinc-500">
                        skill
                      </span>
                      <span className="text-[11px] font-bold tabular-nums text-on-surface dark:text-zinc-100">
                        {skillCount}
                      </span>
                   </div>
                </div>
              </Link>

              {/* Card Footer: Compact Status */}
              <div className="mt-auto flex items-center justify-between border-t border-outline-variant/15 pt-4 dark:border-zinc-600/60">
                 <div className="min-w-0 flex-1">
                    <p className="truncate text-[8px] font-bold lowercase tracking-widest text-brand-teal dark:text-[#6ee7eb]">
                      sync {resume.updatedAt?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toLowerCase()}
                    </p>
                 </div>
                 <Link href={`/resumes/${resume.id}`}>
                    <span className="material-symbols-outlined text-base text-on-surface-variant transition-all group-hover:text-brand-teal dark:text-zinc-500 dark:group-hover:text-[#7af0f4]">
                      chevron_right
                    </span>
                 </Link>
              </div>
            </div>
          );
        })}

        {loading && Array.from({ length: 4 }).map((_, i) => (
           <div key={i} className="h-[200px] animate-pulse rounded-3xl border border-outline-variant/15 bg-white/85 p-5 dark:border-zinc-600/40 dark:bg-[#121a1d]/90">
              <div className="mb-4 h-8 w-8 rounded-xl bg-on-surface/10 dark:bg-zinc-700/50"></div>
              <div className="mb-4 h-3 w-2/3 rounded-full bg-on-surface/10 dark:bg-zinc-700/50"></div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                 <div className="h-6 rounded-lg bg-on-surface/10 dark:bg-zinc-700/50"></div>
                 <div className="h-6 rounded-lg bg-on-surface/10 dark:bg-zinc-700/50"></div>
                 <div className="h-6 rounded-lg bg-on-surface/10 dark:bg-zinc-700/50"></div>
              </div>
           </div>
        ))}
      </div>

      {createModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeCreateModal();
          }}
        >
          <div
            className="absolute inset-0 bg-zinc-950/55 backdrop-blur-[2px] dark:bg-black/70"
            aria-hidden
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-resume-title-heading"
            className="relative w-full max-w-md rounded-[1.75rem] border border-outline-variant/25 bg-white/95 p-6 shadow-xl dark:border-zinc-600/50 dark:bg-[#121a1d]/98"
          >
            <h2
              id="new-resume-title-heading"
              className="font-headline text-lg font-bold lowercase tracking-tight text-on-surface dark:text-white"
            >
              name this blueprint.
            </h2>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-zinc-500">
              {createSections
                ? "duplicate — choose how it appears in your studio."
                : "how this resume is saved — e.g. frontend sde, research, internship."}
            </p>
            <label className="mt-5 block">
              <span className="mb-2 block text-[9px] font-black uppercase tracking-[0.12em] text-brand-teal dark:text-[#7ee8ec]">
                document title
              </span>
              <input
                type="text"
                value={newDocTitle}
                onChange={(e) => setNewDocTitle(e.target.value)}
                placeholder="e.g. frontend sde · acme"
                autoFocus
                disabled={creating}
                className="h-12 w-full rounded-xl border border-outline-variant/30 bg-white/90 px-4 text-sm font-semibold text-zinc-900 outline-none transition-all placeholder:font-normal placeholder:text-zinc-500 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/15 disabled:opacity-60 dark:border-zinc-500/50 dark:bg-zinc-900/90 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-[#5ec4c9] dark:focus:ring-[#5ec4c9]/25"
              />
            </label>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={closeCreateModal}
                disabled={creating}
                className="rounded-full border border-outline-variant/30 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant transition-colors hover:bg-on-surface/[0.06] disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                cancel
              </button>
              <button
                type="button"
                onClick={() => void confirmCreate()}
                disabled={creating}
                className="rounded-full border border-brand-teal/40 bg-brand-teal px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm transition-colors hover:bg-brand-teal/90 disabled:opacity-50 dark:border-[#5ec4c9]/50 dark:bg-[#3d9ea3] dark:hover:bg-[#4eb4b9]"
              >
                {creating ? "creating…" : "create & open"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
