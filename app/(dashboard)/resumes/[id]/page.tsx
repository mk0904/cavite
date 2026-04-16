"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Resume, updateResume } from "@/lib/db";
import { useAuth } from "@/context/AuthContext";
import debounce from "lodash/debounce";

export default function ResumeEditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'basics' | 'experience' | 'education' | 'skills'>('basics');

  useEffect(() => {
    if (!id) return;
    const unsub = onSnapshot(doc(db, "resumes", id as string), (docSnap) => {
      if (docSnap.exists()) {
        setResume({ id: docSnap.id, ...docSnap.data() } as Resume);
      } else {
        router.push("/resumes");
      }
      setLoading(false);
    });
    return () => unsub();
  }, [id, router]);

  // Debounced update helper
  const debouncedUpdate = useCallback(
    debounce((data: Partial<Resume>) => {
      if (id) updateResume(id as string, data);
    }, 1000),
    [id]
  );

  const handleUpdate = (newData: any) => {
    if (!resume) return;
    const updated = { ...resume, ...newData };
    setResume(updated);
    debouncedUpdate(newData);
  };

  const handleSectionUpdate = (section: string, data: any) => {
    if (!resume) return;
    const newSections = { ...resume.sections, [section]: data };
    handleUpdate({ sections: newSections });
  };

  if (loading || !resume) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
        <div className="w-12 h-12 border-4 border-brand-teal/20 border-t-brand-teal rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-widest text-brand-teal animate-pulse">synchronizing studio...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 top-[88px] flex overflow-hidden bg-surface">
      {/* Editor Section (Left) */}
      <div className="w-full md:w-1/2 overflow-y-auto px-8 py-12 border-r border-outline-variant/20 scrollbar-hide bg-surface-container-lowest/50 backdrop-blur-3xl">
        <div className="max-w-2xl mx-auto">
          <div className="mb-12 flex justify-between items-end">
             <div>
                <span className="text-brand-teal font-extrabold tracking-[0.3em] uppercase text-[10px] mb-4 block underline decoration-brand-teal/30">studio architecture</span>
                <input 
                  value={resume.title}
                  onChange={(e) => handleUpdate({ title: e.target.value })}
                  className="text-4xl font-black font-headline tracking-tighter text-on-surface bg-transparent border-none outline-none focus:ring-0 w-full p-0"
                  placeholder="untitled structural v1"
                />
             </div>
             <button onClick={() => router.push("/resumes")} className="text-[10px] font-black tracking-widest uppercase text-on-surface-variant hover:text-brand-teal transition-all mb-2">
                save & exit
             </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-4 mb-12 overflow-x-auto pb-2 scrollbar-hide">
            {['basics', 'experience', 'education', 'skills'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === tab 
                  ? 'bg-brand-teal text-white shadow-lg shadow-brand-teal/20' 
                  : 'bg-white/40 text-on-surface-variant/60 border border-outline-variant/30 hover:border-brand-teal/40'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'basics' && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <FormInput 
                    label="full name"
                    value={resume.sections.basics.name}
                    onChange={(val) => handleSectionUpdate('basics', { ...resume.sections.basics, name: val })}
                  />
                  <FormInput 
                    label="email address"
                    value={resume.sections.basics.email}
                    onChange={(val) => handleSectionUpdate('basics', { ...resume.sections.basics, email: val })}
                  />
                  <FormInput 
                    label="phone nexus"
                    value={resume.sections.basics.phone}
                    onChange={(val) => handleSectionUpdate('basics', { ...resume.sections.basics, phone: val })}
                  />
                  <FormInput 
                    label="geographical nexus"
                    value={resume.sections.basics.location}
                    onChange={(val) => handleSectionUpdate('basics', { ...resume.sections.basics, location: val })}
                  />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black tracking-widest uppercase text-on-surface-variant/60 ml-4">structural objective</label>
                   <textarea 
                     rows={4}
                     className="w-full bg-white/40 border border-outline-variant/30 rounded-3xl px-6 py-4 focus:ring-2 focus:ring-brand-teal transition-all outline-none font-medium resize-none"
                     value={resume.sections.basics.summary}
                     onChange={(e) => handleSectionUpdate('basics', { ...resume.sections.basics, summary: e.target.value })}
                   />
                </div>
              </div>
            )}

            {activeTab === 'experience' && (
              <div className="space-y-8">
                {resume.sections.experience.map((exp, idx) => (
                  <div key={exp.id} className="p-8 rounded-[2rem] bg-white/40 border border-outline-variant/20 relative group">
                    <button 
                      onClick={() => {
                        const newList = [...resume.sections.experience];
                        newList.splice(idx, 1);
                        handleSectionUpdate('experience', newList);
                      }}
                      className="absolute top-6 right-6 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                    <div className="grid grid-cols-2 gap-6">
                      <FormInput borderless label="company" value={exp.company} onChange={(v) => {
                        const l = [...resume.sections.experience]; l[idx].company = v; handleSectionUpdate('experience', l);
                      }} />
                      <FormInput borderless label="role" value={exp.role} onChange={(v) => {
                        const l = [...resume.sections.experience]; l[idx].role = v; handleSectionUpdate('experience', l);
                      }} />
                      <FormInput borderless label="dates" value={exp.dates} onChange={(v) => {
                        const l = [...resume.sections.experience]; l[idx].dates = v; handleSectionUpdate('experience', l);
                      }} />
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => {
                    const newList = [...resume.sections.experience, { id: Math.random().toString(), company: "", role: "", dates: "", bullets: [] }];
                    handleSectionUpdate('experience', newList);
                  }}
                  className="w-full py-4 border-2 border-dashed border-brand-teal/20 rounded-[2rem] text-[10px] font-black uppercase tracking-widest text-brand-teal hover:bg-brand-teal/5 transition-all"
                >
                  + structural experience
                </button>
              </div>
            )}

            {activeTab === 'education' && (
              <div className="space-y-8">
                {resume.sections.education.map((edu, idx) => (
                   <div key={edu.id} className="p-8 rounded-[2rem] bg-white/40 border border-outline-variant/20 relative group">
                     <button onClick={() => {
                        const l = [...resume.sections.education]; l.splice(idx, 1); handleSectionUpdate('education', l);
                     }} className="absolute top-6 right-6 text-red-400 opacity-0 group-hover:opacity-100 transition-all"><span className="material-symbols-outlined">delete</span></button>
                     <div className="grid grid-cols-2 gap-6 text-on-surface">
                       <FormInput borderless label="institution" value={edu.school} onChange={(v) => {
                         const l = [...resume.sections.education]; l[idx].school = v; handleSectionUpdate('education', l);
                       }} />
                       <FormInput borderless label="degree structural" value={edu.degree} onChange={(v) => {
                         const l = [...resume.sections.education]; l[idx].degree = v; handleSectionUpdate('education', l);
                       }} />
                       <FormInput borderless label="dates" value={edu.dates} onChange={(v) => {
                         const l = [...resume.sections.education]; l[idx].dates = v; handleSectionUpdate('education', l);
                       }} />
                       <FormInput borderless label="academic yield" value={edu.gpa} onChange={(v) => {
                         const l = [...resume.sections.education]; l[idx].gpa = v; handleSectionUpdate('education', l);
                       }} />
                     </div>
                   </div>
                ))}
                <button 
                  onClick={() => {
                    const l = [...resume.sections.education, { id: Math.random().toString(), school: "", degree: "", dates: "", gpa: "" }];
                    handleSectionUpdate('education', l);
                  }}
                  className="w-full py-4 border-2 border-dashed border-brand-teal/20 rounded-[2rem] text-[10px] font-black uppercase tracking-widest text-brand-teal hover:bg-brand-teal/5 transition-all"
                >
                  + educational foundation
                </button>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-8">
                 {resume.sections.skills.map((skill, idx) => (
                   <div key={skill.id} className="p-8 rounded-[2rem] bg-white/40 border border-outline-variant/20">
                     <FormInput borderless label="skill nexus" value={skill.category} onChange={(v) => {
                        const l = [...resume.sections.skills]; l[idx].category = v; handleSectionUpdate('skills', l);
                     }} />
                     <textarea 
                        className="w-full mt-4 bg-transparent border-none focus:ring-0 font-medium resize-none text-on-surface"
                        placeholder="precision tools (comma separated)..."
                        value={skill.items.join(", ")}
                        onChange={(e) => {
                          const l = [...resume.sections.skills];
                          l[idx].items = e.target.value.split(",").map(i => i.trim());
                          handleSectionUpdate('skills', l);
                        }}
                     />
                   </div>
                 ))}
                 <button 
                  onClick={() => {
                    const l = [...resume.sections.skills, { id: Math.random().toString(), category: "", items: [] }];
                    handleSectionUpdate('skills', l);
                  }}
                  className="w-full py-4 border-2 border-dashed border-brand-teal/20 rounded-[2rem] text-[10px] font-black uppercase tracking-widest text-brand-teal hover:bg-brand-teal/5 transition-all"
                >
                  + technical nexus
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Section (Right) */}
      <div className="hidden md:block w-1/2 p-12 bg-surface-container-low/30 overflow-y-auto">
        <div className="bg-white shadow-2xl w-full min-h-[11in] rounded-sm p-16 origin-top scale-[0.9] hover:scale-100 transition-transform duration-500 mx-auto max-w-[8.5in] text-slate-800">
           {/* LaTeX Style Header */}
           <div className="text-center pb-10 border-b-2 border-slate-100">
              <h1 className="text-4xl font-black font-headline tracking-tighter uppercase mb-4">{resume.sections.basics.name || "architect name"}</h1>
              <div className="flex justify-center gap-6 text-[10px] font-black tracking-widest text-slate-500 uppercase">
                 <span>{resume.sections.basics.email}</span>
                 {resume.sections.basics.phone && <span>• {resume.sections.basics.phone}</span>}
                 {resume.sections.basics.location && <span>• {resume.sections.basics.location}</span>}
              </div>
           </div>

           {/* Professional Summary */}
           {resume.sections.basics.summary && (
             <div className="mt-10">
                <h4 className="text-[10px] font-black tracking-widest uppercase text-brand-teal mb-4">structural objective</h4>
                <p className="text-xs leading-relaxed font-medium text-slate-600">{resume.sections.basics.summary}</p>
             </div>
           )}

           {/* Experience */}
           {resume.sections.experience.length > 0 && (
             <div className="mt-12">
                <h4 className="text-[10px] font-black tracking-widest uppercase text-brand-teal mb-6 pb-2 border-b border-slate-100">experience synergy</h4>
                <div className="space-y-8">
                  {resume.sections.experience.map(exp => (
                    <div key={exp.id}>
                       <div className="flex justify-between items-baseline mb-1">
                          <h5 className="text-sm font-black font-headline tracking-tight">{exp.company}</h5>
                          <span className="text-[9px] font-bold text-slate-400">{exp.dates}</span>
                       </div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-brand-teal/70 mb-2">{exp.role}</p>
                    </div>
                  ))}
                </div>
             </div>
           )}

           {/* Education */}
           {resume.sections.education.length > 0 && (
             <div className="mt-12">
                <h4 className="text-[10px] font-black tracking-widest uppercase text-brand-teal mb-6 pb-2 border-b border-slate-100">academic foundation</h4>
                <div className="space-y-6">
                  {resume.sections.education.map(edu => (
                    <div key={edu.id} className="flex justify-between items-start">
                       <div>
                          <h5 className="text-sm font-black font-headline tracking-tight">{edu.school}</h5>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mt-0.5">{edu.degree}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-[9px] font-bold text-slate-400">{edu.dates}</p>
                          <p className="text-[9px] font-black text-brand-teal uppercase mt-0.5">{edu.gpa}</p>
                       </div>
                    </div>
                  ))}
                </div>
             </div>
           )}

           {/* Skills */}
           {resume.sections.skills.length > 0 && (
             <div className="mt-12">
                <h4 className="text-[10px] font-black tracking-widest uppercase text-brand-teal mb-6 pb-2 border-b border-slate-100">technical nexus</h4>
                <div className="space-y-4">
                  {resume.sections.skills.map(skill => (
                    <div key={skill.id} className="flex gap-4">
                       <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 min-w-[100px]">{skill.category}</span>
                       <span className="text-[10px] font-medium text-slate-600">{skill.items.join(" • ")}</span>
                    </div>
                  ))}
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

function FormInput({ label, value, onChange, borderless = false }: any) {
  return (
    <div className={`space-y-1 ${!borderless && 'bg-white/40 p-6 rounded-3xl border border-outline-variant/30'}`}>
       <label className="text-[10px] font-black tracking-widest uppercase text-on-surface-variant/60 ml-2">{label}</label>
       <input 
         value={value}
         onChange={(e) => onChange(e.target.value)}
         className="w-full bg-transparent border-none outline-none focus:ring-0 font-medium text-on-surface"
         placeholder={`enter ${label}...`}
       />
    </div>
  );
}
