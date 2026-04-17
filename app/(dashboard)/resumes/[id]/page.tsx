"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Resume, updateResume, listenToUserResumes } from "@/lib/db";
import { StudioInput } from "@/components/ui/StudioInput";
import { StudioCard } from "@/components/ui/StudioCard";
import { generateLatex } from "@/lib/latex-generator";
import { debounce } from "lodash";

type SectionType = 'general' | 'socials' | 'experience' | 'education' | 'projects' | 'skills' | 'certificates' | 'leadership';

function EditorContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [resume, setResume] = useState<Resume | null>(null);
  const [previewZoom, setPreviewZoom] = useState(0.8);
  
  // Consolidate Active Section from Global Sidebar (URL Param)
  const activeSection = (searchParams.get("section") as SectionType) || "general";

  useEffect(() => {
    if (!user || !params.id) return;
    const unsub = listenToUserResumes(user.uid, (resumes) => {
      const current = resumes.find(r => r.id === params.id);
      if (current) setResume(current);
    });
    return () => unsub();
  }, [user, params.id]);

  const handleUpdate = debounce((data: Partial<Resume>) => {
    if (!user || !params.id) return;
    updateResume(user.uid, params.id as string, data);
  }, 1000);

  const handleSectionUpdate = (sectionKey: keyof Resume['sections'], data: any) => {
    if (!resume) return;
    const newResume = { ...resume, sections: { ...resume.sections, [sectionKey]: data } };
    setResume(newResume);
    handleUpdate({ sections: newResume.sections });
  };

  if (!resume) return (
     <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-teal/20 border-t-brand-teal rounded-full animate-spin"></div>
     </div>
  );

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-surface-container-lowest/30">
      
      {/* 2. Structured Form Workspace (Center Pillar) */}
      <div className="flex-1 overflow-y-auto scrollbar-hide py-12 px-8 xl:px-20 border-r border-outline-variant/5">
        <div className="max-w-3xl mx-auto">
          
          {/* Section Header */}
          <div className="mb-12 flex justify-between items-end">
             <div>
                <span className="text-[10px] font-bold text-brand-teal lowercase tracking-[0.3em] block mb-2 opacity-60">Architecture Phase</span>
                <h3 className="text-3xl font-bold font-headline text-on-surface tracking-tighter lowercase">{activeSection}.</h3>
             </div>
             {(activeSection !== 'general' && activeSection !== 'socials' && activeSection !== 'skills') && (
               <button 
                 onClick={() => {
                   const key = activeSection === 'leadership' ? 'coCurricular' : activeSection;
                   const currentSection = resume.sections[key as keyof Resume['sections']] || [];
                   const list = [...(currentSection as any[])];
                   list.unshift({ id: Math.random().toString(36).substr(2, 9), isVisible: true, ...(activeSection === 'experience' ? {company: '', role: '', dates: '', bullets: []} : {}) });
                   handleSectionUpdate(key as keyof Resume['sections'], list);
                 }}
                 className="flex items-center gap-2 px-5 py-2.5 bg-on-surface text-white rounded-2xl font-bold text-[10px] lowercase tracking-widest hover:bg-brand-teal transition-all shadow-sm"
               >
                 <span className="material-symbols-outlined text-sm">add</span> initiate entry.
               </button>
             )}
          </div>

          <div className="space-y-10 group/form mt-2">
            
            {/* General Section */}
            {activeSection === 'general' && (
              <div className="bg-white border border-outline-variant/5 rounded-[2.5rem] p-10 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
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
              <div className="bg-white border border-outline-variant/5 rounded-[2.5rem] p-10 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-8 p-4 bg-brand-teal/5 border border-brand-teal/10 rounded-2xl">
                   <p className="text-[10px] font-bold text-brand-teal lowercase tracking-wider flex items-center gap-2">
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
                        
                        <div className="flex-1 flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/10 rounded-2xl px-4 py-2 transition-all hover:border-brand-teal/20">
                           <div className="w-10 h-10 bg-on-surface/5 rounded-xl flex items-center justify-center text-on-surface-variant group-hover/row:text-brand-teal transition-all">
                              <span className="material-symbols-outlined text-xl">{platform.icon}</span>
                           </div>
                           <span className="text-[10px] font-bold text-on-surface-variant/40 tracking-widest lowercase px-2 select-none">https://</span>
                           <input 
                              type="text"
                              value={url}
                              onChange={(e) => updateSocial(e.target.value, isVisible)}
                              placeholder={`add ${platform.label} profile link...`}
                              className="flex-1 bg-transparent border-none outline-none text-[12px] font-bold text-on-surface placeholder:text-on-surface-variant/20 tracking-tight py-2"
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

                      <div className="grid grid-cols-2 gap-8">
                        <StudioInput label="temporal index (e.g. feb 24 - current)" value={exp.dates} onChange={(v) => {
                          const l = [...resume.sections.experience]; l[idx].dates = v; handleSectionUpdate('experience', l);
                        }} />
                        <div className="flex items-center gap-3 pt-6">
                          <input 
                            type="checkbox" 
                            checked={exp.isCurrent || false}
                            onChange={(e) => {
                              const l = [...resume.sections.experience]; l[idx].isCurrent = e.target.checked; handleSectionUpdate('experience', l);
                            }}
                            className="w-4 h-4 rounded-lg border-outline-variant/20 text-brand-teal focus:ring-brand-teal/20"
                          />
                          <span className="text-[10px] font-bold lowercase tracking-widest text-on-surface-variant/40">active deployment</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-bold lowercase tracking-widest text-brand-teal/40 ml-1">architectural impact (bullets)</label>
                        <textarea 
                          className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-6 text-[12px] font-medium leading-relaxed resize-none focus:ring-2 focus:ring-brand-teal/10 outline-none transition-all"
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
                  className="w-full py-6 border-2 border-dashed border-outline-variant/10 rounded-3xl text-[10px] font-bold lowercase tracking-widest text-on-surface-variant/30 hover:border-brand-teal/40 hover:text-brand-teal transition-all"
                >
                  + expand skill index.
                </button>
              </div>
            )}

            {/* Placeholder for remaining sections */}
            {(activeSection === 'projects' || activeSection === 'certificates' || activeSection === 'leadership') && (
               <div className="py-20 text-center bg-white border border-outline-variant/5 rounded-3xl opacity-40">
                  <span className="material-symbols-outlined text-4xl mb-4 font-light animate-pulse">architecture</span>
                  <p className="text-[10px] font-bold lowercase tracking-[0.2em]">module synchronization in progress.</p>
               </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Immersive Preview Hub (Right Pillar) */}
      <aside className="w-[450px] 2xl:w-[550px] bg-surface-container-low/50 backdrop-blur-3xl flex flex-col items-center py-12 overflow-y-auto scrollbar-hide z-10 shrink-0">
        <div 
           id="resume-preview"
           className="bg-white shadow-3xl p-12 transition-all duration-700 origin-top hover:scale-[1.02]"
           style={{ width: '8.5in', minHeight: '11in', transform: `scale(${previewZoom})`, marginBottom: `calc(-11in * (1 - ${previewZoom}))` }}
        >
           {/* High-Fidelity Preview Content (Standard Layout) */}
           <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-tighter mb-2">{resume.sections.basics.name || "structural architect"}</h1>
              <div className="flex justify-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                 <span>{resume.sections.basics.email || "email@index.io"}</span>
                 {resume.sections.basics.phone && <span>• {resume.sections.basics.phone}</span>}
              </div>
           </div>

           {/* Generic Preview Placeholder (to keep it clean) */}
           <div className="mt-12 space-y-10">
              <div className="space-y-4">
                 <div className="h-0.5 bg-gray-100 w-full"></div>
                 <div className="flex justify-between">
                    <div className="h-4 bg-gray-50 rounded-full w-1/4"></div>
                    <div className="h-4 bg-gray-50 rounded-full w-1/6"></div>
                 </div>
                 <div className="space-y-2">
                    <div className="h-3 bg-gray-50/50 rounded-full w-full"></div>
                    <div className="h-3 bg-gray-50/50 rounded-full w-5/6"></div>
                 </div>
              </div>
              <div className="space-y-4">
                 <div className="h-0.5 bg-gray-100 w-full"></div>
                 <div className="flex justify-between">
                    <div className="h-4 bg-gray-50 rounded-full w-1/3"></div>
                    <div className="h-4 bg-gray-50 rounded-full w-1/5"></div>
                 </div>
                 <div className="space-y-2">
                    <div className="h-3 bg-gray-50/50 rounded-full w-full"></div>
                    <div className="h-3 bg-gray-50/50 rounded-full w-4/5"></div>
                 </div>
              </div>
           </div>
        </div>

        {/* Floating Global Utility Bar */}
        <div className="fixed bottom-10 right-10 flex items-center gap-3 bg-on-surface/90 backdrop-blur-4xl px-6 py-4 rounded-[2rem] border border-white/10 shadow-3xl z-50 animate-in fade-in slide-in-from-right-8 duration-700">
           <button 
             onClick={() => {
               const latex = generateLatex(resume);
               navigator.clipboard.writeText(latex);
             }}
             className="flex items-center gap-3 px-6 py-2.5 bg-brand-teal text-white rounded-2xl font-bold text-[10px] lowercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-teal/20"
           >
             <span className="material-symbols-outlined text-base">code</span>
             capture latex.
           </button>
           <div className="flex items-center gap-3 ml-2 pl-4 border-l border-white/10">
              <button onClick={() => setPreviewZoom(z => Math.max(0.4, z - 0.05))} className="text-white/30 hover:text-white transition-colors"><span className="material-symbols-outlined text-lg">zoom_out</span></button>
              <span className="text-[9px] font-bold text-brand-teal w-10 text-center">{Math.round(previewZoom * 100)}%</span>
              <button onClick={() => setPreviewZoom(z => Math.min(1.2, z + 0.05))} className="text-white/30 hover:text-white transition-colors"><span className="material-symbols-outlined text-lg">zoom_in</span></button>
           </div>
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
