"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Resume, listenToUserResumes, createResume } from "@/lib/db";
import { generateLatex } from "@/lib/latex-generator";

export default function ResumesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsub = listenToUserResumes(user.uid, (data) => {
      setResumes(data);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const handleCreate = async (initialSections?: Resume['sections'], titleSuffix = "v") => {
    if (!user) return;
    setCreating(true);
    try {
      const title = `structural resume ${titleSuffix}${resumes.length + 1}`;
      const docRef = await createResume(user.uid, title, initialSections);
      router.push(`/resumes/${docRef.id}`);
    } catch (err) {
      console.error(err);
      alert("Verification failed. See console.");
    } finally {
      setCreating(false);
    }
  };

  const copyLatex = (resume: Resume) => {
    const latex = generateLatex(resume);
    navigator.clipboard.writeText(latex);
    alert("Structural LaTeX code copied to clipboard!");
  };

  return (
    <div className="w-full pb-32 max-w-5xl pt-2">
      <div className="mb-10">
        <h1 className="text-3xl font-bold font-headline tracking-tighter text-on-surface leading-tight">the resume <span className="text-brand-teal italic font-light lowercase">studio.</span></h1>
        <p className="text-sm text-on-surface-variant mt-0 font-light max-w-2xl leading-relaxed">
          build high-fidelity, latex-inspired career documents. precision-engineered for institution-grade verification.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Blueprint Hub (Primary Action) */}
        <button 
          onClick={() => handleCreate()}
          disabled={creating}
          className="group relative h-[200px] flex flex-col items-center justify-center bg-transparent border-2 border-dashed border-outline-variant/10 rounded-3xl hover:border-brand-teal/40 hover:bg-brand-teal/[0.02] transition-all duration-500 overflow-hidden"
        >
          <div className="w-12 h-12 bg-brand-teal/5 rounded-2xl flex items-center justify-center text-brand-teal group-hover:scale-110 group-hover:bg-brand-teal group-hover:text-white transition-all duration-500 shadow-sm">
            <span className="material-symbols-outlined text-2xl">{creating ? "sync" : "add_notes"}</span>
          </div>
          <div className="mt-5 text-center px-4">
             <h3 className="text-[12px] font-bold font-headline text-on-surface lowercase tracking-tight">initiate blueprint.</h3>
             <p className="text-[7px] font-bold lowercase tracking-widest text-on-surface-variant/30 mt-1">create document architecture</p>
          </div>
        </button>

        {/* 2. Resume Gallery (Structural Capsules) */}
        {!loading && resumes.map((resume) => {
          // Calculate structural density
          const expCount = resume.sections.experience.length;
          const projCount = resume.sections.projects.length;
          const skillCount = resume.sections.skills.length;
          
          return (
            <div 
              key={resume.id}
              className="group relative h-[200px] bg-white border border-outline-variant/5 rounded-3xl p-5 transition-all duration-300 hover:border-brand-teal/20 flex flex-col"
            >
              <Link href={`/resumes/${resume.id}`} className="flex-1">
                <div className="flex justify-between items-start mb-4">
                   <div className="w-8 h-8 bg-on-surface/5 rounded-xl flex items-center justify-center text-on-surface-variant group-hover:bg-brand-teal/10 group-hover:text-brand-teal transition-all">
                      <span className="material-symbols-outlined text-lg font-light">description</span>
                   </div>
                   <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0">
                      <button 
                        onClick={(e) => { e.preventDefault(); copyLatex(resume); }}
                        className="w-7 h-7 rounded-lg bg-surface border border-outline-variant/5 flex items-center justify-center text-on-surface-variant hover:text-brand-teal transition-all"
                      >
                        <span className="material-symbols-outlined text-[14px]">code</span>
                      </button>
                      <button 
                        onClick={(e) => { e.preventDefault(); handleCreate(resume.sections, "copy "); }}
                        className="w-7 h-7 rounded-lg bg-surface border border-outline-variant/5 flex items-center justify-center text-on-surface-variant hover:text-brand-teal transition-all"
                      >
                        <span className="material-symbols-outlined text-[14px]">content_copy</span>
                      </button>
                   </div>
                </div>

                <h3 className="text-[12px] font-bold font-headline text-on-surface tracking-tight group-hover:text-brand-teal transition-colors lowercase line-clamp-1">
                  {resume.title}
                </h3>
                
                {/* Structural Analysis (Compact) */}
                <div className="mt-4 grid grid-cols-3 gap-1">
                   <div className="flex flex-col">
                      <span className="text-[7px] font-bold lowercase text-on-surface-variant/20 tracking-widest">exp</span>
                      <span className="text-[10px] font-bold text-on-surface">{expCount}</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[7px] font-bold lowercase text-on-surface-variant/20 tracking-widest">proj</span>
                      <span className="text-[10px] font-bold text-on-surface">{projCount}</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[7px] font-bold lowercase text-on-surface-variant/20 tracking-widest">skill</span>
                      <span className="text-[10px] font-bold text-on-surface">{skillCount}</span>
                   </div>
                </div>
              </Link>

              {/* Card Footer: Compact Status */}
              <div className="mt-auto pt-4 border-t border-outline-variant/5 flex items-center justify-between">
                 <div className="flex-1 overflow-hidden">
                    <p className="text-[8px] font-bold text-brand-teal/40 lowercase tracking-widest truncate">
                      sync {resume.updatedAt?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toLowerCase()}
                    </p>
                 </div>
                 <Link href={`/resumes/${resume.id}`}>
                    <span className="material-symbols-outlined text-base text-on-surface-variant/20 group-hover:text-brand-teal transition-all">chevron_right</span>
                 </Link>
              </div>
            </div>
          );
        })}

        {loading && Array.from({ length: 4 }).map((_, i) => (
           <div key={i} className="h-[200px] bg-white border border-outline-variant/5 rounded-3xl p-5 animate-pulse">
              <div className="w-8 h-8 bg-on-surface/5 rounded-xl mb-4"></div>
              <div className="h-3 bg-on-surface/5 rounded-full w-2/3 mb-4"></div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                 <div className="h-6 bg-on-surface/5 rounded-lg"></div>
                 <div className="h-6 bg-on-surface/5 rounded-lg"></div>
                 <div className="h-6 bg-on-surface/5 rounded-lg"></div>
              </div>
           </div>
        ))}
      </div>
    </div>
  );
}
