"use client";

import { useState, useEffect, useMemo, useRef, useCallback, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Resume, updateResume, listenToUserResumes } from "@/lib/db";
import { StudioInput } from "@/components/ui/StudioInput";
import { StudioCard } from "@/components/ui/StudioCard";
import { generateLatex } from "@/lib/latex-generator";

type SectionType = 'general' | 'socials' | 'experience' | 'education' | 'projects' | 'skills' | 'certificates' | 'leadership';

/** US Letter at 96 CSS px per inch */
const PREVIEW_PAPER_W = 816;
const PREVIEW_PAPER_H = 1056;

function entryIsVisible(isVisible: boolean | undefined) {
  return isVisible !== false;
}

function ResumePrintPreview({ resume }: { resume: Resume }) {
  const {
    basics,
    experience = [],
    education = [],
    projects = [],
    skills = [],
    certificates = [],
    coCurricular = [],
  } = resume.sections;

  const contactBits = [
    basics.email,
    basics.phone,
    basics.location,
  ].filter(Boolean);

  const visibleSocials =
    basics.socials?.filter((s) => s.isVisible && s.url?.trim()) ?? [];

  const exp = experience.filter((e) => entryIsVisible(e.isVisible));
  const edu = education.filter((e) => entryIsVisible(e.isVisible));
  const proj = projects.filter((e) => entryIsVisible(e.isVisible));
  const sk = skills.filter((e) => entryIsVisible(e.isVisible));
  const cert = certificates.filter((e) => entryIsVisible(e.isVisible));
  const lead = coCurricular.filter((e) => entryIsVisible(e.isVisible));

  const hasBody =
    (basics.summary && basics.summary.trim().length > 0) ||
    exp.length > 0 ||
    edu.length > 0 ||
    proj.length > 0 ||
    sk.length > 0 ||
    cert.length > 0 ||
    lead.length > 0;

  return (
    <>
      <header className="mb-8 border-b-2 border-zinc-800 pb-6 text-center">
        <h1 className="text-[22px] font-bold uppercase leading-tight tracking-tight text-zinc-900">
          {basics.name?.trim() || "your name"}
        </h1>
        {contactBits.length > 0 && (
          <p className="mt-3 text-[11px] font-medium leading-relaxed text-zinc-700">
            {contactBits.join(" · ")}
          </p>
        )}
        {visibleSocials.length > 0 && (
          <p className="mt-2 text-[10px] font-medium text-zinc-600">
            {visibleSocials.map((s) => s.url).join(" · ")}
          </p>
        )}
      </header>

      {basics.summary?.trim() && (
        <section className="mb-6 text-left">
          <h2 className="mb-2 border-b border-zinc-800 pb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-900">
            summary
          </h2>
          <p className="text-[11px] leading-relaxed text-zinc-800">{basics.summary.trim()}</p>
        </section>
      )}

      {exp.length > 0 && (
        <section className="mb-6 text-left">
          <h2 className="mb-3 border-b border-zinc-800 pb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-900">
            experience
          </h2>
          <ul className="space-y-4">
            {exp.map((e) => (
              <li key={e.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-[12px] font-bold text-zinc-900">
                    {e.role || "role"}
                  </span>
                  <span className="text-[10px] font-semibold text-zinc-600">
                    {e.dates || "—"}
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-zinc-700">
                  {e.company}
                  {e.location ? ` · ${e.location}` : ""}
                </p>
                {e.bullets?.filter((b) => b.trim()).length ? (
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-[10px] leading-snug text-zinc-800">
                    {e.bullets.filter((b) => b.trim()).map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {edu.length > 0 && (
        <section className="mb-6 text-left">
          <h2 className="mb-3 border-b border-zinc-800 pb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-900">
            education
          </h2>
          <ul className="space-y-3">
            {edu.map((ed) => (
              <li key={ed.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-[12px] font-bold text-zinc-900">
                    {ed.school || "institution"}
                  </span>
                  <span className="text-[10px] font-semibold text-zinc-600">{ed.dates}</span>
                </div>
                <p className="text-[11px] text-zinc-700">
                  {ed.degree}
                  {ed.gpa ? ` · GPA ${ed.gpa}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {proj.length > 0 && (
        <section className="mb-6 text-left">
          <h2 className="mb-3 border-b border-zinc-800 pb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-900">
            projects
          </h2>
          <ul className="space-y-4">
            {proj.map((p) => (
              <li key={p.id}>
                <p className="text-[12px] font-bold text-zinc-900">{p.title || "project"}</p>
                {p.description?.trim() && (
                  <p className="mt-1 text-[10px] leading-relaxed text-zinc-800">{p.description}</p>
                )}
                {p.bullets?.filter((b) => b.trim()).length ? (
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-[10px] text-zinc-800">
                    {p.bullets.filter((b) => b.trim()).map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {sk.length > 0 && (
        <section className="mb-6 text-left">
          <h2 className="mb-3 border-b border-zinc-800 pb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-900">
            skills
          </h2>
          <ul className="space-y-2">
            {sk.map((s) => (
              <li key={s.id} className="text-[10px] text-zinc-800">
                <span className="font-bold text-zinc-900">{s.category}: </span>
                {(s.items || []).filter(Boolean).join(", ") || "—"}
              </li>
            ))}
          </ul>
        </section>
      )}

      {cert.length > 0 && (
        <section className="mb-6 text-left">
          <h2 className="mb-3 border-b border-zinc-800 pb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-900">
            certificates
          </h2>
          <ul className="space-y-2">
            {cert.map((c) => (
              <li key={c.id} className="text-[10px] text-zinc-800">
                <span className="font-semibold text-zinc-900">{c.name}</span>
                {c.issuer ? ` — ${c.issuer}` : ""}
                {c.date ? ` · ${c.date}` : ""}
              </li>
            ))}
          </ul>
        </section>
      )}

      {lead.length > 0 && (
        <section className="mb-6 text-left">
          <h2 className="mb-3 border-b border-zinc-800 pb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-900">
            leadership & activities
          </h2>
          <ul className="space-y-3">
            {lead.map((l) => (
              <li key={l.id}>
                <p className="text-[11px] font-bold text-zinc-900">{l.role}</p>
                <p className="text-[10px] text-zinc-700">
                  {l.organization} · {l.dates}
                </p>
                {l.bullets?.filter((b) => b.trim()).length ? (
                  <ul className="mt-1 list-disc pl-4 text-[10px] text-zinc-800">
                    {l.bullets.filter((b) => b.trim()).map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {!hasBody && (
        <div className="rounded-lg border border-dashed border-zinc-400 bg-zinc-50/80 px-5 py-8 text-center">
          <p className="text-[11px] font-semibold text-zinc-700">
            Your resume preview will appear here as you fill in sections.
          </p>
          <p className="mt-2 text-[10px] leading-relaxed text-zinc-600">
            Add a summary, experience, education, or other blocks in the studio — this page updates
            live.
          </p>
        </div>
      )}
    </>
  );
}

function EditorContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const [resume, setResume] = useState<Resume | null>(null);
  /** 1 = auto-fit to panel; adjust with zoom controls */
  const [previewZoom, setPreviewZoom] = useState(1);
  const [fitScale, setFitScale] = useState(0.4);
  const [saveUi, setSaveUi] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const previewSlotRef = useRef<HTMLDivElement>(null);
  const pendingPatchRef = useRef<Partial<Resume>>({});
  const flushTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveUiResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeRef = useRef<Resume | null>(null);

  // Consolidate Active Section from Global Sidebar (URL Param)
  const activeSection = (searchParams.get("section") as SectionType) || "general";

  useEffect(() => {
    const el = previewSlotRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      const pad = 16;
      const cw = r.width - pad;
      const ch = r.height - pad;
      if (cw < 48 || ch < 48) return;
      const sw = cw / PREVIEW_PAPER_W;
      const sh = ch / PREVIEW_PAPER_H;
      setFitScale(Math.min(sw, sh));
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, [resume?.id]);

  useEffect(() => {
    if (!user || !params.id) return;
    const unsub = listenToUserResumes(user.uid, (resumes) => {
      const current = resumes.find(r => r.id === params.id);
      if (current) setResume(current);
    });
    return () => unsub();
  }, [user, params.id]);

  useEffect(() => {
    resumeRef.current = resume;
  }, [resume]);

  const queueResumePatch = useCallback(
    (data: Partial<Resume>) => {
      pendingPatchRef.current = { ...pendingPatchRef.current, ...data };
      if (flushTimeoutRef.current) clearTimeout(flushTimeoutRef.current);
      flushTimeoutRef.current = setTimeout(() => {
        flushTimeoutRef.current = null;
        if (!user || !params.id) return;
        const patch = pendingPatchRef.current;
        pendingPatchRef.current = {};
        if (Object.keys(patch).length === 0) return;
        void updateResume(user.uid, params.id as string, patch);
      }, 1000);
    },
    [user, params.id]
  );

  useEffect(() => {
    return () => {
      if (flushTimeoutRef.current) clearTimeout(flushTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    pendingPatchRef.current = {};
    if (flushTimeoutRef.current) {
      clearTimeout(flushTimeoutRef.current);
      flushTimeoutRef.current = null;
    }
  }, [params.id]);

  const cancelDebouncedSave = useCallback(() => {
    if (flushTimeoutRef.current) {
      clearTimeout(flushTimeoutRef.current);
      flushTimeoutRef.current = null;
    }
    pendingPatchRef.current = {};
  }, []);

  const saveResumeNow = useCallback(async () => {
    const r = resumeRef.current;
    if (!user || !params.id || !r) return;
    cancelDebouncedSave();
    if (saveUiResetRef.current) clearTimeout(saveUiResetRef.current);
    setSaveUi("saving");
    try {
      await updateResume(user.uid, params.id as string, {
        title: r.title,
        sections: r.sections,
      });
      setSaveUi("saved");
      saveUiResetRef.current = setTimeout(() => setSaveUi("idle"), 2200);
    } catch (e) {
      console.error(e);
      setSaveUi("error");
      saveUiResetRef.current = setTimeout(() => setSaveUi("idle"), 4000);
    }
  }, [user, params.id, cancelDebouncedSave]);

  useEffect(() => {
    return () => {
      if (saveUiResetRef.current) clearTimeout(saveUiResetRef.current);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        void saveResumeNow();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [saveResumeNow]);

  const handleSectionUpdate = <K extends keyof Resume["sections"]>(
    sectionKey: K,
    data: Resume["sections"][K]
  ) => {
    if (!resume) return;
    const newResume = {
      ...resume,
      sections: { ...resume.sections, [sectionKey]: data },
    };
    setResume(newResume);
    queueResumePatch({ sections: newResume.sections });
  };

  if (!resume) return (
     <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-teal/20 border-t-brand-teal"></div>
     </div>
  );

  const displayScale = Math.max(0.15, Math.min(fitScale * previewZoom, 2.5));

  return (
    <div className="flex h-[calc(100dvh-5rem)] min-h-[360px] max-h-[calc(100dvh-5rem)] w-full overflow-hidden bg-surface-container-lowest/30 dark:bg-transparent">
      
      {/* 2. Structured Form Workspace (Center Pillar) */}
      <div className="min-h-0 flex-1 overflow-y-auto border-r border-outline-variant/5 px-8 py-12 scrollbar-hide dark:border-white/[0.06] xl:px-20">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 rounded-2xl border border-outline-variant/20 bg-white/50 p-5 dark:border-zinc-600/40 dark:bg-zinc-900/45">
            <StudioInput
              label="document title"
              value={resume.title}
              onChange={(v) => {
                setResume({ ...resume, title: v });
                queueResumePatch({ title: v });
              }}
              placeholder="e.g. frontend sde · research · internship"
            />
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <p className="min-w-0 flex-1 text-[9px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-zinc-500">
                studio name only — not printed on your resume pdf. autosave ~1s ·{" "}
                <kbd className="rounded border border-outline-variant/40 bg-on-surface/[0.04] px-1.5 py-0.5 font-mono text-[8px] text-on-surface-variant dark:border-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-400">
                  cmd s
                </kbd>{" "}
                /{" "}
                <kbd className="rounded border border-outline-variant/40 bg-on-surface/[0.04] px-1.5 py-0.5 font-mono text-[8px] text-on-surface-variant dark:border-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-400">
                  ctrl s
                </kbd>{" "}
                saves now.
              </p>
              <div className="flex shrink-0 flex-nowrap items-center justify-end gap-2 sm:max-w-none">
                {saveUi === "saved" ? (
                  <span className="whitespace-nowrap text-[10px] font-bold lowercase tracking-wide text-brand-teal dark:text-[#7ee8ec]">
                    saved to cloud.
                  </span>
                ) : null}
                {saveUi === "error" ? (
                  <span className="max-w-[10rem] text-[10px] font-bold lowercase tracking-wide text-red-600 sm:max-w-none dark:text-red-400">
                    save failed — try again.
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() => void saveResumeNow()}
                  disabled={saveUi === "saving"}
                  className="flex h-10 shrink-0 flex-nowrap items-center justify-center gap-2 whitespace-nowrap rounded-full bg-brand-teal px-5 text-[10px] font-bold uppercase tracking-wide text-white transition-[filter,opacity] hover:brightness-110 active:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-brand-teal dark:text-white dark:hover:brightness-110"
                >
                  <span
                    className={`material-symbols-outlined shrink-0 text-[18px] font-light leading-none ${saveUi === "saving" ? "animate-spin" : ""}`}
                  >
                    {saveUi === "saving" ? "progress_activity" : "save"}
                  </span>
                  <span className="leading-none">
                    {saveUi === "saving" ? "saving…" : "save now"}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Section Header */}
          <div className="mb-12 flex items-end justify-between">
             <div>
                <span className="mb-2 block text-[10px] font-bold lowercase tracking-[0.3em] text-brand-teal opacity-80 dark:text-[#7ee8ec] dark:opacity-100">
                  architecture phase
                </span>
                <h3 className="font-headline text-3xl font-bold lowercase tracking-tighter text-on-surface dark:text-white">
                  {activeSection}.
                </h3>
             </div>
             {(activeSection !== 'general' && activeSection !== 'socials' && activeSection !== 'skills') && (
               <button 
                 onClick={() => {
                   const key =
                     activeSection === "leadership"
                       ? "coCurricular"
                       : activeSection;
                   const newId = Math.random().toString(36).slice(2, 11);
                   if (key === "experience") {
                     handleSectionUpdate("experience", [
                       {
                         id: newId,
                         company: "",
                         role: "",
                         dates: "",
                         bullets: [],
                         isVisible: true,
                       },
                       ...resume.sections.experience,
                     ]);
                   } else if (key === "education") {
                     handleSectionUpdate("education", [
                       {
                         id: newId,
                         school: "",
                         degree: "",
                         dates: "",
                         gpa: "",
                         isVisible: true,
                       },
                       ...resume.sections.education,
                     ]);
                   } else if (key === "projects") {
                     handleSectionUpdate("projects", [
                       {
                         id: newId,
                         title: "",
                         description: "",
                         bullets: [],
                         isVisible: true,
                       },
                       ...resume.sections.projects,
                     ]);
                   } else if (key === "certificates") {
                     handleSectionUpdate("certificates", [
                       {
                         id: newId,
                         name: "",
                         issuer: "",
                         date: "",
                         isVisible: true,
                       },
                       ...resume.sections.certificates,
                     ]);
                   } else if (key === "coCurricular") {
                     handleSectionUpdate("coCurricular", [
                       {
                         id: newId,
                         role: "",
                         organization: "",
                         dates: "",
                         bullets: [],
                         isVisible: true,
                       },
                       ...resume.sections.coCurricular,
                     ]);
                   }
                 }}
                 className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-teal to-[#009097] px-5 py-2.5 text-[10px] font-bold lowercase tracking-widest text-white shadow-[0_8px_24px_rgba(0,123,128,0.35)] transition-all hover:shadow-[0_10px_32px_rgba(0,123,128,0.5)] hover:brightness-[1.05] active:scale-[0.98] dark:from-brand-teal dark:to-cyan-600 dark:shadow-[0_0_26px_rgba(0,123,128,0.45)] dark:hover:shadow-[0_0_34px_rgba(0,123,128,0.55)]"
               >
                 <span className="material-symbols-outlined text-sm">add</span> initiate entry.
               </button>
             )}
          </div>

          <div className="space-y-10 group/form mt-2">
            
            {/* General Section */}
            {activeSection === 'general' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 rounded-[2.5rem] border border-outline-variant/15 bg-white/90 p-10 shadow-sm backdrop-blur-md duration-700 dark:border-zinc-600/45 dark:bg-zinc-900/55 dark:shadow-[0_8px_40px_rgba(0,0,0,0.45)]">
                <div className="space-y-8">
                  <StudioInput label="full name" value={resume.sections.basics.name} onChange={(v) => handleSectionUpdate('basics', { ...resume.sections.basics, name: v })} />
                  <StudioInput label="sync email" value={resume.sections.basics.email} onChange={(v) => handleSectionUpdate('basics', { ...resume.sections.basics, email: v })} />
                  
                  <div className="grid grid-cols-2 gap-8">
                    <StudioInput label="comms contact" value={resume.sections.basics.phone} onChange={(v) => handleSectionUpdate('basics', { ...resume.sections.basics, phone: v })} />
                    <StudioInput label="region index" value={resume.sections.basics.nationality || ""} onChange={(v) => handleSectionUpdate('basics', { ...resume.sections.basics, nationality: v })} />
                  </div>

                  <StudioInput isTextArea label="architectural bio" value={resume.sections.basics.summary} onChange={(v) => handleSectionUpdate('basics', { ...resume.sections.basics, summary: v })} />
                </div>
              </div>
            )}

            {/* Socials Section (Architectural Registry) */}
            {activeSection === 'socials' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 rounded-[2.5rem] border border-outline-variant/15 bg-white/90 p-10 shadow-sm backdrop-blur-md duration-700 dark:border-zinc-600/45 dark:bg-zinc-900/55 dark:shadow-[0_8px_40px_rgba(0,0,0,0.45)]">
                <div className="mb-8 rounded-2xl border border-brand-teal/10 bg-brand-teal/5 p-4 dark:border-brand-teal/30 dark:bg-brand-teal/15">
                   <p className="flex items-center gap-2 text-[10px] font-bold lowercase tracking-wider text-brand-teal dark:text-[#9ef0f3]">
                      <span className="material-symbols-outlined text-sm">info</span>
                      tick the checkbox to show the link on your active resume blueprint.
                   </p>
                </div>

                <div className="space-y-4">
                  {[
                    { id: 'linkedin', label: 'linkedin', icon: 'person_search' },
                    { id: 'github', label: 'github', icon: 'terminal' },
                    { id: 'hackerearth', label: 'hackerearth', icon: 'code_blocks' },
                    { id: 'hackerrank', label: 'hackerrank', icon: 'hotel_class' },
                    { id: 'codechef', label: 'codechef', icon: 'restaurant_menu' },
                    { id: 'leetcode', label: 'leetcode', icon: 'functions' },
                    { id: 'codeforces', label: 'codeforces', icon: 'equalizer' },
                    { id: 'portfolio', label: 'portfolio/website', icon: 'language' },
                  ].map((platform) => {
                    const existing = (resume.sections.basics.socials || []).find(s => s.platform === platform.id);
                    const url = existing?.url || "";
                    const isVisible = existing?.isVisible ?? false;

                    const updateSocial = (newUrl: string, newVisibility: boolean) => {
                       const others = (resume.sections.basics.socials || []).filter(s => s.platform !== platform.id);
                       const updated = [...others, { platform: platform.id, url: newUrl, isVisible: newVisibility }];
                       handleSectionUpdate('basics', { ...resume.sections.basics, socials: updated });
                    };

                    return (
                      <div key={platform.id} className="flex items-center gap-4 group/row">
                        <div className="flex items-center justify-center w-6 h-6">
                           <input 
                              type="checkbox"
                              checked={isVisible}
                              onChange={(e) => updateSocial(url, e.target.checked)}
                              className="w-4 h-4 rounded-md border-outline-variant/20 text-brand-teal focus:ring-brand-teal/20 transition-all cursor-pointer"
                           />
                        </div>
                        
                        <div className="flex flex-1 items-center gap-2 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest px-4 py-2 transition-all hover:border-brand-teal/25 dark:border-zinc-500/40 dark:bg-zinc-900/70">
                           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-on-surface/5 text-zinc-600 transition-all group-hover/row:text-brand-teal dark:bg-zinc-800/80 dark:text-zinc-300 dark:group-hover/row:text-[#7ee8ec]">
                              <span className="material-symbols-outlined text-xl">{platform.icon}</span>
                           </div>
                           <span className="select-none px-2 text-[10px] font-bold lowercase tracking-widest text-zinc-500 dark:text-zinc-500">
                             https://
                           </span>
                           <input 
                              type="text"
                              value={url}
                              onChange={(e) => updateSocial(e.target.value, isVisible)}
                              placeholder={`add ${platform.label} profile link...`}
                              className="flex-1 border-none bg-transparent py-2 text-[12px] font-bold tracking-tight text-zinc-900 outline-none placeholder:text-zinc-500 dark:text-zinc-100 dark:placeholder:text-zinc-400"
                           />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Experience Section */}
            {activeSection === 'experience' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {(resume.sections.experience || []).map((exp, idx) => (
                  <StudioCard 
                    key={exp.id} 
                    title={exp.role || "Untitled Role"} 
                    subtitle={exp.company || "Pending Organization"} 
                    isVisible={exp.isVisible}
                    onToggleVisibility={(v) => {
                      const l = [...resume.sections.experience]; l[idx].isVisible = v; handleSectionUpdate('experience', l);
                    }}
                    onDelete={() => {
                      const l = [...resume.sections.experience]; l.splice(idx, 1); handleSectionUpdate('experience', l);
                    }}
                  >
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-8">
                        <StudioInput label="role designation" value={exp.role} onChange={(v) => {
                          const l = [...resume.sections.experience]; l[idx].role = v; handleSectionUpdate('experience', l);
                        }} />
                        <StudioInput label="organization" value={exp.company} onChange={(v) => {
                          const l = [...resume.sections.experience]; l[idx].company = v; handleSectionUpdate('experience', l);
                        }} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-8">
                        <StudioInput label="experience domain" value={exp.domain || ""} onChange={(v) => {
                          const l = [...resume.sections.experience]; l[idx].domain = v; handleSectionUpdate('experience', l);
                        }} />
                        <StudioInput label="location axis" value={exp.location || ""} onChange={(v) => {
                          const l = [...resume.sections.experience]; l[idx].location = v; handleSectionUpdate('experience', l);
                        }} />
                      </div>

                      <StudioInput
                        label="temporal index (e.g. feb 24 – current)"
                        value={exp.dates}
                        onChange={(v) => {
                          const l = [...resume.sections.experience];
                          l[idx].dates = v;
                          handleSectionUpdate("experience", l);
                        }}
                      />
                      <label className="flex cursor-pointer items-center gap-3">
                        <input
                          type="checkbox"
                          checked={exp.isCurrent || false}
                          onChange={(e) => {
                            const l = [...resume.sections.experience];
                            l[idx].isCurrent = e.target.checked;
                            handleSectionUpdate("experience", l);
                          }}
                          className="h-4 w-4 rounded border-zinc-400 text-brand-teal focus:ring-brand-teal/30 dark:border-zinc-500 dark:bg-zinc-900"
                        />
                        <span className="text-[10px] font-bold lowercase tracking-widest text-zinc-700 dark:text-zinc-300">
                          active deployment
                        </span>
                      </label>

                      <div className="space-y-2">
                        <label className="ml-1 text-[9px] font-bold lowercase tracking-widest text-brand-teal dark:text-[#7ee8ec]">
                          architectural impact (bullets)
                        </label>
                        <textarea 
                          className="w-full resize-none rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-6 text-[12px] font-medium leading-relaxed text-zinc-900 outline-none transition-all placeholder:text-zinc-500 focus:ring-2 focus:ring-brand-teal/15 dark:border-zinc-500/40 dark:bg-zinc-900/80 dark:text-zinc-100 dark:placeholder:text-zinc-400 dark:focus:ring-brand-teal/25"
                          rows={6}
                          value={(exp.bullets || []).join("\n")}
                          placeholder="• quantified impact metrics...&#10;• technical stack utilized..."
                          onChange={(e) => {
                            const l = [...resume.sections.experience]; l[idx].bullets = e.target.value.split("\n"); handleSectionUpdate('experience', l);
                          }}
                        />
                      </div>
                    </div>
                  </StudioCard>
                ))}
              </div>
            )}

            {/* Education, Projects, Skills etc. - Using the same pattern */}
            {activeSection === 'education' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {(resume.sections.education || []).map((edu, idx) => (
                  <StudioCard 
                    key={edu.id} 
                    title={edu.school || "Unnamed Institution"} 
                    subtitle={edu.degree || "Pending Degree"}
                    isVisible={edu.isVisible}
                    onToggleVisibility={(v) => {
                      const l = [...resume.sections.education]; l[idx].isVisible = v; handleSectionUpdate('education', l);
                    }}
                    onDelete={() => {
                      const l = [...resume.sections.education]; l.splice(idx, 1); handleSectionUpdate('education', l);
                    }}
                  >
                    <div className="space-y-6">
                      <StudioInput label="institution name" value={edu.school} onChange={(v) => {
                        const l = [...resume.sections.education]; l[idx].school = v; handleSectionUpdate('education', l);
                      }} />
                      <div className="grid grid-cols-2 gap-8">
                        <StudioInput label="academic degree" value={edu.degree} onChange={(v) => {
                          const l = [...resume.sections.education]; l[idx].degree = v; handleSectionUpdate('education', l);
                        }} />
                        <StudioInput label="temporal index" value={edu.dates} onChange={(v) => {
                          const l = [...resume.sections.education]; l[idx].dates = v; handleSectionUpdate('education', l);
                        }} />
                      </div>
                    </div>
                  </StudioCard>
                ))}
              </div>
            )}

            {activeSection === 'skills' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {(resume.sections.skills || []).map((skill, idx) => (
                  <StudioCard 
                    key={skill.id} 
                    title={skill.category || "Skill Module"}
                    isVisible={skill.isVisible}
                    onToggleVisibility={(v) => {
                      const l = [...resume.sections.skills]; l[idx].isVisible = v; handleSectionUpdate('skills', l);
                    }}
                    onDelete={() => {
                      const l = [...resume.sections.skills]; l.splice(idx, 1); handleSectionUpdate('skills', l);
                    }}
                  >
                    <div className="space-y-6">
                      <StudioInput label="module category (e.g. core engineering)" value={skill.category} onChange={(v) => {
                        const l = [...resume.sections.skills]; l[idx].category = v; handleSectionUpdate('skills', l);
                      }} />
                      <StudioInput label="skill nodes (comma separated)" value={(skill.items || []).join(", ")} onChange={(v) => {
                        const l = [...resume.sections.skills]; l[idx].items = v.split(",").map(s => s.trim()); handleSectionUpdate('skills', l);
                      }} />
                    </div>
                  </StudioCard>
                ))}
                <button 
                  onClick={() => handleSectionUpdate('skills', [...resume.sections.skills, { id: Math.random().toString(), category: '', items: [], isVisible: true }])} 
                  className="w-full rounded-3xl border-2 border-dashed border-outline-variant/25 py-6 text-[11px] font-bold lowercase tracking-widest text-zinc-600 transition-all hover:border-brand-teal/50 hover:text-brand-teal dark:border-zinc-500 dark:text-zinc-300 dark:hover:border-brand-teal/60 dark:hover:text-[#7ee8ec]"
                >
                  + expand skill index.
                </button>
              </div>
            )}

            {/* Placeholder for remaining sections */}
            {(activeSection === 'projects' || activeSection === 'certificates' || activeSection === 'leadership') && (
               <div className="rounded-3xl border border-outline-variant/15 bg-white/85 py-20 text-center backdrop-blur-sm dark:border-zinc-600/50 dark:bg-zinc-900/50">
                  <span className="material-symbols-outlined mb-4 animate-pulse text-4xl font-light text-brand-teal/50 dark:text-[#5ecfd4]/80">
                    architecture
                  </span>
                  <p className="text-[10px] font-bold lowercase tracking-[0.2em] text-on-surface-variant dark:text-zinc-400">
                    module synchronization in progress.
                  </p>
               </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Preview column: non-scrollable fitted page; controls sit below */}
      <aside className="z-10 flex h-full min-h-0 w-[450px] shrink-0 flex-col overflow-hidden border-l border-outline-variant/10 bg-slate-200/60 backdrop-blur-xl dark:border-white/[0.08] dark:bg-gradient-to-b dark:from-[#080b0d] dark:via-[#0d1114] dark:to-[#12181c] 2xl:w-[550px]">
        <div className="shrink-0 px-4 pb-2 pt-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-zinc-600 dark:text-zinc-400">
            print preview
          </p>
          <p className="mt-1 text-[8px] font-medium text-zinc-500 dark:text-zinc-500">
            full page fits the panel at 100%. preview does not scroll.
          </p>
        </div>

        <div
          ref={previewSlotRef}
          className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-3 pb-2"
        >
          <div
            className="relative shrink-0 rounded-lg bg-zinc-300/50 p-1 shadow-inner dark:bg-black/40 dark:ring-1 dark:ring-white/10"
            style={{
              width: PREVIEW_PAPER_W * displayScale,
              height: PREVIEW_PAPER_H * displayScale,
            }}
          >
            <div
              id="resume-preview"
              className="absolute left-0 top-0 overflow-hidden bg-white p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.35)] ring-1 ring-zinc-900/10 dark:shadow-[0_24px_60px_-8px_rgba(0,0,0,0.65)] dark:ring-white/20"
              style={{
                width: PREVIEW_PAPER_W,
                height: PREVIEW_PAPER_H,
                transform: `scale(${displayScale})`,
                transformOrigin: "top left",
              }}
            >
              <ResumePrintPreview resume={resume} />
            </div>
          </div>
        </div>

        <div className="shrink-0 space-y-3 border-t border-zinc-300/80 bg-white/80 px-4 py-4 dark:border-white/10 dark:bg-black/40">
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setPreviewZoom((z) => Math.max(0.5, Math.round((z - 0.08) * 100) / 100))}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              aria-label="zoom out"
            >
              <span className="material-symbols-outlined text-xl">zoom_out</span>
            </button>
            <span className="min-w-[3.5rem] text-center text-[10px] font-bold tabular-nums text-brand-teal dark:text-[#7ee8ec]">
              {Math.round(previewZoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setPreviewZoom((z) => Math.min(1.6, Math.round((z + 0.08) * 100) / 100))}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              aria-label="zoom in"
            >
              <span className="material-symbols-outlined text-xl">zoom_in</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewZoom(1)}
              className="rounded-xl border border-zinc-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-zinc-600 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              reset
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              const latex = generateLatex(resume);
              navigator.clipboard.writeText(latex);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-teal py-3 text-[10px] font-bold lowercase tracking-widest text-white shadow-lg shadow-brand-teal/25 transition-all hover:opacity-95 active:scale-[0.99]"
          >
            <span className="material-symbols-outlined text-base">code</span>
            capture latex
          </button>
        </div>
      </aside>
    </div>
  );
}

export default function ResumeEditorPage() {
  return (
    <Suspense fallback={<div>Loading Studio...</div>}>
      <EditorContent />
    </Suspense>
  );
}
