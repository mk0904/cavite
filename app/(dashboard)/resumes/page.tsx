"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Resume, listenToUserResumes, createResume } from "@/lib/db";

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

  const handleCreate = async () => {
    if (!user) return;
    setCreating(true);
    try {
      const title = `structural resume v${resumes.length + 1}`;
      const docRef = await createResume(user.uid, title);
      router.push(`/resumes/${docRef.id}`);
    } catch (err) {
      console.error(err);
      alert("Verification failed. See console.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="w-full pb-32">
      <div className="mb-16">
        <span className="text-brand-teal font-extrabold tracking-[0.3em] uppercase text-[10px] mb-4 block">document architecture</span>
        <h1 className="text-5xl md:text-7xl font-black font-headline tracking-tighter text-on-surface leading-none">
          the resume <br />
          <span className="text-brand-teal">studio.</span>
        </h1>
        <p className="text-xl text-on-surface-variant mt-8 font-light max-w-2xl leading-relaxed">
          build high-fidelity, latex-inspired career documents. precision-engineered for institution-grade verification.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* initiate new card */}
        <button 
          onClick={handleCreate}
          disabled={creating}
          className="glass-panel p-10 rounded-[3rem] border-2 border-dashed border-brand-teal/20 hover:border-brand-teal/40 hover:bg-brand-teal/5 transition-all group flex flex-col items-center justify-center text-center min-h-[320px] shadow-xl hover:shadow-2xl"
        >
          <div className="w-20 h-20 bg-brand-teal/10 rounded-3xl flex items-center justify-center text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-all duration-500 mb-6">
            <span className="material-symbols-outlined text-4xl">{creating ? "sync" : "add_notes"}</span>
          </div>
          <h3 className="text-2xl font-black font-headline text-on-surface mb-2">initiate new studio</h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">create a new structural resume</p>
        </button>

        {/* resume cards */}
        {!loading && resumes.map((resume) => (
          <Link 
            key={resume.id}
            href={`/resumes/${resume.id}`}
            className="glass-panel p-10 rounded-[3rem] border border-white/40 shadow-xl hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-500 group flex flex-col justify-between min-h-[320px]"
          >
            <div>
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 bg-brand-teal/5 rounded-2xl flex items-center justify-center text-brand-teal group-hover:bg-brand-teal/10 transition-all">
                  <span className="material-symbols-outlined text-3xl font-light">description</span>
                </div>
                <span className="text-[9px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600">
                  synchronized
                </span>
              </div>
              <h3 className="text-2xl font-black font-headline text-on-surface tracking-tight leading-tight mb-2 group-hover:text-brand-teal transition-colors">
                {resume.title.toLowerCase()}
              </h3>
              <p className="text-[10px] font-black tracking-widest uppercase text-on-surface-variant/60">
                last updated {resume.updatedAt?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toLowerCase()}
              </p>
            </div>

            <div className="pt-8 border-t border-outline-variant/20 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-teal">view studio</span>
              <span className="material-symbols-outlined text-brand-teal text-xl group-hover:translate-x-2 transition-transform">arrow_forward</span>
            </div>
          </Link>
        ))}

        {loading && (
          <div className="col-span-full py-20 flex flex-col items-center gap-4">
             <div className="w-8 h-8 border-3 border-brand-teal/20 border-t-brand-teal rounded-full animate-spin"></div>
             <p className="text-[9px] font-black uppercase tracking-widest text-brand-teal animate-pulse">synchronizing studio gallery...</p>
          </div>
        )}
      </div>
    </div>
  );
}
